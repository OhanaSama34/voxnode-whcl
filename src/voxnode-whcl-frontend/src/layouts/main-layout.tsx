import { Footer } from '@/components/footer';
import { Navbar } from '@/components/Navbar';
import { SmoothCursor } from '@/components/ui/smooth-cursor';

const MainLayout = ({ children }: { children: any }) => {
  return (
    <>
      <div className="relative mx-auto mt-10 flex max-w-4xl flex-col items-center justify-center">
        <Navbar />

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
      {/* <SmoothCursor /> */}
    </>
  );
};

export default MainLayout;
