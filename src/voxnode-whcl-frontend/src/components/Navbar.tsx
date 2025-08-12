import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Principal } from '@dfinity/principal';
import { Loader2, LogOutIcon, Settings, User, LifeBuoy } from 'lucide-react';
import { AppLogo } from './app-logo';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Badge } from './ui/badge';

// Helper function to shorten the principal ID for display
const shortenPrincipal = (principalId?: string) => {
  if (!principalId) return '';
  const parts = principalId.split('-');
  if (parts.length < 5) return principalId;
  return `${parts[0]}-${parts[1]}...${parts[parts.length - 2]}-${parts[parts.length - 1]}`;
};

// Define the props the Navbar will receive.
interface NavbarProps {
  state: {
    isAuthenticated: boolean;
    actor?: any;
    principal?: string | null;
  };
  login: () => void;
  logout: () => void;
}

export const Navbar = ({ state, login, logout }: NavbarProps) => {
  const [reputation, setReputation] = useState<string | null>(null);
  const [isLoadingReputation, setIsLoadingReputation] = useState(false);

  useEffect(() => {
    const fetchReputation = async () => {
      if (state.isAuthenticated && state.actor && state.principal) {
        setIsLoadingReputation(true);
        setReputation(null);
        try {
          // const userPrincipal = Principal.fromText(state.principal);
          const userPrincipal = Principal.fromText(state.principal);
          console.log(userPrincipal);
          const result = await state.actor.getReputation(userPrincipal);
          setReputation(result.toString());
        } catch (error) {
          console.error("Failed to fetch reputation:", error);
          setReputation("Error");
        } finally {
          setIsLoadingReputation(false);
        }
      } else {
        setReputation(null);
      }
    };

    fetchReputation();
  }, [state.isAuthenticated, state.actor, state.principal]);

  return (
    <nav className="sticky top-0 flex w-full items-center justify-between overflow-x-hidden border border-neutral-200/80 bg-white/20 px-4 py-4 backdrop-blur-md dark:border-neutral-800/80 dark:bg-black/20 z-[100]">
      <div className="flex items-center gap-2">
        <Link to="/">
          <AppLogo className="scale-150 origin-left" />
        </Link>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Link to="/feeds">
          <Button variant="ghost" size="sm">
            Feeds
          </Button>
        </Link>
        <Link to="/voxbot">
          <Button variant="ghost" size="sm">
            VoxBot
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {state.isAuthenticated ? (
          <>
            <Badge variant="outline" className="flex items-center gap-2">
              YOUR POINTS:
              {isLoadingReputation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="font-bold">7</span>
                // <span className="font-bold">{reputation ?? '...'}</span>
              )}
            </Badge>
            <Drawer direction="right">
              <DrawerTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-full max-w-sm flex flex-col bg-white dark:bg-neutral-900 z-[150]">
                <DrawerHeader className="p-4 text-left border-b dark:border-neutral-800">
                  <DrawerTitle className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    My Account
                  </DrawerTitle>
                  <DrawerDescription
                    className="text-sm text-neutral-500 dark:text-neutral-400 truncate"
                    title={state.principal || undefined}
                  >
                    Principal: {shortenPrincipal(state.principal || undefined)}
                  </DrawerDescription>
                </DrawerHeader>
                <div className="flex-grow p-4 space-y-4">
                  <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Reputation Points
                    </p>
                    <p className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                      7
                      {/*{reputation ?? '...'}*/}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto">
                      <User className="h-5 w-5 text-neutral-500" />
                      <span className="text-base">Profile</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto">
                      <Settings className="h-5 w-5 text-neutral-500" />
                      <span className="text-base">Settings</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 p-2 h-auto">
                      <LifeBuoy className="h-5 w-5 text-neutral-500" />
                      <span className="text-base">Help & Support</span>
                    </Button>
                  </div>
                </div>
                <DrawerFooter className="mt-auto border-t p-4 dark:border-neutral-800">
                  <Button
                    onClick={logout}
                    variant="destructive"
                    className="w-full justify-center gap-2"
                  >
                    <LogOutIcon className="h-4 w-4" /> Log Out
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <Button onClick={login} className="capitalize">
            Login with Internet Identity
          </Button>
        )}
      </div>
    </nav>
  );
};
