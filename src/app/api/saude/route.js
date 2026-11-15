import { connection } from "next/server";
import { gerarJSON } from "@/lib/ia/gemini";

// Diagnóstico: diz se a chave está configurada (sem revelá-la) e se a IA responde, com o tempo gasto.
export const maxDuration = 30;

export async function GET() {
  await connection();
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
