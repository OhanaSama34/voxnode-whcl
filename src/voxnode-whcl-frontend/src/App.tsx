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
import { FeedPage } from './pages/feeds/Feed';
import VoxBotPage from './pages/voxbot';

export interface AppState {
  isAuthenticated: boolean;
  principal?: string;
  actor?: ActorSubclass<Actor_Service>;
  authClient?: AuthClient;
}

const network = process.env.DFX_NETWORK;
console.log(network)
const identityProvider = 'https://identity.ic0.app';
// const identityProvider =
//   network === 'ic'
//     ? 'https://identity.ic0.app' // Mainnet
    // : `${import.meta.env.CANISTER_ID_VOXNODE_WHCL_BACKEND}.localhost:3000`; // Local
    // : `http://${process.env.CANISTER_ID_VOXNODE_WHCL_BACKEND}.localhost:4943`; // Local


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

  const handleAuthenticated = async (authClient: AuthClient) => {
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal().toString();

    const agent = new HttpAgent({ identity, host: import.meta.env.VITE_HOST });

    if (network !== 'ic') {
      await agent.fetchRootKey().catch((err) => {
        console.warn(
          'Unable to fetch root key. Check to ensure that your local replica is running',
        );
        console.error(err);
      });
    }

    const actor = createActor(canisterId as string, {
      agent,
    });

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
        <Route path="/feeds" element={<FeedPage actor={state.actor} isAuthenticated={state.isAuthenticated} />} />
        <Route path="/voxbot" element={<VoxBotPage />} />
      </Routes>
    </MainLayout>
  );
}
