import { connection } from "next/server";

// Diagnóstico: mostra se a chave está configurada (sem revelá-la) e como cada modelo do Gemini responde.
export const maxDuration = 60;

const MODELOS = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-flash-latest"];

async function testar(modelo, chave, comPensamentoDesligado) {
  const inicio = Date.now();
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), 12000);
  try {
    const generationConfig = { maxOutputTokens: 20 };
    if (comPensamentoDesligado) generationConfig.thinkingConfig = { thinkingBudget: 0 };
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": chave },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Diga ok." }] }], generationConfig }),
      signal: controle.signal,
      cache: "no-store",
    });
    const texto = await r.text();
    let resumo = texto.slice(0, 160);
    try { const j = JSON.parse(texto); resumo = j?.candidates?.[0]?.content?.parts?.[0]?.text ?? j?.error?.message?.slice(0, 160) ?? resumo; } catch {}
    return { modelo, status: r.status, ms: Date.now() - inicio, resumo };
  } catch (erro) {
    return { modelo, status: erro?.name === "AbortError" ? "tempo_esgotado" : String(erro?.message).slice(0, 80), ms: Date.now() - inicio };
  } finally {
    clearTimeout(relogio);
  }
}

export async function GET() {
  await connection();
  const chave = process.env.GEMINI_API_KEY;
  if (!chave) return Response.json({ chaveConfigurada: false });
  const resultados = await Promise.all([
    ...MODELOS.map((m) => testar(m, chave, false)),
    testar("gemini-2.5-flash", chave, true),
  ]);
  return Response.json({ chaveConfigurada: true, tamanhoDaChave: chave.length, regiao: process.env.VERCEL_REGION ?? null, resultados });
}
