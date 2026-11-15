// Chamada ao Gemini pela API REST. A chave vem do cofre da Vercel (GEMINI_API_KEY).
// O Google aposentou a família 2.5 para chaves novas. O 3.5 Flash-Lite responde em menos de 1 s no plano gratuito.
const MODELOS = [...new Set([process.env.GEMINI_MODELO, "gemini-3.5-flash-lite"].filter(Boolean))];

// Cada tentativa tem um limite de tempo; a soma de todas também.
const LIMITE_TENTATIVA_MS = 12000;
const LIMITE_TOTAL_MS = 18000;

async function chamar(modelo, chave, corpo, limiteMs) {
  const controle = new AbortController();
  const relogio = setTimeout(() => controle.abort(), limiteMs);
  try {
    return await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": chave },
      body: JSON.stringify(corpo),
      signal: controle.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(relogio);
  }
}

export async function gerarJSON({ instrucao, conteudo, esquema }) {
  const chave = process.env.GEMINI_API_KEY;
  if (!chave) throw new Error("sem_chave");

  const corpoBase = {
    systemInstruction: { parts: [{ text: instrucao }] },
    contents: [{ role: "user", parts: [{ text: conteudo }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 700,
      responseMimeType: "application/json",
      responseSchema: esquema,
      // Pensamento no mínimo: a resposta sai rápida e o limite de tokens vai todo para o texto.
      thinkingConfig: { thinkingLevel: "minimal" },
    },
  };

  const inicio = Date.now();
  let ultimoErro = new Error("sem_modelo");
  for (const modelo of MODELOS) {
    const restante = LIMITE_TOTAL_MS - (Date.now() - inicio);
    if (restante < 1500) break;
    try {
      let resposta = await chamar(modelo, chave, corpoBase, Math.min(LIMITE_TENTATIVA_MS, restante));
      // Modelos que não aceitam desligar o pensamento: tenta de novo sem essa opção.
      if (resposta.status === 400) {
        const { thinkingConfig, ...semPensamento } = corpoBase.generationConfig;
        resposta = await chamar(modelo, chave, { ...corpoBase, generationConfig: semPensamento }, Math.min(LIMITE_TENTATIVA_MS, LIMITE_TOTAL_MS - (Date.now() - inicio)));
      }
      if (!resposta.ok) {
        const detalhe = (await resposta.text().catch(() => "")).slice(0, 300);
        console.error(`gemini ${modelo} ${resposta.status}: ${detalhe}`);
        ultimoErro = new Error(`${resposta.status === 429 ? "limite" : "erro_" + resposta.status}_${modelo}`);
        continue;
      }
      const dados = await resposta.json();
      const texto = dados?.candidates?.[0]?.content?.parts?.filter((p) => !p.thought).map((p) => p.text ?? "").join("") ?? "";
      if (!texto.trim()) { ultimoErro = new Error("resposta_vazia"); continue; }
      return JSON.parse(texto);
    } catch (erro) {
      ultimoErro = erro?.name === "AbortError" ? new Error("tempo_esgotado") : erro;
    }
  }
  throw ultimoErro;
}
