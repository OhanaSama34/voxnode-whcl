import React from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent, ActorSubclass } from '@dfinity/agent';
import {
  createActor,
  canisterId,
} from '../../declarations/voxnode-whcl-backend';
import type { _SERVICE as Actor_Service } from '../../declarations/voxnode-whcl-backend/voxnode-whcl-backend.did.js';

import MainLayout from './layouts/main-layout';
import Home from './pages/landing-page/Home';
import { Feed } from './pages/feeds/Feed';
import VoxBotPage from './pages/voxbot';

// Define a type for the application's authentication state for type safety.
export interface AppState {
  isAuthenticated: boolean;
  principal?: string;
  actor?: ActorSubclass<Actor_Service>;
  authClient?: AuthClient;
}

const network = import.meta.env.DFX_NETWORK;

// Determine the identity provider URL based on the network.
const identityProvider = 'https://identity.ic0.app';

export default function App() {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
  });

  // This effect runs once when the component mounts to initialize authentication.
  useEffect(() => {
    const initAuth = async () => {
      try {
        const authClient = await AuthClient.create();
        const isAuthenticated = await authClient.isAuthenticated();

        if (isAuthenticated) {
          // If already authenticated, get identity and create the actor.
          handleAuthenticated(authClient);
        } else {
          // If not, just store the authClient for the login button.
          setState({ authClient, isAuthenticated: false });
        }
      } catch (error) {
        console.error('Failed to initialize auth client:', error);
      }
    };

    initAuth();
  }, []);

  // This function is called on successful login or on initial load if already authenticated.
  const handleAuthenticated = async (authClient: AuthClient) => {
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal().toString();

    const agent = new HttpAgent({ identity, host: import.meta.env.VITE_HOST });

    // For local development, we need to fetch the root key.
    if (network !== 'ic') {
      await agent.fetchRootKey().catch((err) => {
        console.warn(
          'Unable to fetch root key. Check to ensure that your local replica is running',
        );
        console.error(err);
      });
    }

    // Create the actor (backend canister interface).
    const actor = createActor(canisterId as string, {
      agent,
    });

    // Update the application state with the authenticated user's info.
    setState({
      isAuthenticated: true,
      authClient,
      principal,
      actor,
    });
  };

  // Function to handle user login.
  const login = () => {
    if (!state.authClient) return;

    state.authClient.login({
      identityProvider,
      onSuccess: () => {
        handleAuthenticated(state.authClient!);
      },
      onError: (err) => {
        console.error('Login Failed:', err);
      },
    });
  };

  // Function to handle user logout.
  const logout = () => {
    state.authClient?.logout();
    setState({ isAuthenticated: false });
  };

  return (
    <MainLayout state={state} login={login} logout={logout}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feeds" element={<Feed />} />
        <Route path="/voxbot" element={<VoxBotPage />} />
      </Routes>
    </MainLayout>
  );
}
