"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Tronco from "./Tronco";
import Marca from "./Marca";
import Fundo from "./Fundo";
import { casos, gestoes, padroes, pessoaPorId } from "@/data";
import { posicionarCasos, raiosDoAnel, ponto } from "@/lib/geometria";
import { acharCargo } from "@/data/cargos";
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
  const [lente, setLente] = useState("legado");
  const [gestaoAtiva, setGestaoAtiva] = useState("2026.2");
  const [casoAtivo, setCasoAtivo] = useState(null);
  const [padraoAtivo, setPadraoAtivo] = useState(null);

  const posicoes = useMemo(() => posicionarCasos(casos, gestoes, pessoaPorId), []);
  const caso = casos.find((c) => c.id === casoAtivo);
  const gestao = gestoes.find((g) => g.codigo === gestaoAtiva);
  const indiceGestao = gestoes.findIndex((g) => g.codigo === gestaoAtiva);
  const casosDaGestao = casos.filter((c) => c.gestao === gestaoAtiva);

  // Ponto do anel ativo para onde a linha do painel da esquerda aponta.
  const alvoGestao = useMemo(() => {
    if (indiceGestao < 0) return null;
    const { interno, externo } = raiosDoAnel(indiceGestao, gestoes.length);
    return ponto((interno + externo) / 2, 196);
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
                <span>{entrada.area.nome === entrada.cargo.nome ? "Trocar de cargo" : entrada.cargo.titulo ?? entrada.cargo.nome}</span>
              </span>
            </Link>
          )}
        </div>
      </header>

      <div className={estilos.palco}>
        <svg viewBox="0 0 1600 900" className={estilos.desenho} role="img" aria-label="Tronco do LegaCITi: cada anel é uma gestão do CITi e cada ponto é um caso">
          <Tronco gestoes={gestoes} casos={casos} posicoes={posicoes}
            selecionado={casoAtivo} gestaoAtiva={gestaoAtiva} padraoAtivo={padraoAtivo}
            aoEscolherCaso={(id) => setCasoAtivo(id)} aoEscolherGestao={(g) => { setGestaoAtiva(g); setCasoAtivo(null); }} />

          {/* Linhas que ligam os painéis ao tronco */}
          {alvoGestao && (
            <g className={estilos.ligacao}>
              <polyline points={`390,250 420,250 ${alvoGestao.x},${alvoGestao.y}`} />
              <circle cx={alvoGestao.x} cy={alvoGestao.y} r="4" />
            </g>
          )}
          {caso && (
            <g className={estilos.ligacao}>
              <polyline points={`1200,230 1170,230 ${posicoes[caso.id].x},${posicoes[caso.id].y}`} />
              <circle cx={posicoes[caso.id].x} cy={posicoes[caso.id].y} r="9" className={estilos.mira} />
            </g>
          )}
        </svg>

        {/* Painel da gestão */}
        {gestao && (
          <section className={estilos.painel} style={{ left: px(40), top: py(150), width: px(350) }}>
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
            <p className={estilos.diretoria}>{gestao.diretoria}</p>
            <p className={estilos.texto}>{gestao.descricao}</p>
            <div className={estilos.numeros}>
              <div><strong>{casosDaGestao.length}</strong><span>casos</span></div>
              <div><strong>{new Set(casosDaGestao.map((c) => c.autor)).size}</strong><span>pessoas</span></div>
              <div><strong>{new Set(casosDaGestao.flatMap((c) => c.padroes)).size}</strong><span>padrões</span></div>
            </div>
          </section>
        )}

        {/* Painel da direita: caso escolhido, padrões ou visão geral */}
        <section className={estilos.painel} style={{ left: px(1200), top: py(130), width: px(370) }}>
          {caso ? (
            <>
              <div className={estilos.rotulo}>Caso {caso.id} · {caso.gestao}</div>
              <h3 className={estilos.tituloCaso}>{caso.titulo}</h3>
              <p className={estilos.autor}>{pessoaPorId[caso.autor].nome} · {caso.area} · {ORIGEM[caso.origem]}</p>
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

      <form className={estilos.pergunta} onSubmit={(e) => e.preventDefault()}>
        <input placeholder="Pergunte ao LegaCITi: o que o CITi já aprendeu sobre…" aria-label="Pergunte ao LegaCITi" />
        <button type="submit" aria-label="Enviar pergunta">→</button>
      </form>
    </div>
  );
}
