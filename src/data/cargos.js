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

export function acharCargo(id) {
  for (const area of AREAS) {
    const cargo = area.cargos.find((c) => c.id === id);
    if (cargo) return { area, cargo };
  }
  return null;
}
