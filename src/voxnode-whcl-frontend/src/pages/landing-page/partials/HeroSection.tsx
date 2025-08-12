'use client';

import { AppLogo } from '@/components/app-logo';
import HeroVideoDialog from '@/components/magicui/hero-video-dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { VoxnodeFeatures } from './features';

export function HeroSection() {
  return (
    <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center">
      <div className="px-4 py-10 md:py-20">
        <AppLogo className="mx-auto select-none mb-4" />
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-8xl font-comic">
          {`Kritik Asik Tanpa Harus Terusik`.split(' ').map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: 'easeInOut',
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600"
        >
          Deliver your thoughts and criticisms freely without worry. Share your
          voice, spark meaningful change, and stay protected — all while keeping
          it smart, safe, and impactful. Use your words, let us protect your
          space.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Button size={"lg"} className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800">
            Start Your Opinion
          </Button>
        </motion.div>
        <hr className="my-10" />
        <h2 className="relative z-10 mx-auto max-w-4xl text-center text-lg font-bold text-slate-700 md:text-2xl lg:text-4xl font-comic">
          Bebas Kritik, Tetap Asik: Begini Caranya!
        </h2>
        <p className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600">
          Tonton bagaimana platform kami membuatmu bisa mengirim kritik dengan
          bebas dan aman. Dalam demo singkat ini, kamu akan melihat bagaimana
          caranya berbicara tanpa takut, membangun perubahan, dan tetap
          terlindungi.
        </p>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md "
        >
          <div className="relative w-full overflow-hidden rounded-xl border border-gray-300 ">
            <HeroVideoDialog
              className="block "
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/ZDoyjW3urvM?si=3VhHcPa02yzBO53L"
              thumbnailSrc="https://img.youtube.com/vi/ZDoyjW3urvM/maxresdefault.jpg"
              thumbnailAlt="Hero Video"
            />
          </div>
        </motion.div>
      </div>
      <VoxnodeFeatures />

      <div className="px-8 text-center mt-8 mb-16">
        <h5 className="text-lg md:text-xl font-semibold text-black dark:text-white">
          Siap untuk menyuarakan pendapat Anda?
        </h5>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 mb-6 max-w-md mx-auto">
          Gabung dalam diskusi secara anonim dan aman. Jadilah bagian dari perubahan.
        </p>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 mx-auto shadow-lg"
        >
            Masuk dengan Internet Identity
        </motion.button>
      </div>

    </div>
  );
}
