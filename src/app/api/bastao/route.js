import { casos, gestoes } from "@/data";
import { gerarJSON } from "@/lib/ia/gemini";
import { casosComoTexto } from "@/lib/ia/busca";
import { instrucaoBastao, ESQUEMA_BASTAO, conferirKit, kitReserva } from "@/lib/ia/bastao";

export const maxDuration = 30;

const ORDEM = gestoes.map((g) => g.codigo);
const CARGOS = new Set(casos.map((c) => c.cargoAutor));
const corta = (t, max = 600) => String(t ?? "").slice(0, max);

// Passada de bastão de um cargo: IA com citações conferidas; sem IA, montada só com os dados.
export async function POST(request) {
  const corpo = await request.json().catch(() => ({}));
  const cargo = String(corpo.cargo ?? "");
  if (!CARGOS.has(cargo)) return Response.json({ erro: "cargo_sem_legado" }, { status: 400 });

  // Casos que a própria pessoa registrou nesta demonstração também contam, se forem do mesmo cargo.
  const meus = (Array.isArray(corpo.extras) ? corpo.extras : []).slice(0, 30)
    .filter((c) => /^N\d{3,4}$/.test(String(c?.id)) && c.cargoAutor === cargo)
    .map((c) => ({
      id: c.id, titulo: corta(c.titulo, 90), gestao: corta(c.gestao, 8), cargoAutor: cargo, situacao: corta(c.situacao),
      dilema: corta(c.dilema), decisao: corta(c.decisao), resultado: corta(c.resultado), licao: corta(c.licao, 300),
      padroes: (Array.isArray(c.padroes) ? c.padroes : []).filter((p) => /^P[1-6]$/.test(p)),
    }));
  const doCargo = [...casos.filter((c) => c.cargoAutor === cargo), ...meus]
    .sort((a, b) => ORDEM.indexOf(b.gestao) - ORDEM.indexOf(a.gestao))
    .slice(0, 16);
  const reserva = kitReserva(cargo, doCargo, ORDEM);

  const fontes = casosComoTexto(doCargo);
  try {
    const saida = await gerarJSON({
      instrucao: instrucaoBastao(cargo),
      conteudo: `Casos contados por quem já foi ${cargo}:\n\n${fontes}`,
      esquema: ESQUEMA_BASTAO,
      maxTokens: 1600,
    });
    return Response.json({ cargo, total: doCargo.length, kit: conferirKit(saida, doCargo, reserva, fontes + ` ${doCargo.length}`), origem: "ia" });
  } catch (erro) {
    console.error("bastao:", erro?.message);
    return Response.json({ cargo, total: doCargo.length, kit: reserva, origem: "dados" });
  }
}
