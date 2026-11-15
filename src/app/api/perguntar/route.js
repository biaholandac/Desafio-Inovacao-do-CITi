import { casos } from "@/data";
import { relevancia } from "@/data/cargos";
import { buscarCasos, casosComoTexto } from "@/lib/ia/busca";
import { gerarJSON } from "@/lib/ia/gemini";
import { MENSAGENS, INSTRUCAO_SISTEMA, ESQUEMA_RESPOSTA, pedeParaSairDoPapel } from "@/lib/ia/regras";

// A função pode rodar por até 30 s na Vercel; a IA tem 18 s e, depois disso, entra o modo de segurança.
export const maxDuration = 30;

// Pergunte ao LegaCITi: responde só com base nos casos registrados.
export async function POST(request) {
  const { pergunta = "", cargo = null } = await request.json().catch(() => ({}));
  const texto = String(pergunta).slice(0, 500).trim();

  if (!texto) return Response.json({ tipo: "sem_informacao", resposta: MENSAGENS.semInformacao, casos: [] });

  // 1. Pedido para sair do papel: resposta padrão, sem chamar a IA.
  if (pedeParaSairDoPapel(texto)) {
    return Response.json({ tipo: "fora_do_papel", resposta: MENSAGENS.foraDoPapel, casos: [] });
  }

  // 2. Busca os casos do legado. Sem casos próximos, não há o que responder.
  const encontrados = buscarCasos(texto, casos, { relevanciaCargo: cargo ? (c) => relevancia(c, cargo) : null });
  if (encontrados.length === 0) {
    return Response.json({ tipo: "sem_informacao", resposta: MENSAGENS.semInformacao, casos: [] });
  }

  // 3. A IA escreve a resposta usando apenas esses casos.
  try {
    const saida = await gerarJSON({
      instrucao: INSTRUCAO_SISTEMA,
      conteudo: `Casos registrados no legado do CITi:\n\n${casosComoTexto(encontrados)}\n\nPergunta do membro:\n${texto}`,
      esquema: ESQUEMA_RESPOSTA,
    });

    if (saida.tipo === "fora_do_papel") {
      return Response.json({ tipo: "fora_do_papel", resposta: MENSAGENS.foraDoPapel, casos: [] });
    }

    // 4. Conferência: só valem citações de casos que foram realmente enviados.
    const permitidos = new Set(encontrados.map((c) => c.id));
    const citados = (saida.casos ?? []).filter((id) => permitidos.has(id));
    if (saida.tipo !== "resposta" || citados.length === 0 || !saida.resposta?.trim()) {
      return Response.json({ tipo: "sem_informacao", resposta: MENSAGENS.semInformacao, casos: [] });
    }
    return Response.json({ tipo: "resposta", resposta: saida.resposta.trim(), casos: citados });
  } catch (erro) {
    // 5. Modo de segurança: sem IA, mostra os casos mais próximos. O motivo (só um código) ajuda a diagnosticar.
    console.error("perguntar:", erro?.message);
    return Response.json({ tipo: "indisponivel", motivo: String(erro?.message ?? "desconhecido").slice(0, 40), resposta: MENSAGENS.indisponivel, casos: encontrados.slice(0, 3).map((c) => c.id) });
  }
}
