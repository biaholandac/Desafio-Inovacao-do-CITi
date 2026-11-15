import diretoria from "./casos-diretoria.json";
import solucoes from "./casos-solucoes.json";
import negocios from "./casos-negocios-gg-inovacao.json";
import apoio from "./casos-apoio.json";
import personagens from "./personagens.json";
import gestoes from "./gestoes.json";

export const casos = [...diretoria, ...solucoes, ...negocios, ...apoio];
export { personagens, gestoes };

export const padroes = {
  P1: "Escopo que cresce sem registro",
  P2: "Passada de bastão incompleta",
  P3: "Cliente que some no meio do projeto",
  P4: "Time sobrecarregado com projetos simultâneos",
  P5: "Conhecimento concentrado numa pessoa",
  P6: "Descoberta bem feita e cliente envolvido toda semana",
};

export const pessoaPorId = Object.fromEntries(personagens.map((p) => [p.id, p]));
