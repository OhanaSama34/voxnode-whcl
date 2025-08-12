import React from "react";
import { cn } from "@/lib/utils";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
// PERUBAHAN: Mengimpor ikon yang lebih relevan
import { IconMessageChatbot, IconUsersGroup, IconChartBar, IconWorldSearch } from "@tabler/icons-react";


export function VoxnodeFeatures() {
  // PERUBAHAN: Menyesuaikan konten fitur dengan tema VoxNode
  const features = [
    {
      title: "Diskusi Terarah & Bermutu",
      description:
        "Sampaikan opini Anda dalam ruang diskusi yang dimoderasi AI untuk menjaga percakapan tetap substantif dan bebas dari toksisitas.",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800",
    },
    {
      title: "Wawasan Politik Global",
      description:
        "Jelajahi isu-isu politik tidak hanya di Indonesia, tapi juga di seluruh dunia dengan asisten AI VoxBot kami.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];

  return (
    <div className="relative z-20 py-10 max-w-7xl mx-auto">
      <div className="px-8">
        {/* PERUBAHAN: Menyesuaikan judul utama */}
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
          Platform Diskusi Politik Generasi Berikutnya
        </h4>

        {/* PERUBAHAN: Menyesuaikan subjudul */}
        <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
          VoxNode menggabungkan kekuatan komunitas dengan kecerdasan buatan untuk menciptakan ruang diskursus publik yang cerdas, adil, dan berdampak.
        </p>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base max-w-4xl text-left mx-auto",
        "text-neutral-500 text-center font-normal dark:text-neutral-300",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

// PERUBAHAN: Mengganti gambar dengan visualisasi UI VoxNode
export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full p-5 mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2">
          {/* Gambar placeholder untuk UI feed VoxNode */}
          <img
            src="/feed.png"
            alt="Contoh tampilan feed diskusi VoxNode"
            width={800}
            height={800}
            className="h-full w-full aspect-square object-cover object-center rounded-sm"
          />
        </div>
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

// PERUBAHAN: Mengganti gambar dengan visualisasi analisis sentimen
export const SkeletonTwo = () => {
  return (
    <div className="relative flex flex-col items-center justify-center p-8 gap-10 h-full overflow-hidden">
        <IconChartBar className="w-20 h-20 md:w-32 md:h-32 text-slate-700 dark:text-slate-300" stroke={1.5} />
        <div className="w-full mt-4">
            <div className="h-4 bg-green-500 rounded-full" style={{width: '60%'}}></div>
            <p className="text-xs text-green-500 mt-1">Positif</p>
        </div>
        <div className="w-full">
            <div className="h-4 bg-red-500 rounded-full" style={{width: '25%'}}></div>
            <p className="text-xs text-red-500 mt-1">Negatif</p>
        </div>
        <div className="w-full">
            <div className="h-4 bg-gray-400 rounded-full" style={{width: '15%'}}></div>
            <p className="text-xs text-gray-400 mt-1">Netral</p>
        </div>
      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black to-transparent h-full pointer-events-none" />
    </div>
  );
};


// PERUBAHAN: Mengganti ikon YouTube dengan ikon komunitas
export const SkeletonThree = () => {
  return (
    <div className="relative flex flex-col items-center justify-center gap-10 h-full group/image">
        <IconUsersGroup className="w-24 h-24 md:w-40 md:h-40 text-slate-700 dark:text-slate-300 group-hover/image:scale-110 transition-transform duration-200" stroke={1.5} />
        <div className="flex -space-x-4 rtl:space-x-reverse">
            <img className="w-12 h-12 border-2 border-white rounded-full dark:border-gray-800" src="https://placehold.co/40x40/f87171/ffffff?text=A" alt="User A"/>
            <img className="w-12 h-12 border-2 border-white rounded-full dark:border-gray-800" src="https://placehold.co/40x40/60a5fa/ffffff?text=B" alt="User B"/>
            <div className="flex items-center justify-center w-12 h-12 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800">
                +99
            </div>
        </div>
    </div>
  );
};

// PERUBAHAN: Mengganti Globe dengan ikon VoxBot dan memindahkan Globe ke fitur lain
export const SkeletonFour = () => {
    return (
      <div className="h-60 md:h-60 flex flex-col items-center justify-center relative bg-transparent dark:bg-transparent mt-10">
        <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
      </div>
    );
};


export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        // longitude latitude
        // PERUBAHAN: Menambahkan marker untuk Jakarta
        { location: [-6.2088, 106.8456], size: 0.1 },
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.05 },
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};
