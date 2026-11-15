// Busca os casos do legado mais próximos de uma pergunta, sem usar IA.
import { padroes } from "@/data";

const PALAVRAS_VAZIAS = new Set(("a o as os um uma uns umas de da do das dos e em no na nos nas para por com sem que " +
  "como qual quais quando onde porque por que se ao aos à às é ser foi sao são tem ter mais menos muito muita " +
  "eu voce você vc nos nós meu minha seu sua isso esse essa este esta já ja sobre fazer faço faz o que lidar " +
  "citi legaciti caso casos alguém alguem algum alguma devo posso pode melhor pior bom boa ruim jeito forma " +
  "coisa coisas vez vezes dia dias hoje agora sempre nunca tudo nada ainda bem mal tipo quem qual quais").split(" "));

function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ");
}

function termos(texto) {
  return normalizar(texto).split(/\s+/).filter((t) => t.length > 2 && !PALAVRAS_VAZIAS.has(t))
    .map((t) => t.replace(/(oes|aes|ais|eis|s)$/, ""));
}

export function buscarCasos(pergunta, casos, { limite = 6, relevanciaCargo = null } = {}) {
  const alvo = new Set(termos(pergunta));
  if (alvo.size === 0) return [];
  return casos
    .map((c) => {
      const titulo = new Set(termos(c.titulo));
      const corpo = termos([c.situacao, c.dilema, c.decisao, c.resultado, c.licao, ...c.padroes.map((p) => padroes[p])].join(" "));
      let pontos = 0, distintos = 0;
      for (const t of alvo) {
        const n = corpo.filter((x) => x === t).length + (titulo.has(t) ? 3 : 0);
        if (n > 0) distintos++;
        pontos += n;
      }
      if (pontos > 0 && relevanciaCargo) pontos += relevanciaCargo(c) ?? 0;
      return { caso: c, pontos, distintos };
    })
    // Exige pelo menos dois termos da pergunta no caso, ou um termo muito presente.
    .filter((r) => r.distintos >= 2 || r.pontos >= 4)
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, limite)
    .map((r) => r.caso);
}

// Texto que vai para a IA com os casos encontrados.
export function casosComoTexto(lista) {
  return lista.map((c) => [
    `[${c.id}] ${c.titulo} (gestão ${c.gestao}; contado por: ${c.cargoAutor})`,
    `Situação: ${c.situacao}`,
    `Dilema: ${c.dilema}`,
    `Decisão: ${c.decisao}`,
    `Resultado: ${c.resultado}`,
    c.licao ? `Lição: ${c.licao}` : null,
  ].filter(Boolean).join("\n")).join("\n\n");
}
