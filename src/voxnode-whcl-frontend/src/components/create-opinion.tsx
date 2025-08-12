// PERUBAHAN: Mengimpor fungsi moderasi AI dan tipe datanya
import { moderateVoxnodePost, ModerationResult } from '@/lib/moderation';
import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  User,
  AlertTriangle, // Icon tambahan untuk alasan penolakan
} from 'lucide-react';

// DIHAPUS: Fungsi dummyMLVerification tidak diperlukan lagi.
// const dummyMLVerification = ...

interface CreateOpinionProps {
  actor: any; // The Motoko canister actor
  onPostCreated: () => void; // Callback to refresh the feed
}

export const CreateOpinion = ({ actor, onPostCreated }: CreateOpinionProps) => {
  const [step, setStep] = useState(1);
  const [inputText, setInputText] = useState('');

  // PERUBAHAN: State diubah dari boolean ke objek ModerationResult
  // untuk menyimpan hasil lengkap dari API.
  const [moderationResult, setModerationResult] = useState<ModerationResult | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // useEffect untuk inject style tetap sama, tidak perlu diubah.
  useEffect(() => {
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleNext = async () => {
    setErrorMessage(null);

    // Step 1: Verifikasi konten menggunakan Gemini AI
    if (step === 1) {
      if (!inputText.trim()) {
        setErrorMessage('Konten tidak boleh kosong. Silakan ketik sesuatu yang menarik!');
        return;
      }
      setIsLoading(true);

      // PERUBAHAN: Memanggil fungsi moderasi AI yang sesungguhnya
      const result = await moderateVoxnodePost(inputText);
      setModerationResult(result); // Menyimpan seluruh objek hasil

      setIsLoading(false);
      setStep(2);
    }
    // Step 2: Submit ke Motoko canister jika konten diterima
    else if (step === 2) {
      // PERUBAHAN: Logika pengecekan diubah sesuai dengan objek 'moderationResult'
      if (moderationResult?.rekomendasi === 'TOLAK') {
        setErrorMessage('Konten Anda tidak bisa dikirim karena tidak sesuai. Silakan revisi.');
        return;
      }
       if (moderationResult?.rekomendasi === 'ERROR') {
        setErrorMessage('Terjadi kesalahan saat verifikasi. Coba lagi.');
        return;
      }
      if (!actor) {
        setErrorMessage("Tidak bisa terhubung ke layanan. Silakan refresh.");
        return;
      }

      setIsLoading(true);
      try {
        // Logika pengiriman ke canister tetap sama
        const textToSend = inputText.substring(0, 255);
        await actor.askQuestion(textToSend);
        setStep(3); // Pindah ke langkah sukses
      } catch (err: any) {
        console.error("Gagal mengirim opini ke canister:", err);
        let detailedError = "Terjadi kesalahan saat memposting opini Anda. Silakan coba lagi.";
        if (err.message?.includes("trapped: assertion failed")) {
            detailedError = "Pengiriman gagal. Konten mungkin terlalu panjang atau melanggar aturan server.";
        } else if (err.message?.includes("400")) {
            detailedError = "Pengiriman gagal. Mungkin ada masalah dengan koneksi. Silakan refresh dan coba lagi.";
        }
        setErrorMessage(detailedError);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (step > 1) {
      setStep(step - 1);
      if (step === 2) {
        // PERUBAHAN: Reset state moderasi
        setModerationResult(null);
      }
    }
  };

  const handleReset = () => {
    setStep(1);
    setInputText('');
    // PERUBAHAN: Reset state moderasi
    setModerationResult(null);
    setIsLoading(false);
    setErrorMessage(null);
    onPostCreated();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        // Tampilan Step 1 tidak ada perubahan signifikan
        return (
          <div key="step1" className="step-container absolute w-full px-4">
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0 item-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 shadow-xl border border-gray-300">
                  <User size={28} />
                </div>
              </div>
              <textarea
                id="content"
                className="flex-1 p-5 bg-gray-100 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:border-gray-400 transition-all duration-300 ease-in-out resize-none text-lg shadow-inner item-fade-in-up"
                style={{ animationDelay: '0.2s' }}
                rows={5}
                placeholder="Tulis opini kamu disini... (maks 255 karakter)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                maxLength={255}
                disabled={isLoading}
              ></textarea>
            </div>
            <p className="text-right text-sm text-gray-500 mt-3 font-medium item-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {inputText.length}/255 karakter
            </p>
          </div>
        );
      case 2:
        // PERUBAHAN BESAR: Tampilan Step 2 kini menampilkan hasil dari Gemini AI
        return (
          <div key="step2" className="step-container absolute w-full h-full flex flex-col items-center justify-center px-4 text-center">
            {isLoading && !moderationResult ? (
              <div className="flex flex-col items-center space-y-5">
                <Loader2 className="text-gray-800 animate-spin" size={80} />
                <p className="text-2xl font-bold text-gray-800">Memverifikasi dengan AI...</p>
                <p className="text-base text-gray-600">Sedang menganalisis sentimen dan kelayakan konten Anda.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-5">
                {moderationResult?.rekomendasi === 'PUBLIKASIKAN' ? (
                  <>
                    <div className="icon-scale-in">
                      <CheckCircle2 className="text-green-600" size={80} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">Konten Anda Lolos! 🎉</p>
                    <p className="text-lg text-gray-700 capitalize">
                      Klasifikasi: <span className="font-semibold">{moderationResult.klasifikasi.replace(/_/g, ' ')}</span>
                    </p>
                  </>
                ) : (
                  <>
                    <div className="icon-scale-in">
                      <XCircle className="text-red-600" size={80} />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">Konten Anda Ditolak 😟</p>
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-3">
                      <AlertTriangle size={20} />
                      <span className="text-base font-medium text-left">
                        Alasan: {moderationResult?.alasan_singkat}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      case 3:
        // Tampilan Step 3 tidak ada perubahan
        return (
          <div key="step3" className="step-container absolute w-full h-full flex flex-col items-center justify-center px-4 text-center">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-5">
                <Loader2 className="text-gray-800 animate-spin" size={80} />
                <p className="text-2xl font-bold text-gray-800">Mengirim ke Canister...</p>
              </div>
            ) : (
              <>
                <div className="icon-scale-in">
                  <Sparkles className="text-gray-800" size={80} />
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-5 item-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  Pengajuan Selesai dengan SUKSES! ✨
                </p>
                <p className="text-lg text-gray-700 mt-3 item-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Konten Anda telah diproses. Terima kasih!
                </p>
                <button
                  onClick={handleReset}
                  className="mt-10 px-10 py-4 bg-gray-800 text-gray-50 rounded-full hover:bg-gray-700 transition-all duration-300 ease-in-out shadow-xl text-lg font-bold button-hover-effect item-fade-in-up"
                  style={{ animationDelay: '0.3s' }}
                >
                  Lihat Postingan Saya
                </button>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full p-10 border-gray-200 relative overflow-hidden border-b">
      {/* Progress Bar tidak berubah */}
      {inputText.length > 0 && (
        <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-gray-800"
            style={{ width: `${(step / 3) * 100}%`, transition: 'width 0.7s ease-in-out' }}
          />
        </div>
      )}

      {/* Error Message tidak berubah */}
      {errorMessage && (
        <div
          className="bg-red-100 text-red-700 px-5 py-4 rounded-xl relative mb-8 text-base text-center border border-red-200 font-medium step-container"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      {/* Main Content Area tidak berubah */}
      <div className="relative min-h-[250px] flex items-center justify-center">
        {renderStepContent()}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mt-10 pt-6 gap-6">
        {step > 1 && step < 3 && (
          <button
            key="backButton"
            onClick={handleBack}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground button-hover-effect"
            disabled={isLoading}
          >
            Kembali
          </button>
        )}
        {step < 3 && (
          // PERUBAHAN: Logika 'disabled' dan 'className' pada tombol disesuaikan
          <button
            key="nextButton"
            onClick={handleNext}
            className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none h-9 px-4 py-2 button-hover-effect
              ${isLoading ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-gray-800 text-gray-50 hover:bg-gray-700'}
              ${!inputText.trim() && step === 1 ? 'opacity-50 cursor-not-allowed' : ''}
              ${moderationResult?.rekomendasi === 'TOLAK' && step === 2 ? 'opacity-50 bg-red-700 text-red-200 hover:bg-red-800 cursor-not-allowed' : ''}
            `}
            disabled={isLoading || (step === 1 && !inputText.trim()) || (step === 2 && moderationResult?.rekomendasi === 'TOLAK')}
          >
            {isLoading ? <Loader2 className="animate-spin inline-block mr-3" size={20} /> : step === 1 ? 'Verifikasi Konten' : 'Kirim Opini'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateOpinion;
