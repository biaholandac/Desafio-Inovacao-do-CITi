import { connection } from "next/server";
import { gerarJSON } from "@/lib/ia/gemini";
import { POST as perguntar } from "../perguntar/route";

// Diagnóstico: diz se a chave está configurada (sem revelá-la) e se a IA responde, com o tempo gasto.
export const maxDuration = 30;

export async function GET(request) {
  await connection();
  // ?pergunta=... roda a pergunta pelo mesmo caminho do site e mostra em que etapa ela parou.
  const teste = new URL(request.url).searchParams.get("pergunta");
  if (teste) {
    const r = await perguntar(new Request("http://x", { method: "POST", body: JSON.stringify({ pergunta: teste.slice(0, 300), cargo: "gerente-projeto" }) }));
    return Response.json(await r.json());
  }
  const inicio = Date.now();
  const chaveConfigurada = Boolean(process.env.GEMINI_API_KEY);
  try {
    await gerarJSON({
      instrucao: "Responda apenas com o JSON pedido.",
      conteudo: "Diga ok.",
      esquema: { type: "OBJECT", properties: { ok: { type: "STRING" } }, required: ["ok"] },
    });
    return Response.json({ chaveConfigurada, ia: "respondeu", ms: Date.now() - inicio });
  } catch (erro) {
    return Response.json({ chaveConfigurada, ia: "falhou", motivo: String(erro?.message ?? "desconhecido"), ms: Date.now() - inicio });
  }
}
