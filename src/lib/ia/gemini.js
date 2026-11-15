// Chamada ao Gemini pela API REST. A chave vem do cofre da Vercel (GEMINI_API_KEY).
const MODELOS = [process.env.GEMINI_MODELO, "gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"].filter(Boolean);

export async function gerarJSON({ instrucao, conteudo, esquema }) {
  const chave = process.env.GEMINI_API_KEY;
  if (!chave) throw new Error("sem_chave");
  let ultimoErro;
  for (const modelo of MODELOS) {
    const resposta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": chave },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instrucao }] },
        contents: [{ role: "user", parts: [{ text: conteudo }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 700, responseMimeType: "application/json", responseSchema: esquema },
      }),
    });
    if (resposta.status === 404) { ultimoErro = new Error("modelo_indisponivel"); continue; }
    if (!resposta.ok) throw new Error(resposta.status === 429 ? "limite" : `erro_${resposta.status}`);
    const dados = await resposta.json();
    const texto = dados?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
    return JSON.parse(texto);
  }
  throw ultimoErro ?? new Error("sem_modelo");
}
