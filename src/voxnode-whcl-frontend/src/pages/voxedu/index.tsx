
import { motion } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';

export default function VoxEduPage() {
  // Animation variants for Framer Motion
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.15,
      },
    }),
  };

  const compareBoxVariants = {
      hidden: { opacity: 0, x: -50 },
      visible: (i) => ({
          opacity: 1,
          x: 0,
          transition: {
              duration: 0.5,
              delay: i * 0.2,
          }
      })
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <main className="container mx-auto px-4 py-12 md:py-20">

        {/* Hero Section */}
        <motion.section
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900"
            style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Selamat Datang di Voxnode
          </motion.h1>
          <motion.p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600">
            Ruang Diskusi Aman dan Cerdas untuk Mendorong Kesetaraan.
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { delay: 0.4, duration: 0.5 } }}
          >
            <img
              src="https://placehold.co/1200x600/8b5cf6/ffffff?text=Ilustrasi+Diskusi+Inklusif&font=raleway"
              alt="Ilustrasi orang-orang berdiskusi secara inklusif"
              className="rounded-2xl shadow-2xl mx-auto"
            />
          </motion.div>
        </motion.section>

        {/* Why Voxnode Section */}
        <motion.section
          className="mt-24 md:mt-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900">Mengapa Memilih Voxnode?</h2>
          <p className="mt-3 text-center max-w-xl mx-auto text-slate-600">
            Kami membangun platform yang tidak hanya berbeda, tapi lebih baik untuk diskusi yang bermakna.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: <ShieldCheckIcon className="w-8 h-8 text-blue-500"/>, title: "Identitas Pseudo-Anonim", description: "Bicara bebas tanpa takut. Identitas Anda dilindungi oleh enkripsi blockchain, bukan data pribadi Anda." },
              { icon: <MessageCircleIcon className="w-8 h-8 text-purple-500"/>, title: "Diskusi Sehat & Terarah", description: "Fokus pada gagasan, bukan gender. Sistem kami mendorong argumen berkualitas dan meminimalisir kebisingan." },
              { icon: <BrainCircuitIcon className="w-8 h-8 text-green-500"/>, title: "Edukasi Berbasis AI", description: "Belajar tentang politik dan kesetaraan melalui gamifikasi dan chatbot AI yang cerdas dan interaktif." }
            ].map((item, i) => (
              <motion.div key={item.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cardVariants}>
                  <Card className="h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    <CardHeader>
                      <div className="bg-slate-100 p-3 rounded-full w-fit mb-2">{item.icon}</div>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">{item.description}</p>
                    </CardContent>
                  </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Critique vs Insult Section */}
        <motion.section
          className="mt-24 md:mt-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900">Pahami Perbedaannya: Kritik vs. Hinaan</h2>
          <p className="mt-3 text-center max-w-2xl mx-auto text-slate-600">
            Di Voxnode, kami mendorong kritik yang membangun, bukan hinaan yang menjatuhkan. Mari ciptakan dialog yang sehat.
          </p>
          <div className="mt-12 grid md:grid-cols-2 gap-8 items-start">
            {/* Kolom Kritik */}
            <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={compareBoxVariants}>
                <Card className="border-2 border-green-400 bg-green-50/50 h-full">
                  <CardHeader>
                    <CardTitle className="text-2xl text-green-800">✅ Kritik (Membangun)</CardTitle>
                    <CardDescription className="text-green-700">Bertujuan untuk perbaikan dan pertumbuhan bersama.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p><strong>Fokus:</strong> Pada ide, argumen, atau kebijakan.</p>
                    <p><strong>Tujuan:</strong> Memberikan masukan untuk perbaikan.</p>
                    <p><strong>Cara:</strong> Menggunakan data, logika, dan disampaikan dengan hormat.</p>
                    <div className="p-4 bg-green-100 rounded-lg">
                        <p className="font-mono text-sm text-green-900">"Saya kurang setuju dengan kebijakan itu karena data X menunjukkan dampak negatif. Mungkin alternatif Y bisa dipertimbangkan?"</p>
                    </div>
                  </CardContent>
                </Card>
            </motion.div>

            {/* Kolom Hinaan */}
            <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={compareBoxVariants}>
                <Card className="border-2 border-red-400 bg-red-50/50 h-full">
                  <CardHeader>
                    <CardTitle className="text-2xl text-red-800">❌ Hinaan (Menjatuhkan)</CardTitle>
                    <CardDescription className="text-red-700">Bertujuan untuk merendahkan dan menyerang personal.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p><strong>Fokus:</strong> Pada pribadi, kelompok, atau penampilan.</p>
                    <p><strong>Tujuan:</strong> Merendahkan, menyakiti, atau membungkam.</p>
                    <p><strong>Cara:</strong> Menggunakan makian, label negatif, dan emosi.</p>
                     <div className="p-4 bg-red-100 rounded-lg">
                        <p className="font-mono text-sm text-red-900">"Dasar tidak becus! Pendapatmu tidak berguna sama sekali!"</p>
                    </div>
                  </CardContent>
                </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer CTA */}
        <motion.footer
            className="mt-24 md:mt-32 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={sectionVariants}
        >
            <img
                src="https://placehold.co/400x200/e2e8f0/4a5568?text=Voxnode+Logo&font=raleway"
                alt="Logo Voxnode"
                className="mx-auto h-16 w-auto mb-4"
            />
            <h3 className="text-2xl font-bold text-slate-900">Siap Menjadi Bagian dari Perubahan?</h3>
            <p className="mt-2 text-slate-600">Bergabunglah dalam diskusi yang berarti dan suarakan pendapatmu sekarang.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="mt-6 bg-purple-600 text-white hover:bg-purple-700 text-lg">
                    Mulai Berdiskusi
                </Button>
            </motion.div>
        </motion.footer>

      </main>
    </div>
  );
}
