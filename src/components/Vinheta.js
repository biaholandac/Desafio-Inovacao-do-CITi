"use client";

import { useEffect, useState } from "react";
import Marca from "./Marca";
import estilos from "./Vinheta.module.css";

// Vinheta de abertura (cerca de 8 s): os anéis do tronco nascem do centro, um por gestão,
// e a marca do LegaCITi aparece no fim. Toca uma vez por visita; ?vinheta=1 força, ?vinheta=0 pula.
const GESTOES = ["2024.1", "2024.2", "2025.1", "2025.2", "2026.1", "2026.2", "2027.1"];
const DURACAO_MS = 8200;
const CHAVE = "legaciti:vinheta-vista";

export default function Vinheta() {
  const [estado, setEstado] = useState("tocando"); // tocando | saindo | fim
  const [gravando, setGravando] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("vinheta");
    let vista = false;
    try { vista = sessionStorage.getItem(CHAVE) === "1"; } catch {}
    const semMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (p === "0" || (p !== "1" && p !== "gravar" && (vista || semMovimento))) { setEstado("fim"); return; }
    if (p === "gravar") { setGravando(true); return; } // modo para gravar o vídeo: sem relógio e sem botão
    try { sessionStorage.setItem(CHAVE, "1"); } catch {}
    const t = setTimeout(() => setEstado("fim"), DURACAO_MS);
    return () => clearTimeout(t);
  }, []);

  function pular() {
    setEstado("saindo");
    setTimeout(() => setEstado("fim"), 450);
  }

  if (estado === "fim") return null;

  return (
    <div className={`${estilos.vinheta} ${estado === "saindo" ? estilos.saindo : ""} ${gravando ? estilos.gravando : ""}`} aria-label="Abertura do LegaCITi" role="presentation">
      <svg className={estilos.aneis} viewBox="-500 -300 1000 600" aria-hidden="true">
        <defs>
          <filter id="vinhetaBrilho" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="vinhetaMiolo">
            <stop offset="0" stopColor="#8dffc0" stopOpacity=".9" />
            <stop offset=".4" stopColor="#2fd97a" stopOpacity=".45" />
            <stop offset="1" stopColor="#2fd97a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse className={estilos.miolo} rx="70" ry="42" fill="url(#vinhetaMiolo)" />
        <g filter="url(#vinhetaBrilho)">
          {GESTOES.map((g, i) => {
            const rx = 62 + i * 54;
            return (
              <g key={g} className={estilos.anel} style={{ "--i": i }}>
                <ellipse rx={rx} ry={rx * 0.58} fill="none" stroke={i === GESTOES.length - 1 ? "#8dffc0" : "#2fd97a"}
                  strokeWidth={i === GESTOES.length - 1 ? 3 : 2.2} strokeDasharray={i === GESTOES.length - 1 ? "10 8" : undefined} />
              </g>
            );
          })}
        </g>
        <g className={estilos.veios}>
          {Array.from({ length: 20 }, (_, k) => {
            const rx = 40 + k * 19.5;
            return <ellipse key={k} className={estilos.veio} style={{ "--i": k / 2.85 }} rx={rx} ry={rx * 0.58} fill="none" stroke="#2fd97a" strokeWidth="0.8" />;
          })}
        </g>
        {GESTOES.map((g, i) => {
          const rx = 62 + i * 54;
          return <text key={g} className={estilos.ano} style={{ "--i": i }} x={0} y={-rx * 0.58 - 10} textAnchor="middle">{g}</text>;
        })}
      </svg>

      <p className={`${estilos.frase} ${estilos.frase1}`}>Todo semestre, o CITi se renova.</p>
      <p className={`${estilos.frase} ${estilos.frase2}`}>E cada gestão deixa <em>um anel.</em></p>

      <div className={estilos.marca}>
        <Marca altura={92} />
        <span className={estilos.slogan}>A memória coletiva do CITi</span>
      </div>

      {!gravando && <button className={estilos.pular} onClick={pular}>Pular</button>}
    </div>
  );
}
