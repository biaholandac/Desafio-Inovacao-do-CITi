# LegaCITi · Todos os casos da simulação

> **Dados simulados.** Personagens, clientes e histórias fictícios, criados para a demonstração do LegaCITi.

São 115 casos, organizados por gestão. Cada caso mostra o cargo de quem contou na época, sem nomes.

**Padrões:** P1 escopo que cresce sem registro · P2 passada de bastão incompleta · P3 cliente que some · P4 time sobrecarregado com projetos simultâneos · P5 conhecimento que não circula pelo time · P6 acerto: descoberta bem feita + cliente envolvido toda semana.

| Padrão | Casos |
|---|---|
| P1 | 9 |
| P2 | 14 |
| P3 | 9 |
| P4 | 14 |
| P5 | 20 |
| P6 | 12 |

## Gestão 2024.1

Foi a gestão do esforço para ampliar a carteira de clientes, com destaque para o aplicativo de agendamento da Clínica Bem Cuidar. Os contratos foram fechados rápido e com escopo pouco detalhado, e muitos pedidos novos foram aceitos em reunião sem registro. Ficou a lição de que vender bem não basta: o que foi combinado com o cliente precisa chegar inteiro ao time.

### C001 · Crescer a carteira sem afogar o time
*Contado por: CEO · conversa de fim de gestão · P4*

- **Situação:** A diretoria de 2024 definiu como prioridade ampliar a carteira de clientes. O comercial fechou muitos contratos em poucas semanas, e os mesmos membros de Soluções foram alocados em dois ou três projetos ao mesmo tempo.
- **Dilema:** Segurar novas vendas para proteger o time ou aproveitar o bom momento comercial.
- **Opções na época:** (a) Manter o ritmo de vendas e pedir mais esforço ao time; (b) Limitar o número de projetos por pessoa antes de vender mais; (c) Escalonar o início dos novos projetos ao longo do semestre
- **Decisão:** A diretoria manteve o ritmo de vendas e prometeu reforço de pessoas para a gestão seguinte.
- **Resultado:** Os projetos foram entregues, mas com atrasos e sinais claros de cansaço no time. O reforço só chegou meses depois.
- **Lição:** Antes de acelerar as vendas, combine quantos projetos cada pessoa consegue tocar ao mesmo tempo.
- **Simulação:** escolha entre opções

### C018 · As funcionalidades pequenas que viraram um mês
*Contado por: Pessoa desenvolvedora · conversa do squad · projeto A · P1*

- **Situação:** A cada reunião de acompanhamento, o dono da Clínica Bem Cuidar pedia um ajuste rapidinho: lembrete por mensagem, confirmação de consulta, uma tela de relatórios. Ninguém anotava os pedidos como mudança de escopo.
- **Dilema:** Dizer não e arriscar a relação com um cliente importante, ou absorver tudo e arriscar o prazo.
- **Opções na época:** (a) Aceitar tudo e trabalhar mais; (b) Registrar cada pedido e renegociar o prazo; (c) Entregar o combinado e propor as novidades numa segunda fase
- **Decisão:** O time aceitou tudo, e a pessoa desenvolvedora passou a resolver os pedidos sozinha, à noite.
- **Resultado:** A entrega atrasou quatro semanas e o cliente achou que o time tinha sido lento.
- **Lição:** Um pedido pequeno não registrado vira prazo perdido. Todo pedido novo precisa ser anotado e ter o impacto discutido com o cliente na hora.
- **Simulação:** escolha entre opções

### C025 · A descoberta que foi cortada para ganhar tempo
*Contado por: Analista de produto · conversa do squad · projeto A · P1, P2*

- **Situação:** A descoberta com a Clínica Bem Cuidar foi reduzida a uma reunião para começar logo o desenvolvimento. A analista de produto não entrevistou a recepcionista, que era quem mais usaria o aplicativo.
- **Dilema:** Defender mais tempo de descoberta ou seguir o ritmo que a gestão pedia.
- **Opções na época:** (a) Seguir com uma reunião só; (b) Pedir uma semana de descoberta; (c) Fazer entrevistas curtas durante o desenvolvimento
- **Decisão:** Uma reunião só.
- **Resultado:** A maior parte dos pedidos pequenos veio da recepcionista, que só viu o aplicativo na metade do projeto.
- **Lição:** Pular a descoberta não economiza tempo, só adia o trabalho. Ouvir quem vai usar o produto antes de construir evita o escopo que cresce depois.
- **Simulação:** escolha entre opções

### C039 · O que eu combinei e não chegou ao time
*Contado por: Gerente de contas · conversa do squad · projeto A · P2*

- **Situação:** Na negociação com a Clínica Bem Cuidar, o gerente de contas prometeu que o aplicativo enviaria lembretes por mensagem. Na passada de bastão, ele resumiu o projeto como um app de agendamento simples.
- **Dilema:** Como transmitir tudo o que foi combinado sem transformar a passada de bastão numa reunião interminável.
- **Opções na época:** (a) Passar um resumo rápido; (b) Entregar um documento com tudo o que foi prometido; (c) Levar o time para conhecer o cliente antes de começar
- **Decisão:** Resumo rápido, por falta de tempo.
- **Resultado:** O time descobriu a promessa dos lembretes só no meio do projeto, quando o cliente cobrou. Foi o primeiro dos pedidos pequenos.
- **Lição:** A passada de bastão precisa conter tudo o que foi prometido, por escrito, mesmo o que parece detalhe.
- **Simulação:** conversa com: Dono da Clínica Bem Cuidar, que quer tudo rápido e acha cada pedido simples

### C063 · A meta de clientes que trouxe projetos fora do perfil
*Contado por: CRO · conversa de fim de gestão · P4*

- **Situação:** Com a meta de ampliar a carteira, o comercial passou a aceitar projetos que o CITi não costumava fazer.
- **Dilema:** Manter a meta ou filtrar os projetos pelo perfil do CITi.
- **Decisão:** A CRO manteve a meta e aceitou os projetos.
- **Resultado:** Os projetos fora do perfil consumiram mais tempo do time e geraram atrasos.
- **Lição:** Meta de vendas precisa vir acompanhada de um perfil claro de cliente.

### C064 · Escolher uma tecnologia padrão para aplicativos
*Contado por: CTO · conversa de fim de gestão*

- **Situação:** Cada squad de aplicativo escolhia sua tecnologia, e ninguém conseguia ajudar em projetos de outros squads.
- **Dilema:** Padronizar ou manter a liberdade de cada squad.
- **Decisão:** O CTO definiu uma tecnologia padrão para novos aplicativos.
- **Resultado:** Os membros passaram a circular entre projetos com mais facilidade.
- **Lição:** Padronizar o que se repete libera energia para o que é único em cada projeto.

### C070 · A tela de login refeita três vezes
*Contado por: Pessoa desenvolvedora · conversa do squad · P1*

- **Situação:** O cliente mudava de ideia sobre a tela de login a cada reunião.
- **Dilema:** Refazer a cada pedido ou fechar a definição com o cliente.
- **Decisão:** A pessoa desenvolvedora refez a tela três vezes.
- **Resultado:** Duas semanas foram gastas numa única tela.
- **Lição:** Feche a definição com o cliente antes de construir, e registre o que foi decidido.

### C071 · Um aplicativo entregue sem testes
*Contado por: Pessoa desenvolvedora · conversa do squad*

- **Situação:** Para cumprir o prazo, um aplicativo foi entregue sem testes.
- **Dilema:** Atrasar para testar ou entregar no prazo.
- **Decisão:** A pessoa desenvolvedora entregou no prazo, sem testes.
- **Resultado:** O aplicativo apresentou falhas na primeira semana de uso.
- **Lição:** Pular testes não economiza tempo, só transfere o problema para o cliente.

### C079 · O protótipo aprovado por quem não ia usar
*Contado por: Designer de produto · conversa do squad · P2*

- **Situação:** O protótipo foi aprovado pelo dono da empresa, mas quem usaria o sistema era a equipe dele.
- **Dilema:** Considerar a aprovação suficiente ou validar com os usuários.
- **Decisão:** A designer de produto considerou a aprovação suficiente.
- **Resultado:** A equipe do cliente estranhou o sistema e pediu mudanças.
- **Lição:** Aprovação de quem paga não é validação de quem usa.

### C087 · Os dados que chegaram com dois meses de atraso
*Contado por: Analista de dados · conversa do squad · P3*

- **Situação:** O cliente demorou dois meses para enviar os dados.
- **Dilema:** Esperar ou cobrar formalmente.
- **Decisão:** A analista de dados esperou.
- **Resultado:** O projeto ficou parado e o prazo foi perdido.
- **Lição:** Combine no contrato quando os dados devem chegar e o que acontece se atrasarem.

### C094 · Um contrato sem escopo escrito
*Contado por: Gerente de contas · conversa do squad · P1*

- **Situação:** A gerente de contas fechou um contrato com o escopo descrito em poucas linhas.
- **Dilema:** Detalhar o escopo ou fechar rápido.
- **Decisão:** A gerente de contas fechou rápido.
- **Resultado:** O cliente e o squad entenderam o projeto de formas diferentes.
- **Lição:** Escopo não escrito é escopo em disputa.

### C101 · A campanha que trouxe clientes fora do perfil
*Contado por: Analista de marketing · conversa de fim de gestão*

- **Situação:** Uma campanha de captação trouxe muitos contatos fora do perfil do CITi.
- **Dilema:** Medir pela quantidade ou pela qualidade.
- **Decisão:** A analista de marketing passou a medir pela qualidade dos contatos.
- **Resultado:** As campanhas seguintes foram ajustadas ao perfil ideal.
- **Lição:** O número que importa é o de clientes certos.

## Gestão 2024.2

O CITi viveu um crescimento rápido, com muitos projetos simultâneos, entre eles o painel de vendas do Mercadinho Boa Praça. As mesmas pessoas acabaram em vários projetos ao mesmo tempo, alguns clientes sumiram no meio do caminho, e a pesquisa de clima mostrou sinais de sobrecarga.

### C002 · O que eu gostaria de ter deixado escrito
*Contado por: CEO · conversa de despedida · P5*

- **Situação:** Ao fim do mandato, a CEO passou a presidência para o próximo CEO em uma reunião de duas horas. Acordos com parceiros, combinados com clientes antigos e os motivos de várias decisões estratégicas estavam só na memória dela.
- **Dilema:** Como transmitir um ano de contexto em pouco tempo, sem sobrecarregar quem chega.
- **Decisão:** A CEO fez uma reunião de passagem e se colocou à disposição para dúvidas por mensagem.
- **Resultado:** Nos primeiros meses de 2025, o novo CEO precisou reconstruir decisões do zero e procurou a antiga CEO várias vezes, já formada e com pouco tempo.
- **Lição:** Uma passagem de gestão precisa registrar não só o que foi decidido, mas por que foi decidido.

### C005 · O escopo que dobrou sem ninguém perceber
*Contado por: Gerente de dados · conversa do squad · P1*

- **Situação:** No primeiro projeto que gerenciou, um painel de pedidos para uma padaria, a gerente de dados aceitava pequenos ajustes em cada reunião. No fim, o painel tinha o dobro de indicadores combinados.
- **Dilema:** Recusar os ajustes e frustrar o cliente, ou aceitar e estourar o prazo.
- **Opções na época:** (a) Aceitar os ajustes; (b) Registrar cada pedido e avaliar o impacto; (c) Recusar tudo que não estava no contrato
- **Decisão:** A gerente de dados aceitou os ajustes até perceber o atraso.
- **Resultado:** O projeto atrasou um mês. Depois disso, ela passou a manter uma lista de pedidos com o impacto de cada um, revisada com o cliente toda semana.
- **Lição:** Escopo não cresce de uma vez, cresce em pedidos pequenos. Registrar cada um torna o crescimento visível para todos.
- **Simulação:** escolha entre opções

### C008 · Metade dos squads atrasados ao mesmo tempo
*Contado por: COO · conversa de fim de gestão · P4*

- **Situação:** No meio de 2024.2, metade dos squads estava atrasada. As mesmas cinco pessoas apareciam em quase todos os projetos.
- **Dilema:** Redistribuir pessoas no meio do semestre ou renegociar prazos com os clientes.
- **Opções na época:** (a) Redistribuir pessoas entre os projetos; (b) Renegociar prazos com os clientes; (c) Pedir mais horas ao time
- **Decisão:** O COO mapeou quem estava em cada projeto e propôs que ninguém ficasse em mais de dois ao mesmo tempo, renegociando dois prazos.
- **Resultado:** Os projetos renegociados foram entregues bem, e o mapa de alocação passou a ser revisado toda semana.
- **Lição:** A sobrecarga aparece primeiro na alocação. Olhar quem está em cada projeto evita atrasos em cadeia.
- **Simulação:** escolha entre opções

### C009 · Cuidar do clima enquanto a empresa cresce
*Contado por: COO · conversa de despedida*

- **Situação:** O crescimento de 2024 trouxe muitos membros novos e muitos projetos. Os ritos de integração ficaram de lado, e quem chegava não conhecia quem estava em outras áreas.
- **Dilema:** Manter os ritos mesmo com pouco tempo ou focar só nas entregas.
- **Decisão:** O COO manteve um encontro mensal curto entre todas as áreas, mesmo nas semanas mais cheias.
- **Resultado:** Os membros relataram mais sensação de pertencimento, e problemas entre áreas passaram a ser resolvidos em conversa direta.
- **Lição:** Em períodos de crescimento, os ritos são os primeiros a serem cortados e os que mais fazem falta.

### C016 · Um painel, um cliente sumido e outros dois projetos
*Contado por: Pessoa desenvolvedora · conversa do squad · projeto B · P3, P4*

- **Situação:** A pessoa desenvolvedora desenvolvia o painel de vendas do Mercadinho Boa Praça enquanto tocava outros dois projetos. O cliente parou de responder justamente quando o painel precisava ser validado.
- **Dilema:** Seguir desenvolvendo sem validação ou pausar o painel e focar nos outros projetos.
- **Opções na época:** (a) Seguir desenvolvendo com base em suposições; (b) Pausar e focar nos outros projetos; (c) Avisar o gerente e pedir que alguém acione o cliente
- **Decisão:** A pessoa desenvolvedora seguiu desenvolvendo com base em suposições para não perder o ritmo.
- **Resultado:** Quando o cliente voltou, metade das telas precisou ser refeita, e os outros dois projetos também atrasaram.
- **Lição:** Desenvolver sem validação parece ganhar tempo, mas costuma gerar retrabalho. Cliente em silêncio é sinal para escalar, não para adivinhar.
- **Simulação:** escolha entre opções

### C035 · Três semanas sem resposta e um prazo que não mudou
*Contado por: Analista de dados · conversa do squad · projeto B · P3*

- **Situação:** O analista de dados precisava dos dados de vendas do Mercadinho Boa Praça. O dono do mercado parou de responder por três semanas, mas o prazo do contrato continuou o mesmo.
- **Dilema:** Esperar, insistir com mais mensagens ou escalar.
- **Opções na época:** (a) Esperar o cliente; (b) Mandar mais mensagens; (c) Pedir ao gerente de contas que acionasse o cliente e renegociasse o prazo
- **Decisão:** O analista de dados mandou mensagens por semanas, sem escalar.
- **Resultado:** Os dados chegaram tarde e o time teve que comprimir o trabalho no fim.
- **Lição:** Silêncio do cliente precisa de prazo: se não houver resposta em poucos dias, escale e renegocie.
- **Simulação:** conversa com: Dono do Mercadinho Boa Praça, atarefado e pouco familiarizado com dados

### C036 · O que eu faria diferente na primeira reunião
*Contado por: Analista de dados · conversa de despedida · P3*

- **Situação:** Na despedida, o analista de dados refletiu sobre o projeto do mercadinho e sobre o que poderia ter evitado o sumiço do cliente.
- **Dilema:** O que combinar logo na primeira reunião.
- **Decisão:** O analista de dados deixou como conselho combinar, logo no início, quem envia os dados, em que data e o que acontece se atrasar.
- **Resultado:** O conselho passou a fazer parte do briefing de projetos de dados.
- **Lição:** Combinados claros na primeira reunião evitam semanas de espera depois.

### C040 · Manter o cliente engajado quando ele some
*Contado por: Gerente de contas · conversa do squad · projeto B · P3*

- **Situação:** O squad do Mercadinho Boa Praça avisou o gerente de contas que o cliente não respondia havia duas semanas. Ele também estava com outros clientes em negociação.
- **Dilema:** Acionar o cliente de novo por mensagem ou ir pessoalmente ao mercado.
- **Opções na época:** (a) Mandar outra mensagem; (b) Ligar e marcar uma visita; (c) Deixar o squad resolver
- **Decisão:** O gerente de contas mandou mais uma mensagem e voltou às negociações.
- **Resultado:** O cliente só respondeu uma semana depois, e o atraso caiu sobre o squad.
- **Lição:** Quem cuida da relação com o cliente é quem precisa agir quando ele some. Uma visita resolve o que dez mensagens não resolvem.
- **Simulação:** escolha entre opções

### C051 · Os sinais de sobrecarga antes de virarem atraso
*Contado por: Analista de Gente e Gestão · conversa de fim de gestão · P4*

- **Situação:** A analista de Gente e Gestão percebeu que membros estavam faltando a ritos, demorando a responder e reclamando de cansaço. Eram as mesmas pessoas que estavam em vários projetos.
- **Dilema:** Levar o assunto à diretoria ou esperar a pesquisa de clima confirmar.
- **Opções na época:** (a) Esperar a pesquisa de clima; (b) Conversar com as pessoas e levar o mapa à diretoria
- **Decisão:** A analista de Gente e Gestão esperou a pesquisa de clima.
- **Resultado:** A pesquisa confirmou a sobrecarga, mas só depois de vários projetos atrasarem.
- **Lição:** Os sinais de sobrecarga aparecem antes dos números. Agir no sinal evita o atraso.
- **Simulação:** escolha entre opções

### C072 · A publicação na véspera da entrega
*Contado por: Pessoa desenvolvedora · conversa de fim de gestão · P4*

- **Situação:** A pessoa desenvolvedora estava em vários projetos e deixou a publicação do sistema para a véspera da entrega.
- **Dilema:** Publicar na véspera ou pedir mais um dia.
- **Decisão:** A pessoa desenvolvedora publicou na véspera.
- **Resultado:** O sistema do cliente ficou fora do ar por algumas horas.
- **Lição:** Publicação nunca deve ficar para a última hora, principalmente quando o time está sobrecarregado.

### C073 · Três projetos ao mesmo tempo
*Contado por: Gerente de software · conversa de despedida · P4*

- **Situação:** O gerente de software gerenciou três projetos simultâneos no auge do crescimento de 2024.
- **Dilema:** Pedir para sair de um projeto ou seguir com os três.
- **Decisão:** O gerente de software seguiu com os três.
- **Resultado:** Nenhum dos projetos teve a atenção que precisava.
- **Lição:** Gerenciar bem um projeto exige tempo. Três ao mesmo tempo dividem a atenção em partes pequenas demais.

### C074 · O cliente que sumiu depois de aprovar o protótipo
*Contado por: Gerente de software · conversa do squad · P3*

- **Situação:** Depois de aprovar o protótipo, o cliente parou de responder.
- **Dilema:** Seguir com o desenvolvimento ou esperar.
- **Decisão:** A gerente de software seguiu com o desenvolvimento.
- **Resultado:** Quando o cliente voltou, pediu mudanças que invalidaram parte do trabalho.
- **Lição:** Aprovação de protótipo não substitui acompanhamento. Combine validações ao longo do projeto.

### C095 · Vender dados sem saber quais dados existiam
*Contado por: Gerente de contas · conversa do squad · P2*

- **Situação:** O gerente de contas vendeu um projeto de dados sem verificar se o cliente tinha os dados necessários.
- **Dilema:** Verificar antes ou vender e ver depois.
- **Decisão:** O gerente de contas vendeu sem verificar.
- **Resultado:** O squad descobriu que metade dos dados não existia.
- **Lição:** Em projetos de dados, verificar os dados vem antes da proposta.

### C106 · Saídas no meio do semestre
*Contado por: Especialista de Gente e Gestão · conversa de despedida · P5*

- **Situação:** Membros saíram no meio do semestre e deixaram projetos sem dono.
- **Dilema:** Redistribuir rapidamente ou renegociar prazos.
- **Decisão:** A especialista de Gente e Gestão redistribuiu os projetos, mas sem registro do que cada um estava fazendo.
- **Resultado:** Os novos responsáveis levaram semanas para retomar.
- **Lição:** Toda saída precisa de uma passagem, mesmo no meio do semestre.

### C107 · A pesquisa de clima que mostrou sobrecarga
*Contado por: Analista de Gente e Gestão · conversa de fim de gestão · P4*

- **Situação:** A pesquisa de clima mostrou que boa parte dos membros se sentia sobrecarregada.
- **Dilema:** Divulgar o resultado ou tratar internamente.
- **Decisão:** A analista de Gente e Gestão divulgou o resultado e propôs ações com a diretoria.
- **Resultado:** A alocação passou a ser revista com mais frequência.
- **Lição:** Dado de clima só tem valor quando vira ação.

## Gestão 2025.1

Foi a gestão de organizar processos: os rituais de retrospectiva e a biblioteca de componentes de design ganharam força, e o projeto da Escola Aprender Mais virou referência de entrega no prazo. O desafio foram os sistemas que ninguém sabia manter depois que alguém saía.

### C003 · Retrospectiva não é reunião para culpar ninguém
*Contado por: CEO · conversa de fim de gestão · P4*

- **Situação:** Depois de um semestre de sobrecarga, a diretoria de 2025 decidiu reformular os rituais de retrospectiva dos squads. Nas primeiras tentativas, os encontros viraram uma lista de culpados.
- **Dilema:** Manter um formato rígido de retrospectiva ou abrir espaço para conversas mais livres.
- **Opções na época:** (a) Formato rígido, com perguntas fixas; (b) Conversa livre conduzida pelo gerente; (c) Formato curto conduzido por alguém de Gente e Gestão
- **Decisão:** O CEO e uma analista de Gente e Gestão criaram um formato curto, conduzido por alguém de fora do squad, focado em situações e não em pessoas.
- **Resultado:** As retrospectivas passaram a apontar problemas de alocação antes que virassem atrasos.
- **Lição:** Processos funcionam quando protegem as pessoas. Uma retrospectiva útil olha para situações, não para culpados.
- **Simulação:** escolha entre opções

### C010 · O sistema que só uma pessoa entendia
*Contado por: CTO · conversa de fim de gestão · P5*

- **Situação:** Um cliente pediu melhorias num sistema entregue um ano antes. A única pessoa que conhecia a arquitetura tinha saído do CITi e não havia documentação.
- **Dilema:** Reescrever partes do sistema ou investir tempo em entender o código existente.
- **Opções na época:** (a) Reescrever as partes afetadas; (b) Estudar o código e documentar antes de mudar; (c) Recusar as melhorias
- **Decisão:** A CTO separou duas semanas para estudar e documentar o sistema antes de qualquer mudança.
- **Resultado:** As melhorias foram feitas com segurança, e a documentação virou modelo para os projetos seguintes.
- **Lição:** Código sem documentação é conhecimento que sai junto com quem o escreveu.
- **Simulação:** escolha entre opções

### C014 · A funcionalidade que o time não sabia que existia
*Contado por: Gerente de contas · conversa do squad · P2*

- **Situação:** Para fechar um contrato com uma academia, o gerente de contas prometeu integração com o aplicativo de pagamentos que o cliente já usava. A promessa não entrou na passada de bastão.
- **Dilema:** Admitir a falha ao time e ao cliente ou tentar encaixar a integração sem renegociar.
- **Opções na época:** (a) Pedir ao time que encaixe a integração; (b) Renegociar prazo e escopo com o cliente; (c) Retirar a promessa
- **Decisão:** O gerente de contas reuniu o time, explicou a promessa e renegociou duas semanas a mais com o cliente.
- **Resultado:** A integração foi entregue e o cliente valorizou a transparência. O gerente de contas passou a revisar a passada de bastão com o gerente do projeto.
- **Lição:** Tudo o que foi prometido precisa estar na passada de bastão, principalmente o que parece pequeno na hora da venda.
- **Simulação:** conversa com: Dono de uma academia, animado com o projeto e com pressa

### C019 · O sistema que só eu sabia mexer
*Contado por: Pessoa desenvolvedora · conversa de despedida · P5*

- **Situação:** Na conversa de despedida, a pessoa desenvolvedora percebeu que era a única pessoa que entendia o sistema de agendamento de um cliente. Ela resolvia tudo sozinha e nunca tinha documentado as decisões.
- **Dilema:** Usar as últimas semanas para documentar ou para terminar as entregas pendentes.
- **Decisão:** A pessoa desenvolvedora terminou as entregas e deixou só um resumo curto do sistema.
- **Resultado:** Meses depois, um pedido de melhoria do cliente levou semanas para ser atendido, porque o time precisou entender o código do zero.
- **Lição:** Quem resolve tudo sozinho cria um ponto único de falha. Documentar enquanto trabalha custa menos do que documentar na saída.

### C020 · O projeto que deu certo do começo ao fim, visto pelo dev
*Contado por: Pessoa desenvolvedora · conversa do squad · projeto C · P6*

- **Situação:** No projeto da Escola Aprender Mais, a pessoa desenvolvedora começou a programar só depois de duas semanas de descoberta. Toda sexta, mostrava à diretora o que tinha sido feito.
- **Dilema:** Começar a programar logo ou esperar a descoberta terminar.
- **Opções na época:** (a) Começar a programar em paralelo à descoberta; (b) Esperar a descoberta e programar com tudo definido; (c) Programar só um protótipo enquanto a descoberta acontece
- **Decisão:** A pessoa desenvolvedora esperou a descoberta e aproveitou o tempo para preparar a estrutura técnica do projeto.
- **Resultado:** Quase nada precisou ser refeito, e o projeto foi entregue no prazo.
- **Lição:** Esperar a descoberta não é perder tempo. Programar o que já foi validado é o jeito mais rápido de entregar.
- **Simulação:** escolha entre opções

### C026 · O projeto que deu certo do começo ao fim
*Contado por: Gerente de produto · conversa de despedida · projeto C · P6*

- **Situação:** Depois do projeto A, a gerente de produto propôs um formato diferente: duas semanas de descoberta com a secretaria da escola, os pais e a direção, e uma reunião curta toda sexta com o cliente para validar o que foi feito.
- **Dilema:** Convencer a gestão de que duas semanas sem código valiam a pena.
- **Decisão:** A descoberta completa, com a passada de bastão da gerente de contas já incluindo as entrevistas.
- **Resultado:** Entrega no prazo, sem mudanças grandes de escopo, e o cliente indicou o CITi para outra escola.
- **Lição:** Descoberta bem feita e cliente envolvido toda semana são o caminho mais curto até a entrega.
- **Simulação:** conversa com: Diretora da Escola Aprender Mais, cuidadosa e cheia de perguntas

### C027 · Desenhar com a escola, e não para a escola
*Contado por: Designer de produto · conversa do squad · projeto C · P6*

- **Situação:** O designer de produto levou os primeiros esboços da plataforma de matrículas para a secretaria da escola antes de qualquer tela final.
- **Dilema:** Mostrar esboços simples ou esperar ter telas bonitas para impressionar.
- **Opções na época:** (a) Mostrar esboços simples; (b) Esperar telas finais
- **Decisão:** O designer de produto mostrou esboços em papel e ajustou na hora com a secretária.
- **Resultado:** O fluxo de matrícula ficou com metade dos passos previstos, e quase nada mudou depois.
- **Lição:** Esboço simples na frente do usuário vale mais do que tela bonita na gaveta.
- **Simulação:** escolha entre opções

### C031 · Ampliar a biblioteca de componentes
*Contado por: Líder de design · conversa de fim de gestão*

- **Situação:** Cada projeto recomeçava botões, formulários e telas do zero. A biblioteca de componentes existente estava incompleta.
- **Dilema:** Investir tempo da subárea na biblioteca ou focar só nos projetos.
- **Decisão:** O líder de design reservou algumas horas por semana de cada designer para ampliar a biblioteca.
- **Resultado:** Os projetos seguintes começaram mais rápido e com mais consistência visual.
- **Lição:** Tempo investido no que se repete em todo projeto volta multiplicado.

### C041 · A passada de bastão que fez o projeto começar com o pé direito
*Contado por: Gerente de contas · conversa do squad · projeto C · P6*

- **Situação:** Ao fechar o contrato com a Escola Aprender Mais, a gerente de contas organizou a passada de bastão com tudo o que foi prometido e levou a diretora da escola para conhecer o squad.
- **Dilema:** Investir tempo numa passada de bastão completa ou seguir para o próximo cliente.
- **Opções na época:** (a) Passada rápida e seguir em frente; (b) Documento completo e reunião com o cliente presente
- **Decisão:** Documento completo e reunião com a diretora presente.
- **Resultado:** O squad começou sabendo exatamente o que foi combinado, e não houve surpresas de escopo.
- **Lição:** Uma hora a mais na passada de bastão economiza semanas de retrabalho.
- **Simulação:** escolha entre opções

### C047 · Muitos contatos, poucos clientes no perfil
*Contado por: Analista de marketing · conversa de fim de gestão*

- **Situação:** Uma campanha de a analista de marketing gerou muitos contatos, mas a maioria eram empresas fora do perfil do CITi.
- **Dilema:** Medir a campanha pelo número de contatos ou pela qualidade deles.
- **Decisão:** A analista de marketing revisou a campanha junto com o comercial para focar no perfil ideal de cliente.
- **Resultado:** A campanha seguinte gerou menos contatos, mas o dobro de reuniões de venda.
- **Lição:** Marketing bom traz os clientes certos, não os mais numerosos.

### C052 · Reformular as retrospectivas com o CEO
*Contado por: Especialista de Gente e Gestão · conversa de despedida*

- **Situação:** Uma especialista de Gente e Gestão ajudou o CEO a reformular as retrospectivas dos squads, depois de tentativas que viraram listas de culpados.
- **Dilema:** Quem deveria conduzir as retrospectivas.
- **Decisão:** As retrospectivas passaram a ser conduzidas por alguém de Gente e Gestão, de fora do squad.
- **Resultado:** Os squads passaram a falar com mais abertura sobre os problemas.
- **Lição:** Uma pessoa de fora ajuda o squad a falar de situações, e não de culpados.

### C065 · Ninguém em três projetos ao mesmo tempo
*Contado por: COO · conversa de fim de gestão · P4*

- **Situação:** A COO encontrou membros alocados em três projetos simultâneos.
- **Dilema:** Reduzir a alocação no meio do semestre ou esperar a próxima gestão.
- **Decisão:** A COO redistribuiu pessoas e limitou a dois projetos por membro.
- **Resultado:** Os atrasos diminuíram nas semanas seguintes.
- **Lição:** O limite de projetos por pessoa precisa ser regra, não exceção.

### C075 · Herdar um código sem documentação
*Contado por: Pessoa desenvolvedora · conversa de fim de gestão · P5*

- **Situação:** A pessoa desenvolvedora herdou um sistema de quem já tinha saído, sem nenhuma documentação.
- **Dilema:** Reescrever ou entender o código existente.
- **Decisão:** A pessoa desenvolvedora estudou o código e documentou enquanto entendia.
- **Resultado:** As próximas manutenções ficaram muito mais rápidas.
- **Lição:** Quem herda código sem documentação pode quebrar o ciclo documentando para o próximo.

### C080 · Entrevistas que mudaram o escopo para melhor
*Contado por: Analista de produto · conversa do squad · P6*

- **Situação:** A analista de produto entrevistou usuários antes de definir o escopo.
- **Dilema:** Seguir o escopo do contrato ou ajustar com o que ouviu.
- **Decisão:** A analista de produto propôs ajustes ao cliente com base nas entrevistas.
- **Resultado:** O produto ficou mais simples e mais útil.
- **Lição:** Ouvir os usuários cedo muda o escopo para melhor, não para maior.

### C088 · Revisar o padrão de entrega de relatórios
*Contado por: Líder de dados · conversa de despedida*

- **Situação:** Cada analista entregava relatórios num formato diferente.
- **Dilema:** Padronizar ou deixar livre.
- **Decisão:** A líder de dados revisou e padronizou o formato de entrega.
- **Resultado:** Os clientes passaram a entender os relatórios com mais facilidade.
- **Lição:** Padrão de entrega é parte da qualidade do trabalho.

### C089 · Três projetos de dados ao mesmo tempo
*Contado por: Analista de dados · conversa de fim de gestão · P4*

- **Situação:** O analista de dados estava em três projetos de dados ao mesmo tempo.
- **Dilema:** Pedir ajuda ou seguir sozinho.
- **Decisão:** O analista de dados seguiu sozinho.
- **Resultado:** Dois projetos atrasaram.
- **Lição:** Pedir ajuda cedo é sinal de responsabilidade, não de fraqueza.

### C096 · A proposta que prometia prazo antes de o time estimar
*Contado por: Gerente de contas · conversa do squad · P2*

- **Situação:** O gerente de contas enviou uma proposta com prazo antes de o time técnico estimar.
- **Dilema:** Esperar a estimativa ou enviar logo.
- **Decisão:** O gerente de contas enviou logo.
- **Resultado:** O prazo era curto demais, e o projeto atrasou.
- **Lição:** Prazo na proposta precisa vir de quem vai fazer o trabalho.

### C102 · O calendário de eventos que ninguém atualizava
*Contado por: Analista de marketing · conversa de fim de gestão · P5*

- **Situação:** O calendário de eventos de Marketing estava desatualizado e só a analista de marketing sabia o que estava valendo.
- **Dilema:** Atualizar sozinha ou envolver o time.
- **Decisão:** A analista de marketing atualizou e definiu um responsável por semana.
- **Resultado:** O calendário passou a ser confiável.
- **Lição:** Informação que só uma pessoa atualiza vira informação que ninguém confia.

## Gestão 2025.2

Os projetos de dados ganharam espaço e o checklist de passada de bastão foi reforçado. Os desafios foram clientes que pediam "só mais um gráfico" toda semana e acessos e materiais que se perdiam na troca de gestão.

### C004 · Quando o cliente para de responder
*Contado por: CEO · conversa de despedida · P3*

- **Situação:** Um projeto de dados para uma rede de academias ficou três semanas parado porque o cliente não enviava os dados nem respondia mensagens. O squad cogitou cancelar o projeto.
- **Dilema:** Cancelar o contrato, esperar ou escalar o contato.
- **Opções na época:** (a) Esperar o cliente responder; (b) Cancelar o projeto; (c) A diretoria entrar em contato com quem decide no cliente
- **Decisão:** O CEO ligou diretamente para o sócio da rede, que nem sabia que o projeto estava parado.
- **Resultado:** Os dados chegaram em uma semana e o projeto foi concluído com um novo prazo combinado.
- **Lição:** Quando o cliente some, quase sempre há alguém acima que não sabe disso. Descubra cedo quem realmente decide.
- **Simulação:** conversa com: Sócio de uma rede de academias, ocupado e surpreso ao saber do atraso

### C011 · Padronizar a passagem de projetos entre squads
*Contado por: CTO · conversa de despedida · P2*

- **Situação:** Quando um projeto mudava de squad, cada time fazia a passagem do seu jeito. Informações importantes, como acessos e combinados com o cliente, se perdiam.
- **Dilema:** Criar um processo obrigatório ou confiar no bom senso de cada time.
- **Decisão:** A CTO criou um roteiro curto de passagem, com acessos, decisões técnicas e combinados com o cliente.
- **Resultado:** As passagens ficaram mais rápidas e as dúvidas do time que recebia o projeto caíram bastante.
- **Lição:** Uma passagem bem feita cabe em um roteiro curto. O difícil é garantir que ele seja usado.

### C022 · Uma entrega atrasada por mudanças que ninguém registrou
*Contado por: Pessoa desenvolvedora · conversa do squad · projeto D · P1*

- **Situação:** No dashboard da Distribuidora Litoral, o gerente de operações do cliente começou a pedir mudanças direto para a pessoa desenvolvedora, por mensagem. Ela atendia sem avisar o restante do squad.
- **Dilema:** Atender o cliente rapidamente ou encaminhar cada pedido para quem cuida do escopo.
- **Opções na época:** (a) Atender direto para agradar o cliente; (b) Encaminhar todo pedido à gerente de contas; (c) Atender e registrar num documento compartilhado
- **Decisão:** A pessoa desenvolvedora atendia direto, sem registrar.
- **Resultado:** A entrega atrasou e ninguém conseguia explicar ao cliente de onde vinha o atraso.
- **Lição:** Pedido do cliente que não passa por quem cuida do escopo vira atraso invisível.
- **Simulação:** escolha entre opções

### C023 · O que eu queria ter sabido quando virei membro
*Contado por: Pessoa desenvolvedora · conversa de fim de gestão*

- **Situação:** Ao fim da primeira gestão como membro, a pessoa desenvolvedora listou o que mais sentiu falta: saber a quem perguntar, como funciona uma passada de bastão e que pedir ajuda cedo é normal.
- **Dilema:** Guardar essas percepções para si ou deixá-las para a próxima turma.
- **Decisão:** A pessoa desenvolvedora registrou as percepções na conversa de fim de gestão.
- **Resultado:** Os pontos dela passaram a fazer parte da trilha de quem acaba de virar New Pig em Desenvolvimento.
- **Lição:** Quem acabou de chegar é quem melhor sabe o que falta para quem vai chegar depois.

### C032 · O conselho para quem vai liderar Design
*Contado por: Líder de design · conversa de despedida*

- **Situação:** Na despedida, o líder de design refletiu sobre o que mais importou na liderança de Design.
- **Dilema:** O que priorizar: a qualidade das entregas ou o desenvolvimento das pessoas.
- **Decisão:** O líder de design deixou como conselho dedicar tempo fixo para revisar o trabalho dos designers junto com eles.
- **Resultado:** O conselho entrou no kit do sucessor de quem assume a liderança de Design.
- **Lição:** A qualidade das entregas vem da qualidade das pessoas. Revisar junto ensina mais do que corrigir sozinho.

### C033 · O cliente que pedia só mais um gráfico
*Contado por: Analista de dados · conversa do squad · projeto D · P1*

- **Situação:** No dashboard da Distribuidora Litoral, o cliente pedia um gráfico novo toda semana. Cada pedido parecia pequeno, mas exigia novos tratamentos de dados.
- **Dilema:** Atender cada pedido ou entender qual pergunta o cliente queria responder.
- **Opções na época:** (a) Atender cada pedido; (b) Pausar e perguntar qual decisão o cliente queria tomar; (c) Recusar novos gráficos
- **Decisão:** A analista de dados atendeu os pedidos por semanas até propor uma conversa sobre as decisões do cliente.
- **Resultado:** Na conversa, ficou claro que três indicadores respondiam a quase tudo. O painel foi simplificado, mas o prazo já estava estourado.
- **Lição:** Por trás de cada novo gráfico há uma pergunta. Entender a pergunta cedo evita painéis que crescem sem fim.
- **Simulação:** conversa com: Gerente de operações da Distribuidora Litoral, sempre com um pedido novo

### C042 · Quando o cliente começou a pedir direto ao time
*Contado por: Gerente de contas · conversa do squad · projeto D · P1*

- **Situação:** No projeto da Distribuidora Litoral, o cliente começou a pedir mudanças por mensagem direto aos membros do squad, sem passar por a gerente de contas.
- **Dilema:** Proibir o contato direto ou criar um canal organizado para os pedidos.
- **Opções na época:** (a) Proibir o contato direto; (b) Criar um canal único de pedidos com registro; (c) Deixar como estava
- **Decisão:** A gerente de contas percebeu tarde e criou um canal único de pedidos já perto do prazo.
- **Resultado:** O canal organizou o fim do projeto, mas o atraso causado pelos pedidos anteriores já tinha acontecido.
- **Lição:** Combine logo no início por onde os pedidos do cliente devem chegar.
- **Simulação:** escolha entre opções

### C048 · O calendário de conteúdo que se perdia a cada gestão
*Contado por: Analista de marketing · conversa de despedida · P5*

- **Situação:** A cada troca de gestão, o calendário de conteúdo e as lições sobre o que funcionava nas redes sociais recomeçavam do zero.
- **Dilema:** Deixar o calendário para a próxima pessoa ou registrar também o que aprendeu.
- **Decisão:** Na despedida, a analista de marketing registrou o calendário e os aprendizados sobre cada tipo de conteúdo.
- **Resultado:** Quem assumiu pôde começar a partir do que já funcionava.
- **Lição:** Um calendário sem os aprendizados por trás dele é só uma lista de datas.

### C066 · Reforçar o checklist de passada de bastão
*Contado por: CRO · conversa de despedida · P2*

- **Situação:** Dois projetos seguidos tiveram problemas porque combinados com o cliente não chegaram ao time.
- **Dilema:** Confiar na memória de cada gerente de contas ou exigir um checklist.
- **Decisão:** O CRO reforçou o checklist de passada de bastão e tornou o uso obrigatório.
- **Resultado:** As passadas de bastão ficaram mais completas.
- **Lição:** O que é prometido na venda precisa estar escrito antes do projeto começar.

### C076 · Gerenciar dois squads ao mesmo tempo
*Contado por: Gerente de software · conversa de fim de gestão · P4*

- **Situação:** A gerente de software passou a gerenciar dois squads por falta de gerentes.
- **Dilema:** Aceitar ou pedir apoio.
- **Decisão:** A gerente de software aceitou e organizou rituais em dias alternados.
- **Resultado:** Funcionou por um tempo, mas um dos squads sentiu falta de acompanhamento.
- **Lição:** Acúmulo de gestão é solução temporária, não modelo.

### C081 · Critérios de aceite escritos com o cliente
*Contado por: Gerente de produto · conversa do squad · P6*

- **Situação:** O gerente de produto escreveu os critérios de aceite junto com o cliente, antes do desenvolvimento.
- **Dilema:** Escrever sozinho ou com o cliente.
- **Decisão:** O gerente de produto escreveu com o cliente.
- **Resultado:** Na entrega, não houve discussão sobre o que estava pronto.
- **Lição:** Combinar o que é pronto antes de começar evita discussões no fim.

### C090 · O painel que o cliente nunca usou
*Contado por: Analista de dados · conversa do squad · P3*

- **Situação:** O cliente sumiu durante o projeto e não participou das validações.
- **Dilema:** Entregar mesmo assim ou insistir no envolvimento.
- **Decisão:** O analista de dados entregou mesmo assim.
- **Resultado:** O painel nunca foi usado.
- **Lição:** Painel sem participação do cliente vira painel sem uso.

### C091 · O painel que virou previsão
*Contado por: Gerente de dados · conversa do squad · P1*

- **Situação:** O cliente pediu um painel e, no meio do projeto, percebeu que queria uma previsão.
- **Dilema:** Seguir com o painel ou mudar o projeto.
- **Decisão:** O gerente de dados renegociou o escopo com o cliente.
- **Resultado:** O projeto mudou, com novo prazo combinado.
- **Lição:** Quando o pedido muda de natureza, o escopo precisa ser renegociado, não absorvido.

### C097 · O cliente que só respondia por áudio
*Contado por: Gerente de contas · conversa do squad · P3*

- **Situação:** O cliente só respondia por áudio e sumia por semanas.
- **Dilema:** Adaptar-se ao jeito do cliente ou combinar um formato.
- **Decisão:** A gerente de contas combinou uma reunião fixa a cada quinze dias.
- **Resultado:** O cliente passou a participar mais e as decisões foram registradas.
- **Lição:** Combine um ritmo de contato que funcione para o cliente e para o time.

### C103 · Perder o acesso às redes na troca de gestão
*Contado por: Analista de marketing · conversa de despedida · P5*

- **Situação:** Na troca de gestão, ninguém sabia as senhas de algumas redes sociais.
- **Dilema:** Recuperar os acessos ou criar novas contas.
- **Decisão:** O analista de marketing recuperou os acessos e registrou os responsáveis por cada um.
- **Resultado:** As trocas seguintes não perderam acessos.
- **Lição:** Acessos precisam de dono e de registro, principalmente na troca de gestão.

### C108 · A planilha financeira que só uma pessoa entendia
*Contado por: Analista de Gente e Gestão · conversa de despedida · P5*

- **Situação:** Só o analista de Gente e Gestão entendia a planilha financeira da gestão.
- **Dilema:** Simplificar a planilha ou explicar a outra pessoa.
- **Decisão:** O analista de Gente e Gestão simplificou a planilha e treinou quem assumiria.
- **Resultado:** A transição financeira aconteceu sem problemas.
- **Lição:** Ferramenta que só uma pessoa entende é risco para a empresa.

## Gestão 2026.1

A gestão entregou o assistente com IA da Ótica Visão Clara e começou as conversas sobre a reorganização das áreas.

### C012 · Ninguém em três projetos ao mesmo tempo
*Contado por: COO · conversa de fim de gestão · P4*

- **Situação:** A COO percebeu que a alocação de pessoas era decidida por cada gerente, sem visão do todo. Alguns membros estavam em três projetos, outros em nenhum.
- **Dilema:** Centralizar a alocação em Gente e Gestão ou manter a autonomia dos gerentes.
- **Opções na época:** (a) Centralizar a alocação; (b) Manter a autonomia dos gerentes; (c) Criar um painel de alocação compartilhado
- **Decisão:** A COO criou um painel de alocação compartilhado, revisado a cada duas semanas com os gerentes.
- **Resultado:** A distribuição ficou mais equilibrada e os gerentes passaram a negociar pessoas entre si com dados.
- **Lição:** Visibilidade resolve mais do que controle. Quando todos veem a alocação, o equilíbrio vem mais fácil.
- **Simulação:** escolha entre opções

### C021 · Gerenciar um projeto com IA para um cliente
*Contado por: Gerente de software · conversa do squad · projeto E · P2, P6*

- **Situação:** A Ótica Visão Clara contratou um assistente com IA para atendimento. Na passada de bastão, ficou claro que nem o cliente sabia exatamente o que o assistente deveria responder.
- **Dilema:** Começar a construir com o que havia ou voltar ao cliente para definir melhor o escopo.
- **Opções na época:** (a) Construir uma primeira versão e ajustar depois; (b) Fazer uma rodada de descoberta com as atendentes; (c) Pedir ao comercial que fechasse o escopo
- **Decisão:** O gerente de software propôs uma semana de conversa com as atendentes da ótica e uma validação semanal com a dona.
- **Resultado:** O assistente foi treinado com as dúvidas reais dos clientes da ótica e entrou em uso no prazo.
- **Lição:** Quando o cliente não sabe o que quer, ouvir quem faz o trabalho no dia a dia define o escopo melhor do que qualquer reunião.
- **Simulação:** conversa com: Dona da Ótica Visão Clara, entusiasmada com IA mas sem clareza do que precisa

### C024 · Integrar a IA com o cliente acompanhando toda semana
*Contado por: Pessoa desenvolvedora · conversa do squad · projeto E · P6*

- **Situação:** No assistente da Ótica Visão Clara, a pessoa desenvolvedora mostrava toda semana à dona da ótica como o assistente respondia às perguntas reais dos clientes.
- **Dilema:** Mostrar versões incompletas ou esperar o assistente estar pronto.
- **Decisão:** A pessoa desenvolvedora mostrou as versões incompletas, explicando o que ainda faltava.
- **Resultado:** A dona da ótica corrigiu respostas cedo, e o assistente chegou à versão final sem surpresas.
- **Lição:** Mostrar cedo, mesmo incompleto, evita surpresas no fim.

### C028 · A identidade visual que só eu sabia atualizar
*Contado por: Designer de produto · conversa de despedida · projeto F · P5*

- **Situação:** O designer de produto criou toda a identidade visual da loja virtual do Ateliê Maré, mas os arquivos estavam só no computador dele, sem guia de uso.
- **Dilema:** Organizar e compartilhar os arquivos antes de sair ou deixar para quem assumir pedir depois.
- **Decisão:** O designer de produto deixou um link para a pasta, sem organizar nem explicar.
- **Resultado:** Quem assumiu não conseguiu atualizar a loja sem quebrar o padrão visual, e o projeto perdeu ritmo.
- **Lição:** Material de design só é legado quando outra pessoa consegue usar sem precisar de quem o criou.

### C034 · Como os projetos de dados mudaram com a IA
*Contado por: Gerente de dados · conversa de fim de gestão*

- **Situação:** Com o uso de IA, tarefas de limpeza e análise de dados ficaram muito mais rápidas.
- **Dilema:** Usar o tempo ganho para fazer mais projetos ou para aprofundar as análises.
- **Decisão:** A gerente de dados orientou o time a usar o tempo ganho para entender melhor as perguntas dos clientes.
- **Resultado:** As entregas ficaram mais estratégicas e os clientes passaram a pedir análises, não só painéis.
- **Lição:** A IA acelera o trabalho, mas o valor continua em fazer as perguntas certas.

### C038 · Boas práticas que sobrevivem às trocas de gestão
*Contado por: Líder de dados · conversa de fim de gestão · P5*

- **Situação:** A líder de dados percebeu que cada analista guardava as próprias consultas e scripts, e que tudo se perdia quando alguém saía.
- **Dilema:** Criar um repositório comum ou deixar cada um com seu jeito.
- **Decisão:** A líder de dados criou um repositório comum de consultas e um padrão simples de documentação.
- **Resultado:** Novos analistas passaram a começar a partir do trabalho de quem veio antes.
- **Lição:** Conhecimento que fica no computador de cada um vai embora com ele.

### C045 · Vender um projeto com IA quando nem o cliente sabia o que queria
*Contado por: Gerente de contas · conversa do squad · projeto E · P2*

- **Situação:** A dona da Ótica Visão a gerente de contas queria um assistente com IA, mas não sabia dizer o que ele deveria fazer. Ela fechou o contrato com um escopo amplo.
- **Dilema:** Fechar logo com escopo amplo ou detalhar mais antes de assinar.
- **Opções na época:** (a) Fechar com escopo amplo; (b) Fazer uma reunião de descoberta antes de fechar; (c) Fechar uma primeira fase pequena
- **Decisão:** A gerente de contas fechou com escopo amplo e deixou a definição para o squad.
- **Resultado:** O squad precisou de uma semana extra de descoberta. A partir daí, a gerente de contas passou a incluir uma etapa de descoberta nos contratos com IA.
- **Lição:** Em projetos com IA, o escopo precisa de descoberta antes da assinatura, não depois.
- **Simulação:** conversa com: Dona da Ótica Visão Clara, empolgada com IA e sem clareza do que precisa

### C046 · O que eu aprendi nos primeiros clientes
*Contado por: Gerente de contas · conversa de fim de gestão*

- **Situação:** No fim da gestão, a gerente de contas refletiu sobre as primeiras negociações como gerente de contas.
- **Dilema:** Falar de tecnologia ou de problema nas reuniões de venda.
- **Decisão:** A gerente de contas passou a abrir as reuniões perguntando sobre o problema do cliente, e só depois falando de tecnologia.
- **Resultado:** As propostas ficaram mais precisas e os contratos, mais fáceis de entregar.
- **Lição:** O cliente compra a solução para o problema dele, não a tecnologia.

### C055 · Participar do planejamento financeiro
*Contado por: Analista de Gente e Gestão · conversa de fim de gestão*

- **Situação:** A analista de Gente e Gestão participou do planejamento financeiro da gestão e percebeu que as projeções dependiam de informações espalhadas em várias planilhas.
- **Dilema:** Seguir com as planilhas ou organizar uma base única.
- **Decisão:** A analista de Gente e Gestão organizou uma base única com as receitas e despesas da gestão.
- **Resultado:** As projeções ficaram mais confiáveis e mais fáceis de explicar à diretoria.
- **Lição:** Informação financeira espalhada é informação que ninguém confia.

### C083 · Quem realmente decidia no cliente
*Contado por: Analista de produto · conversa do squad · P2*

- **Situação:** Só na terceira reunião o analista de produto descobriu quem tomava as decisões no cliente.
- **Dilema:** Seguir com o contato inicial ou incluir quem decide.
- **Decisão:** O analista de produto pediu para incluir quem decide nas reuniões.
- **Resultado:** As decisões passaram a ser tomadas mais rápido.
- **Lição:** Descubra cedo quem decide. Essa informação deveria vir na passada de bastão.

### C092 · Documentar as consultas para quem vier depois
*Contado por: Analista de dados · conversa de fim de gestão · P5*

- **Situação:** A analista de dados percebeu que suas consultas de dados não estavam registradas em lugar nenhum.
- **Dilema:** Seguir assim ou documentar.
- **Decisão:** A analista de dados documentou as consultas no repositório comum.
- **Resultado:** Novos analistas passaram a reaproveitar o trabalho dela.
- **Lição:** Cada consulta documentada é uma hora economizada para quem vem depois.

### C098 · Gravar a passada de bastão
*Contado por: Gerente de contas · conversa do squad · P2*

- **Situação:** A gerente de contas passou a gravar a reunião de passada de bastão para o time ouvir depois.
- **Dilema:** Reunião ao vivo apenas ou gravada.
- **Decisão:** A gerente de contas gravou e compartilhou com o squad.
- **Resultado:** Membros que entraram depois no projeto conseguiram entender o contexto.
- **Lição:** Uma passada de bastão gravada continua útil para quem chega depois.

### C104 · Divulgar os projetos de IA do CITi
*Contado por: Analista de marketing · conversa de fim de gestão*

- **Situação:** A analista de marketing precisava divulgar os projetos com IA do CITi.
- **Dilema:** Falar de tecnologia ou de resultado.
- **Decisão:** A analista de marketing focou nos resultados para os clientes.
- **Resultado:** Os conteúdos geraram interesse de novas empresas.
- **Lição:** Resultado convence mais do que tecnologia.

### C109 · Mapear quem estava em mais de um projeto
*Contado por: Especialista de Gente e Gestão · conversa de fim de gestão · P4*

- **Situação:** O especialista de Gente e Gestão mapeou a alocação de todos os membros.
- **Dilema:** Mostrar o mapa só à diretoria ou a todos.
- **Decisão:** O especialista de Gente e Gestão compartilhou o mapa com todos os gerentes.
- **Resultado:** Os gerentes passaram a negociar pessoas entre si.
- **Lição:** Quando todos veem a alocação, a sobrecarga é percebida mais cedo.

## Gestão 2026.2

O time de Inovação voltou e liderou a maior implementação de IA do CITi, com ferramentas para a empresa inteira e para subáreas específicas, além da venda de um produto pronto para clientes. Foi também a gestão que planejou em detalhes a reorganização das áreas, enquanto um projeto perdia ritmo depois da saída de uma pessoa-chave (Ateliê Maré). A gestão está terminando: parte das conversas de fim de gestão e de despedida ainda não foi feita.

### C006 · Abrir espaço para a volta da Inovação
*Contado por: CEO · conversa de fim de gestão*

- **Situação:** Com a volta do time de Inovação, todas as áreas queriam ferramentas de IA ao mesmo tempo, enquanto os projetos de clientes continuavam em andamento.
- **Dilema:** Como dar prioridade à implementação de IA sem tirar foco dos clientes.
- **Decisão:** A diretoria definiu que a Inovação teria autonomia para escolher a ordem das ferramentas e que cada área indicaria uma pessoa de contato.
- **Resultado:** A implementação avançou sem interromper projetos, e cada área recebeu ferramentas pensadas para a sua rotina.
- **Lição:** Dar autonomia a um time especializado e um ponto de contato em cada área acelera mudanças grandes.

### C007 · A passagem para a próxima CEO
*Contado por: CEO · conversa de despedida · P5*

- **Situação:** A CEO planejou a fusão das áreas durante todo o semestre, mas muitas decisões estavam só na cabeça dela e de poucos diretores. Ela sairia antes de a fusão acontecer.
- **Dilema:** Como entregar para a próxima CEO não só o plano, mas os porquês de cada decisão.
- **Decisão:** A CEO fez a conversa de despedida no LegaCITi e registrou um caso para cada decisão importante da fusão, com o que foi considerado e descartado.
- **Resultado:** A nova CEO começou 2027.1 com o kit do sucessor de CEO, que reúne o legado de todos os CEOs anteriores e as decisões da fusão.
- **Lição:** Numa passagem de gestão, o plano é a parte fácil de transmitir. O que se perde são os porquês.

### C029 · Assumir um projeto sem nada documentado
*Contado por: Gerente de produto · conversa do squad · projeto F · P5*

- **Situação:** A gerente de produto assumiu a loja virtual do Ateliê Maré depois da saída do designer. Não havia guia visual nem registro das decisões tomadas com a cliente.
- **Dilema:** Reconstruir o que faltava ou pedir à cliente que repetisse tudo.
- **Opções na época:** (a) Reconstruir sozinha a partir da loja; (b) Marcar uma reunião para a cliente repetir as decisões; (c) Combinar as duas coisas e registrar tudo
- **Decisão:** A gerente de produto estudou a loja, montou um guia visual e validou com a cliente em uma reunião.
- **Resultado:** O projeto voltou a andar, mas com duas semanas de atraso e uma cliente um pouco desconfiada.
- **Lição:** Assumir um projeto sem registro custa tempo e confiança. O guia que faltou agora existe para quem vier depois.
- **Simulação:** conversa com: Dona do Ateliê Maré, preocupada com a demora

### C030 · Os primeiros meses como gerente de produto
*Contado por: Gerente de produto · conversa de fim de gestão*

- **Situação:** Ao virar gerente de produto, a gerente de produto passou a cuidar de pessoas e prazos, e não só de entregas.
- **Dilema:** Continuar fazendo o trabalho de analista ou confiar mais no time.
- **Decisão:** A gerente de produto passou a delegar as entrevistas e a focar na organização do squad e na relação com o cliente.
- **Resultado:** O squad ganhou autonomia e as entregas ficaram mais previsíveis.
- **Lição:** Virar gerente é trocar o fazer pelo fazer acontecer.

### C037 · Preparar Dados para a fusão em Tech
*Contado por: Líder de dados · conversa de fim de gestão*

- **Situação:** A líder de dados sabia que a subárea seria unida a Dev em 2027.1.
- **Dilema:** Como garantir que as práticas de Dados não se perdessem na fusão.
- **Decisão:** A líder de dados registrou as práticas, os modelos de entrega e as lições da subárea antes da fusão.
- **Resultado:** O material serviu de base para o CTO da nova área de Tech.
- **Lição:** Antes de uma fusão, registre o que cada parte faz bem. É isso que se perde primeiro.

### C043 · Explicar ao cliente por que a loja parou de evoluir
*Contado por: Gerente de contas · conversa do squad · projeto F · P5*

- **Situação:** A dona do Ateliê Maré ligou para o gerente de contas reclamando que a loja virtual não recebia atualizações havia semanas, desde a saída do designer.
- **Dilema:** Explicar a situação com transparência ou prometer uma solução rápida.
- **Opções na época:** (a) Prometer atualizações na semana seguinte; (b) Explicar a transição e apresentar um novo plano com prazo realista
- **Decisão:** O gerente de contas explicou a transição e apresentou o plano da nova gerente de produto, com um prazo realista.
- **Resultado:** A cliente ficou insatisfeita no início, mas renovou o contrato depois de ver o plano cumprido.
- **Lição:** Transparência sobre um problema interno preserva mais a relação do que uma promessa que não se cumpre.
- **Simulação:** conversa com: Dona do Ateliê Maré, chateada com a demora

### C049 · Comunicar a volta da Inovação ao mercado
*Contado por: Analista de marketing · conversa de fim de gestão*

- **Situação:** Com a volta do time de Inovação e a implementação de IA no CITi, o analista de marketing precisava comunicar isso ao mercado.
- **Dilema:** Falar de IA de forma genérica ou mostrar resultados concretos.
- **Decisão:** O analista de marketing construiu a comunicação a partir de exemplos reais das ferramentas criadas pela Inovação.
- **Resultado:** Os conteúdos geraram contatos de empresas interessadas em soluções com IA.
- **Lição:** Resultados concretos comunicam mais do que promessas sobre tecnologia.

### C057 · Por onde começar a maior implementação de IA do CITi
*Contado por: Time de Inovação · conversa de fim de gestão*

- **Situação:** O time de Inovação voltou com a missão de levar IA para o dia a dia do CITi. Logo nas primeiras semanas, todas as áreas tinham pedidos de ferramentas.
- **Dilema:** Por onde começar, se cada área queria a sua ferramenta e o time só libera o que está impecável.
- **Opções na época:** (a) Atender os pedidos por ordem de chegada; (b) Começar pelas ferramentas que serviriam ao CITi inteiro; (c) Começar pelos processos que mais consumiam tempo em cada subárea
- **Decisão:** O time mapeou os processos que mais consumiam tempo em todas as áreas, começou pelas ferramentas que serviam à empresa inteira e, em seguida, construiu ferramentas sob medida para subáreas específicas. Cada uma passou por testes rigorosos antes de ser liberada.
- **Resultado:** As ferramentas chegaram às áreas prontas para uso e viraram parte da rotina do CITi.
- **Lição:** Com muitos pedidos ao mesmo tempo, comece pelo que gera mais impacto para mais pessoas, e só entregue quando estiver pronto de verdade.

### C058 · A ferramenta interna que virou produto
*Contado por: Time de Inovação · conversa de fim de gestão*

- **Situação:** Uma ferramenta de IA criada pela Inovação para uso interno funcionou tão bem que outras empresas se interessaram por ela.
- **Dilema:** Manter a ferramenta só para o CITi ou transformá-la em produto.
- **Decisão:** O time adaptou a ferramenta para clientes, mantendo o mesmo padrão de qualidade da versão interna.
- **Resultado:** A ferramenta passou a ser vendida como produto pronto.
- **Lição:** Uma solução interna bem feita pode virar produto quando resolve um problema que outras empresas também têm.

### C059 · Vender um produto pronto da Inovação
*Contado por: Time de Inovação · conversa de fim de gestão · P2*

- **Situação:** Na venda de um produto pronto da Inovação, o comercial deu a entender ao cliente que o produto poderia ser adaptado ao seu processo. O produto foi feito para funcionar de forma padrão.
- **Dilema:** Fazer adaptações para manter o cliente ou alinhar expectativas.
- **Opções na época:** (a) Fazer as adaptações pedidas; (b) Explicar o que o produto faz e oferecer uma configuração dentro do padrão
- **Decisão:** A integrante do time de Inovação explicou ao cliente como o produto funciona e mostrou como ele resolveria o problema dentro do padrão.
- **Resultado:** O cliente aceitou e o produto entrou em uso sem perder qualidade. A integrante do time de Inovação passou a participar das reuniões de venda dos produtos da Inovação.
- **Lição:** Quem conhece o produto precisa estar na venda. Expectativa alinhada protege o cliente e a qualidade do produto.
- **Simulação:** conversa com: Gestora de uma empresa de serviços que quer adaptações no produto

### C060 · Escolher quais ideias viram solução interna
*Contado por: Time de Inovação · conversa de fim de gestão*

- **Situação:** O time de Inovação recebia muitas ideias de ferramentas, vindas de todas as áreas.
- **Dilema:** Como decidir quais ideias construir primeiro.
- **Decisão:** A integrante do time de Inovação propôs avaliar cada ideia pelo tempo que ela economizaria e por quantas pessoas a usariam.
- **Resultado:** O time passou a priorizar com critérios claros e as áreas entenderam a ordem das entregas.
- **Lição:** Critérios claros de prioridade evitam que tudo pareça urgente.

### C061 · Documentar cada ferramenta desde o início
*Contado por: Time de Inovação · conversa de fim de gestão · P5*

- **Situação:** O integrante do time de Inovação entrou na Inovação junto com a volta do time e percebeu que cada ferramenta tinha detalhes que só quem a construiu conhecia.
- **Dilema:** Documentar enquanto constrói ou só depois de entregar.
- **Decisão:** O integrante do time de Inovação passou a documentar cada ferramenta durante a construção, com um padrão que o time adotou.
- **Resultado:** Qualquer pessoa da Inovação consegue manter e evoluir as ferramentas.
- **Lição:** Documentar durante a construção é parte de entregar algo impecável.

### C062 · Os testes antes de cada ferramenta chegar às áreas
*Contado por: Time de Inovação · conversa de fim de gestão*

- **Situação:** Antes de liberar uma ferramenta, a Inovação testa com casos reais de cada área que vai usá-la.
- **Dilema:** Quanto testar antes de liberar.
- **Decisão:** O integrante do time de Inovação ajudou a criar uma bateria de testes com situações reais de cada área.
- **Resultado:** As ferramentas chegam às áreas funcionando como esperado.
- **Lição:** Testar com situações reais é o que transforma uma boa ideia em uma ferramenta confiável.

### C067 · Apoiar a implementação de IA sem parar os clientes
*Contado por: CTO · conversa de despedida*

- **Situação:** Com a volta da Inovação, a área de Soluções precisava adotar as novas ferramentas de IA sem atrasar os projetos.
- **Dilema:** Parar para adotar as ferramentas ou adotar aos poucos.
- **Decisão:** A CTO definiu uma pessoa por squad para adotar as ferramentas primeiro e ensinar o resto do time.
- **Resultado:** A adoção aconteceu sem atrasar entregas.
- **Lição:** Mudanças de ferramenta funcionam melhor com alguém de referência dentro de cada time.

### C068 · Vender um produto pronto da Inovação
*Contado por: CRO · conversa de despedida · P2*

- **Situação:** O CRO acompanhou a venda de um produto pronto da Inovação para um cliente.
- **Dilema:** Vender como projeto sob medida ou como produto padrão.
- **Decisão:** O CRO vendeu como produto padrão, com alguém da Inovação na reunião.
- **Resultado:** O cliente entendeu o que estava comprando desde o começo.
- **Lição:** Produto pronto se vende diferente de projeto: quem conhece o produto precisa estar na venda.

### C077 · Validação com o cliente toda sexta
*Contado por: Pessoa desenvolvedora · conversa do squad · P6*

- **Situação:** A pessoa desenvolvedora propôs mostrar ao cliente o que foi feito toda sexta.
- **Dilema:** Mostrar versões incompletas ou esperar.
- **Decisão:** A pessoa desenvolvedora mostrou toda sexta, mesmo incompleto.
- **Resultado:** O projeto andou sem surpresas e foi entregue no prazo.
- **Lição:** Validação frequente reduz o risco de retrabalho.

### C078 · Depender de uma só pessoa para entender o projeto
*Contado por: Pessoa desenvolvedora · conversa do squad · P5*

- **Situação:** A pessoa desenvolvedora entrou num projeto pela metade e só uma pessoa sabia explicar o sistema.
- **Dilema:** Esperar essa pessoa ou estudar sozinho.
- **Decisão:** A pessoa desenvolvedora marcou conversas curtas com a pessoa e registrou tudo.
- **Resultado:** O registro ajudou também quem entrou depois dele.
- **Lição:** Quem aprende com uma pessoa só deve registrar para que o próximo não dependa dela.

### C082 · Retomar a biblioteca de componentes
*Contado por: Líder de design · conversa de despedida · P5*

- **Situação:** A líder de design encontrou a biblioteca de componentes desatualizada.
- **Dilema:** Atualizar a biblioteca ou focar nos projetos.
- **Decisão:** A líder de design atualizou a biblioteca e definiu quem cuidaria dela a cada gestão.
- **Resultado:** A biblioteca voltou a ser usada.
- **Lição:** Material compartilhado precisa de um responsável em cada gestão.

### C084 · O guia visual de um cliente
*Contado por: Designer de produto · conversa de fim de gestão · P5*

- **Situação:** A designer de produto percebeu que só ela sabia aplicar a identidade visual de um cliente.
- **Dilema:** Seguir assim ou criar um guia.
- **Decisão:** A designer de produto criou um guia visual simples.
- **Resultado:** Outros designers passaram a atender o cliente sem depender dela.
- **Lição:** Um guia visual transforma o conhecimento de uma pessoa em conhecimento do time.

### C085 · O cliente em todas as revisões
*Contado por: Designer de produto · conversa do squad · P6*

- **Situação:** O designer de produto convidou o cliente para todas as revisões de design.
- **Dilema:** Revisar só com o time ou com o cliente.
- **Decisão:** O designer de produto incluiu o cliente.
- **Resultado:** As telas foram aprovadas sem retrabalho.
- **Lição:** Cliente presente nas revisões é cliente sem surpresas.

### C086 · Conduzir uma descoberta sozinha
*Contado por: Analista de produto · conversa do squad · P6*

- **Situação:** A analista de produto conduziu sozinha a descoberta de um projeto.
- **Dilema:** Seguir um roteiro pronto ou adaptar ao cliente.
- **Decisão:** A analista de produto partiu de um roteiro e adaptou as perguntas a cada entrevista.
- **Resultado:** A descoberta trouxe informações que mudaram a proposta para melhor.
- **Lição:** Um roteiro é ponto de partida, não limite.

### C093 · Um projeto de dados com apoio de IA
*Contado por: Analista de dados · conversa do squad*

- **Situação:** O analista de dados usou as ferramentas de IA da Inovação para tratar os dados de um cliente.
- **Dilema:** Confiar no resultado da ferramenta ou revisar tudo.
- **Decisão:** O analista de dados revisou os pontos críticos e confiou no restante.
- **Resultado:** O projeto foi entregue mais rápido e com qualidade.
- **Lição:** IA acelera, mas a revisão dos pontos críticos continua sendo de quem entrega.

### C099 · A reunião semanal no contrato
*Contado por: Gerente de contas · conversa do squad · P6*

- **Situação:** O gerente de contas incluiu no contrato uma reunião semanal com o cliente.
- **Dilema:** Deixar o acompanhamento informal ou formalizar.
- **Decisão:** O gerente de contas formalizou no contrato.
- **Resultado:** O cliente participou de todas as reuniões e o projeto foi entregue no prazo.
- **Lição:** Envolvimento do cliente combinado no contrato vira compromisso dos dois lados.

### C110 · Conduzir as retrospectivas dos squads
*Contado por: Analista de Gente e Gestão · conversa de fim de gestão*

- **Situação:** A analista de Gente e Gestão conduziu as retrospectivas de vários squads.
- **Dilema:** Seguir o roteiro padrão ou adaptar a cada squad.
- **Decisão:** Ela manteve o roteiro e adaptou as perguntas ao momento de cada projeto.
- **Resultado:** Os squads relataram retrospectivas mais úteis.
- **Lição:** Um bom roteiro de retrospectiva se adapta ao momento do time.

### C112 · Uma ferramenta de IA para Gente e Gestão
*Contado por: Time de Inovação · conversa de fim de gestão*

- **Situação:** A área de Gente e Gestão gastava muitas horas num processo interno repetitivo.
- **Dilema:** Automatizar parte do processo ou tudo.
- **Decisão:** O integrante do time de Inovação construiu uma ferramenta de IA que automatizou o processo de ponta a ponta, testada com a área antes de ser liberada.
- **Resultado:** A área passou a dedicar o tempo economizado ao acompanhamento das pessoas.
- **Lição:** A melhor automação é a que devolve tempo para o que só pessoas fazem.

### C113 · Uma ferramenta sob medida para Dados
*Contado por: Time de Inovação · conversa de despedida*

- **Situação:** A subárea de Dados tinha uma etapa de trabalho que se repetia em todos os projetos.
- **Dilema:** Criar uma ferramenta genérica ou sob medida.
- **Decisão:** A integrante do time de Inovação criou uma ferramenta sob medida, junto com os analistas de Dados.
- **Resultado:** A etapa que levava horas passou a levar minutos.
- **Lição:** Ferramenta sob medida nasce de conversa com quem faz o trabalho.

### C114 · Medir quanto tempo a IA economizou
*Contado por: Time de Inovação · conversa de fim de gestão*

- **Situação:** O integrante do time de Inovação quis saber o impacto real das ferramentas de IA nas áreas.
- **Dilema:** Medir por percepção ou por dados.
- **Decisão:** O integrante do time de Inovação mediu o tempo das tarefas antes e depois das ferramentas.
- **Resultado:** O CITi passou a ter números para mostrar o impacto da IA.
- **Lição:** Medir o impacto ajuda a decidir quais ferramentas construir a seguir.

### C115 · Documentar cada ferramenta para qualquer pessoa manter
*Contado por: Time de Inovação · conversa de fim de gestão · P5*

- **Situação:** A integrante do time de Inovação quis garantir que qualquer pessoa do time pudesse manter as ferramentas.
- **Dilema:** Documentar ao fim ou durante a construção.
- **Decisão:** A integrante do time de Inovação documentou cada ferramenta durante a construção.
- **Resultado:** As ferramentas passaram a ser mantidas por qualquer pessoa da Inovação.
- **Lição:** Ferramenta bem documentada continua impecável mesmo quando o time muda.

## Gestão 2027.1

Gestão começando: a fusão de Dados e Dev em Tech, e de Marketing e Comercial em Negócios, e a chegada de uma nova turma de New Pigs. O legado desta geração está sendo escrito agora.

### C013 · Assumir como CEO no meio da fusão
*Contado por: CEO · caso em andamento*

- **Situação:** A nova CEO assume no momento em que Dados e Dev se unem em Tech, e Marketing e Comercial em Negócios. O plano veio da gestão anterior, com os porquês registrados pela CEO que saiu.
- **Dilema:** Seguir o plano herdado à risca ou adaptá-lo à nova diretoria.
- **Decisão:** Ela está revisando cada decisão do plano com os novos diretores, a partir dos casos deixados pela CEO anterior.
- **Resultado:** Em andamento.

### C015 · Unir Marketing e Comercial em Negócios
*Contado por: CRO · caso em andamento*

- **Situação:** O CRO conduz a fusão de Marketing e Comercial na nova área de Negócios. Os dois times tinham rotinas, metas e ferramentas diferentes.
- **Dilema:** Unificar tudo de uma vez ou fazer a transição em etapas.
- **Decisão:** O CRO começou com um planejamento comercial único e reuniões semanais conjuntas, mantendo as rotinas de cada subárea por enquanto.
- **Resultado:** Em andamento.

### C017 · Unir Dados e Dev em Tech
*Contado por: CTO · caso em andamento*

- **Situação:** O CTO conduz a fusão de Dados e Dev na área de Tech. Cada subárea tinha seus padrões de entrega e suas lideranças.
- **Dilema:** Criar padrões únicos de cara ou deixar cada subárea manter os seus por um tempo.
- **Decisão:** O CTO está reunindo as boas práticas das duas subáreas, partindo do legado registrado pelas lideranças anteriores.
- **Resultado:** Em andamento.

### C044 · Vender agora que Comercial e Marketing são uma área só
*Contado por: Gerente de contas · caso em andamento*

- **Situação:** Com a fusão em Negócios, o gerente de contas passou a planejar a prospecção junto com o time de Marketing.
- **Dilema:** Como dividir o trabalho entre atrair e vender sem duplicar esforços.
- **Decisão:** O gerente de contas está testando um funil compartilhado, em que Marketing qualifica os contatos antes de chegarem ao comercial.
- **Resultado:** Em andamento.

### C050 · Marketing e Comercial trabalhando juntos na mesma área
*Contado por: Analista de marketing · caso em andamento*

- **Situação:** Com a fusão, o analista de marketing passou a dividir metas com o time comercial.
- **Dilema:** Como medir o trabalho de Marketing quando a meta passa a ser de vendas.
- **Decisão:** O analista de marketing está acompanhando quantos contatos de Marketing viram reuniões de venda.
- **Resultado:** Em andamento.

### C053 · Receber os New Pigs em plena fusão
*Contado por: Analista de Gente e Gestão · caso em andamento*

- **Situação:** A nova turma de New Pigs chega justamente quando as áreas estão sendo unidas em Tech e Negócios.
- **Dilema:** Como integrar quem chega se nem as áreas estão com as rotinas definidas.
- **Decisão:** O analista de Gente e Gestão está montando a integração a partir das trilhas do LegaCITi, com uma pessoa de referência em cada área.
- **Resultado:** Em andamento.

### C054 · O que muda nos ritos com a reorganização
*Contado por: Analista de Gente e Gestão · caso em andamento*

- **Situação:** Com menos áreas e times maiores, os ritos de cada área precisam ser revistos.
- **Dilema:** Manter os ritos antigos ou desenhar novos para as áreas fundidas.
- **Decisão:** O analista de Gente e Gestão está ouvindo cada área antes de propor mudanças.
- **Resultado:** Em andamento.

### C056 · Acompanhar as pessoas durante a reorganização
*Contado por: Analista de Gente e Gestão · caso em andamento*

- **Situação:** Com a fusão das áreas, muitos membros têm dúvidas sobre seu papel e sua trilha de carreira.
- **Dilema:** Esperar as áreas se organizarem ou conversar com as pessoas desde já.
- **Decisão:** A analista de Gente e Gestão está fazendo conversas individuais com os membros das áreas fundidas.
- **Resultado:** Em andamento.

### C069 · Integrar os New Pigs às áreas recém-fundidas
*Contado por: COO · caso em andamento*

- **Situação:** A COO assume como COO no momento em que a nova turma de New Pigs chega e as áreas estão sendo unidas.
- **Dilema:** Integrar os New Pigs por área antiga ou já na nova estrutura.
- **Decisão:** A COO está integrando os New Pigs direto na nova estrutura, com apoio das trilhas do LegaCITi.
- **Resultado:** Em andamento.

### C100 · Uma venda já na área de Negócios
*Contado por: Gerente de contas · caso em andamento*

- **Situação:** A gerente de contas saiu de Marketing e virou gerente de contas na nova área de Negócios.
- **Dilema:** Como usar a experiência de Marketing nas vendas.
- **Decisão:** A gerente de contas está usando os dados das campanhas para preparar cada reunião de venda.
- **Resultado:** Em andamento.

### C105 · Planejar conteúdo junto com o comercial
*Contado por: Analista de marketing · caso em andamento*

- **Situação:** Com a fusão, o analista de marketing passou a planejar conteúdo junto com o comercial.
- **Dilema:** Seguir o calendário de Marketing ou partir das necessidades de venda.
- **Decisão:** O analista de marketing está montando o calendário a partir das dúvidas que os clientes trazem nas reuniões.
- **Resultado:** Em andamento.

### C111 · Organizar a recepção dos New Pigs
*Contado por: Analista de Gente e Gestão · caso em andamento*

- **Situação:** A analista de Gente e Gestão está organizando a recepção da nova turma de New Pigs.
- **Dilema:** Fazer uma recepção geral ou por área.
- **Decisão:** A analista de Gente e Gestão está combinando uma recepção geral com encontros por área.
- **Resultado:** Em andamento.
