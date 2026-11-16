// Casos registrados nas conversas de legado desta demonstração.
// Ficam só neste navegador: cada pessoa da banca pode testar do seu jeito, sem afetar as outras.
import { FOCO } from "@/data/cargos";

const CHAVE = "legaciti:demonstracao:v1";

// A demonstração pertence ao perfil que a fez: entrando com outro cargo, ela recomeça do zero.
export function lerDemonstracao(cargo) {
  try {
    const dados = JSON.parse(window.localStorage.getItem(CHAVE) ?? "null");
    if (dados && dados.cargo === cargo && Array.isArray(dados.casos)) return { casos: dados.casos, simuladas: Number(dados.simuladas) || 0 };
    window.localStorage.removeItem(CHAVE);
  } catch {}
  return { casos: [], simuladas: 0 };
}

export function salvarDemonstracao(estado, cargo) {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify({ ...estado, cargo }));
  } catch {}
}

// Área do caso (como nos casos do legado) e fatia do tronco onde ele nasce, a partir do cargo.
const SETOR_DA_AREA = {
  Diretoria: "Diretoria",
  Desenvolvimento: "Tech",
  "Inteligência de Dados": "Tech",
  Produto: "Produto",
  Comercial: "Negócios",
  Marketing: "Negócios",
  Negócios: "Negócios",
  "Gente e Gestão": "Gente e Gestão",
  Inovação: "Inovação",
};

export function areaDoCargo(entrada) {
  if (!entrada) return { area: "Diretoria", setor: "Diretoria" };
  if (entrada.area.id === "ceo" || entrada.area.id === "diretoria") return { area: "Diretoria", setor: "Diretoria" };
  const area = FOCO[entrada.cargo.id]?.areas?.[0] ?? "Diretoria";
  return { area, setor: SETOR_DA_AREA[area] ?? "Diretoria" };
}

export function novoCaso({ rascunho, tipo, entrada, indice, gestao }) {
  const { area, setor } = areaDoCargo(entrada);
  return {
    id: "N" + String(indice).padStart(3, "0"),
    titulo: rascunho.titulo,
    autor: null,
    gestao,
    origem: tipo,
    projeto: null,
    area,
    setor,
    padroes: rascunho.padroes ?? [],
    situacao: rascunho.situacao,
    dilema: rascunho.dilema || null,
    opcoes: null,
    decisao: rascunho.decisao,
    resultado: rascunho.resultado,
    licao: rascunho.licao,
    simulacao: null,
    cargoAutor: entrada?.cargo.nome ?? "Membro do CITi",
    meu: true,
  };
}
