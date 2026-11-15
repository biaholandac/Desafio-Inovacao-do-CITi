// Entrada por área e cargo. Cada cargo usa um membro ativo da simulação
// como referência para personalizar o que o LegaCITi mostra.
export const AREAS = [
  { id: "ceo", nome: "CEO", cargos: [{ id: "ceo", nome: "CEO" }] },
  { id: "diretoria", nome: "Diretoria", cargos: [
    { id: "coo", nome: "COO" },
    { id: "cro", nome: "CRO" },
    { id: "cto", nome: "CTO" },
  ] },
  // Ondas: as lideranças de cada subárea e a gerência dos projetos.
  { id: "ondas", nome: "Ondas", pergunta: "escolha o seu cargo", cargos: [
    { id: "lider-dev", nome: "Líder de desenvolvimento" },
    { id: "lider-dados", nome: "Líder de dados" },
    { id: "lider-produto", nome: "Líder de produto" },
    { id: "lider-comercial", nome: "Líder de comercial" },
    { id: "lider-marketing", nome: "Líder de marketing" },
    { id: "lider-gg", nome: "Líder de Gente e Gestão" },
    { id: "head-inovacao", nome: "Head de Inovação" },
    { id: "gerente-projeto", nome: "Gerente de projeto" },
  ] },
  { id: "tech", nome: "Tech", cargos: [
    { id: "dev", nome: "Pessoa desenvolvedora" },
    { id: "analista-software", nome: "Analista de software" },
    { id: "analista-dados", nome: "Analista de dados" },
  ] },
  { id: "produto", nome: "Produto", cargos: [{ id: "operacional-produto", nome: "Operacional de produto" }] },
  { id: "negocios", nome: "Negócios", cargos: [
    { id: "gerente-contas", nome: "Gerente de contas" },
    { id: "analista-marketing", nome: "Analista de marketing" },
  ] },
  { id: "gg", nome: "Gente e Gestão", cargos: [
    { id: "analista-gg", nome: "Analista de Gente e Gestão" },
    { id: "especialista-gg", nome: "Especialista de Gente e Gestão" },
  ] },
  { id: "inovacao", nome: "Inovação", cargos: [{ id: "inovacao", nome: "Time de Inovação" }] },
  { id: "new-pig", nome: "New Pig", pergunta: "escolha a subárea em que você está entrando", cargos: [
    { id: "np-tech", nome: "Tech", cargos: [{ id: "new-pig-tech", nome: "New Pig de Tech" }] },
    { id: "np-produto", nome: "Produto", cargos: [{ id: "new-pig-produto", nome: "New Pig de Produto" }] },
    { id: "np-negocios", nome: "Negócios", cargos: [{ id: "new-pig-negocios", nome: "New Pig de Negócios" }] },
    { id: "np-gg", nome: "Gente e Gestão", cargos: [{ id: "new-pig-gg", nome: "New Pig de Gente e Gestão" }] },
    { id: "np-inovacao", nome: "Inovação", cargos: [{ id: "new-pig-inovacao", nome: "New Pig de Inovação" }] },
  ] },
];

// O que cada cargo enxerga com mais destaque no tronco:
// "papeis" = casos contados por quem ocupou o mesmo cargo; "areas" = casos da mesma área.
const DEV = ["Desenvolvimento"], DADOS = ["Inteligência de Dados"], PRODUTO = ["Produto"];
const NEGOCIOS = ["Comercial", "Marketing", "Negócios"], GG = ["Gente e Gestão"];
export const FOCO = {
  ceo: { papeis: ["CEO"], areas: ["Diretoria"] },
  coo: { papeis: ["COO"], areas: [...GG, "Diretoria"] },
  cro: { papeis: ["CRO"], areas: [...NEGOCIOS, "Diretoria"] },
  cto: { papeis: ["CTO"], areas: [...DEV, ...DADOS, "Diretoria"] },
  "lider-dev": { papeis: ["Líder de desenvolvimento"], areas: DEV },
  "lider-dados": { papeis: ["Líder de dados"], areas: DADOS },
  "lider-produto": { papeis: ["Líder de produto"], areas: PRODUTO },
  "lider-comercial": { papeis: ["Líder de comercial"], areas: ["Comercial", "Negócios"] },
  "lider-marketing": { papeis: ["Líder de marketing"], areas: ["Marketing", "Negócios"] },
  "lider-gg": { papeis: ["Líder de Gente e Gestão"], areas: GG },
  "head-inovacao": { papeis: ["Head de Inovação"], areas: ["Inovação"] },
  "gerente-projeto": { papeis: ["Gerente de projeto"], areas: [...DEV, ...DADOS, ...PRODUTO] },
  dev: { papeis: ["Pessoa desenvolvedora"], areas: DEV },
  "analista-software": { papeis: ["Analista de software"], areas: [...DEV, ...DADOS] },
  "analista-dados": { papeis: ["Analista de dados"], areas: DADOS },
  "operacional-produto": { papeis: ["Operacional de produto"], areas: PRODUTO },
  "gerente-contas": { papeis: ["Gerente de contas"], areas: ["Comercial", "Negócios"] },
  "analista-marketing": { papeis: ["Analista de marketing"], areas: ["Marketing", "Negócios"] },
  "analista-gg": { papeis: ["Analista de Gente e Gestão"], areas: GG },
  "especialista-gg": { papeis: ["Especialista de Gente e Gestão"], areas: GG },
  inovacao: { papeis: ["Time de Inovação"], areas: ["Inovação"] },
  // New Pig: os casos de chegada valem para todos; somam-se os da subárea em que a pessoa entra.
  "new-pig-tech": { novato: true, papeis: ["Pessoa desenvolvedora", "Analista de software", "Analista de dados"], areas: [...DEV, ...DADOS] },
  "new-pig-produto": { novato: true, papeis: ["Operacional de produto"], areas: PRODUTO },
  "new-pig-negocios": { novato: true, papeis: ["Gerente de contas", "Analista de marketing"], areas: NEGOCIOS },
  "new-pig-gg": { novato: true, papeis: ["Analista de Gente e Gestão"], areas: GG },
  "new-pig-inovacao": { novato: true, papeis: ["Time de Inovação"], areas: ["Inovação"] },
};

// Casos sobre chegar, integrar e aprender os primeiros combinados do CITi.
export const CHEGADA = ["C023", "C036", "C046", "C030", "C041", "C098", "C069", "C111", "C053", "C026"];

export const ehNovato = (cargoId) => Boolean(FOCO[cargoId]?.novato);

// 2 = mesmo cargo, 1 = mesma área, 0 = fora do foco.
export function relevancia(caso, cargoId) {
  const foco = FOCO[cargoId];
  if (!foco) return null;
  if (foco.novato) {
    if (CHEGADA.includes(caso.id)) return 2;
    return foco.areas.includes(caso.area) ? 1 : 0;
  }
  if (foco.papeis.includes(caso.cargoAutor)) return 2;
  if (foco.areas.includes(caso.area)) return 1;
  return 0;
}

// Acha um cargo pelo id, inclusive dentro das subáreas das Ondas.
export function acharCargo(id) {
  for (const area of AREAS) {
    for (const item of area.cargos) {
      if (item.cargos) {
        const cargo = item.cargos.find((c) => c.id === id);
        if (cargo) return { area, subarea: item, cargo };
      } else if (item.id === id) {
        return { area, subarea: null, cargo: item };
      }
    }
  }
  return null;
}
