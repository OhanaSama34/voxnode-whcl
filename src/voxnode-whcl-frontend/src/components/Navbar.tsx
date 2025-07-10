import { AppLogo } from './app-logo';
import { Button } from './ui/button';

export const Navbar = () => {
  return (
    <nav className="flex w-full items-center justify-between border border-neutral-200 px-4 py-4 dark:border-neutral-800 sticky top-0 z-[100] bg-white/20 dark:bg-black/20 backdrop-blur-md border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <AppLogo className="scale-150 origin-left" />
      </div>
      <Button>Login</Button>
    </nav>
  );
};
