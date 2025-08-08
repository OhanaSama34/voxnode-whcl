import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {Avatar, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import { PaperclipIcon, MicIcon, SendHorizontalIcon, SendHorizonalIcon } from 'lucide-react';

type Message = {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  sources?: { uri: string; title: string }[];
};
const SYSTEM_PROMPT = `You are VoxBot, a professional AI assistant who is an expert and observer of the latest and most up-to-date political and policy issues of the Indonesian government, communicating in an academic tone yet still easily understood by the general public, politically neutral, and based on data and credible references. Your role is as an AI Assistant for Voxnode, a Web3 and AI-based public aspiration platform aimed at fostering inclusive and sustainable governance. This platform enables the anonymous expression of public aspirations through a blockchain-based internet computer network. Voxnode focuses on facilitating anonymous feedback on government policies and actions, fostering a culture of participatory engagement within society regarding current events in Indonesia. Your primary role is to analyze questions, provide answers, and facilitate focused discussions on political issues and the latest policies in Indonesia using an academic tone that remains accessible to the general public, politically neutral, and backed by credible data and references. You will provide sharp and informative summaries of complex political issues using language that is easy to understand, including the latest news sources. If a question is outside this scope, politely explain that you are a specialist in topics related to Voxnode and the latest political and policy issues in Indonesia. Keep your answers concise and clear.`;

async function getGeminiResponse(currentMessage: string, history: Message[]): Promise<{text: string, sources: any[]}> {

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const formattedHistory = history.map(msg => ({
        role: msg.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }]
    }));

    const payload = {
        contents: [
            ...formattedHistory,
            { role: "user", parts: [{ text: currentMessage }] }
        ],
        tools: [{
            "google_search": {}
        }],
        systemInstruction: {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT }]
        }
    };

    try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) {
            console.error("API Error:", response.status, await response.text());
            return { text: "Maaf, terjadi sedikit gangguan di pihak saya. Coba tanyakan lagi beberapa saat lagi.", sources: [] };
        }
        const result = await response.json();

        const candidate = result.candidates?.[0];
        if (candidate?.content?.parts?.[0]) {
            const text = candidate.content.parts[0].text;
            const sources = candidate.groundingMetadata?.webSearchQueries?.map((q: any) => q.results).flat().filter(Boolean) || [];
            return { text, sources };
        } else {
            const finishReason = candidate?.finishReason;
            if (finishReason === 'SAFETY') {
                 return { text: "Maaf, saya tidak dapat memberikan jawaban untuk pertanyaan tersebut karena batasan keamanan. Bisakah Anda mencoba pertanyaan lain?", sources: [] };
            }
            console.error("Unexpected API response structure:", result);
            return { text: "Maaf, saya menerima respons yang tidak terduga. Bisakah Anda mencoba lagi?", sources: [] };
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        return { text: "Maaf, saya tidak dapat terhubung ke server saat ini. Silakan periksa koneksi Anda dan coba lagi.", sources: [] };
    }
}

const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.sender === 'user';

  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);
      const processedLine = parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      const isListItem = /^\s*(\d+\.|-|\*)\s/.test(line);
      return <span key={index} className={`block ${isListItem ? 'pl-4' : ''}`}>{processedLine}</span>;
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
      <div className={`max-w-md lg:max-w-lg rounded-xl px-4 py-3 text-sm shadow-md text-wrap ${isUser ? 'bg-slate-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
        <div>{renderFormattedText(message.text)}</div>
        {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-2 border-t border-gray-300">
                <h4 className="text-xs font-bold text-gray-600 mb-1">Sumber:</h4>
                <ul className="list-none pl-0">
                    {message.sources
                        .filter(source => source && source.uri)
                        .map((source, index) => (
                            <li key={index} className="text-xs truncate">
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:underline">
                                    {index + 1}. {source.title}
                                </a>
                            </li>
                        ))}
                </ul>
            </div>
        )}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
      { id: 1, sender: 'bot', text: "Halo! Selamat datang di Voxnode. Saya adalah asisten AI yang siap membantu Anda mendiskusikan isu politik dan kebijakan terbaru di Indonesia. Apa yang ingin Anda ketahui?" }
  ]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isBotTyping) return;
    const userMessage: Message = { id: Date.now(), sender: 'user', text: input };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    setIsBotTyping(true);

    const { text: botResponseText, sources: botSources } = await getGeminiResponse(input, currentMessages);

    const botMessage: Message = { id: Date.now() + 1, sender: 'bot', text: botResponseText, sources: botSources };
    setMessages(prev => [...prev, botMessage]);
    setIsBotTyping(false);
  };

  return (
    <div className="flex w-full flex-col bg-gray-50 h-screen font-sans">
      <header className="flex-shrink-0 border-b bg-white p-4 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">VoxBot</h1>
        <p className="text-sm text-gray-500">Your AI-powered copilot for political discourse</p>
      </header>
      <div ref={scrollAreaRef} className="flex-grow p-4 overflow-y-auto">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
            <AnimatePresence>
                {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
            </AnimatePresence>
            {isBotTyping && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2 justify-start">
                    <Avatar className="h-8 w-8 border"><AvatarImage src="https://placehold.co/40x40/7c3aed/ffffff?text=V" alt="Bot" /></Avatar>
                    <div className="max-w-[80%] rounded-xl px-4 py-3 text-sm shadow-md bg-gray-200 text-gray-800 rounded-bl-none">
                        <motion.div className="flex gap-1.5" initial="start" animate="end" transition={{ repeat: Infinity, staggerChildren: 0.2 }}>
                            <motion.span variants={{start: {y: "0%"}, end: {y: "100%"}}} transition={{duration: 0.4, repeat: Infinity, repeatType: 'reverse'}} className="w-2 h-2 bg-gray-400 rounded-full" />
                            <motion.span variants={{start: {y: "0%"}, end: {y: "100%"}}} transition={{duration: 0.4, repeat: Infinity, repeatType: 'reverse', delay: 0.2}} className="w-2 h-2 bg-gray-400 rounded-full" />
                            <motion.span variants={{start: {y: "0%"}, end: {y: "100%"}}} transition={{duration: 0.4, repeat: Infinity, repeatType: 'reverse', delay: 0.4}} className="w-2 h-2 bg-gray-400 rounded-full" />
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </div>
      </div>
      <footer className="flex-shrink-0 border-t bg-white px-4 py-3 sticky bottom-0">
        <div className="mx-auto max-w-4xl">
          <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
            <Input type="text" placeholder="Ketik pesan Anda..." className="flex-grow focus-visible:ring-slate-500" autoComplete="off" value={input} onChange={(e) => setInput(e.target.value)} disabled={isBotTyping} />
            <Button type="submit" size="icon" variant="default" className="flex-shrink-0 bg-slate-600 hover:bg-slate-700" disabled={isBotTyping}><SendHorizonalIcon className="h-5 w-5" /></Button>
          </form>
        </div>
      </footer>
    </div>
  );
}
