// src/layouts/main-layout.tsx
import React from 'react';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/Navbar';
import type { AppState } from '@/App'; // Import the state type from App.tsx

// Define the props for the layout component for type safety.
interface MainLayoutProps {
  children: React.ReactNode;
  state: AppState;
  login: () => void;
  logout: () => void;
}

const MainLayout = ({
  children,
  state,
  login,
  logout,
}: MainLayoutProps) => {
  return (
    <>
      <main className="max-w-5xl mx-auto">
        <div className="relative mx-auto mt-10 flex max-w-4xl flex-col items-center justify-center">
          {/* Pass all the necessary props down to the Navbar */}
          <Navbar state={state} login={login} logout={logout} />

          <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
            <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
          </div>
          <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
            <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
            <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </div>

          {children}

          <Footer />
        </div>
      </main>
    </>
  );
};

export default MainLayout;
