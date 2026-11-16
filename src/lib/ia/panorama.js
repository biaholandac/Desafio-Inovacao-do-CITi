// Panorama do legado: números calculados dos próprios dados, para perguntas sobre quantidade,
// padrões e gestões. Vai junto com os casos; os números que a IA usar precisam estar aqui.
import { gestoes, padroes } from "@/data";

export function gestoesCitadas(texto) {
  const codigos = new Set();
  for (const m of texto.matchAll(/\b(20\d\d)(?:[.,/ -]?([12]))?\b/g)) {
    const doAno = gestoes.filter((g) => g.codigo.startsWith(m[1]) && (!m[2] || g.codigo.endsWith("." + m[2])));
    doAno.forEach((g) => codigos.add(g.codigo));
    if (!doAno.length) codigos.add(m[2] ? `${m[1]}.${m[2]}` : m[1]);
  }
  return [...codigos];
}

export function panorama(casos, citadas = []) {
  const linhas = ["Panorama do legado (calculado dos registros):"];
  linhas.push(`Total: ${casos.length} casos em ${gestoes.length} gestões (${gestoes[0].codigo} a ${gestoes.at(-1).codigo}).`);
  const porPadrao = Object.entries(padroes).map(([p, nome]) => [p, nome, casos.filter((c) => c.padroes.includes(p)).length])
    .sort((a, b) => b[2] - a[2]);
  linhas.push("Casos por padrão: " + porPadrao.map(([p, nome, n]) => `${p} ${nome}: ${n}`).join("; ") + ".");
  linhas.push("Casos por gestão: " + gestoes.map((g) => `${g.codigo}: ${casos.filter((c) => c.gestao === g.codigo).length}`).join("; ") + ".");
  for (const codigo of citadas) {
    const g = gestoes.find((x) => x.codigo === codigo);
    if (g) linhas.push(`Retrato da gestão ${g.codigo}: ${g.descricao}`);
  }
  return linhas.join("\n");
}
