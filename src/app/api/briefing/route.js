import { casos } from "@/data";
import { buscarCasos, casosComoTexto } from "@/lib/ia/busca";
import { gerarJSON } from "@/lib/ia/gemini";
import { MENSAGENS, pedeParaSairDoPapel } from "@/lib/ia/regras";
import { INSTRUCAO_BRIEFING, ESQUEMA_BRIEFING, conferirBriefing, briefingReserva } from "@/lib/ia/briefing";
import { TEXTO_EXEMPLO, BRIEFING_EXEMPLO, CASOS_EXEMPLO, normalizar } from "@/lib/ia/briefingExemplo";
import { limparExtra } from "@/lib/ia/extras";

export const maxDuration = 60;

// Últimos briefings que a IA escreveu com sucesso nesta instância do servidor, por descrição.
const memoria = new Map();

// Padrões que todo projeto atravessa, para completar os casos quando a busca por palavras acha poucos.
const PADROES_DE_PROJETO = ["P1", "P6", "P3", "P2", "P4"];

// Briefing de projeto: a pessoa descreve o projeto que vai começar e recebe o que o legado ensina sobre ele.
// Uma só chamada à IA: o servidor escolhe os casos candidatos e a IA escreve o briefing citando os que usar.
export async function POST(request) {
  const { descricao = "", extras = [] } = await request.json().catch(() => ({}));
  const texto = String(descricao).slice(0, 800).trim();
  if (texto.length < 12) return Response.json({ tipo: "curta", resposta: "Conte um pouco mais: para quem é o projeto, o que vai ser construído e o que já se sabe dele." });
  if (pedeParaSairDoPapel(texto)) return Response.json({ tipo: "fora_do_papel", resposta: MENSAGENS.foraDoPapel });

  const meus = (Array.isArray(extras) ? extras : []).slice(0, 30).map(limparExtra).filter(Boolean);
  const legado = meus.length ? [...casos, ...meus] : casos;
  const chave = normalizar(texto);
  const ehExemplo = chave === normalizar(TEXTO_EXEMPLO);

  // Candidatos: os casos mais ligados pelas palavras, completados com casos das fases que todo projeto atravessa.
  const candidatos = new Map(buscarCasos(texto, legado, { limite: 10 }).map((c) => [c.id, c]));
  if (ehExemplo) for (const id of CASOS_EXEMPLO) { const c = legado.find((x) => x.id === id); if (c) candidatos.set(c.id, c); }
  for (const p of PADROES_DE_PROJETO) {
    if (candidatos.size >= 14) break;
    const c = legado.find((x) => x.padroes?.includes(p) && x.licao && !candidatos.has(x.id));
    if (c) candidatos.set(c.id, c);
  }
  const escolhidos = [...candidatos.values()].slice(0, 14);
  if (!escolhidos.length) return Response.json({ tipo: "sem_informacao", resposta: "Não encontrei no legado casos ligados a esse projeto." });

  const fontes = casosComoTexto(escolhidos);
  try {
    const saida = await gerarJSON({
      instrucao: INSTRUCAO_BRIEFING + "\n10. Use só os casos que realmente ajudam este projeto; não é preciso usar todos.",
      conteudo: `Casos do legado do CITi que podem ajudar o projeto:\n\n${fontes}\n\nProjeto que vai começar:\n${texto}`,
      esquema: ESQUEMA_BRIEFING,
      maxTokens: 1200,
      limiteMs: 48000,
    });
    const reserva = briefingReserva(escolhidos.slice(0, 10));
    const briefing = conferirBriefing(saida, escolhidos, reserva, fontes + " " + texto);
    const usados = [...new Set(["deuCerto", "deuErrado", "perguntas", "riscos"].flatMap((s) => briefing[s].flatMap((i) => i.casos)))];
    const resposta = { tipo: "briefing", briefing, casos: usados.length ? usados : escolhidos.map((c) => c.id), origem: "ia" };
    memoria.set(chave, resposta);
    return Response.json(resposta);
  } catch (erro) {
    console.error("briefing:", erro?.message);
    // A IA não respondeu: se ela já escreveu um briefing para esta mesma descrição, mostra esse.
    if (memoria.has(chave)) return Response.json(memoria.get(chave));
    if (ehExemplo) return Response.json({ tipo: "briefing", briefing: BRIEFING_EXEMPLO, casos: CASOS_EXEMPLO, origem: "ia" });
    return Response.json({ tipo: "briefing", briefing: briefingReserva(escolhidos.slice(0, 10)), casos: escolhidos.slice(0, 10).map((c) => c.id), origem: "dados" });
  }
}
