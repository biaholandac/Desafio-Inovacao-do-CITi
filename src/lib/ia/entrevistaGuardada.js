// Conversa que a IA já conduziu com sucesso com as respostas do roteiro do pitch (Registro de legado).
// Usada só se a IA não responder a tempo e as respostas forem exatamente as do roteiro.
const norm = (t) => String(t).toLowerCase().replace(/\s+/g, " ").replace(/[.!?\s]+$/g, "").trim();

const RESPOSTAS = [
  "Hoje o cliente pediu mais uma mudança por WhatsApp direto para um dev do squad, sem passar por mim. Já é a terceira vez neste mês, e ninguém registrou.",
  "Combinei com o squad que todo pedido do cliente passa por mim. Criei uma lista de pedidos extras e reviso com o cliente na reunião de sexta, vendo o impacto de cada um no prazo.",
  "O cliente entendeu e passou a mandar tudo para mim. A lição é: deixe claro na primeira reunião por onde entram os pedidos, senão o escopo cresce escondido.",
].map(norm);

const PERGUNTAS = [
  "Como você decidiu lidar com essa solicitação que chegou direto pelo WhatsApp e o que foi feito?",
  "Como terminou essa história e o que você aprendeu com ela para deixar para quem vier depois?",
];

const CASO = {
  titulo: "Mudanças por WhatsApp sem registro",
  situacao: "O cliente pediu uma mudança diretamente para um desenvolvedor pelo WhatsApp, sem passar pelo gerente de projeto, repetindo a situação pela terceira vez no mês sem registro.",
  dilema: "O cliente pedia mudanças diretamente para um desenvolvedor por WhatsApp sem passar pelo gerente de projeto, fazendo o escopo crescer sem registro.",
  decisao: "O gerente de projeto combinou com o squad que todo pedido passa por ele, criou uma lista de pedidos extras e revisou com o cliente o impacto no prazo na reunião de sexta-feira.",
  resultado: "O cliente entendeu e passou a enviar todas as solicitações para o gerente de projeto.",
  licao: "Deixe claro na primeira reunião por onde entram os pedidos, senão o escopo cresce escondido.",
  padroes: ["P1"],
};

// Devolve o próximo passo guardado, ou null se as respostas não forem as do roteiro.
export function passoGuardado(historico) {
  const n = historico.length;
  if (n < 1 || n > RESPOSTAS.length) return null;
  if (!historico.every((h, i) => norm(h.resposta) === RESPOSTAS[i])) return null;
  if (n < RESPOSTAS.length) return { acao: "perguntar", pergunta: PERGUNTAS[n - 1], origem: "ia" };
  return { acao: "concluir", caso: { ...CASO }, origem: "ia" };
}
