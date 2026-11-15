// Painel da diretoria: a saúde do legado da gestão, calculada só a partir dos dados registrados.
import { padroes } from "@/data";
import { buscarCasos } from "@/lib/ia/busca";

const RISCO = ["P1", "P2", "P3", "P4", "P5"];

// Conversas por área: o que a gestão já registrou mais o que foi feito nesta demonstração.
export function conversasPorArea(gestao, meusCasos = [], simuladas = 0) {
  const base = gestao?.conversas?.porArea ?? {};
  const areas = Object.entries(base).map(([area, [feitas, esperadas]]) => ({
    area, esperadas, feitas: Math.min(esperadas, feitas + meusCasos.filter((c) => c.setor === area && c.gestao === gestao.codigo).length),
  }));
  // As conversas simuladas vão preenchendo as áreas com mais pendências.
  let resto = simuladas;
  while (resto > 0) {
    const alvo = [...areas].filter((a) => a.feitas < a.esperadas).sort((a, b) => (b.esperadas - b.feitas) - (a.esperadas - a.feitas))[0];
    if (!alvo) break;
    alvo.feitas++;
    resto--;
  }
  return areas.sort((a, b) => a.feitas / a.esperadas - b.feitas / b.esperadas);
}

// Padrões desta gestão comparados com a média das gestões completas anteriores.
export function padroesEmAlta(casos, gestoes, codigoAtual) {
  const anteriores = gestoes.filter((g) => g.status === "completa").map((g) => g.codigo);
  return Object.keys(padroes).map((p) => {
    const atual = casos.filter((c) => c.gestao === codigoAtual && c.padroes.includes(p));
    const media = anteriores.reduce((s, g) => s + casos.filter((c) => c.gestao === g && c.padroes.includes(p)).length, 0) / Math.max(1, anteriores.length);
    return { padrao: p, nome: padroes[p], atual: atual.length, media, razao: media ? atual.length / media : atual.length ? Infinity : 1, casos: atual.map((c) => c.id), risco: RISCO.includes(p) };
  }).sort((a, b) => b.razao - a.razao || b.atual - a.atual);
}

// Legado que apoia: para cada situação em andamento, os casos anteriores cujo aprendizado ajuda.
export function legadoQueApoia(casos, codigoEmFormacao) {
  const andamento = casos.filter((c) => c.gestao === codigoEmFormacao);
  const anteriores = casos.filter((c) => c.gestao !== codigoEmFormacao && c.licao);
  const usados = new Set();
  return andamento.map((c) => {
    const texto = [c.titulo, c.situacao, c.dilema].filter(Boolean).join(" ");
    return { caso: c, parecidos: buscarCasos(texto, anteriores, { limite: 5 }) };
  }).filter((x) => x.parecidos.length).sort((a, b) => b.parecidos.length - a.parecidos.length).map((x) => {
    // Cada situação mostra um aprendizado diferente.
    const fonte = x.parecidos.find((p) => !usados.has(p.id));
    if (!fonte) return null;
    usados.add(fonte.id);
    return { caso: x.caso, aprendizado: fonte.licao, parecidos: [fonte, ...x.parecidos.filter((p) => p !== fonte)].slice(0, 3) };
  }).filter(Boolean).slice(0, 4);
}

export function montarPainel({ casos, gestoes, meusCasos = [], simuladas = 0 }) {
  const atual = gestoes.find((g) => g.status === "fechando") ?? gestoes.find((g) => g.codigo === "2026.2");
  const formacao = gestoes.find((g) => g.status === "em_formacao");
  return {
    atual: atual.codigo,
    formacao: formacao?.codigo,
    areas: conversasPorArea(atual, meusCasos, simuladas),
    padroes: padroesEmAlta(casos, gestoes, atual.codigo),
    apoio: formacao ? legadoQueApoia(casos, formacao.codigo) : [],
  };
}
