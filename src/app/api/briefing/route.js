import { casos } from "@/data";
import { buscarCasos, casosComoTexto } from "@/lib/ia/busca";
import { gerarJSON } from "@/lib/ia/gemini";
import { MENSAGENS, pedeParaSairDoPapel } from "@/lib/ia/regras";
import { selecionarParaProjeto, INSTRUCAO_BRIEFING, ESQUEMA_BRIEFING, conferirBriefing, briefingReserva } from "@/lib/ia/briefing";
import { limparExtra } from "@/lib/ia/extras";

export const maxDuration = 30;

// Briefing de projeto: a pessoa descreve o projeto que vai começar e recebe o que o legado ensina sobre ele.
export async function POST(request) {
  const { descricao = "", extras = [] } = await request.json().catch(() => ({}));
  const texto = String(descricao).slice(0, 800).trim();
  if (texto.length < 12) return Response.json({ tipo: "curta", resposta: "Conte um pouco mais: para quem é o projeto, o que vai ser construído e o que já se sabe dele." });
  if (pedeParaSairDoPapel(texto)) return Response.json({ tipo: "fora_do_papel", resposta: MENSAGENS.foraDoPapel });

  const meus = (Array.isArray(extras) ? extras : []).slice(0, 30).map(limparExtra).filter(Boolean);
  const legado = meus.length ? [...casos, ...meus] : casos;

  // Casos ligados ao projeto: por significado (a IA escolhe no catálogo) e por palavras.
  const porPalavras = buscarCasos(texto, legado, {});
  let escolhidos;
  try {
    const porSignificado = await selecionarParaProjeto(texto, legado);
    if (!porSignificado.length) return Response.json({ tipo: "sem_informacao", resposta: "Não encontrei no legado casos ligados a esse projeto. Descreva o cliente, o que vai ser construído e o tamanho do squad para eu procurar de novo." });
    escolhidos = [...new Map([...porSignificado, ...porPalavras.slice(0, 2)].map((c) => [c.id, c])).values()].slice(0, 10);
  } catch (erro) {
    console.error("briefing selecao:", erro?.message);
    escolhidos = porPalavras.slice(0, 8);
  }
  if (!escolhidos.length) return Response.json({ tipo: "sem_informacao", resposta: "Não encontrei no legado casos ligados a esse projeto." });

  const reserva = briefingReserva(escolhidos);
  const fontes = casosComoTexto(escolhidos);
  try {
    const saida = await gerarJSON({
      instrucao: INSTRUCAO_BRIEFING,
      conteudo: `Casos do legado do CITi ligados ao projeto:\n\n${fontes}\n\nProjeto que vai começar:\n${texto}`,
      esquema: ESQUEMA_BRIEFING,
      maxTokens: 1800,
    });
    return Response.json({ tipo: "briefing", briefing: conferirBriefing(saida, escolhidos, reserva, fontes + " " + texto), casos: escolhidos.map((c) => c.id), origem: "ia" });
  } catch (erro) {
    console.error("briefing:", erro?.message);
    return Response.json({ tipo: "briefing", briefing: reserva, casos: escolhidos.map((c) => c.id), origem: "dados" });
  }
}
