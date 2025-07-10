import { AppLogo } from './app-logo';

export const Footer = () => {
  return (
    <footer className="bg-black flex w-full justify-between items-center py-20 px-18 text-white">
      <AppLogo className="scale-[200%] origin-left" />
      <h2 className="text-2xl md:text-4xl font-bold font-comic">
        #KritikAsikTanpaTerusik
      </h2>
    </footer>
  );
};
