import { gerarJSON } from "@/lib/ia/gemini";
import { pedeParaSairDoPapel } from "@/lib/ia/regras";
import {
  TIPOS, ROTEIRO_RESERVA, MINIMO_RESPOSTAS, MAXIMO_RESPOSTAS, MENSAGEM_REDIRECIONAR,
  instrucaoEntrevista, ESQUEMA_ENTREVISTA, conferirCaso, casoReserva, historicoComoTexto,
} from "@/lib/ia/entrevista";

export const maxDuration = 30;

// Conversa de legado: devolve a próxima pergunta ou o caso montado.
// Camadas: pedido para sair do papel → IA → conferência → roteiro reserva se a IA falhar.
export async function POST(request) {
  const corpo = await request.json().catch(() => ({}));
  const tipo = TIPOS[corpo.tipo] ? corpo.tipo : "fim_gestao";
  const cargo = String(corpo.cargo ?? "membro do CITi").slice(0, 60);
  const historico = (Array.isArray(corpo.historico) ? corpo.historico : [])
    .slice(0, MAXIMO_RESPOSTAS)
    .map((h) => ({ pergunta: String(h?.pergunta ?? "").slice(0, 300), resposta: String(h?.resposta ?? "").slice(0, 1500) }));
  const n = historico.length;
  const ultima = historico[n - 1]?.resposta ?? "";

  if (n === 0) return Response.json({ acao: "perguntar", pergunta: TIPOS[tipo].abertura, origem: "roteiro" });

  // Resposta que tenta tirar a IA do papel: nem chega a ser enviada.
  if (pedeParaSairDoPapel(ultima) || ultima.trim().length < 3) {
    return Response.json({ acao: "redirecionar", pergunta: MENSAGEM_REDIRECIONAR, origem: "regra" });
  }

  const concluirAgora = n >= MAXIMO_RESPOSTAS;
  try {
    const saida = await gerarJSON({
      instrucao: instrucaoEntrevista({ tipo, cargo }),
      conteudo: `${historicoComoTexto(historico)}\n\n${concluirAgora ? "A conversa chegou ao limite: use a ação \"concluir\" agora." : "Decida a próxima ação."}`,
      esquema: ESQUEMA_ENTREVISTA,
    });

    if (saida.acao === "redirecionar") {
      return Response.json({ acao: "redirecionar", pergunta: limpo(saida.pergunta) || MENSAGEM_REDIRECIONAR, origem: "ia" });
    }
    if (saida.acao === "concluir" && n >= MINIMO_RESPOSTAS) {
      const caso = conferirCaso(saida.caso);
      if (caso) return Response.json({ acao: "concluir", caso, origem: "ia" });
      return Response.json({ acao: "concluir", caso: casoReserva(historico), origem: "reserva" });
    }
    if (concluirAgora) return Response.json({ acao: "concluir", caso: casoReserva(historico), origem: "reserva" });
    const pergunta = limpo(saida.pergunta);
    if (pergunta) return Response.json({ acao: "perguntar", pergunta, origem: "ia" });
    throw new Error("sem_pergunta");
  } catch (erro) {
    console.error("entrevista:", erro?.message);
    // Sem IA: segue o roteiro fixo e, no fim, monta o caso com as palavras da própria pessoa.
    if (n - 1 < ROTEIRO_RESERVA.length) return Response.json({ acao: "perguntar", pergunta: ROTEIRO_RESERVA[n - 1], origem: "reserva" });
    return Response.json({ acao: "concluir", caso: casoReserva(historico), origem: "reserva" });
  }
}

function limpo(t) {
  return String(t ?? "").replace(/\s+/g, " ").trim().slice(0, 240);
}
