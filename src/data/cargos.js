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
    { id: "lider-dev", nome: "Desenvolvimento", titulo: "Liderança de Desenvolvimento", pessoa: 10 },
    { id: "lider-dados", nome: "Dados", titulo: "Liderança de Dados", pessoa: 18 },
    { id: "lider-produto", nome: "Produto", titulo: "Liderança de Produto", pessoa: 14 },
    { id: "lider-inovacao", nome: "Inovação", titulo: "Liderança de Inovação", pessoa: 28 },
    { id: "lider-comercial", nome: "Comercial", titulo: "Liderança de Comercial", pessoa: 21 },
    { id: "lider-marketing", nome: "Marketing", titulo: "Liderança de Marketing", pessoa: 24 },
  ] },
  { id: "tech", nome: "Tech", cargos: [
    { id: "dev", nome: "Pessoa desenvolvedora", pessoa: 11 },
    { id: "analista-dados", nome: "Analista de dados", pessoa: 60 },
    { id: "gerente-software", nome: "Gerente de software", pessoa: 10 },
    { id: "gerente-dados", nome: "Gerente de dados", pessoa: 16 },
  ] },
  { id: "produto", nome: "Produto", cargos: [
    { id: "analista-produto", nome: "Analista de produto", pessoa: 51 },
    { id: "designer", nome: "Designer de produto", pessoa: 52 },
    { id: "gerente-produto", nome: "Gerente de produto", pessoa: 14 },
  ] },
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
const DEV = ["Desenvolvimento"], DADOS = ["Inteligência de Dados"], PRODUTO = ["Produto", "Design de Produto"];
const NEGOCIOS = ["Comercial", "Marketing", "Negócios"], GG = ["Gente e Gestão"];
export const FOCO = {
  ceo: { papeis: ["CEO"], areas: ["Diretoria"] },
  cto: { papeis: ["CTO"], areas: [...DEV, ...DADOS, "Diretoria"] },
  coo: { papeis: ["COO"], areas: [...GG, "Diretoria"] },
  cro: { papeis: ["CRO"], areas: [...NEGOCIOS, "Diretoria"] },
  "lider-dev": { papeis: ["Gerente de software"], areas: DEV },
  "lider-dados": { papeis: ["Líder de dados", "Gerente de dados"], areas: DADOS },
  "lider-produto": { papeis: ["Gerente de produto", "Líder de design"], areas: PRODUTO },
  "lider-inovacao": { papeis: ["Time de Inovação"], areas: ["Inovação"] },
  "lider-comercial": { papeis: ["Gerente de contas"], areas: ["Comercial", "Negócios"] },
  "lider-marketing": { papeis: ["Analista de marketing"], areas: ["Marketing", "Negócios"] },
  dev: { papeis: ["Pessoa desenvolvedora"], areas: DEV },
  "analista-dados": { papeis: ["Analista de dados"], areas: DADOS },
  "gerente-software": { papeis: ["Gerente de software"], areas: DEV },
  "gerente-dados": { papeis: ["Gerente de dados"], areas: DADOS },
  "analista-produto": { papeis: ["Analista de produto"], areas: PRODUTO },
  designer: { papeis: ["Designer de produto", "Líder de design"], areas: PRODUTO },
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

export function acharCargo(id) {
  for (const area of AREAS) {
    const cargo = area.cargos.find((c) => c.id === id);
    if (cargo) return { area, cargo };
  }
  return null;
}
