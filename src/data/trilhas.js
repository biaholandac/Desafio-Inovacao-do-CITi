// Trilhas de carreira do CITi: o caminho de cada área, do New Pig à diretoria.
// Em cada degrau, o LegaCITi mostra o que quem passou por ali deixou registrado.
export const TRILHAS = [
  {
    id: "tech",
    nome: "Tech",
    degraus: [
      { cargo: "New Pig", descricao: "Chega ao CITi e escolhe Tech." },
      { cargo: ["Pessoa desenvolvedora", "Analista de software", "Analista de dados"], descricao: "Constrói sistemas, painéis e análises nos squads." },
      { cargo: "Gerente de projeto", descricao: "Cuida das pessoas, dos prazos e do cliente de um ou mais squads." },
      { cargo: ["Líder de desenvolvimento", "Líder de dados"], descricao: "Lidera a subárea e cuida das práticas que ficam de uma gestão para outra." },
      { cargo: "CTO", descricao: "Responde pela área de Soluções na diretoria." },
      { cargo: "CEO", descricao: "Comanda o CITi." },
    ],
  },
  {
    id: "produto",
    nome: "Produto",
    degraus: [
      { cargo: "New Pig", descricao: "Chega ao CITi e escolhe Produto." },
      { cargo: "Operacional de produto", descricao: "Conduz descobertas, protótipos e o guia visual dos projetos." },
      { cargo: "Gerente de projeto", descricao: "Cuida das pessoas, dos prazos e do cliente de um ou mais squads." },
      { cargo: "Líder de produto", descricao: "Lidera a subárea e cuida da biblioteca de componentes e das práticas." },
      { cargo: "CTO", descricao: "Responde pela área de Soluções na diretoria." },
      { cargo: "CEO", descricao: "Comanda o CITi." },
    ],
  },
  {
    id: "negocios",
    nome: "Negócios",
    degraus: [
      { cargo: "New Pig", descricao: "Chega ao CITi e escolhe Negócios." },
      { cargo: ["Gerente de contas", "Analista de marketing"], descricao: "Vende, atende os clientes e leva o CITi ao mercado." },
      { cargo: ["Líder de comercial", "Líder de marketing"], descricao: "Lidera a subárea e organiza metas, funil e conteúdo." },
      { cargo: "CRO", descricao: "Responde pela área de Negócios na diretoria." },
      { cargo: "CEO", descricao: "Comanda o CITi." },
    ],
  },
  {
    id: "gg",
    nome: "Gente e Gestão",
    degraus: [
      { cargo: "New Pig", descricao: "Chega ao CITi e escolhe Gente e Gestão." },
      { cargo: "Analista de Gente e Gestão", descricao: "Cuida da recepção, do clima e dos ritos dos times." },
      { cargo: "Especialista de Gente e Gestão", descricao: "Aprofunda processos como alocação e retrospectivas." },
      { cargo: "Líder de Gente e Gestão", descricao: "Lidera a área e acompanha as pessoas de toda a empresa." },
      { cargo: "COO", descricao: "Responde pela operação e pelas pessoas na diretoria." },
      { cargo: "CEO", descricao: "Comanda o CITi." },
    ],
  },
  {
    id: "inovacao",
    nome: "Inovação",
    degraus: [
      { cargo: "New Pig", descricao: "Chega ao CITi e escolhe Inovação." },
      { cargo: "Time de Inovação", descricao: "Cria as ferramentas internas e os produtos prontos do CITi." },
      { cargo: "Head de Inovação", descricao: "Define as prioridades da Inovação e leva os produtos ao mercado." },
      { cargo: "CEO", descricao: "Comanda o CITi." },
    ],
  },
];

// Trilha de quem entrou, pela área do cargo.
const TRILHA_DA_AREA = { tech: "tech", produto: "produto", negocios: "negocios", gg: "gg", inovacao: "inovacao" };
const TRILHA_DO_CARGO = {
  cto: "tech", coo: "gg", cro: "negocios", ceo: "tech",
  "lider-dev": "tech", "lider-dados": "tech", "gerente-projeto": "tech",
  "lider-produto": "produto", "lider-comercial": "negocios", "lider-marketing": "negocios",
  "lider-gg": "gg", "head-inovacao": "inovacao",
  "new-pig-tech": "tech", "new-pig-produto": "produto", "new-pig-negocios": "negocios", "new-pig-gg": "gg", "new-pig-inovacao": "inovacao",
};

export function trilhaInicial(entrada) {
  if (!entrada) return "tech";
  return TRILHA_DO_CARGO[entrada.cargo.id] ?? TRILHA_DA_AREA[entrada.area.id] ?? "tech";
}

export const cargosDoDegrau = (degrau) => (Array.isArray(degrau.cargo) ? degrau.cargo : [degrau.cargo]);
