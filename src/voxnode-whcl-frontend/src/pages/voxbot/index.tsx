import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizontalIcon } from 'lucide-react';

// ==================================================================
// TIPE DATA
// ==================================================================
type Message = {
  id: number;
  sender: 'user' | 'bot';
  text: string;
};

// ==================================================================
// FUNGSI INTI (Panggilan ke Gemini API)
// ==================================================================

/**
 * Memanggil Gemini API untuk mendapatkan respons.
 * @param userInput Teks pertanyaan dari pengguna.
 * @returns String berisi jawaban dari AI.
 */
async function getGeminiResponse(userInput: string): Promise<string> {
  // --- PENTING: Ganti dengan Kunci API Gemini Anda ---
  // Dapatkan kunci gratis dari: https://aistudio.google.com/
  const GEMINI_API_KEY = "AIzaSyAT8jRM3XWQ0hxZa9xcRFO6SSM_k-n9hX4";

  if (GEMINI_API_KEY !== "AIzaSyAT8jRM3XWQ0hxZa9xcRFO6SSM_k-n9hX4") {
    return "Error: Kunci API Gemini belum diatur. Silakan ganti placeholder di dalam kode.";
  }

  // Prompt ini mendefinisikan persona dan batasan pengetahuan bot.
  const systemPrompt = `
    Anda adalah VoxBot, seorang asisten AI yang sangat ahli dalam bidang politik, kebijakan, dan sejarah Indonesia.
    - **Persona Anda**: Netral, objektif, informatif, dan analitis.
    - **Domain Pengetahuan**: Politik terkini (berdasarkan data pelatihan Anda), sejarah politik Indonesia, definisi konsep-konsep seperti kritik, saran, hinaan, dan isu-isu terkait. Anda juga bisa membahas politik dunia, tetapi selalu prioritaskan konteks Indonesia.
    - **Batasan**: Pengetahuan Anda tidak real-time dan terbatas pada data hingga pembaruan terakhir Anda. Jangan pernah mengklaim mengetahui berita yang terjadi "hari ini". Jika ditanya tentang kejadian sangat baru, jelaskan batasan Anda dengan sopan.
    - **Tugas**: Jawab pertanyaan pengguna secara komprehensif dan terstruktur.
  `;

  const finalPrompt = `${systemPrompt}\n\n**Pertanyaan Pengguna:**\n${userInput}`;

  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: finalPrompt }] }] }),
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error("Gemini API Error:", errorBody);
      return `Maaf, terjadi error saat menghubungi API: ${geminiResponse.status}`;
    }

    const geminiData = await geminiResponse.json();
    const textResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (textResponse) {
        return textResponse;
    } else {
        // Menangani jika respons diblokir karena safety settings atau format tidak valid
        const finishReason = geminiData.candidates?.[0]?.finishReason;
        if (finishReason === 'SAFETY') {
            return "Maaf, saya tidak dapat memberikan jawaban untuk pertanyaan tersebut karena batasan keamanan.";
        }
        return "Maaf, saya tidak dapat menghasilkan respons saat ini. Mungkin ada masalah dengan format balasan dari API.";
    }
  } catch (error) {
    console.error("Gagal memanggil Gemini API:", error);
    return "Maaf, terjadi kesalahan saat menghubungi layanan AI. Periksa koneksi internet Anda.";
  }
}


// ==================================================================
// KOMPONEN PESAN CHAT
// ==================================================================
const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.sender === 'user';

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);
      return (
        <span key={index} className="block">
          {parts.map((part, i) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
            ) : (
              part
            )
          )}
        </span>
      );
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border self-start">
          <AvatarImage src="https://placehold.co/40x40/7c3aed/ffffff?text=V" alt="Bot" />
        </Avatar>
      )}
      <div className={`max-w-md lg:max-w-lg rounded-xl px-4 py-3 text-sm shadow-md ${
        isUser ? 'bg-slate-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'
      }`}>
        <div>{renderFormattedText(message.text)}</div>
      </div>
    </motion.div>
  );
};


// ==================================================================
// KOMPONEN UTAMA APLIKASI
// ==================================================================
export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'bot',
      text: "Halo! Saya VoxBot, asisten AI Anda untuk isu politik di Indonesia. Apa yang ingin Anda diskusikan?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isBotTyping) return;

    const userMessage: Message = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsBotTyping(true);

    try {
      // Memanggil fungsi Gemini langsung dari frontend
      const responseText = await getGeminiResponse(input);
      const botMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: "Maaf, terjadi kesalahan yang tidak terduga."
      }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="flex w-full flex-col bg-gray-50 h-screen font-sans">
      <header className="flex-shrink-0 border-b bg-white p-4 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">VoxBot</h1>
        <p className="text-sm text-gray-500">Asisten AI untuk Diskursus Politik</p>
      </header>

      <div ref={scrollAreaRef} className="flex-grow p-4 overflow-y-auto">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          <AnimatePresence>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </AnimatePresence>

          {isBotTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2 justify-start">
              <Avatar className="h-8 w-8 border">
                <AvatarImage src="https://placehold.co/40x40/7c3aed/ffffff?text=V" alt="Bot" />
              </Avatar>
              <div className="rounded-xl px-4 py-3 bg-gray-200">
                <motion.div
                  className="flex gap-1.5"
                  transition={{ repeat: Infinity, staggerChildren: 0.2 }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.span
                      key={i}
                      style={{ y: '50%' }}
                      animate={{ y: ['50%', '0%', '50%'] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <footer className="flex-shrink-0 border-t bg-white px-4 py-3 sticky bottom-0">
        <div className="mx-auto max-w-4xl">
          <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
            <Input
              type="text"
              placeholder="Ketik pesan Anda..."
              className="flex-grow focus-visible:ring-slate-500"
              autoComplete="off"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isBotTyping}
            />
            <Button
              type="submit"
              size="icon"
              variant="default"
              className="flex-shrink-0 bg-slate-600 hover:bg-slate-700"
              disabled={isBotTyping || !input.trim()}
            >
              <SendHorizontalIcon className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}
