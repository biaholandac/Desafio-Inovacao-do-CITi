"use client";

import { useEffect, useState } from "react";
import base from "./Entrevista.module.css";
import { AVISOS } from "@/lib/avisos";
import estilos from "./Briefing.module.css";

const SECOES = [
  { id: "deuCerto", nome: "O que já deu certo" },
  { id: "deuErrado", nome: "O que já deu errado" },
  { id: "perguntas", nome: "Perguntas para fazer ao cliente" },
  { id: "riscos", nome: "Riscos para ficar de olho" },
];

const EXEMPLO = "Vamos começar um aplicativo para uma clínica: agendamento de consultas pelos pacientes e uma agenda para as recepcionistas. O squad tem quatro pessoas e o prazo é de dois meses.";

// Briefing de projeto: descreve o projeto que vai começar e recebe o que o legado ensina sobre ele.
export default function Briefing({ extras = [], aoFechar, aoAbrirCaso }) {
  const [descricao, setDescricao] = useState("");
  const [pensando, setPensando] = useState(false);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const tecla = (e) => { if (e.key === "Escape") aoFechar(); };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [aoFechar]);

  async function gerar(e) {
    e?.preventDefault();
    const texto = descricao.trim();
    if (!texto || pensando) return;
    setPensando(true);
    setResultado(null);
    const controle = new AbortController();
    const relogio = setTimeout(() => controle.abort(), 58000);
    try {
      const r = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descricao: texto, extras }),
        signal: controle.signal,
      });
      if (!r.ok) throw new Error();
      setResultado(await r.json());
    } catch {
      setResultado({ tipo: "erro", resposta: AVISOS.conexao });
    } finally {
      clearTimeout(relogio);
      setPensando(false);
    }
  }

  const briefing = resultado?.tipo === "briefing" ? resultado.briefing : null;

  return (
    <div className={base.fundo} role="dialog" aria-modal="true" aria-label="Briefing de projeto">
      <div className={`${base.caixa} ${estilos.caixa}`}>
        <header className={base.topo}>
          <div>
            <div className={base.rotulo}>Briefing de projeto</div>
            <div className={base.quem}>O que o legado ensina antes de começar</div>
          </div>
          <button className={base.fechar} onClick={aoFechar} aria-label="Fechar briefing">✕</button>
        </header>

        <div className={base.corpo}>
          {!briefing && (
            <>
              <h2 className={base.pergunta}>Que projeto vocês vão começar?</h2>
              <p className={base.explica}>Conte para quem é, o que vai ser construído e o que já se sabe. O LegaCITi procura projetos parecidos no legado e monta o briefing, citando os casos de onde veio cada ponto.</p>
              <form onSubmit={gerar} className={base.resposta}>
                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={4} maxLength={800}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) gerar(e); }}
                  placeholder="Ex.: um aplicativo de agendamento para uma clínica, com área do paciente e agenda da recepção" aria-label="Descrição do projeto" />
                <div className={base.acoes}>
                  {!descricao && <button type="button" className={estilos.exemplo} onClick={() => setDescricao(EXEMPLO)}>Usar um exemplo</button>}
                  <span className={base.dica}>{pensando ? "Procurando projetos parecidos no legado… pode levar até meio minuto" : "Enter gera o briefing"}</span>
                  <button className={base.enviar} disabled={!descricao.trim() || pensando}>{pensando ? "Gerando…" : "Gerar briefing"}</button>
                </div>
              </form>
              {resultado && !briefing && <p className={estilos.aviso}>{resultado.resposta}</p>}
            </>
          )}

          {briefing && (
            <>
              <p className={estilos.projeto}>{descricao}</p>
              {resultado.origem === "dados"
                ? <p className={estilos.semIA}>{AVISOS.briefing(resultado.casos.length)}</p>
                : <p className={estilos.resumo}>{briefing.resumo}</p>}
              <div className={estilos.secoes}>
                {SECOES.map((s) => (briefing[s.id]?.length ? (
                  <section key={s.id} className={`${estilos.secao} ${estilos[s.id]}`}>
                    <h3>{s.nome}</h3>
                    <ul>
                      {briefing[s.id].map((item, i) => (
                        <li key={i}>
                          <span>{item.texto}</span>
                          <span className={estilos.fontes}>
                            {item.casos.map((id) => <button key={id} onClick={() => aoAbrirCaso(id)}>{id}</button>)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null))}
              </div>
              <div className={base.acoesFinais}>
                <span className={base.dica}>
                  Feito a partir de {resultado.casos.length} casos do legado. Toque num código para abrir o caso.
                </span>
                {resultado.origem === "dados" && <button className={estilos.exemplo} onClick={() => gerar()} disabled={pensando}>{pensando ? "Gerando…" : "Gerar de novo"}</button>}
                <button className={estilos.exemplo} onClick={() => setResultado(null)}>Descrever outro projeto</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
