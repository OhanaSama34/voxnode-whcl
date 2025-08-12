import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// PERUBAHAN 1: Menyederhanakan tipe 'rekomendasi' menjadi hanya dua pilihan utama.
export interface ModerationResult {
  klasifikasi: string;
  alasan_singkat: string;
  rekomendasi: "PUBLIKASIKAN" | "TOLAK" | "ERROR";
}

const API_KEY = 'AIzaSyAT8jRM3XWQ0hxZa9xcRFO6SSM_k-n9hX4';
if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
  safetySettings,
  generationConfig: {
    responseMimeType: "application/json",
  },
});

/**
 * Menggunakan Gemini API untuk memoderasi teks opini (hanya diterima/ditolak).
 * @param userText Teks opini dari pengguna.
 * @returns {Promise<ModerationResult>} Objek hasil klasifikasi dan rekomendasi.
 */
export async function moderateVoxnodePost(userText: string): Promise<ModerationResult> {
  // PERUBAHAN 2: Prompt diperbarui untuk menghilangkan 'TINJAU_MANUAL'
  // dan mengubah aturan untuk kategori 'TIDAK_RELEVAN'.
  const prompt = `
    Anda adalah seorang moderator konten AI yang tegas dan adil untuk platform opini publik "Voxnode".
    Tugas Anda adalah menganalisis teks opini dan memberikan rekomendasi akhir: PUBLIKASIKAN atau TOLAK.

    Teks untuk dianalisis: "${userText}"

    Langkah-langkah Analisis:
    1.  Klasifikasikan teks ke dalam SATU kategori paling sesuai: UMPAN_BALIK_POSITIF, KRITIK_KONSTRUKTIF, SARAN_KONSTRUKTIF, HINAAN, UJARAN_KEBENCIAN, KONTEN_DEWASA, SPAM, TIDAK_RELEVAN.
    2.  Berikan alasan singkat (maksimal 15 kata) untuk klasifikasi tersebut.
    3.  Berikan rekomendasi tindakan berdasarkan aturan tegas berikut:
        - "TOLAK": Jika klasifikasi adalah HINAAN, UJARAN_KEBENCIAN, KONTEN_DEWASA, SPAM, atau TIDAK_RELEVAN.
        - "PUBLIKASIKAN": Jika klasifikasi adalah UMPAN_BALIK_POSITIF, KRITIK_KONSTRUKTIF, atau SARAN_KONSTRUKTIF.

    Anda HARUS merespons HANYA dalam format JSON yang valid, sesuai dengan skema yang telah ditentukan.
    Struktur JSON harus:
    {
      "klasifikasi": "NAMA_KATEGORI",
      "alasan_singkat": "Penjelasan singkat.",
      "rekomendasi": "PUBLIKASIKAN" atau "TOLAK"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const moderationData: ModerationResult = JSON.parse(responseText);
    return moderationData;

  } catch (error) {
    console.error("Error calling Gemini API or parsing JSON:", error);
    return {
      klasifikasi: 'ERROR_API',
      alasan_singkat: 'Gagal memproses teks melalui AI.',
      rekomendasi: 'ERROR',
    };
  }
}
