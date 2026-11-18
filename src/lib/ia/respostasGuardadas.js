// Respostas que a IA já escreveu com sucesso para as perguntas usadas na demonstração do pitch.
// Usadas só se a IA não responder a tempo para essa mesma pergunta; o texto é o que ela escreveu, com os mesmos casos.
export const normalizarPergunta = (t) => String(t).toLowerCase().replace(/[?!.\s]+$/g, "").replace(/\s+/g, " ").trim();

export const RESPOSTAS_GUARDADAS = {
  [normalizarPergunta("o que o CITi aprendeu sobre gerenciar um squad desunido")]: {
    tipo: "resposta",
    resposta:
      "Para lidar com um time desunido ou com problemas de alinhamento, mantenha encontros periódicos entre as áreas mesmo com a agenda cheia e utilize rituais como retrospectivas focadas em situações, conduzidas preferencialmente por alguém de fora do squad para evitar apontar culpados. Essas lições vêm de situações em que a falta de integração e a sobrecarga exigiram criar ritos curtos de conexão e reformular reuniões para que o time falasse com mais abertura sobre os problemas.",
    casos: ["C003", "C009", "C052", "C110"],
  },
};
