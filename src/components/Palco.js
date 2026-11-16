"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Tronco from "./Tronco";
import Marca from "./Marca";
import Fundo from "./Fundo";
import Entrevista from "./Entrevista";
import PainelDiretoria from "./PainelDiretoria";
import { montarPainel } from "@/lib/diretoria";
import { lerDemonstracao, salvarDemonstracao, novoCaso } from "@/lib/meusCasos";
import { SECOES } from "@/lib/ia/bastao";
import { casos as casosLegado, gestoes, padroes, pessoaPorId } from "@/data";
import { posicionarCasos, raiosDoAnel, ponto, naTela } from "@/lib/geometria";
import { acharCargo, relevancia, ehNovato, CHEGADA, FOCO } from "@/data/cargos";
import estilos from "./Palco.module.css";

const LENTES = [
  { id: "legado", nome: "Legado" },
  { id: "padroes", nome: "Padrões" },
  { id: "bastao", nome: "Para quem assume" },
];

const ORIGEM = {
  squad: "Conversa do squad",
  fim_gestao: "Conversa de fim de gestão",
  despedida: "Conversa de despedida",
  em_andamento: "Caso em andamento",
};

// Converte coordenadas do desenho (1600 x 900) em porcentagem do palco.
const px = (x) => `${(x / 1600) * 100}%`;
const py = (y) => `${(y / 900) * 100}%`;

export default function Palco({ cargo = null }) {
  const entrada = acharCargo(cargo);
  const novato = ehNovato(entrada?.cargo.id);
  // O painel da diretoria aparece só para CEO e diretores.
  const daDiretoria = entrada?.area.id === "ceo" || entrada?.area.id === "diretoria";
  // New Pigs chegam direto em "Para quem assume": o legado de quem já começou no mesmo lugar.
  const [lente, setLente] = useState(novato ? "bastao" : "legado");
  const [gestaoAtiva, setGestaoAtiva] = useState("2026.2");
  const [casoAtivo, setCasoAtivo] = useState(null);
  const [padraoAtivo, setPadraoAtivo] = useState(null);
  const [retratoAberto, setRetratoAberto] = useState(false);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState(null);
  const [pensando, setPensando] = useState(false);
  const [solucoesJuntas, setSolucoesJuntas] = useState(false);
  // No celular, o tronco fica em cima e os painéis descem, um embaixo do outro.
  const [celular, setCelular] = useState(false);
  useEffect(() => {
    const consulta = window.matchMedia("(max-width: 760px)");
    const atualizar = () => setCelular(consulta.matches);
    atualizar();
    consulta.addEventListener("change", atualizar);
    return () => consulta.removeEventListener("change", atualizar);
  }, []);
  const painelDireito = useRef(null);

  // Conversas de legado feitas nesta demonstração (guardadas só neste navegador).
  const [demo, setDemo] = useState({ casos: [], simuladas: 0 });
  const [entrevistaAberta, setEntrevistaAberta] = useState(false);
  const [nasceu, setNasceu] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [celebrando, setCelebrando] = useState(null);
  const fechadoAntes = useRef(null);
  const [pronto, setPronto] = useState(false);
  useEffect(() => {
    const salvo = lerDemonstracao(cargo);
    // Ao recarregar, um anel que já estava fechado não comemora de novo.
    const g = gestoes.find((x) => x.codigo === "2026.2");
    fechadoAntes.current = g.conversas.feitas + salvo.casos.length + salvo.simuladas >= g.conversas.esperadas;
    setDemo(salvo);
    setPronto(true);
  }, [cargo]);
  function atualizarDemo(novo) {
    setDemo(novo);
    salvarDemonstracao(novo, cargo);
  }

  const casos = useMemo(() => [...casosLegado, ...demo.casos], [demo.casos]);
  const painelDiretoria = useMemo(() => montarPainel({ casos, gestoes, meusCasos: demo.casos, simuladas: demo.simuladas }), [casos, demo]);

  // Para quem assume: o legado de todas as pessoas que já ocuparam um cargo, para quem vai assumir.
  const cargosComLegado = useMemo(() => [...new Set(casosLegado.map((c) => c.cargoAutor))].sort((a, b) => a.localeCompare(b, "pt-BR")), []);
  const [cargoBastao, setCargoBastao] = useState(() => FOCO[entrada?.cargo.id]?.papeis?.find((p) => casosLegado.some((c) => c.cargoAutor === p)) ?? "Gerente de contas");
  const [bastao, setBastao] = useState(null);
  const cacheBastao = useRef({});
  useEffect(() => {
    if (lente !== "bastao") return;
    const meusDoCargo = demo.casos.filter((c) => c.cargoAutor === cargoBastao);
    const chave = `legaciti:bastao:v3:${cargoBastao}:${meusDoCargo.map((c) => c.id).join(",")}`;
    let guardado = cacheBastao.current[chave];
    if (!guardado) { try { guardado = JSON.parse(window.localStorage.getItem(chave) ?? "null"); } catch {} }
    if (guardado) { setBastao(guardado); return; }
    let cancelado = false;
    setBastao({ cargo: cargoBastao, carregando: true });
    const controle = new AbortController();
    const relogio = setTimeout(() => controle.abort(), 28000);
    fetch("/api/bastao", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cargo: cargoBastao, extras: meusDoCargo }), signal: controle.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((dados) => {
        if (cancelado) return;
        cacheBastao.current[chave] = dados;
        // Só a versão feita pela IA fica guardada; a versão só com dados é refeita na próxima vez.
        if (dados.origem === "ia") { try { window.localStorage.setItem(chave, JSON.stringify(dados)); } catch {} }
        setBastao(dados);
      })
      .catch(() => { if (!cancelado) setBastao({ cargo: cargoBastao, erro: true }); })
      .finally(() => clearTimeout(relogio));
    return () => { cancelado = true; controle.abort(); };
  }, [lente, cargoBastao, demo.casos]);
  const citadosBastao = useMemo(() => new Set(bastao?.kit ? SECOES.flatMap((s) => bastao.kit[s.id] ?? []).flatMap((i) => i.casos) : []), [bastao]);

  // O anel em andamento avança a cada conversa registrada e fecha quando todas forem feitas.
  const ANEL_ATUAL = "2026.2";
  const gestoesVivas = useMemo(() => gestoes.map((g) => {
    if (g.codigo !== ANEL_ATUAL || !g.conversas) return g;
    const feitas = Math.min(g.conversas.esperadas, g.conversas.feitas + demo.casos.filter((c) => c.gestao === ANEL_ATUAL).length + demo.simuladas);
    return { ...g, conversas: { ...g.conversas, feitas }, status: feitas >= g.conversas.esperadas ? "completa" : g.status };
  }), [demo]);
  const anelAtual = gestoesVivas.find((g) => g.codigo === ANEL_ATUAL);

  useEffect(() => {
    if (!pronto) return;
    const fechado = anelAtual?.status === "completa";
    if (fechadoAntes.current === false && fechado) {
      setCelebrando(ANEL_ATUAL);
      setGestaoAtiva(ANEL_ATUAL);
      setAviso({ titulo: `O anel ${ANEL_ATUAL} fechou`, texto: "Todas as conversas da gestão foram feitas. O legado desta geração está completo e já ajuda a próxima." });
      setTimeout(() => setCelebrando(null), 4200);
    }
    fechadoAntes.current = fechado;
  }, [anelAtual?.status, pronto]);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 6500);
    return () => clearTimeout(t);
  }, [aviso]);

  function registrar({ rascunho, tipo }) {
    const indice = demo.casos.length + 1;
    const c = novoCaso({ rascunho, tipo, entrada, indice, gestao: ANEL_ATUAL });
    atualizarDemo({ ...demo, casos: [...demo.casos, c] });
    setEntrevistaAberta(false);
    setResposta(null);
    setGestaoAtiva(ANEL_ATUAL);
    setCasoAtivo(c.id);
    setNasceu(c.id);
    setTimeout(() => setNasceu(null), 3500);
    const g = gestoes.find((x) => x.codigo === ANEL_ATUAL);
    const feitas = Math.min(g.conversas.esperadas, (anelAtual?.conversas.feitas ?? 0) + 1);
    if (feitas < g.conversas.esperadas) {
      setAviso({ titulo: "Seu caso entrou no tronco", texto: `Anel ${ANEL_ATUAL} · ${feitas} de ${g.conversas.esperadas} conversas feitas. Quem perguntar ao LegaCITi sobre isso agora encontra o que você viveu.` });
    }
  }

  // Para a apresentação: completa as conversas que faltam, uma a uma, até o anel fechar.
  const simulando = useRef(null);
  function simularRestantes() {
    if (simulando.current) return;
    simulando.current = setInterval(() => {
      setDemo((atual) => {
        const g = gestoes.find((x) => x.codigo === ANEL_ATUAL);
        const feitas = g.conversas.feitas + atual.casos.filter((c) => c.gestao === ANEL_ATUAL).length + atual.simuladas;
        if (feitas >= g.conversas.esperadas) {
          clearInterval(simulando.current);
          simulando.current = null;
          return atual;
        }
        const novo = { ...atual, simuladas: atual.simuladas + 1 };
        salvarDemonstracao(novo, cargo);
        return novo;
      });
    }, 160);
  }
  useEffect(() => () => clearInterval(simulando.current), []);

  function recomecar() {
    clearInterval(simulando.current);
    simulando.current = null;
    fechadoAntes.current = false;
    atualizarDemo({ casos: [], simuladas: 0 });
    setCasoAtivo(null);
    setAviso(null);
  }

  async function perguntar(e) {
    e.preventDefault();
    const texto = pergunta.trim();
    if (!texto || pensando) return;
    setPensando(true);
    setCasoAtivo(null);
    setResposta({ pergunta: texto, carregando: true });
    // Se a resposta não chegar em 25 s, o LegaCITi desiste e avisa, em vez de ficar pensando para sempre.
    const controle = new AbortController();
    const relogio = setTimeout(() => controle.abort(), 25000);
    try {
      const r = await fetch("/api/perguntar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta: texto, cargo, extras: demo.casos }),
        signal: controle.signal,
      });
      if (!r.ok) throw new Error(`erro_${r.status}`);
      const dados = await r.json();
      setResposta({ pergunta: texto, ...dados });
    } catch {
      setResposta({ pergunta: texto, tipo: "indisponivel", resposta: "Não consegui falar com o LegaCITi agora. Tente de novo em instantes.", casos: [] });
    } finally {
      clearTimeout(relogio);
      setPensando(false);
    }
  }

  // No celular, o que a pessoa abriu aparece no painel abaixo do tronco: a tela rola até ele.
  useEffect(() => {
    if (!celular || (!casoAtivo && !resposta)) return;
    painelDireito.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [celular, casoAtivo, resposta?.pergunta]);

  const posicoes = useMemo(() => posicionarCasos(casos, gestoes, pessoaPorId, { distanciaMinima: celular ? 40 : 22 }), [casos, celular]);

  // O que o cargo de quem entrou enxerga com mais destaque.
  const foco = useMemo(() => {
    if (!entrada) return null;
    const mapa = Object.fromEntries(casos.map((c) => [c.id, relevancia(c, entrada.cargo.id)]));
    const doCargo = casos.filter((c) => mapa[c.id] === 2);
    const daArea = casos.filter((c) => mapa[c.id] >= 1);
    const contagem = {};
    for (const c of daArea) for (const p of c.padroes) contagem[p] = (contagem[p] || 0) + 1;
    const padraoTopo = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    const ordem = gestoes.map((g) => g.codigo);
    const recentes = (lista) => [...lista].sort((a, b) => ordem.indexOf(b.gestao) - ordem.indexOf(a.gestao));
    let sugeridos;
    if (ehNovato(entrada.cargo.id)) {
      // Quem está chegando: primeiro o que se aprende ao entrar na sua subárea,
      // depois os conselhos de quem saiu e, por fim, como o CITi recebe quem chega.
      const areas = FOCO[entrada.cargo.id].areas;
      const peso = { despedida: 3, fim_gestao: 2, squad: 1, em_andamento: 0 };
      const chegadaDaArea = CHEGADA.map((id) => casos.find((c) => c.id === id)).filter((c) => c && areas.includes(c.area));
      const conselhos = recentes(casos.filter((c) => areas.includes(c.area) && c.licao && !CHEGADA.includes(c.id)))
        .sort((a, b) => peso[b.origem] - peso[a.origem]);
      const recepcao = ["C069", "C111"].map((id) => casos.find((c) => c.id === id));
      sugeridos = [...new Map([...chegadaDaArea, ...conselhos.slice(0, 2), ...recepcao].filter(Boolean).map((c) => [c.id, c])).values()].slice(0, 4);
    } else {
      // Primeiro os casos do próprio cargo; se forem poucos, completa com o que a área deixou.
      const base = [...recentes(doCargo), ...recentes(daArea.filter((c) => !doCargo.includes(c)))];
      sugeridos = base.filter((c) => c.licao).slice(0, 3);
    }
    return { mapa, doCargo, daArea, padraoTopo, sugeridos };
  }, [entrada, casos]);
  const caso = casos.find((c) => c.id === casoAtivo);
  const gestao = gestoesVivas.find((g) => g.codigo === gestaoAtiva);
  const indiceGestao = gestoes.findIndex((g) => g.codigo === gestaoAtiva);
  const casosDaGestao = casos.filter((c) => c.gestao === gestaoAtiva);

  // Ponto do anel ativo para onde a linha do painel da esquerda aponta.
  const alvoGestao = useMemo(() => {
    if (indiceGestao < 0) return null;
    const { interno, externo } = raiosDoAnel(indiceGestao, gestoes.length);
    return naTela(ponto((interno + externo) / 2, 196));
  }, [indiceGestao]);

  const contagemPadroes = useMemo(() => {
    const c = {};
    for (const caso of casos) for (const p of caso.padroes) c[p] = (c[p] || 0) + 1;
    return c;
  }, [casos]);

  function escolherLente(id) {
    setLente(id);
    setResposta(null);
    setCasoAtivo(null);
    if (id !== "padroes") setPadraoAtivo(null);
    if (id === "padroes" && !padraoAtivo) setPadraoAtivo("P5");
  }

  return (
    <div className={estilos.tela}>
      <Fundo />
      <header className={estilos.topo}>
        <div className={estilos.marcaBloco}>
          <Marca altura={30} />
          <span className={estilos.slogan}>A memória coletiva do CITi</span>
        </div>
        <nav className={estilos.lentes} aria-label="Lentes">
          {[...LENTES, ...(daDiretoria ? [{ id: "diretoria", nome: "Diretoria" }] : [])].map((l) => (
            <button key={l.id} disabled={l.emBreve} onClick={() => escolherLente(l.id)}
              className={`${estilos.lente} ${lente === l.id ? estilos.lenteAtiva : ""}`}>
              {l.nome}
            </button>
          ))}
        </nav>
        <div className={estilos.direita}>
          <div className={estilos.selo}>Dados simulados</div>
          {entrada && (
            <Link href="/" className={estilos.usuario} title="Trocar de cargo">
              <span className={estilos.avatar} aria-hidden="true">{entrada.area.nome.slice(0, 2).toUpperCase()}</span>
              <span className={estilos.usuarioTexto}>
                <strong>{entrada.area.nome === entrada.cargo.nome ? entrada.cargo.nome : entrada.area.nome}</strong>
                <span>{entrada.area.nome === entrada.cargo.nome ? "Trocar de cargo" : novato ? entrada.subarea.nome : entrada.cargo.nome}</span>
              </span>
            </Link>
          )}
        </div>
      </header>

      <div className={estilos.moldura}>
      <div className={estilos.palco}>
        <svg viewBox={celular ? "150 10 1260 790" : "0 0 1600 900"} className={estilos.desenho} role="img" aria-label="Tronco do LegaCITi: cada anel é uma gestão do CITi e cada ponto é um caso">
          <Tronco gestoes={gestoesVivas} casos={casos} posicoes={posicoes} novo={nasceu} celebrando={celebrando} solucoesJuntas={solucoesJuntas} compacto={celular}
            selecionado={casoAtivo} gestaoAtiva={gestaoAtiva} padraoAtivo={padraoAtivo} relevancia={resposta?.casos?.length ? Object.fromEntries(casos.map((c) => [c.id, resposta.casos.includes(c.id) ? 2 : 0]))
              : lente === "bastao" ? Object.fromEntries(casos.map((c) => [c.id, citadosBastao.has(c.id) ? 2 : c.cargoAutor === cargoBastao ? 1 : 0]))
              : lente === "legado" ? foco?.mapa : null}
            aoEscolherCaso={(id) => setCasoAtivo(id)} aoEscolherGestao={(g) => { setGestaoAtiva(g); setCasoAtivo(null); setRetratoAberto(false); setResposta(null); }} />

          {/* Linhas que ligam os painéis ao tronco */}
          {alvoGestao && !resposta && !celular && (
            <g className={estilos.ligacao}>
              <polyline points={`-300,620 ${alvoGestao.x - 50},620 ${alvoGestao.x},${alvoGestao.y}`} />
              <circle cx={alvoGestao.x} cy={alvoGestao.y} r="4" />
            </g>
          )}
          {caso && !celular && (
            <g className={estilos.ligacao}>
              <polyline points={`1900,230 ${naTela(posicoes[caso.id]).x + 60},230 ${naTela(posicoes[caso.id]).x},${naTela(posicoes[caso.id]).y}`} />
              <circle cx={naTela(posicoes[caso.id]).x} cy={naTela(posicoes[caso.id]).y} r="9" className={estilos.mira} />
            </g>
          )}
        </svg>

        {/* Tech e Produto podem ser vistos juntos, como Soluções */}
        <button className={estilos.alternarSolucoes} style={{ left: px(40), top: py(128) }} onClick={() => setSolucoesJuntas((v) => !v)}
          aria-pressed={solucoesJuntas}>
          {solucoesJuntas ? "Separar Tech e Produto" : "Ver Tech e Produto como Soluções"}
        </button>

        {/* Painel da gestão */}
        {gestao && !resposta && (
          <section className={`${estilos.painel} ${estilos.painelEsquerda}`} style={{ top: py(500), width: `max(${px(360)}, 300px)`, maxHeight: py(392) }}>
            <div className={estilos.rotulo}>Anel · gestão</div>
            <h2 className={estilos.tituloGestao}>{gestao.codigo}</h2>
            {gestao.status === "fechando" && (
              <div className={estilos.status}>
                <span className={estilos.statusPonto} /> Anel fechando · {gestao.conversas.feitas} de {gestao.conversas.esperadas} conversas feitas
                <div className={estilos.barra}><div style={{ width: `${(gestao.conversas.feitas / gestao.conversas.esperadas) * 100}%` }} /></div>
              </div>
            )}
            {gestao.status === "em_formacao" && (
              <div className={estilos.status}><span className={estilos.statusPonto} /> Anel em formação</div>
            )}
            {gestao.codigo === ANEL_ATUAL && gestao.status === "completa" && (
              <div className={`${estilos.status} ${estilos.statusFechado}`}>
                <span className={estilos.statusPonto} /> Anel fechado · {gestao.conversas.feitas} de {gestao.conversas.esperadas} conversas feitas
                <div className={estilos.barra}><div style={{ width: "100%" }} /></div>
              </div>
            )}
            <p className={`${estilos.texto} ${retratoAberto ? "" : estilos.textoRecolhido}`}>{gestao.descricao}</p>
            <button className={estilos.lerMais} onClick={() => setRetratoAberto(!retratoAberto)}>{retratoAberto ? "Ler menos" : "Ler mais"}</button>
            <div className={estilos.numeros}>
              <div><strong>{casosDaGestao.length}</strong><span>casos</span></div>
              <div><strong>{new Set(casosDaGestao.map((c) => c.autor)).size}</strong><span>pessoas</span></div>
              <div><strong>{new Set(casosDaGestao.flatMap((c) => c.padroes)).size}</strong><span>padrões</span></div>
            </div>
            {gestao.codigo === ANEL_ATUAL && (
              <div className={estilos.demo}>
                {gestao.status !== "completa" && (
                  <button className={estilos.demoBotao} onClick={simularRestantes}>Simular as conversas que faltam</button>
                )}
                {(demo.casos.length > 0 || demo.simuladas > 0) && (
                  <button className={estilos.demoBotao} onClick={recomecar}>Recomeçar a demonstração</button>
                )}
              </div>
            )}
          </section>
        )}

        {/* Painel da direita: caso escolhido, padrões ou visão geral */}
        <section ref={painelDireito} className={`${estilos.painel} ${estilos.painelDireita}`} style={{ top: py(24), width: `max(${px(410)}, 330px)`, maxHeight: py(860) }}>
          {caso ? (
            <>
              <div className={estilos.rotulo}>Caso {caso.id} · {caso.gestao}{caso.meu ? " · registrado por você" : ""}</div>
              <h3 className={estilos.tituloCaso}>{caso.titulo}</h3>
              <p className={estilos.autor}>Contado por: {caso.cargoAutor} · {ORIGEM[caso.origem]}</p>
              <dl className={estilos.campos}>
                <dt>Situação</dt><dd>{caso.situacao}</dd>
                <dt>Decisão</dt><dd>{caso.decisao}</dd>
                {caso.meu && caso.resultado && (<><dt>Resultado</dt><dd>{caso.resultado}</dd></>)}
                {caso.licao && (<><dt>Lição</dt><dd className={estilos.licao}>{caso.licao}</dd></>)}
              </dl>
              {caso.padroes.length > 0 && (
                <div className={estilos.chips}>{caso.padroes.map((p) => <span key={p} className={estilos.chip}>{p} · {padroes[p]}</span>)}</div>
              )}
              <button className={estilos.fechar} onClick={() => setCasoAtivo(null)}>Fechar caso</button>
            </>
          ) : resposta ? (
            <>
              <div className={estilos.rotulo}>Pergunte ao LegaCITi</div>
              <p className={estilos.perguntaFeita}>“{resposta.pergunta}”</p>
              {resposta.carregando ? (
                <p className={estilos.pensando}><span className={estilos.statusPonto} /> Consultando o legado…</p>
              ) : (
                <>
                  <p className={`${estilos.respostaTexto} ${resposta.tipo !== "resposta" ? estilos.respostaPadrao : ""}`}>{resposta.resposta}</p>
                  {resposta.casos?.length > 0 && (
                    <>
                      <div className={estilos.rotuloLista}>{resposta.tipo === "resposta" ? "Baseado nestes casos" : "Casos mais próximos"}</div>
                      <ul className={estilos.sugeridos}>
                        {resposta.casos.map((id) => {
                          const c = casos.find((x) => x.id === id);
                          return c && (
                            <li key={id}>
                              <button onClick={() => setCasoAtivo(id)}>
                                <span className={estilos.sugeridoGestao}>{c.gestao}</span>
                                <span>{c.titulo}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </>
              )}
              <button className={estilos.fechar} onClick={() => { setResposta(null); setPergunta(""); }}>Fechar resposta</button>
            </>
          ) : lente === "bastao" ? (
            <>
              <div className={estilos.rotulo}>Para quem assume{novato ? ` · ${entrada.cargo.nome}` : ""}</div>
              {novato ? (
                <h3 className={estilos.tituloCaso}>Boas-vindas ao CITi. <em>Comece pelo que quem já foi {cargoBastao} deixou.</em></h3>
              ) : (
                <h3 className={estilos.tituloCaso}>Para quem vai assumir: <em>{cargoBastao}</em></h3>
              )}
              <label className={estilos.seletor}>
                <span>Cargo</span>
                <select value={cargoBastao} onChange={(e) => setCargoBastao(e.target.value)}>
                  {cargosComLegado.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              {bastao?.carregando && <p className={estilos.pensando}><span className={estilos.statusPonto} /> Juntando o legado de quem já foi {cargoBastao}…</p>}
              {bastao?.erro && <p className={estilos.respostaPadrao}>Não consegui juntar esse legado agora. Tente de novo em instantes.</p>}
              {bastao?.kit && (
                <>
                  <p className={estilos.texto}>{bastao.kit.resumo}</p>
                  <p className={estilos.fonteBastao}>
                    Feita a partir de {bastao.total} {bastao.total === 1 ? "caso" : "casos"} de quem já ocupou o cargo{bastao.origem === "dados" ? " · montada só com os dados, sem IA" : ""}. Toque num código para abrir o caso.
                  </p>
                  {SECOES.map((sec) => bastao.kit[sec.id]?.length > 0 && (
                    <div key={sec.id} className={estilos.secaoBastao}>
                      <div className={estilos.rotuloLista}>{sec.nome}</div>
                      <ul className={sec.id === "primeirasSemanas" ? estilos.checklist : estilos.bastaoLista}>
                        {bastao.kit[sec.id].map((item, i) => (
                          <li key={i}>
                            <span>{item.texto}</span>
                            <span className={estilos.citacoes}>
                              {item.casos.map((id) => <button key={id} onClick={() => setCasoAtivo(id)}>{id}</button>)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              )}
            </>
          ) : lente === "padroes" ? (
            <>
              <div className={estilos.rotulo}>Padrões entre gerações</div>
              <h3 className={estilos.tituloCaso}>O que se repete no CITi</h3>
              <ul className={estilos.listaPadroes}>
                {Object.entries(padroes).map(([cod, nome]) => (
                  <li key={cod}>
                    <button onClick={() => setPadraoAtivo(cod)} className={padraoAtivo === cod ? estilos.padraoAtivo : ""}>
                      <span className={estilos.padraoCodigo}>{cod}</span>
                      <span className={estilos.padraoNome}>{nome}</span>
                      <span className={estilos.padraoNum}>{contagemPadroes[cod]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : foco ? (
            <>
              <div className={estilos.rotulo}>Para você · {entrada.cargo.nome}</div>
              <h3 className={estilos.tituloCaso}>
                {novato
                  ? <>Boas-vindas ao CITi. <em>Comece pelo que quem chegou antes aprendeu.</em></>
                  : <>O que quem já esteve no seu lugar <em>deixou para você.</em></>}
              </h3>
              <div className={estilos.numeros}>
                <div><strong>{foco.doCargo.length}</strong><span>{novato ? "sobre chegar" : "do seu cargo"}</span></div>
                <div><strong>{novato ? foco.daArea.length - foco.doCargo.length : foco.daArea.length}</strong><span>{novato ? "da sua subárea" : "da sua área"}</span></div>
              </div>
              {!novato && foco.doCargo.length < 3 && (
                <p className={estilos.dica}>{foco.doCargo.length === 0 ? "Ninguém deste cargo contou um caso ainda." : "Ainda há poucos casos contados por este cargo."} Enquanto isso, comece também pelo que a sua área já viveu.</p>
              )}
              {foco.padraoTopo && (
                <p className={estilos.alerta}>
                  <span>{novato ? "O que mais se repete na sua subárea" : "Padrão mais comum na sua área"}</span>
                  {foco.padraoTopo} · {padroes[foco.padraoTopo]}
                </p>
              )}
              <div className={estilos.rotuloLista}>Comece por aqui</div>
              <ul className={estilos.sugeridos}>
                {foco.sugeridos.map((c) => (
                  <li key={c.id}>
                    <button onClick={() => setCasoAtivo(c.id)}>
                      <span className={estilos.sugeridoGestao}>{c.gestao}</span>
                      <span>{c.titulo}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className={estilos.dica}>{novato ? "No tronco, brilham os casos sobre chegar ao CITi; os da sua subárea aparecem logo atrás." : foco.doCargo.length ? "No tronco, os casos de quem ocupou o seu cargo brilham mais." : "No tronco, os casos da sua área ficam acesos e os outros, mais apagados."}</p>
            </>
          ) : (
            <>
              <div className={estilos.rotulo}>Memória coletiva</div>
              <h3 className={estilos.tituloCaso}>O legado de cada geração, <em>de volta para quem trabalha agora.</em></h3>
              <div className={estilos.numeros}>
                <div><strong>{casos.length}</strong><span>casos</span></div>
                <div><strong>{gestoes.length}</strong><span>gestões</span></div>
                <div><strong>{Object.keys(pessoaPorId).length}</strong><span>pessoas</span></div>
              </div>
              <p className={estilos.dica}>Toque num anel para ver a gestão. Toque num ponto para abrir o caso.</p>
            </>
          )}
        </section>
      </div>

      </div>

      <div className={estilos.base}>
        <button className={estilos.contar} onClick={() => setEntrevistaAberta(true)}>
          <span aria-hidden="true">＋</span> Contar meu legado
        </button>
        <form className={estilos.pergunta} onSubmit={perguntar}>
          <input value={pergunta} onChange={(e) => setPergunta(e.target.value)} maxLength={500}
            placeholder={celular ? "Pergunte ao LegaCITi…" : "Pergunte ao LegaCITi: o que o CITi já aprendeu sobre…"} aria-label="Pergunte ao LegaCITi" />
          <button type="submit" aria-label="Enviar pergunta" disabled={pensando}>→</button>
        </form>
      </div>

      {aviso && (
        <div className={estilos.aviso} role="status">
          <strong>{aviso.titulo}</strong>
          <span>{aviso.texto}</span>
        </div>
      )}

      {lente === "diretoria" && daDiretoria && (
        <PainelDiretoria painel={painelDiretoria} casos={casos} aoFechar={() => escolherLente("legado")}
          aoAbrirCaso={(id) => { escolherLente("legado"); setCasoAtivo(id); }} />
      )}

      {entrevistaAberta && (
        <Entrevista entrada={entrada} gestao={ANEL_ATUAL} aoFechar={() => setEntrevistaAberta(false)} aoRegistrar={registrar} />
      )}
    </div>
  );
}
