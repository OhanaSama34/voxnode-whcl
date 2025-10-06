import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";
import TrieMap "mo:base/TrieMap";
import Bool "mo:base/Bool";
import Int "mo:base/Int";
import Text "mo:base/Text";

// Platform Suara Rakyat Anonim
actor {

  // Tipe alias
  type Int = Int.Int;
  type Bool = Bool.Bool;

  // Konstanta sistem poin
  let POINTS_ASK_QUESTION = 7;
  let POINTS_ANSWER = 5;
  let POINTS_UPVOTE_RESPONDER = 2;
  let POINTS_UPVOTE_QUESTIONER = 1;

  // Batasan input
  let MAX_QUESTION_LENGTH: Nat = 33;
  let MAX_ANSWER_LENGTH: Nat = 33;

  // Penyimpanan pertanyaan dan jawaban (masih dalam bentuk array flat)
  var questions: [var Text] = [var];

  // Penyimpanan poin pengguna
  var reputation: TrieMap.TrieMap<Principal, Int> = TrieMap.TrieMap(Principal.equal, Principal.hash);

  // Random boolean state (pseudo-random coin flip)
  var randomToggle: Bool = true;
  func flipCoin(): Bool {
    let current = randomToggle;
    randomToggle := not randomToggle;
    current;
  };

  // Fungsi utilitas: Update poin pengguna secara pseudo-random
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

  // Fungsi: Ajukan pertanyaan anonim
  public shared (msg) func askQuestion(content: Text): async Bool {
    assert Text.size(content) <= MAX_QUESTION_LENGTH;

    let userId = Principal.toText(msg.caller);
    let fullEntry = content # "/" # userId;

    // Tambahkan pertanyaan ke array
    let nextQuestions = Array.init<Text>(questions.size() + 1, "");
    for (i in questions.keys()) {
      nextQuestions[i] := questions[i];
    };
    nextQuestions[questions.size()] := fullEntry;
    questions := nextQuestions;

    // Tambah poin penanya
    adjustReputation(msg.caller, POINTS_ASK_QUESTION);
  };

  // Fungsi: Jawab pertanyaan berdasarkan indeks
  public shared (msg) func answerQuestion(index: Nat, response: Text): async Bool {
    assert Text.size(response) <= MAX_ANSWER_LENGTH;
    assert index < questions.size();

    let userId = Principal.toText(msg.caller);
    let entry = questions[index] # "/" # response # "/" # userId;
    questions[index] := entry;

    adjustReputation(msg.caller, POINTS_ANSWER);
  };

  // Fungsi: Berikan upvote ke penjawab dan penanya berdasarkan Principal
  public shared (msg) func upvote(responderId: Text, questionerId: Text): async Bool {
    let responder = Principal.fromText(responderId);
    let questioner = Principal.fromText(questionerId);

    // Dilarang self-vote
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

    // Pemberi vote juga mendapatkan poin
    adjustReputation(msg.caller, POINTS_UPVOTE_QUESTIONER + POINTS_UPVOTE_QUESTIONER);
  };

  // Query: Ambil reputasi pengguna
  public query func getReputation(user: Principal): async Int {
    switch (reputation.get(user)) {
      case (?val) val;
      case null 0;
    };
  };

  // Query: Tampilkan semua pertanyaan (sementara gabungan pertanyaan, jawaban, dan user)
  public query func getAllQuestions(): async [Text] {
    Array.tabulate<Text>(questions.size(), func(i: Nat): Text {
      questions[i];
    });
  };
};
