"use client";

import { useEffect, useRef, useState } from "react";
import { padroes } from "@/data";
import { AVISOS } from "@/lib/avisos";
import estilos from "./Entrevista.module.css";

const TIPOS = [
  { id: "momento", nome: "Algo que aconteceu", detalhe: "Uma situação que incomodou ou que vale registrar agora para quem ocupar o seu cargo depois." },
  { id: "squad", nome: "Fim de projeto", detalhe: "O que o squad aprendeu no projeto que terminou." },
  { id: "fim_gestao", nome: "Fim de gestão", detalhe: "A situação desta gestão que vale passar adiante." },
  { id: "despedida", nome: "Despedida", detalhe: "O que você quer deixar antes de sair do CITi." },
];
const NOME_TIPO = Object.fromEntries(TIPOS.map((t) => [t.id, t.nome]));
const TOTAL_ESPERADO = 5;

// Transcrição de voz do próprio navegador (Chrome e Edge). Sem suporte, o microfone fica desativado.
function useVoz(aoTranscrever) {
  const [suportada, setSuportada] = useState(false);
  const [ouvindo, setOuvindo] = useState(false);
  const reconhecedor = useRef(null);
  const retorno = useRef(aoTranscrever);
  retorno.current = aoTranscrever;

  useEffect(() => {
    const Reconhecimento = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!Reconhecimento) return;
    const r = new Reconhecimento();
    r.lang = "pt-BR";
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e) => {
      let final = "", parcial = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t; else parcial += t;
      }
      retorno.current({ final, parcial });
    };
    r.onend = () => setOuvindo(false);
    r.onerror = () => setOuvindo(false);
    reconhecedor.current = r;
    setSuportada(true);
    return () => { try { r.abort(); } catch {} };
  }, []);

  function alternar() {
    const r = reconhecedor.current;
    if (!r) return;
    if (ouvindo) { r.stop(); setOuvindo(false); return; }
    try { r.start(); setOuvindo(true); } catch {}
  }
  function parar() {
    if (ouvindo) { try { reconhecedor.current?.stop(); } catch {} setOuvindo(false); }
  }
  return { suportada, ouvindo, alternar, parar };
}

export default function Entrevista({ entrada, gestao, aoFechar, aoRegistrar }) {
  const [tipo, setTipo] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [parcial, setParcial] = useState("");
  const [pensando, setPensando] = useState(false);
  const [rascunho, setRascunho] = useState(null);
  const [aviso, setAviso] = useState("");
  const [casoSemIA, setCasoSemIA] = useState(false);
  const campo = useRef(null);

  const voz = useVoz(({ final, parcial }) => {
    if (final) setResposta((atual) => (atual ? atual.trimEnd() + " " : "") + final.trim());
    setParcial(parcial);
  });

  useEffect(() => {
    const tecla = (e) => { if (e.key === "Escape") aoFechar(); };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [aoFechar]);

  useEffect(() => { if (pergunta && !pensando) campo.current?.focus(); }, [pergunta, pensando]);

  async function pedir(tipoEscolhido, hist) {
    setPensando(true);
    setAviso("");
    const controle = new AbortController();
    const relogio = setTimeout(() => controle.abort(), 58000);
    try {
      const r = await fetch("/api/entrevista", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: tipoEscolhido, cargo: entrada?.cargo.nome, historico: hist }),
        signal: controle.signal,
      });
      if (!r.ok) throw new Error();
      const dados = await r.json();
      if (dados.acao === "concluir") {
        setRascunho(dados.caso);
        setCasoSemIA(dados.origem === "reserva");
        setPergunta("");
      } else {
        if (dados.acao === "redirecionar") {
          // A resposta não entra no histórico: a pergunta anterior continua valendo.
          setHistorico(hist.slice(0, -1));
          setAviso(dados.pergunta);
          return;
        }
        setPergunta(dados.pergunta);
      }
    } catch {
      setAviso("Não consegui falar com o LegaCITi agora. Tente enviar de novo.");
      setHistorico(hist.slice(0, -1));
    } finally {
      clearTimeout(relogio);
      setPensando(false);
    }
  }

  function comecar(id) {
    setTipo(id);
    pedir(id, []);
  }

  function enviar(e) {
    e?.preventDefault();
    voz.parar();
    const texto = (resposta + (parcial ? " " + parcial : "")).trim();
    if (!texto || pensando) return;
    const hist = [...historico, { pergunta: aviso || pergunta, resposta: texto }];
    setHistorico(hist);
    setResposta("");
    setParcial("");
    pedir(tipo, hist);
  }

  function editar(campoNome, valor) {
    setRascunho((r) => ({ ...r, [campoNome]: valor }));
  }

  const etapa = !tipo ? "tipo" : rascunho ? "previa" : "conversa";

  return (
    <div className={estilos.fundo} role="dialog" aria-modal="true" aria-label="Registro de legado">
      <div className={estilos.caixa}>
        <header className={estilos.topo}>
          <div>
            <div className={estilos.rotulo}>Registro de legado{tipo ? ` · ${NOME_TIPO[tipo]}` : ""} · anel {gestao}</div>
            <div className={estilos.quem}>{entrada ? `${entrada.cargo.nome}` : "Membro do CITi"}</div>
          </div>
          <button className={estilos.fechar} onClick={aoFechar} aria-label="Fechar conversa">✕</button>
        </header>

        {etapa === "tipo" && (
          <div className={estilos.corpo}>
            <h2 className={estilos.pergunta}>O que você quer registrar?</h2>
            <p className={estilos.explica}>São poucas perguntas, uma de cada vez. Você pode digitar ou falar. No fim, você revisa o caso antes de ele entrar no tronco.</p>
            <div className={estilos.tipos}>
              {TIPOS.map((t) => (
                <button key={t.id} className={estilos.tipo} onClick={() => comecar(t.id)}>
                  <strong>{t.nome}</strong>
                  <span>{t.detalhe}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {etapa === "conversa" && (
          <div className={estilos.corpo}>
            <div className={estilos.progresso} aria-label={`Pergunta ${historico.length + 1}`}>
              {Array.from({ length: TOTAL_ESPERADO }, (_, i) => (
                <span key={i} className={i < historico.length ? estilos.feito : i === historico.length ? estilos.atual : ""} />
              ))}
            </div>

            {historico.length > 0 && (
              <ol className={estilos.ja}>
                {historico.map((h, i) => (
                  <li key={i}><span>{h.pergunta}</span>{h.resposta}</li>
                ))}
              </ol>
            )}

            {pensando ? (
              <p className={estilos.ouvindoIA}><span className={estilos.pontinho} /> O LegaCITi está ouvindo o que você contou…</p>
            ) : (
              <>
                <h2 className={estilos.pergunta}>{aviso || pergunta}</h2>
                <form onSubmit={enviar} className={estilos.resposta}>
                  <textarea ref={campo} value={resposta + (parcial ? (resposta ? " " : "") + parcial : "")}
                    onChange={(e) => { setResposta(e.target.value); setParcial(""); }}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) enviar(e); }}
                    placeholder={voz.ouvindo ? "Pode falar, estou transcrevendo…" : "Escreva aqui, ou toque no microfone para falar"}
                    rows={4} maxLength={1500} aria-label="Sua resposta" />
                  <div className={estilos.acoes}>
                    <button type="button" onClick={voz.alternar} disabled={!voz.suportada}
                      className={`${estilos.microfone} ${voz.ouvindo ? estilos.gravando : ""}`}
                      title={voz.suportada ? (voz.ouvindo ? "Parar de ouvir" : "Responder falando") : "Seu navegador não transcreve voz. Use o Chrome ou o Edge."}
                      aria-label={voz.ouvindo ? "Parar de ouvir" : "Responder falando"}>
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12h-2Z" /></svg>
                      {voz.ouvindo && <span className={estilos.ondas}><i /><i /><i /><i /></span>}
                    </button>
                    <span className={estilos.dica}>{voz.ouvindo ? "Ouvindo… toque de novo para parar" : "Enter envia · Shift+Enter quebra a linha"}</span>
                    <button type="submit" className={estilos.enviar} disabled={!(resposta || parcial).trim()}>Responder</button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}

        {etapa === "previa" && (
          <div className={estilos.corpo}>
            <div className={estilos.rotulo}>Prévia do seu caso</div>
            <p className={estilos.explica}>{casoSemIA ? AVISOS.entrevista : "Escrito só com o que você contou. Ajuste o que quiser antes de registrar."}</p>
            <div className={estilos.previa}>
              <input className={estilos.titulo} value={rascunho.titulo} onChange={(e) => editar("titulo", e.target.value)} aria-label="Título" maxLength={90} />
              {[["situacao", "Situação"], ["decisao", "Decisão"], ["resultado", "Resultado"], ["licao", "Lição"]].map(([k, nome]) => (
                <label key={k} className={estilos.campoPrevia}>
                  <span>{nome}</span>
                  <textarea value={rascunho[k] ?? ""} onChange={(e) => editar(k, e.target.value)} rows={2} maxLength={600} />
                </label>
              ))}
              {rascunho.padroes?.length > 0 && (
                <div className={estilos.padroes}>{rascunho.padroes.map((p) => <span key={p}>{p} · {padroes[p]}</span>)}</div>
              )}
            </div>
            <div className={estilos.acoesFinais}>
              <span className={estilos.dica}>Nesta demonstração, o caso fica salvo só neste navegador.</span>
              <button className={estilos.enviar} disabled={!rascunho.titulo?.trim() || !rascunho.situacao?.trim()}
                onClick={() => aoRegistrar({ rascunho, tipo })}>Registrar no legado</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
