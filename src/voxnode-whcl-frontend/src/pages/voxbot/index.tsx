import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Mic, SendHorizonal, SendHorizonalIcon, PaperclipIcon, MicIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the structure for a single message
type Message = {
  id: number;
  sender: 'user' | 'bot';
  text: string;
};

// Mock data for the chat messages
const messages: Message[] = [
  { id: 1, sender: 'bot', text: "Halo! Selamat datang di Voxnode. Saya adalah asisten AI yang siap membantu Anda. Ada yang bisa saya bantu terkait kesetaraan gender dan politik?" },
  { id: 2, sender: 'user', text: "Halo. Saya masih agak bingung, sebenarnya Voxnode ini platform apa ya?" },
  { id: 3, sender: 'bot', text: "Tentu, saya jelaskan. Voxnode adalah platform diskusi terdesentralisasi berbasis Web3 yang dirancang sebagai ruang aman untuk membahas isu politik tanpa diskriminasi gender. Di sini, identitas Anda pseudo-anonim untuk melindungi privasi Anda." },
  { id: 4, sender: 'user', text: "Menarik. Kenapa sih isu kesetaraan gender di politik Indonesia itu penting banget buat dibahas?" },
  { id: 5, sender: 'bot', text: "Sangat penting. Menurut data, representasi perempuan di parlemen masih rendah dan budaya patriarki seringkali menjadi penghalang. Ini membuat banyak suara dan perspektif perempuan tidak terwakili dalam pembuatan kebijakan yang berdampak bagi semua." },
  { id: 6, sender: 'user', text: "Oke, saya paham. Tapi soal pseudo-anonim itu, seberapa aman memangnya? Saya agak takut kalau pendapat saya malah jadi bumerang." },
  { id: 7, sender: 'bot', text: "Kekhawatiran yang wajar. Voxnode menggunakan teknologi blockchain dari Internet Computer. Identitas Anda tidak terhubung dengan data pribadi seperti nama atau email, melainkan dengan sebuah ID digital unik yang terenkripsi. Ini memastikan Anda bisa berpendapat dengan bebas tanpa takut diidentifikasi." },
  { id: 8, sender: 'user', text: "Wah, keren juga teknologinya. Kalau saya mau ikut diskusi atau memulai topik baru, caranya gimana?" },
  { id: 9, sender: 'bot', text: "Sangat mudah! Anda bisa langsung ke halaman 'Forum' atau 'Diskusi'. Di sana ada tombol 'Buat Postingan Baru'. Anda bisa langsung menuliskan pendapat atau pertanyaan Anda untuk memulai diskusi dengan pengguna lain." },
  { id: 10, sender: 'user', text: "Oke, terima kasih banyak atas penjelasannya. Sangat membantu!" }
];

// A component for rendering a single chat message
const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 border">
          <AvatarImage src="https://github.com/shadcn.png" alt="Bot" />
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`!w-10 rounded-xl px-4 py-3 text-sm shadow-sm text-wrap ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        <p>{message.text}</p>
      </div>
    </div>
  );
};

// The main chat page component
export default function VoxBotPage() {
  return (
    <div className="flex w-full flex-col bg-background h-screen">
      {/* Chat Header */}
      <header className="flex-shrink-0 border-b bg-card p-4 text-center">
        <h1 className="text-xl font-bold text-card-foreground">VoxBot</h1>
        <p className="text-sm text-muted-foreground">Your AI-powered copilot</p>
      </header>

      {/* Chat Messages Area */}
      <ScrollArea className="flex-grow p-4 ">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>
      </ScrollArea>

      {/* Chat Input Form */}
      <footer className="flex-shrink-0 border-t bg-background px-4 py-3 sticky bottom-0">
        <div className="mx-auto max-w-4xl">
          <form className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <PaperclipIcon className="h-5 w-5 text-muted-foreground" />
              {/* <span className="sr-only">Attach file</span> */}
            </Button>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <MicIcon className="h-5 w-5 text-muted-foreground" />
              {/* <span className="sr-only">Use microphone</span> */}
            </Button>
            <Input
              type="text"
              placeholder="Type a message..."
              className="flex-grow"
              autoComplete="off"
            />
            <Button type="submit" size="icon" className="flex-shrink-0">
              <SendHorizonalIcon className="h-5 w-5 transform rotate-45" />
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}
