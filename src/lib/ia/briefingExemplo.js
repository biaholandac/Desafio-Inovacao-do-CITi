// Último briefing que a IA escreveu com sucesso para o exemplo da clínica (botão "Usar um exemplo"),
// gerado a partir dos casos do legado. Usado só se a IA não responder a tempo para esse mesmo texto.
export const TEXTO_EXEMPLO =
  "Vamos começar um aplicativo para uma clínica: agendamento de consultas pelos pacientes e uma agenda para as recepcionistas. O squad tem quatro pessoas e o prazo é de dois meses.";

export const BRIEFING_EXEMPLO = {
  resumo:
    "Como este projeto envolve um aplicativo para uma clínica, os aprendizados com o legado em projetos semelhantes de saúde mostram caminhos essenciais para evitar atrasos e retrabalho. O histórico do CITi reforça que validar entregas e alinhar expectativas com o cliente evita surpresas no prazo.",
  deuCerto: [
    { texto: "Validar o que foi feito semanalmente com o cliente evitou surpresas e garantiu a entrega no prazo.", casos: ["C077"] },
    { texto: "Escrever os critérios de aceite junto com o cliente antes de iniciar evitou discussões sobre o que estava pronto.", casos: ["C081"] },
    { texto: "Convidar o cliente para participar das revisões de design garantiu que as telas fossem aprovadas sem retrabalho.", casos: ["C085"] },
  ],
  deuErrado: [
    { texto: "Reduzir a descoberta a uma única reunião impediu de ouvir quem realmente usaria a ferramenta, gerando novos pedidos depois.", casos: ["C025"] },
    { texto: "Aceitar pedidos informais e não anotar mudanças de escopo custou quatro semanas de atraso na entrega.", casos: ["C018"] },
    { texto: "Deixar a publicação para a véspera da entrega, com o time sobrecarregado, tirou o sistema do ar.", casos: ["C072"] },
  ],
  perguntas: [
    { texto: "Vocês poderiam incluir a recepcionista, que vai usar a agenda diariamente, nas conversas de descoberta?", casos: ["C025"] },
    { texto: "Podemos definir critérios de aceite por escrito e em conjunto antes de iniciar o desenvolvimento?", casos: ["C081"] },
    { texto: "Podemos estabelecer validações semanais para mostrarmos o andamento, mesmo com partes incompletas?", casos: ["C077"] },
  ],
  riscos: [
    { texto: "O escopo crescer com pedidos informais, indicado pelo surgimento de solicitações extras de última hora feitas fora das reuniões de alinhamento.", casos: ["C018"] },
    { texto: "Falhas na publicação por acúmulo de tarefas, indicado por deixar o deploy para a véspera da entrega.", casos: ["C072"] },
    { texto: "Conhecimento centralizado em uma só pessoa, indicado pela ausência de documentação das decisões técnicas durante o desenvolvimento.", casos: ["C019"] },
  ],
};
export const CASOS_EXEMPLO = ["C077", "C081", "C085", "C025", "C018", "C072", "C019"];

export const normalizar = (t) => String(t).toLowerCase().replace(/\s+/g, " ").trim();
