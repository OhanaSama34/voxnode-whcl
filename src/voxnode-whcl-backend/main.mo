import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import TrieMap "mo:base/TrieMap";
import Bool "mo:base/Bool";
import Int "mo:base/Int";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Result "mo:base/Result";
import LLM "mo:llm";

actor {

  // ====== Konstanta & tipe ======
  type Int = Int.Int;
  type Bool = Bool.Bool;

  let POINTS_ASK_QUESTION = 7;
  let POINTS_ANSWER = 5;
  let POINTS_UPVOTE_RESPONDER = 2;
  let POINTS_UPVOTE_QUESTIONER = 1;

  let MAX_QUESTION_LENGTH: Nat = 33;
  let MAX_ANSWER_LENGTH: Nat = 33;

  // Types for IC HTTP outcalls
  type HttpMethod = {
    #get;
    #post;
    #head;
  };

  type HttpHeader = {
    name: Text;
    value: Text;
  };

  type HttpRequestArgs = {
    url: Text;
    max_response_bytes: ?Nat64;
    headers: [HttpHeader];
    body: ?[Nat8];
    method: HttpMethod;
    transform: ?{
      function: shared query ({response: HttpResponse}) -> async HttpResponse;
      context: Blob;
    };
  };

  type HttpResponse = {
    status: Nat;
    headers: [HttpHeader];
    body: [Nat8];
  };

  type ModerationResult = {
    klasifikasi: Text;
    alasan_singkat: Text;
    rekomendasi: Text;
  };

  // ====== Penyimpanan ======
  var questions: [var Text] = [var];
  var reputation: TrieMap.TrieMap<Principal, Int> = TrieMap.TrieMap(Principal.equal, Principal.hash);

  // ====== Random boolean ======
  var randomToggle: Bool = true;
  func flipCoin(): Bool {
    let current = randomToggle;
    randomToggle := not randomToggle;
    current;
  };

  func adjustReputation(p: Principal, amount: Int): Bool {
    let current = switch (reputation.get(p)) {
      case (?value) value;
      case null 0;
    };
    let isLucky = flipCoin();
    let newRep = if (isLucky) current + amount else current - amount;
    reputation.put(p, newRep);
    isLucky;
  };

  // ====== CRUD pertanyaan ======
  public shared (msg) func askQuestion(content: Text): async Bool {
    assert Text.size(content) <= MAX_QUESTION_LENGTH;
    let userId = Principal.toText(msg.caller);
    let fullEntry = content # "/" # userId;

    let nextQuestions = Array.init<Text>(questions.size() + 1, "");
    for (i in questions.keys()) {
      nextQuestions[i] := questions[i];
    };
    nextQuestions[questions.size()] := fullEntry;
    questions := nextQuestions;

    adjustReputation(msg.caller, POINTS_ASK_QUESTION);
  };

  public shared (msg) func answerQuestion(index: Nat, response: Text): async Bool {
    assert Text.size(response) <= MAX_ANSWER_LENGTH;
    assert index < questions.size();
    let userId = Principal.toText(msg.caller);
    let entry = questions[index] # "/" # response # "/" # userId;
    questions[index] := entry;
    adjustReputation(msg.caller, POINTS_ANSWER);
  };

  public shared (msg) func upvote(responderId: Text, questionerId: Text): async Bool {
    let responder = Principal.fromText(responderId);
    let questioner = Principal.fromText(questionerId);
    assert msg.caller != responder;
    assert msg.caller != questioner;

    let updateRep = func (target: Principal, amount: Int) {
      let current = switch (reputation.get(target)) {
        case (?v) v;
        case null 0;
      };
      reputation.put(target, current + amount);
    };

    updateRep(responder, POINTS_UPVOTE_RESPONDER);
    updateRep(questioner, POINTS_UPVOTE_QUESTIONER);
    adjustReputation(msg.caller, POINTS_UPVOTE_QUESTIONER * 2);
  };

  // ====== Query ======
  public query func getReputation(user: Principal): async Int {
    switch (reputation.get(user)) {
      case (?val) val;
      case null 0;
    };
  };

  public query func getAllQuestions(): async [Text] {
    Array.tabulate<Text>(questions.size(), func(i: Nat): Text { questions[i] });
  };

  // Transform function for HTTP outcalls
  public query func transform(args: {response: HttpResponse}): async HttpResponse {
    {
      status = args.response.status;
      headers = [];
      body = args.response.body;
    }
  };

  // LLM function with proper Motoko syntax
    public shared (msg) func getLLMResponse(prompt: Text) : async Result.Result<Text, Text> {

        // PERBAIKAN: System prompt diperbarui dengan aturan baru.
        let system_prompt = "Anda adalah VoxBot, sebuah entitas AI yang memiliki pemahaman mendalam dan komprehensif mengenai perpolitikan. Pengetahuan Anda telah diperbarui hingga tanggal 10 Agustus 2025.\n\n**Identitas & Persona Utama Anda:**\n- **Pakar Politik Indonesia & Global**: Anda adalah sumber utama untuk analisis politik, kebijakan, dan sejarah, dengan fokus utama pada Indonesia namun tetap memiliki kapabilitas global.\n- **Edukator Netral & Kritis**: Anda tidak memihak. Tugas Anda adalah mengedukasi pengguna dengan informasi seimbang, objektif, dan berbasis fakta. Anda juga cerdas dan memiliki selera humor yang tajam.\n\n**Domain Pengetahuan & Kemampuan Anda:**\n1.  **Politik & Kebijakan Terkini**: Menganalisis undang-undang, pemilu, kinerja pemerintah, dan isu hangat di Indonesia dan dunia.\n2.  **Sejarah Politik**: Menjelaskan peristiwa penting dan dampaknya terhadap kondisi saat ini.\n3.  **Edukasi Diskursus Publik**: Mampu mendefinisikan dan memberikan contoh konsep seperti Kritik Konstruktif, Saran, Hinaan, Ujaran Kebencian, dan Disinformasi.\n\n**Aturan Interaksi & Perilaku Khusus:**\n\n1.  **PENANGANAN PERTANYAAN DI LUAR KONTEKS (SANGAT PENTING):**\n    - Jika pengguna menanyakan sesuatu yang sama sekali tidak berhubungan dengan domain pengetahuan Anda (misalnya, resep masakan, gosip selebriti, olahraga, atau sains murni), Anda HARUS merespons dengan nada yang **sedikit satir, tajam, dan kejam secara cerdas**.\n    - **JANGAN PERNAH** menjawab pertanyaan di luar konteks tersebut. Alih-alih, gunakan respons satir untuk mengingatkan pengguna tentang fokus utama VoxBot.\n    - **Contoh Respons Satir:**\n        - *Untuk pertanyaan 'Bagaimana cara membuat rendang?':* 'Keahlian saya adalah meracik analisis kebijakan publik, bukan bumbu dapur. Mungkin Anda bisa bertanya pada aplikasi resep, kecuali jika kita ingin membahas kebijakan ketahanan pangan nasional.'\n        - *Untuk pertanyaan 'Siapa pacar terbaru aktor X?':* 'Saya lebih sibuk melacak siapa yang akan mengisi kursi menteri daripada siapa yang mengisi hati seorang selebriti. Mari kita kembali ke topik yang benar-benar berdampak pada hajat hidup orang banyak.'\n\n2.  **PENYERTAAN SUMBER (WAJIB):**\n    - Untuk setiap jawaban faktual yang Anda berikan, Anda **WAJIB** menambahkan bagian 'Dasar Analisis' di akhir respons Anda.\n    - Bagian ini bertujuan untuk menunjukkan kredibilitas dengan menyebutkan **jenis sumber** yang menjadi dasar analisis Anda (meskipun Anda tidak bisa menjelajah internet secara real-time).\n    - **Contoh 'Dasar Analisis':**\n        - *Dasar Analisis: Jawaban ini disintesis dari data historis pemilu yang dirilis oleh KPU, laporan kebijakan dari lembaga think-tank seperti CSIS, dan liputan dari media nasional terkemuka.*\n        - *Dasar Analisis: Definisi ini merujuk pada Kitab Undang-Undang Hukum Pidana (KUHP) Indonesia dan studi komparatif dari laporan Human Rights Watch.*\n\n3.  **ATURAN LAINNYA:**\n    - **Prioritaskan Indonesia**: Selalu kaitkan isu global dengan konteks Indonesia jika memungkinkan.\n    - **Jaga Netralitas**: Hindari opini pribadi. Sajikan semua sisi argumen.\n    - **Jawaban Terstruktur**: Gunakan poin-poin agar jawaban mudah dicerna.";

        try {
            // Membuat chat builder dengan model yang Anda pilih
            let chatBuilder = LLM.chat(#Qwen3_32B);

            // Menambahkan pesan sistem yang sudah dilatih dan pesan dari pengguna
            let response = await chatBuilder.withMessages([
                #system_({ content = system_prompt }),
                #user({ content = prompt })
            ]).send();

            // Mengambil respons dari asisten
            switch (response.message.content) {
                case (?text) {
                    #ok(text)
                };
                case null {
                    #err("Tidak ada respons yang diterima dari LLM.")
                };
            };
        } catch (error) {
            // Menangani error jika panggilan ke LLM gagal
            #err("Gagal mendapatkan respons dari LLM.")
        };
    };

        public shared (msg) func moderateVoxnodePost(userText: Text) : async Result.Result<Text, Text> {

        // Prompt sistem ini mendefinisikan peran, aturan, dan format output untuk LLM.
        // Ini adalah "pelatihan" inti untuk tugas moderasi.
        let system_prompt = "Anda adalah seorang moderator konten AI yang tegas, adil, dan sangat akurat untuk platform opini publik \"Voxnode\". Tugas Anda adalah menganalisis teks opini yang dikirim oleh pengguna dan memberikan rekomendasi akhir: PUBLIKASIKAN atau TOLAK.\n\nLakukan analisis dengan langkah-langkah berikut:\n1.  **Klasifikasikan teks** ke dalam SATU kategori paling sesuai dari daftar ini: UMPAN_BALIK_POSITIF, KRITIK_KONSTRUKTIF, SARAN_KONSTRUKTIF, HINAAN, UJARAN_KEBENCIAN, KONTEN_DEWASA, SPAM, TIDAK_RELEVAN.\n2.  **Berikan alasan singkat** (maksimal 15 kata) untuk klasifikasi tersebut.\n3.  **Berikan rekomendasi tindakan** berdasarkan aturan tegas berikut:\n    - \"TOLAK\": Jika klasifikasi adalah HINAAN, UJARAN_KEBENCIAN, KONTEN_DEWASA, SPAM, atau TIDAK_RELEVAN.\n    - \"PUBLIKASIKAN\": Jika klasifikasi adalah UMPAN_BALIK_POSITIF, KRITIK_KONSTRUKTIF, atau SARAN_KONSTRUKTIF.\n\n**ATURAN OUTPUT (SANGAT PENTING):**\nAnda HARUS merespons HANYA dalam format JSON yang valid tanpa ada teks, markdown, atau penjelasan lain di luar objek JSON. Strukturnya harus persis seperti ini:\n{\n  \"klasifikasi\": \"NAMA_KATEGORI_YANG_DIPILIH\",\n  \"alasan_singkat\": \"Penjelasan singkat Anda di sini.\",\n  \"rekomendasi\": \"PUBLIKASIKAN\" atau \"TOLAK\"\n}";

        try {
            // Membuat chat builder dengan model yang Anda pilih (misalnya #Qwen3_32B)
            // Model yang lebih kecil biasanya lebih cepat dan hemat biaya untuk tugas klasifikasi.
            let chatBuilder = LLM.chat(#Qwen3_32B);

            // Mengirimkan instruksi sistem dan teks pengguna ke LLM
            let response = await chatBuilder.withMessages([
                #system_({ content = system_prompt }),
                #user({ content = userText }) // Teks yang akan dianalisis
            ]).send();

            // Mengambil respons dari asisten
            switch (response.message.content) {
                case (?text) {
                    // Jika sukses, kembalikan string JSON yang diterima
                    #ok(text)
                };
                case null {
                    #err("Tidak ada respons yang diterima dari LLM.")
                };
            };
        } catch (error) {
            // Menangani error jika panggilan ke LLM gagal
            #err("Gagal mendapatkan respons dari LLM.")
        };
    };
}
