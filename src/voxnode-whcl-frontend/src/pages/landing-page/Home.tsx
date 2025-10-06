import {motion} from 'motion/react'
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {cn} from '@/lib/utils'


import { HeroSection } from './partials/HeroSection';
import { AppLogo } from '@/components/app-logo';

export default function Home() {
  // Animation for the main card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 font-sans">
      <div className="w-full max-w-sm min-h-screen">
        <motion.div initial="hidden" animate="visible" variants={cardVariants}>
          <Card className='min-h-screen py-4'>
            <CardContent>
              <div className="text-center flex flex-col items-center gap-1">
                {/* Logo and Description */}
                <AppLogo className="transform scale-125" />
                <p className="mt-3 mb-8 text-sm text-gray-500">
                  Deliver your thoughts and criticisms freely without worry. Share your
                  voice, spark meaningful change, and stay protected — all while keeping
                  it smart, safe, and impactful. Use your words, let us protect your
                  space.
                </p>

                {/* Login Button */}
                <Button>Login with Internet Identity</Button>

                {/* Separator */}
                <div className="my-6 flex items-center">
                  <div className="flex-grow border-t border-gray-300" />
                  <span className="mx-4 flex-shrink text-xs font-semibold text-gray-400">ATAU</span>
                  <div className="flex-grow border-t border-gray-300" />
                </div>

                {/* Info Link */}
                <a href="#" className="text-xs font-semibold text-black hover:underline">
                  Apa itu Internet Identity?
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom Box */}
        <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.5 } }}
        >
            <Card>
                <div className="p-4 text-center text-sm">
                    Belum punya akun?{' '}
                    <a href="#" className="font-semibold text-black hover:underline">
                        Buat identitas baru.
                    </a>
                </div>
            </Card>
        </motion.div>
      </div>
    </div>
  );
}
