// Entrada por área e cargo. Cada cargo usa um membro ativo da simulação
// como referência para personalizar o que o LegaCITi mostra.
export const AREAS = [
  { id: "ceo", nome: "CEO", cargos: [{ id: "ceo", nome: "CEO", pessoa: 6 }] },
  { id: "diretoria", nome: "Diretoria", cargos: [
    { id: "cto", nome: "CTO", pessoa: 8 },
    { id: "coo", nome: "COO", pessoa: 37 },
    { id: "cro", nome: "CRO", pessoa: 7 },
  ] },
  { id: "ondas", nome: "Ondas", pergunta: "escolha a subárea da qual você faz parte", cargos: [
    { id: "ondas-dev", nome: "Desenvolvimento", cargos: [
      { id: "lider-dev", nome: "Líder de desenvolvimento", pessoa: 10 },
      { id: "gerente-software", nome: "Gerente de software", pessoa: 10 },
    ] },
    { id: "ondas-dados", nome: "Dados", cargos: [
      { id: "lider-dados", nome: "Líder de dados", pessoa: 18 },
      { id: "gerente-dados", nome: "Gerente de dados", pessoa: 16 },
    ] },
    { id: "ondas-produto", nome: "Produto", cargos: [
      { id: "lider-produto", nome: "Líder de produto", pessoa: 14 },
      { id: "gerente-produto", nome: "Gerente de produto", pessoa: 14 },
    ] },
    { id: "ondas-inovacao", nome: "Inovação", cargos: [{ id: "lider-inovacao", nome: "Líder de Inovação", pessoa: 28 }] },
    { id: "ondas-comercial", nome: "Comercial", cargos: [{ id: "lider-comercial", nome: "Líder de Comercial", pessoa: 21 }] },
    { id: "ondas-marketing", nome: "Marketing", cargos: [{ id: "lider-marketing", nome: "Líder de Marketing", pessoa: 24 }] },
  ] },
  { id: "tech", nome: "Tech", cargos: [
    { id: "dev", nome: "Pessoa desenvolvedora", pessoa: 11 },
    { id: "analista-dados", nome: "Analista de dados", pessoa: 60 },
  ] },
  { id: "produto", nome: "Produto", cargos: [{ id: "operacional-produto", nome: "Operacionais", pessoa: 51 }] },
  { id: "negocios", nome: "Negócios", cargos: [
    { id: "gerente-contas", nome: "Gerente de contas", pessoa: 22 },
    { id: "analista-marketing", nome: "Analista de marketing", pessoa: 24 },
  ] },
  { id: "gg", nome: "Gente e Gestão", cargos: [
    { id: "analista-gg", nome: "Analista de Gente e Gestão", pessoa: 26 },
    { id: "especialista-gg", nome: "Especialista de Gente e Gestão", pessoa: 27 },
  ] },
  { id: "inovacao", nome: "Inovação", cargos: [{ id: "inovacao", nome: "Time de Inovação", pessoa: 28 }] },
  { id: "new-pig", nome: "New Pig", cargos: [{ id: "new-pig", nome: "New Pig", pessoa: null }] },
];

// O que cada cargo enxerga com mais destaque no tronco:
// "papeis" = casos contados por quem ocupou o mesmo cargo; "areas" = casos da mesma área.
const DEV = ["Desenvolvimento"], DADOS = ["Inteligência de Dados"], PRODUTO = ["Produto"];
const NEGOCIOS = ["Comercial", "Marketing", "Negócios"], GG = ["Gente e Gestão"];
export const FOCO = {
  ceo: { papeis: ["CEO"], areas: ["Diretoria"] },
  cto: { papeis: ["CTO"], areas: [...DEV, ...DADOS, "Diretoria"] },
  coo: { papeis: ["COO"], areas: [...GG, "Diretoria"] },
  cro: { papeis: ["CRO"], areas: [...NEGOCIOS, "Diretoria"] },
  "lider-dev": { papeis: ["Gerente de software"], areas: DEV },
  "lider-dados": { papeis: ["Líder de dados", "Gerente de dados"], areas: DADOS },
  "lider-produto": { papeis: ["Líder de produto", "Gerente de produto"], areas: PRODUTO },
  "lider-inovacao": { papeis: ["Time de Inovação"], areas: ["Inovação"] },
  "lider-comercial": { papeis: ["Gerente de contas"], areas: ["Comercial", "Negócios"] },
  "lider-marketing": { papeis: ["Analista de marketing"], areas: ["Marketing", "Negócios"] },
  dev: { papeis: ["Pessoa desenvolvedora"], areas: DEV },
  "analista-dados": { papeis: ["Analista de dados"], areas: DADOS },
  "gerente-software": { papeis: ["Gerente de software"], areas: DEV },
  "gerente-dados": { papeis: ["Gerente de dados"], areas: DADOS },
  "operacional-produto": { papeis: ["Operacional de Produto"], areas: PRODUTO },
  "gerente-produto": { papeis: ["Gerente de produto"], areas: PRODUTO },
  "gerente-contas": { papeis: ["Gerente de contas"], areas: ["Comercial", "Negócios"] },
  "analista-marketing": { papeis: ["Analista de marketing"], areas: ["Marketing", "Negócios"] },
  "analista-gg": { papeis: ["Analista de Gente e Gestão"], areas: GG },
  "especialista-gg": { papeis: ["Especialista de Gente e Gestão"], areas: GG },
  inovacao: { papeis: ["Time de Inovação"], areas: ["Inovação"] },
  // New Pig: casos sobre chegar, integrar e aprender os primeiros combinados.
  "new-pig": { casos: ["C023", "C111", "C069", "C053", "C026", "C041", "C036", "C098"] },
};

// 2 = mesmo cargo, 1 = mesma área, 0 = fora do foco.
export function relevancia(caso, cargoId) {
  const foco = FOCO[cargoId];
  if (!foco) return null;
  if (foco.casos) return foco.casos.includes(caso.id) ? 2 : 0;
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
