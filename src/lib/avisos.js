// Avisos mostrados quando a IA não responde a tempo. Escritos para quem nunca viu o projeto:
// dizem o que aconteceu, por que, o que está na tela e o que fazer.
export const POR_QUE_IA =
  "A IA do LegaCITi usa o plano gratuito do Google (Gemini), que limita quantos pedidos podem ser atendidos por minuto e às vezes fica mais lento.";

export const AVISOS = {
  pergunte:
    "A IA não respondeu a tempo desta vez. " + POR_QUE_IA + " " +
    "Para não arriscar uma resposta inventada, o LegaCITi mostra abaixo os casos reais do legado mais ligados à sua pergunta. " +
    "Espere cerca de um minuto e pergunte de novo para receber a resposta escrita.",
  conexao: "Não foi possível falar com o LegaCITi agora. Confira a conexão com a internet e tente de novo.",
  briefing: (n) =>
    `A IA não respondeu a tempo desta vez. ${POR_QUE_IA} ` +
    `Para você não ficar sem briefing, ele foi montado direto do texto dos ${n} casos do legado mais ligados ao projeto, sem nada escrito pela IA. ` +
    "Espere cerca de um minuto e gere de novo para a versão escrita pela IA.",
  paraQuemAssume:
    `A IA não respondeu a tempo desta vez. ${POR_QUE_IA} ` +
    "Por isso, esta lista foi montada direto do texto dos casos de quem já ocupou o cargo, sem nada escrito pela IA.",
  pauta:
    `A IA não respondeu a tempo desta vez. ${POR_QUE_IA} ` +
    "Por isso, esta pauta foi montada direto dos números e casos do painel, sem nada escrito pela IA. Espere cerca de um minuto e toque em Refazer.",
  entrevista:
    `A IA não respondeu a tempo desta vez. ${POR_QUE_IA} ` +
    "Por isso, o caso foi montado com as suas próprias palavras, na ordem em que você contou. Revise e ajuste antes de registrar.",
};
