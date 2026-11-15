import { gerarJSON } from "@/lib/ia/gemini";
import { connection } from "next/server";

// Diagnóstico: mostra se a chave está configurada (sem revelá-la) e se o Gemini responde.
export const maxDuration = 30;

export async function GET() {
  await connection();
  const inicio = Date.now();
  const chaveConfigurada = Boolean(process.env.GEMINI_API_KEY);
  try {
    const saida = await gerarJSON({
      instrucao: "Responda apenas com o JSON pedido.",
      conteudo: "Diga ok.",
      esquema: { type: "OBJECT", properties: { ok: { type: "STRING" } }, required: ["ok"] },
    });
    return Response.json({ chaveConfigurada, gemini: "respondeu", saida, ms: Date.now() - inicio });
  } catch (erro) {
    return Response.json({ chaveConfigurada, gemini: "falhou", motivo: String(erro?.message ?? "desconhecido"), ms: Date.now() - inicio });
  }
}
