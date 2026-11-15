"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Tronco from "./Tronco";
import Marca from "./Marca";
import Fundo from "./Fundo";
import { casos, gestoes, padroes, pessoaPorId } from "@/data";
import { posicionarCasos, raiosDoAnel, ponto, naTela } from "@/lib/geometria";
import { acharCargo, relevancia, ehNovato, CHEGADA, FOCO } from "@/data/cargos";
import estilos from "./Palco.module.css";

const LENTES = [
  { id: "legado", nome: "Legado" },
  { id: "padroes", nome: "Padrões" },
  { id: "trilha", nome: "Trilha", emBreve: true },
  { id: "kit", nome: "Kit do sucessor", emBreve: true },
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
  const [lente, setLente] = useState("legado");
  const [gestaoAtiva, setGestaoAtiva] = useState("2026.2");
  const [casoAtivo, setCasoAtivo] = useState(null);
  const [padraoAtivo, setPadraoAtivo] = useState(null);
  const [retratoAberto, setRetratoAberto] = useState(false);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState(null);
  const [pensando, setPensando] = useState(false);

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
        body: JSON.stringify({ pergunta: texto, cargo }),
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

  const posicoes = useMemo(() => posicionarCasos(casos, gestoes, pessoaPorId), []);

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
      // Cargo sem casos próprios ainda (como Analista de software): começa pelo que a área deixou.
      const base = doCargo.length ? doCargo : daArea;
      sugeridos = recentes(base.filter((c) => c.licao)).slice(0, 3);
    }
    return { mapa, doCargo, daArea, padraoTopo, sugeridos };
  }, [entrada]);
  const caso = casos.find((c) => c.id === casoAtivo);
  const gestao = gestoes.find((g) => g.codigo === gestaoAtiva);
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
  }, []);

  function escolherLente(id) {
    setLente(id);
    if (id !== "padroes") setPadraoAtivo(null);
    if (id === "padroes" && !padraoAtivo) setPadraoAtivo("P5");
  }

  return (
    <div className={estilos.tela}>
      <Fundo />
      <header className={estilos.topo}>
        <Marca altura={30} />
        <nav className={estilos.lentes} aria-label="Lentes">
          {LENTES.map((l) => (
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
        <svg viewBox="0 0 1600 900" className={estilos.desenho} role="img" aria-label="Tronco do LegaCITi: cada anel é uma gestão do CITi e cada ponto é um caso">
          <Tronco gestoes={gestoes} casos={casos} posicoes={posicoes}
            selecionado={casoAtivo} gestaoAtiva={gestaoAtiva} padraoAtivo={padraoAtivo} relevancia={resposta?.casos?.length ? Object.fromEntries(casos.map((c) => [c.id, resposta.casos.includes(c.id) ? 2 : 0])) : lente === "legado" ? foco?.mapa : null}
            aoEscolherCaso={(id) => setCasoAtivo(id)} aoEscolherGestao={(g) => { setGestaoAtiva(g); setCasoAtivo(null); setRetratoAberto(false); setResposta(null); }} />

          {/* Linhas que ligam os painéis ao tronco */}
          {alvoGestao && !resposta && (
            <g className={estilos.ligacao}>
              <polyline points={`390,250 420,250 ${alvoGestao.x},${alvoGestao.y}`} />
              <circle cx={alvoGestao.x} cy={alvoGestao.y} r="4" />
            </g>
          )}
          {caso && (
            <g className={estilos.ligacao}>
              <polyline points={`1200,230 1170,230 ${naTela(posicoes[caso.id]).x},${naTela(posicoes[caso.id]).y}`} />
              <circle cx={naTela(posicoes[caso.id]).x} cy={naTela(posicoes[caso.id]).y} r="9" className={estilos.mira} />
            </g>
          )}
        </svg>

        {/* Painel da gestão */}
        {gestao && !resposta && (
          <section className={estilos.painel} style={{ left: px(40), top: py(150), width: px(350), maxHeight: py(720) }}>
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
            <p className={`${estilos.texto} ${retratoAberto ? "" : estilos.textoRecolhido}`}>{gestao.descricao}</p>
            <button className={estilos.lerMais} onClick={() => setRetratoAberto(!retratoAberto)}>{retratoAberto ? "Ler menos" : "Ler mais"}</button>
            <div className={estilos.numeros}>
              <div><strong>{casosDaGestao.length}</strong><span>casos</span></div>
              <div><strong>{new Set(casosDaGestao.map((c) => c.autor)).size}</strong><span>pessoas</span></div>
              <div><strong>{new Set(casosDaGestao.flatMap((c) => c.padroes)).size}</strong><span>padrões</span></div>
            </div>
          </section>
        )}

        {/* Painel da direita: caso escolhido, padrões ou visão geral */}
        <section className={estilos.painel} style={{ left: px(1200), top: py(110), width: px(370), maxHeight: py(770) }}>
          {caso ? (
            <>
              <div className={estilos.rotulo}>Caso {caso.id} · {caso.gestao}</div>
              <h3 className={estilos.tituloCaso}>{caso.titulo}</h3>
              <p className={estilos.autor}>Contado por: {caso.cargoAutor} · {ORIGEM[caso.origem]}</p>
              <dl className={estilos.campos}>
                <dt>Situação</dt><dd>{caso.situacao}</dd>
                <dt>Decisão</dt><dd>{caso.decisao}</dd>
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
              {!novato && foco.doCargo.length === 0 && (
                <p className={estilos.dica}>Ninguém deste cargo contou um caso ainda. Enquanto isso, comece pelo que a sua área já viveu.</p>
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

      <form className={estilos.pergunta} onSubmit={perguntar}>
        <input value={pergunta} onChange={(e) => setPergunta(e.target.value)} maxLength={500}
          placeholder="Pergunte ao LegaCITi: o que o CITi já aprendeu sobre…" aria-label="Pergunte ao LegaCITi" />
        <button type="submit" aria-label="Enviar pergunta" disabled={pensando}>→</button>
      </form>
    </div>
  );
}
