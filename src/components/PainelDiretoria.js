"use client";

import { useEffect, useRef, useState } from "react";
import { AVISOS } from "@/lib/avisos";
import estilos from "./PainelDiretoria.module.css";

const CHAVE_PAUTA = "legaciti:pauta:v3";

export default function PainelDiretoria({ painel, casos, aoAbrirCaso, aoFechar }) {
  const [pauta, setPauta] = useState(null);

  const fechar = useRef(aoFechar);
  fechar.current = aoFechar;
  useEffect(() => {
    try { const salva = JSON.parse(window.localStorage.getItem(CHAVE_PAUTA) ?? "null"); if (salva) setPauta(salva); } catch {}
    const tecla = (e) => { if (e.key === "Escape") fechar.current(); };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, []);

  async function gerarPauta() {
    setPauta({ carregando: true });
    const controle = new AbortController();
    const relogio = setTimeout(() => controle.abort(), 58000);
    try {
      const r = await fetch("/api/diretoria", { method: "POST", signal: controle.signal });
      if (!r.ok) throw new Error();
      const dados = await r.json();
      setPauta(dados);
      if (dados.origem === "ia") { try { window.localStorage.setItem(CHAVE_PAUTA, JSON.stringify(dados)); } catch {} }
    } catch {
      setPauta({ erro: true });
    } finally {
      clearTimeout(relogio);
    }
  }

  const totalFeitas = painel.areas.reduce((s, a) => s + a.feitas, 0);
  const totalEsperadas = painel.areas.reduce((s, a) => s + a.esperadas, 0);
  const titulo = (id) => casos.find((c) => c.id === id)?.titulo ?? id;
  const emAlta = painel.padroes.filter((p) => p.risco);

  return (
    <div className={estilos.fundo} role="dialog" aria-modal="true" aria-label="Painel da diretoria">
      <div className={estilos.quadro}>
        <header className={estilos.topo}>
          <div>
            <div className={estilos.rotulo}>Painel da diretoria · gestão {painel.atual}</div>
            <h2 className={estilos.titulo}>A saúde do legado <em>desta gestão.</em></h2>
          </div>
          <button className={estilos.fechar} onClick={aoFechar} aria-label="Fechar painel">✕</button>
        </header>

        <div className={estilos.grade}>
          <section className={estilos.bloco}>
            <div className={estilos.rotulo}>Conversas de legado por área</div>
            <p className={estilos.grande}><strong>{totalFeitas}</strong> de {totalEsperadas} feitas</p>
            <ul className={estilos.areas}>
              {painel.areas.map((a, i) => {
                const pct = a.feitas / a.esperadas;
                return (
                  <li key={a.area} className={i === 0 && pct < 1 ? estilos.atrasada : ""}>
                    <div className={estilos.linhaArea}>
                      <span>{a.area}</span>
                      <span>{a.feitas}/{a.esperadas}</span>
                    </div>
                    <div className={estilos.barra}><div style={{ width: `${pct * 100}%` }} /></div>
                    {i === 0 && pct < 1 && <div className={estilos.nota}>Área com mais conversas pendentes</div>}
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={estilos.bloco}>
            <div className={estilos.rotulo}>Padrões nesta gestão × média anterior</div>
            <ul className={estilos.padroes}>
              {emAlta.map((p) => {
                const sobe = p.atual > p.media + 0.5;
                const desce = p.atual < p.media - 0.5;
                return (
                  <li key={p.padrao}>
                    <div className={estilos.linhaArea}>
                      <span><b>{p.padrao}</b> · {p.nome}</span>
                      <span className={sobe ? estilos.sobe : desce ? estilos.desce : estilos.estavel}>
                        {sobe ? "▲" : desce ? "▼" : "●"} {p.atual} <small>vs {p.media.toFixed(1)}</small>
                      </span>
                    </div>
                    <div className={estilos.duasBarras}>
                      <div className={estilos.barraMedia} style={{ width: `${Math.min(100, p.media * 10)}%` }} />
                      <div className={estilos.barraAtual} style={{ width: `${Math.min(100, p.atual * 10)}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className={estilos.legenda}><span className={estilos.chaveAtual} /> {painel.atual} <span className={estilos.chaveMedia} /> média das gestões anteriores</p>
          </section>

          <section className={estilos.bloco}>
            <div className={estilos.rotulo}>Legado que apoia {painel.formacao}</div>
            <p className={estilos.explica}>Para cada situação em andamento, o aprendizado de casos anteriores que pode ajudar.</p>
            {painel.apoio.length === 0 && <p className={estilos.explica}>Ainda não há casos anteriores próximos das situações em andamento.</p>}
            <ul className={estilos.alertas}>
              {painel.apoio.map((a) => (
                <li key={a.caso.id}>
                  <button className={estilos.casoLink} onClick={() => aoAbrirCaso(a.caso.id)}>{a.caso.titulo}</button>
                  <span className={estilos.aprendizado}>“{a.aprendizado}”</span>
                  <span className={estilos.citacoes}>
                    Do legado {a.parecidos.map((x) => <button key={x.id} title={x.titulo} onClick={() => aoAbrirCaso(x.id)}>{x.id}</button>)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className={`${estilos.bloco} ${estilos.pauta}`}>
            <div className={estilos.rotulo}>Pauta da próxima reunião de diretoria</div>
            {!pauta && (
              <>
                <p className={estilos.explica}>O LegaCITi junta os números acima com o que o legado já ensinou e sugere três pontos de pauta, citando os casos.</p>
                <button className={estilos.gerar} onClick={gerarPauta}>Montar a pauta</button>
              </>
            )}
            {pauta?.carregando && <p className={estilos.explica}><span className={estilos.pontinho} /> Montando a pauta a partir do legado…</p>}
            {pauta?.erro && (
              <>
                <p className={estilos.explica}>Não consegui montar a pauta agora.</p>
                <button className={estilos.gerar} onClick={gerarPauta}>Tentar de novo</button>
              </>
            )}
            {pauta?.pontos && (
              <>
                <ol className={estilos.pontos}>
                  {pauta.pontos.map((p, i) => (
                    <li key={i}>
                      <strong>{p.titulo}</strong>
                      <span>{p.texto}</span>
                      {p.casos.length > 0 && (
                        <span className={estilos.citacoes}>{p.casos.map((id) => <button key={id} title={titulo(id)} onClick={() => aoAbrirCaso(id)}>{id}</button>)}</span>
                      )}
                    </li>
                  ))}
                </ol>
                <p className={pauta.origem === "ia" ? estilos.legenda : estilos.avisoSemIA}>{pauta.origem === "ia" ? "Sugerida pela IA com base só nos dados e casos citados." : AVISOS.pauta} <button className={estilos.refazer} onClick={gerarPauta}>Refazer</button></p>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
