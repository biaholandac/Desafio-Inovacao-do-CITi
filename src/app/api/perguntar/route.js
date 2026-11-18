import { casos } from "@/data";
import { relevancia } from "@/data/cargos";
import { buscarCasos, casosComoTexto } from "@/lib/ia/busca";
import { selecionarCasos } from "@/lib/ia/selecao";
import { RESPOSTAS_GUARDADAS, normalizarPergunta } from "@/lib/ia/respostasGuardadas";
import { gerarJSON } from "@/lib/ia/gemini";
import { MENSAGENS, INSTRUCAO_SISTEMA, ESQUEMA_RESPOSTA, pedeParaSairDoPapel, numerosConferem, pedeNomes, pedidoVago, perguntaSobre, perguntaDeNumeros } from "@/lib/ia/regras";
import { panorama, gestoesCitadas } from "@/lib/ia/panorama";
import { gestoes } from "@/data";
import { limparExtra } from "@/lib/ia/extras";

// A função pode rodar por até 30 s na Vercel; a IA tem 18 s e, depois disso, entra o modo de segurança.
export const maxDuration = 60;

// Últimas respostas que a IA escreveu com sucesso nesta instância do servidor, por pergunta.
const memoria = new Map();

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

  // Pedidos de nomes: regra de privacidade. Pedidos vagos: explica o que dá para perguntar.
  if (pedeNomes(texto)) return Response.json({ tipo: "sem_informacao", etapa: "nomes", resposta: MENSAGENS.semNomes, casos: [] });
  if (perguntaSobre(texto)) return Response.json({ tipo: "sem_informacao", etapa: "sobre", resposta: MENSAGENS.sobre, casos: [] });
  if (pedidoVago(texto)) return Response.json({ tipo: "sem_informacao", etapa: "ajuda", resposta: MENSAGENS.ajuda, casos: [] });

  // Um caso pedido pelo código (como C057) é mostrado direto, sem IA.
  const codigos = [...texto.toUpperCase().matchAll(/\b([CN]\d{3})\b/g)].map((m) => m[1]);
  if (codigos.length) {
    const achados = codigos.map((id) => legado.find((c) => c.id === id)).filter(Boolean);
    if (achados.length) return Response.json({ tipo: "resposta", resposta: achados.map((c) => `${c.id} · ${c.titulo} (${c.gestao}): ${c.licao ?? c.situacao}`).join("\n"), casos: achados.map((c) => c.id) });
    return Response.json({ tipo: "sem_informacao", etapa: "codigo", resposta: MENSAGENS.semInformacao, casos: [] });
  }

  // Gestões citadas que não existem no legado (como 2023.2): sem registros, sem IA.
  const citadas = gestoesCitadas(texto);
  const existentes = citadas.filter((c) => gestoes.some((g) => g.codigo === c));
  if (citadas.length && !existentes.length) {
    return Response.json({ tipo: "sem_informacao", etapa: "gestao", resposta: MENSAGENS.semInformacao, casos: [] });
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
  let encontrados = porSignificado
    ? [...new Map([...porSignificado, ...(porSignificado.length ? porPalavras.slice(0, 2) : [])].map((c) => [c.id, c])).values()].slice(0, 7)
    : porPalavras;
  // Pergunta sobre uma ou duas gestões: garante que os casos delas estejam entre as fontes.
  if (existentes.length && existentes.length <= 2) {
    const daGestao = legado.filter((c) => existentes.includes(c.gestao) && c.licao && !encontrados.includes(c));
    const faltam = Math.max(0, 4 * existentes.length - encontrados.filter((c) => existentes.includes(c.gestao)).length);
    encontrados = [...encontrados, ...daGestao.slice(0, faltam)].slice(0, 10);
  }
  // Pergunta sobre os números do legado: os padrões mais comuns entram com um caso de exemplo cada.
  if (perguntaDeNumeros(texto) && encontrados.length < 3) {
    const contagem = {};
    for (const c of legado) for (const p of c.padroes) contagem[p] = (contagem[p] || 0) + 1;
    const exemplos = Object.entries(contagem).sort((a, b) => b[1] - a[1]).slice(0, 4)
      .map(([p]) => legado.find((c) => c.padroes.includes(p) && c.licao && !encontrados.includes(c))).filter(Boolean);
    encontrados = [...encontrados, ...exemplos];
  }
  if (encontrados.length === 0) {
    return Response.json({ tipo: "sem_informacao", etapa: falhaSelecao ? `busca (${falhaSelecao})` : "busca", resposta: MENSAGENS.semInformacao, casos: [] });
  }

  // 3. A IA escreve a resposta usando apenas esses casos (e o panorama com os números do legado).
  const visao = panorama(legado, existentes);
  try {
    const saida = await gerarJSON({
      instrucao: INSTRUCAO_SISTEMA,
      conteudo: `${visao}\n\nCasos do legado do CITi escolhidos como ligados à pergunta:\n\n${casosComoTexto(encontrados)}\n\nPergunta do membro:\n${texto}`,
      esquema: ESQUEMA_RESPOSTA,
      limiteMs: 40000,
    });

    if (saida.tipo === "fora_do_papel") {
      return Response.json({ tipo: "fora_do_papel", resposta: MENSAGENS.foraDoPapel, casos: [] });
    }

    // 4. Conferência: só valem citações de casos que foram realmente enviados.
    const permitidos = new Set(encontrados.map((c) => c.id));
    const citados = (saida.casos ?? []).filter((id) => permitidos.has(id));
    // Conferência de números: a resposta não pode trazer números que não estão nos casos citados.
    if (saida.tipo === "resposta" && !numerosConferem(saida.resposta, casosComoTexto(encontrados.filter((c) => citados.includes(c.id))) + " " + texto + " " + visao)) {
      throw new Error("numero_sem_fonte");
    }
    if (saida.tipo !== "resposta" || citados.length === 0 || !saida.resposta?.trim()) {
      return Response.json({ tipo: "sem_informacao", etapa: `resposta (${saida.tipo}; ${encontrados.map((c) => c.id).join(",")})`, resposta: MENSAGENS.semInformacao, casos: [] });
    }
    const resposta = { tipo: "resposta", resposta: saida.resposta.trim(), casos: citados };
    if (!meus.length) memoria.set(normalizarPergunta(texto), resposta);
    return Response.json(resposta);
  } catch (erro) {
    // 5. Modo de segurança: sem IA, mostra os casos mais próximos. O motivo (só um código) ajuda a diagnosticar.
    console.error("perguntar:", erro?.message);
    // A IA não respondeu: se ela já escreveu uma resposta para esta mesma pergunta, mostra essa.
    const chave = normalizarPergunta(texto);
    if (!meus.length && (memoria.has(chave) || RESPOSTAS_GUARDADAS[chave])) return Response.json(memoria.get(chave) ?? RESPOSTAS_GUARDADAS[chave]);
    return Response.json({ tipo: "indisponivel", motivo: String(erro?.message ?? "desconhecido").slice(0, 40), resposta: MENSAGENS.indisponivel, casos: encontrados.slice(0, 3).map((c) => c.id) });
  }
}

