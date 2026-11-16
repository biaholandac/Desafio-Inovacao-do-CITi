// Casos que a pessoa registrou nesta demonstração chegam do navegador: só passam campos esperados, com tamanho limitado.
const corta = (t, max = 600) => String(t ?? "").slice(0, max);
export function limparExtra(c) {
  if (!c || !/^N\d{3,4}$/.test(String(c.id))) return null;
  return {
    id: c.id, titulo: corta(c.titulo, 90), gestao: corta(c.gestao, 8), cargoAutor: corta(c.cargoAutor, 60), area: corta(c.area, 40),
    situacao: corta(c.situacao), dilema: corta(c.dilema), decisao: corta(c.decisao), resultado: corta(c.resultado), licao: corta(c.licao, 300),
    padroes: (Array.isArray(c.padroes) ? c.padroes : []).filter((p) => /^P[1-6]$/.test(p)), origem: corta(c.origem, 20),
  };
}
