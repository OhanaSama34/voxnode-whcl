import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Award,
  MessageCircle,
  User,
} from 'lucide-react'; // Added Award icon
import { Button } from '@/components/ui/button';

const POINTS_ASK_QUESTION = 7;
const POINTS_ANSWER = 5; // Not used in this form, but kept for reference
const POINTS_UPVOTE_RESPONDER = 2; // Not used in this form, but kept for reference
const POINTS_UPVOTE_QUESTIONER = 1; // Not used in this form, but kept for reference

// Dummy ML Verification Function (unchanged)
const dummyMLVerification = async (text: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const inappropriateKeywords = ['badword', 'spam', 'hate', 'scam'];
      const isAppropriate = !inappropriateKeywords.some((keyword) =>
        text.toLowerCase().includes(keyword)
      );
      resolve(isAppropriate);
    }, 1500);
  });
};

// --- Reputation Management (Simulated Backend Logic) ---
// Using a Map to simulate TrieMap for reputation storage
const reputationStore = new Map<string, number>();

// Pseudo-random coin flip (simulates Motoko's randomToggle)
let randomToggle = true;
const flipCoin = (): boolean => {
  const current = randomToggle;
  randomToggle = !randomToggle;
  return current;
};

// Adjust reputation function (simulates Motoko's adjustReputation)
const adjustReputation = (userId: string, amount: number): boolean => {
  const current = reputationStore.get(userId) || 0;
  const isLucky = flipCoin();
  const newRep = isLucky ? current + amount : current - amount;
  reputationStore.set(userId, newRep);
  return isLucky;
};

// Get reputation (simulates Motoko's getReputation)
const getReputation = (userId: string): number => {
  return reputationStore.get(userId) || 0;
};
// --- End Reputation Management ---

export const CreateOpinion: React.FC = () => {
  const [step, setStep] = useState(1);
  const [inputText, setInputText] = useState('');
  const [isAppropriate, setIsAppropriate] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserReputation, setCurrentUserReputation] = useState<number>(0);

  useEffect(() => {
    const dummyId = `user_${Math.random().toString(36).substring(2, 11)}`;
    setCurrentUserId(dummyId);
    if (!reputationStore.has(dummyId)) {
      reputationStore.set(dummyId, 0);
    }
    setCurrentUserReputation(getReputation(dummyId));
  }, []);

  const updateReputationUI = useCallback(() => {
    setCurrentUserReputation(getReputation(currentUserId));
  }, [currentUserId]);

  const handleNext = async () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!inputText.trim()) {
        setErrorMessage(
          'Konten tidak boleh kosong. Silakan ketik sesuatu yang menarik!'
        );
        return;
      }
      setIsLoading(true);
      const appropriate = await dummyMLVerification(inputText);
      setIsAppropriate(appropriate);
      setIsLoading(false);
      setStep(2);
    } else if (step === 2) {
      if (isAppropriate === false) {
        setErrorMessage(
          'Konten Anda tidak sesuai. Mari kita coba lagi dengan kata-kata yang lebih baik!'
        );
        return;
      }
      const lucky = adjustReputation(currentUserId, POINTS_ASK_QUESTION);
      console.log(
        `Pengguna ${currentUserId} mengajukan pertanyaan. Reputasi disesuaikan sebesar ${POINTS_ASK_QUESTION}. Beruntung: ${lucky}`
      );
      updateReputationUI();
      setStep(3);
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (step > 1) {
      setStep(step - 1);
      if (step === 2) {
        setIsAppropriate(null);
      }
    }
  };

  const handleReset = () => {
    setStep(1);
    setInputText('');
    setIsAppropriate(null);
    setIsLoading(false);
    setErrorMessage(null);
    updateReputationUI();
  };

  // Framer Motion variants for step transitions (more dynamic)
  const stepVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      rotateY: direction > 0 ? 15 : -15, // Reduced rotation for subtlety
      scale: 0.9, // Slightly more subtle scale
    }),
    animate: {
      x: '0%',
      opacity: 1,
      rotateY: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200, // Adjusted stiffness
        damping: 20, // Adjusted damping
        opacity: { duration: 0.2 },
        scale: { duration: 0.3 },
        rotateY: { duration: 0.3 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      rotateY: direction < 0 ? 15 : -15,
      scale: 0.9,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        opacity: { duration: 0.2 },
        scale: { duration: 0.3 },
        rotateY: { duration: 0.3 },
      },
    }),
  };

  // Variants for individual elements within a step (staggered reveal)
  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 15,
      },
    },
  };

  // Variants for buttons (more pronounced hover/tap)
  const buttonVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 250, damping: 20 },
    },
    hover: { scale: 1.05, boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' }, // Monochromatic shadow
    tap: { scale: 0.95 },
  };

  return (
    <div className="w-full p-10 border-gray-200 relative overflow-hidden border-b">
      <AnimatePresence>
        {inputText.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 8, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 right-0 bg-gray-200 overflow-hidden" /* Light gray background for track */
          >
            <motion.div
              className="h-full bg-gray-800"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          className="bg-red-100 text-red-700 px-5 py-4 rounded-xl relative mb-8 text-base text-center border border-red-200 font-medium" /* Lighter error message */
          role="alert"
        >
          {errorMessage}
        </motion.div>
      )}
      <div className="relative min-h-[250px] flex items-center justify-center">
        <AnimatePresence initial={false} mode="wait" custom={step}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={1}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute w-full px-4"
            >
              <div className="flex items-start space-x-5">
                <motion.div
                  className="flex-shrink-0"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 shadow-xl border border-gray-300">
                    {' '}
                    {/* Lighter user icon background */}
                    <User size={28} />
                  </div>
                </motion.div>
                <motion.textarea
                  id="content"
                  className="flex-1 p-5 bg-gray-100 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:border-gray-400 transition-all duration-300 ease-in-out resize-none text-lg shadow-inner" /* Lighter input field */
                  rows={5}
                  placeholder="Tulis opini kamu disini... (maks 33 karakter)"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  maxLength={33}
                  disabled={isLoading}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                ></motion.textarea>
              </div>
              <motion.p
                className="text-right text-sm text-gray-500 mt-3 font-medium" /* Darker text */
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                {inputText.length}/33 karakter
              </motion.p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={1}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute w-full h-full flex flex-col items-center justify-center px-4 text-center"
            >
              {isLoading ? (
                <motion.div
                  className="flex flex-col items-center space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Loader2 className="text-gray-800" size={80} />{' '}
                    {/* Darker loader */}
                  </motion.div>
                  <p className="text-2xl font-bold text-gray-800">
                    Memverifikasi konten Anda...
                  </p>{' '}
                  {/* Darker text */}
                  <p className="text-base text-gray-600">
                    Kami sedang memastikan semuanya sesuai. Mohon tunggu
                    sebentar.
                  </p>{' '}
                  {/* Darker text */}
                </motion.div>
              ) : (
                <motion.div
                  className="flex flex-col items-center space-y-5"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  {isAppropriate ? (
                    <>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 260,
                          damping: 20,
                        }}
                      >
                        <CheckCircle2 className="text-green-600" size={80} />{' '}
                        {/* Darker green for success */}
                      </motion.div>
                      <p className="text-2xl font-bold text-gray-800">
                        Konten Anda LUAR BIASA! 🎉
                      </p>{' '}
                      {/* Darker text */}
                      <p className="text-lg text-gray-700">
                        Siap untuk melanjutkan perjalanan Anda.
                      </p>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 260,
                          damping: 20,
                        }}
                      >
                        <XCircle className="text-red-600" size={80} />{' '}
                        {/* Darker red for error */}
                      </motion.div>
                      <p className="text-2xl font-bold text-gray-800">
                        Konten Anda TIDAK sesuai. 😟
                      </p>{' '}
                      {/* Darker text */}
                      <p className="text-lg text-gray-700">
                        Mari kita revisi bersama untuk pengalaman yang lebih
                        baik.
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={1}
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute w-full h-full flex flex-col items-center justify-center px-4 text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <Sparkles className="text-gray-800" size={80} />{' '}
                {/* Darker sparkles */}
              </motion.div>
              <motion.p
                className="text-2xl font-bold text-gray-800 mt-5" /* Darker text */
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
              >
                Pengajuan Selesai dengan SUKSES! ✨
              </motion.p>
              <motion.p
                className="text-lg text-gray-700 mt-3" /* Darker text */
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                Konten Anda telah diproses dan reputasi Anda telah diperbarui.
                Terima kasih!
              </motion.p>
              <motion.button
                onClick={handleReset}
                className="mt-10 px-10 py-4 bg-gray-800 text-gray-50 rounded-full hover:bg-gray-700 transition-all duration-300 ease-in-out shadow-xl text-lg font-bold" /* Darker button */
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 12px 25px rgba(0, 0, 0, 0.15)',
                }}
                whileTap={{ scale: 0.95 }}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                Mulai Opini Baru
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex justify-end mt-10 pt-6 gap-6">
        {' '}
        {/* Lighter border */}
        <AnimatePresence>
          {step > 1 && step < 3 && (
            <motion.button
              key="backButton"
              onClick={handleBack}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 px-4 py-2 has-[>svg]:px-3 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50" /* Lighter button */
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              Kembali
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {step < 3 && (
            <motion.button
              key="nextButton"
              onClick={handleNext}
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 px-4 py-2 has-[>svg]:px-3
                  ${
                    isLoading
                      ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                      : 'bg-gray-800 text-gray-50 hover:bg-gray-700'
                  } /* Darker main button */
                  ${
                    !inputText.trim() && step === 1
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }
                  ${
                    isAppropriate === false && step === 2
                      ? 'bg-red-700 text-red-200 hover:bg-red-800'
                      : ''
                  }
                `}
              disabled={
                isLoading ||
                (step === 1 && !inputText.trim()) ||
                (step === 2 && isAppropriate === false)
              }
              whileHover={{
                scale: 1.08,
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
              }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                <Loader2 className="animate-spin inline-block mr-3" size={20} />
              ) : step === 1 ? (
                'Verifikasi Konten'
              ) : (
                'Kirim Opini'
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
