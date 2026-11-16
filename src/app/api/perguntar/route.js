import { casos } from "@/data";
import { relevancia } from "@/data/cargos";
import { buscarCasos, casosComoTexto } from "@/lib/ia/busca";
import { selecionarCasos } from "@/lib/ia/selecao";
import { gerarJSON } from "@/lib/ia/gemini";
import { MENSAGENS, INSTRUCAO_SISTEMA, ESQUEMA_RESPOSTA, pedeParaSairDoPapel, numerosConferem } from "@/lib/ia/regras";

// A função pode rodar por até 30 s na Vercel; a IA tem 18 s e, depois disso, entra o modo de segurança.
export const maxDuration = 30;

// Pergunte ao LegaCITi: responde só com base nos casos registrados.
export async function POST(request) {
  const { pergunta = "", cargo = null, extras = [] } = await request.json().catch(() => ({}));
  // Casos que a própria pessoa registrou nesta demonstração (ficam no navegador dela).
  const meus = (Array.isArray(extras) ? extras : []).slice(0, 30).map(limparExtra).filter(Boolean);
  const legado = meus.length ? [...casos, ...meus] : casos;
  const texto = String(pergunta).slice(0, 500).trim();

  if (!texto) return Response.json({ tipo: "sem_informacao", resposta: MENSAGENS.semInformacao, casos: [] });

  // 1. Pedido para sair do papel: resposta padrão, sem chamar a IA.
  if (pedeParaSairDoPapel(texto)) {
    return Response.json({ tipo: "fora_do_papel", resposta: MENSAGENS.foraDoPapel, casos: [] });
  }

  // 2. Busca os casos do legado de dois jeitos: por palavras (local) e por significado (a IA escolhe no catálogo).
  //    Sem casos ligados à pergunta, não há o que responder.
  const porPalavras = buscarCasos(texto, legado, { relevanciaCargo: cargo ? (c) => relevancia(c, cargo) : null });
  let porSignificado = null, falhaSelecao = null;
  try {
    porSignificado = await selecionarCasos(texto, legado);
  } catch (erro) {
    console.error("selecao:", erro?.message);
    falhaSelecao = String(erro?.message ?? "erro").slice(0, 40);
  }
  // Com a seleção por significado, ela manda; as palavras completam. Sem ela, valem só as palavras.
  const encontrados = porSignificado
    ? [...new Map([...porSignificado, ...(porSignificado.length ? porPalavras.slice(0, 2) : [])].map((c) => [c.id, c])).values()].slice(0, 7)
    : porPalavras;
  if (encontrados.length === 0) {
    return Response.json({ tipo: "sem_informacao", etapa: falhaSelecao ? `busca (${falhaSelecao})` : "busca", resposta: MENSAGENS.semInformacao, casos: [] });
  }

  // 3. A IA escreve a resposta usando apenas esses casos.
  try {
    const saida = await gerarJSON({
      instrucao: INSTRUCAO_SISTEMA,
      conteudo: `Casos do legado do CITi escolhidos como ligados à pergunta:\n\n${casosComoTexto(encontrados)}\n\nPergunta do membro:\n${texto}`,
      esquema: ESQUEMA_RESPOSTA,
    });

    if (saida.tipo === "fora_do_papel") {
      return Response.json({ tipo: "fora_do_papel", resposta: MENSAGENS.foraDoPapel, casos: [] });
    }

    // 4. Conferência: só valem citações de casos que foram realmente enviados.
    const permitidos = new Set(encontrados.map((c) => c.id));
    const citados = (saida.casos ?? []).filter((id) => permitidos.has(id));
    // Conferência de números: a resposta não pode trazer números que não estão nos casos citados.
    if (saida.tipo === "resposta" && !numerosConferem(saida.resposta, casosComoTexto(encontrados.filter((c) => citados.includes(c.id))) + " " + texto)) {
      throw new Error("numero_sem_fonte");
    }
    if (saida.tipo !== "resposta" || citados.length === 0 || !saida.resposta?.trim()) {
      return Response.json({ tipo: "sem_informacao", etapa: `resposta (${saida.tipo}; ${encontrados.map((c) => c.id).join(",")})`, resposta: MENSAGENS.semInformacao, casos: [] });
    }
    return Response.json({ tipo: "resposta", resposta: saida.resposta.trim(), casos: citados });
  } catch (erro) {
    // 5. Modo de segurança: sem IA, mostra os casos mais próximos. O motivo (só um código) ajuda a diagnosticar.
    console.error("perguntar:", erro?.message);
    return Response.json({ tipo: "indisponivel", motivo: String(erro?.message ?? "desconhecido").slice(0, 40), resposta: MENSAGENS.indisponivel, casos: encontrados.slice(0, 3).map((c) => c.id) });
  }
}

const corta = (t, max = 600) => String(t ?? "").slice(0, max);
function limparExtra(c) {
  if (!c || !/^N\d{3,4}$/.test(String(c.id))) return null;
  return {
    id: c.id, titulo: corta(c.titulo, 90), gestao: corta(c.gestao, 8), cargoAutor: corta(c.cargoAutor, 60), area: corta(c.area, 40),
    situacao: corta(c.situacao), dilema: corta(c.dilema), decisao: corta(c.decisao), resultado: corta(c.resultado), licao: corta(c.licao, 300),
    padroes: (Array.isArray(c.padroes) ? c.padroes : []).filter((p) => /^P[1-6]$/.test(p)), origem: corta(c.origem, 20),
  };
}
