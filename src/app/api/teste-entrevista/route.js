import { connection } from "next/server";
import { POST as entrevista } from "../entrevista/route";
// Rota temporária: roda a entrevista do pitch com respostas fixas e mostra as perguntas da IA.
export const maxDuration = 60;
const RESPOSTAS = [
  "Hoje o cliente pediu mais uma mudança por WhatsApp direto para um dev do squad, sem passar por mim. Já é a terceira vez neste mês, e ninguém registrou.",
  "Combinei com o squad que todo pedido do cliente passa por mim. Criei uma lista de pedidos extras e reviso com o cliente na reunião de sexta, vendo o impacto de cada um no prazo.",
  "O cliente entendeu e passou a mandar tudo para mim. A lição é: deixe claro na primeira reunião por onde entram os pedidos, senão o escopo cresce escondido.",
  "Foi isso. O prazo foi mantido.",
];
export async function GET() {
  await connection();
  const historico = [];
  const passos = [];
  let pergunta = "O que aconteceu que você quer registrar para quem ocupar o seu cargo depois?";
  for (const resposta of RESPOSTAS) {
    historico.push({ pergunta, resposta });
    const r = await entrevista(new Request("http://x", { method: "POST", body: JSON.stringify({ tipo: "momento", cargo: "Gerente de projeto", historico }) }));
    const d = await r.json();
    passos.push(d);
    if (d.acao === "concluir") break;
    pergunta = d.pergunta;
  }
  return Response.json(passos);
}
