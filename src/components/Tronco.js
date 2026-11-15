"use client";

import { useMemo } from "react";
import {
  RAIO_NUCLEO, RAIO_EXTERNO, SETORES,
  raiosDoAnel, caminhoOndulado, caminhoCasca, caminhoFaixa, centroPara, ponto, semente,
} from "@/lib/geometria";
import estilos from "./Tronco.module.css";

// Desenho do tronco. Cada anel é uma gestão; cada ponto é um caso.
export default function Tronco({ gestoes, casos, posicoes, selecionado, gestaoAtiva, padraoAtivo, relevancia, aoEscolherCaso, aoEscolherGestao }) {
  const total = gestoes.length;

  // Linhas finas de crescimento dentro de cada anel, para dar textura de madeira.
  const linhasDeCrescimento = useMemo(() => {
    const linhas = [];
    gestoes.forEach((g, i) => {
      if (g.status === "em_formacao") return;
      const { interno, externo } = raiosDoAnel(i, total);
      for (let k = 1; k <= 7; k++) {
        const r = interno + ((externo - interno) * k) / 8 + (semente(g.codigo + k) - 0.5) * 2;
        linhas.push({ chave: g.codigo + k, d: caminhoOndulado(r, g.codigo + k, 0.008) });
      }
    });
    return linhas;
  }, [gestoes, total]);

  // Rachaduras em cunha, abertas na borda e finas perto do centro.
  const rachaduras = useMemo(() => [[28, 0.86], [148, 0.62], [258, 0.74]].map(([ang, alcance], i) => {
    const pts = [];
    const passos = 9;
    for (let k = 0; k <= passos; k++) {
      const r = RAIO_NUCLEO + 12 + (RAIO_EXTERNO * alcance - RAIO_NUCLEO - 12) * (k / passos);
      const desvio = (semente("rc" + i + k) - 0.5) * 3;
      const abertura = 0.5 + 7.5 * Math.pow(k / passos, 1.6);
      pts.push([ponto(r, ang + desvio - abertura * (40 / r)), ponto(r, ang + desvio + abertura * (40 / r))]);
    }
    const ida = pts.map(([a]) => `${a.x.toFixed(1)} ${a.y.toFixed(1)}`).join("L");
    const volta = pts.reverse().map(([, b]) => `${b.x.toFixed(1)} ${b.y.toFixed(1)}`).join("L");
    return `M${ida}L${volta}Z`;
  }), []);

  // Raios da madeira: linhas muito finas da medula até a casca.
  const raiosMedulares = useMemo(() => Array.from({ length: 48 }, (_, i) => {
    const ang = i * 7.5 + semente("rm" + i) * 4;
    const a = ponto(RAIO_NUCLEO + 8 + semente("ra" + i) * 60, ang);
    const b = ponto(RAIO_EXTERNO * (0.7 + 0.28 * semente("rb" + i)), ang);
    return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }), []);

  // Faixas alternadas de madeira clara e escura, uma por anel.
  const faixas = useMemo(() => gestoes.map((g, i) => {
    if (g.status === "em_formacao") return null;
    const { interno, externo } = raiosDoAnel(i, total);
    const meio = interno + (externo - interno) * (0.55 + 0.2 * semente(g.codigo));
    return { chave: g.codigo, d: caminhoFaixa(meio, externo, g.codigo) };
  }).filter(Boolean), [gestoes, total]);

  // Casca grossa e rugosa, com fissuras.
  const casca = useMemo(() => caminhoCasca(RAIO_EXTERNO + 40), []);
  const cascaInterna = useMemo(() => caminhoOndulado(RAIO_EXTERNO + 5, "cambio", 0.006), []);
  const fissuras = useMemo(() => Array.from({ length: 200 }, (_, i) => {
    const ang = i * 1.8 + semente("f" + i) * 1.5;
    const ini = RAIO_EXTERNO + 6 + semente("g" + i) * 6;
    const fim = RAIO_EXTERNO + 22 + semente("h" + i) * 20;
    const a = ponto(ini, ang);
    const b = ponto(fim, ang + (semente("k" + i) - 0.5) * 2.5);
    return { d: `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`, forte: semente("j" + i) > 0.7 };
  }), []);

  // Pontos do padrão ativo, em ordem de gestão, ligados por uma linha.
  const linhaPadrao = useMemo(() => {
    if (!padraoAtivo) return null;
    const ordem = gestoes.map((g) => g.codigo);
    const doPadrao = casos
      .filter((c) => c.padroes.includes(padraoAtivo))
      .sort((a, b) => ordem.indexOf(a.gestao) - ordem.indexOf(b.gestao) || posicoes[a.id].angulo - posicoes[b.id].angulo);
    return doPadrao.map((c) => posicoes[c.id]);
  }, [padraoAtivo, casos, gestoes, posicoes]);

  return (
    <g>
      <defs>
        <radialGradient id="madeira" cx="47%" cy="52%" r="55%">
          <stop offset="0%" stopColor="#11301d" />
          <stop offset="55%" stopColor="#0a1c11" />
          <stop offset="88%" stopColor="#0d2416" />
          <stop offset="100%" stopColor="#061009" />
        </radialGradient>
        <filter id="brilho" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="brilhoForte" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="texturaCasca" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09 0.02" numOctaves="3" seed="4" result="r" />
          <feColorMatrix in="r" type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 1.6 -0.75" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* Casca */}
      <path d={casca} className={estilos.casca} />
      <path d={casca} className={estilos.cascaTextura} />
      <g className={estilos.fissuras}>{fissuras.map((f, i) => <path key={i} d={f.d} className={f.forte ? estilos.fissuraForte : undefined} />)}</g>

      {/* Madeira */}
      <path d={cascaInterna} fill="url(#madeira)" className={estilos.cambio} />
      <g className={estilos.faixas}>{faixas.map((f) => <path key={f.chave} d={f.d} fillRule="evenodd" />)}</g>
      <g className={estilos.raiosMedulares}>{raiosMedulares.map((d, i) => <path key={i} d={d} />)}</g>

      {/* Pulso do coração do tronco */}
      <circle cx={centroPara(RAIO_EXTERNO / 2).x} cy={centroPara(RAIO_EXTERNO / 2).y} r={RAIO_EXTERNO} className={estilos.pulso} />

      <g className={estilos.crescimento}>{linhasDeCrescimento.map((l) => <path key={l.chave} d={l.d} />)}</g>
      <g className={estilos.rachaduras}>{rachaduras.map((d, i) => <path key={i} d={d} />)}</g>

      {/* Anéis: uma gestão cada */}
      {gestoes.map((g, i) => {
        const { externo } = raiosDoAnel(i, total);
        const ativo = gestaoAtiva === g.codigo;
        if (g.status === "em_formacao") {
          return <path key={g.codigo} d={caminhoOndulado(externo, g.codigo)} className={`${estilos.anelFormacao} ${ativo ? estilos.anelAtivo : ""}`} />;
        }
        if (g.status === "fechando") {
          const fracao = g.conversas.feitas / g.conversas.esperadas;
          const fim = -90 + 360 * fracao;
          return (
            <g key={g.codigo}>
              <path d={caminhoOndulado(externo, g.codigo, 0.007, -90, fim)} className={`${estilos.anel} ${ativo ? estilos.anelAtivo : ""}`} filter="url(#brilho)" />
              <path d={caminhoOndulado(externo, g.codigo, 0.007, fim, 270)} className={estilos.anelPendente} />
            </g>
          );
        }
        return <path key={g.codigo} d={caminhoOndulado(externo, g.codigo)} className={`${estilos.anel} ${ativo ? estilos.anelAtivo : ""}`} filter="url(#brilho)" />;
      })}

      {/* Núcleo */}
      <circle cx={centroPara(RAIO_NUCLEO).x} cy={centroPara(RAIO_NUCLEO).y} r={RAIO_NUCLEO} className={estilos.nucleo} filter="url(#brilhoForte)" />
      <circle cx={centroPara(0).x} cy={centroPara(0).y} r={6} className={estilos.centro} />

      {/* Áreas clicáveis de cada anel */}
      {gestoes.map((g, i) => {
        const { interno, externo } = raiosDoAnel(i, total);
        const meio = (interno + externo) / 2;
        return (
          <circle key={"alvo" + g.codigo} cx={centroPara(meio).x} cy={centroPara(meio).y} r={meio} className={estilos.alvoAnel}
            strokeWidth={externo - interno} onClick={() => aoEscolherGestao(g.codigo)}>
            <title>{`Gestão ${g.codigo}`}</title>
          </circle>
        );
      })}

      {/* Linha do padrão atravessando as gerações */}
      {linhaPadrao && (
        <g className={estilos.linhaPadrao}>
          {linhaPadrao.map((p, i) => {
            const n = ponto(RAIO_NUCLEO, p.angulo);
            return <line key={i} x1={p.x} y1={p.y} x2={n.x} y2={n.y} />;
          })}
        </g>
      )}

      {/* Casos */}
      {casos.map((c) => {
        const p = posicoes[c.id];
        const doPadrao = padraoAtivo && c.padroes.includes(padraoAtivo);
        const rel = relevancia ? relevancia[c.id] : null;
        const apagado = (padraoAtivo && !doPadrao) || rel === 0;
        const destaque = rel === 2 && !padraoAtivo;
        const escolhido = selecionado === c.id;
        return (
          <g key={c.id} onClick={() => aoEscolherCaso(c.id)} className={estilos.caso}>
            <circle cx={p.x} cy={p.y} r={12} fill="transparent" />
            <circle cx={p.x} cy={p.y} r={escolhido ? 6 : doPadrao || destaque ? 4.5 : 3}
              className={`${estilos.ponto} ${apagado ? estilos.pontoApagado : ""} ${escolhido || doPadrao || destaque ? estilos.pontoAceso : ""} ${c.origem === "em_andamento" ? estilos.pontoAndamento : ""}`}
              filter={escolhido || doPadrao || destaque ? "url(#brilho)" : undefined} />
            <title>{c.titulo}</title>
          </g>
        );
      })}

      {/* Nomes das áreas, curvados ao longo da casca */}
      {SETORES.map((s, i) => {
        const fatia = 360 / SETORES.length;
        const meio = -90 + i * fatia + fatia / 2;
        const r = RAIO_EXTERNO + 64;
        const embaixo = Math.sin((meio * Math.PI) / 180) > 0.2;
        const a1 = ponto(r, meio - 30), a2 = ponto(r, meio + 30);
        const d = embaixo
          ? `M${a2.x} ${a2.y}A${r} ${r} 0 0 0 ${a1.x} ${a1.y}`
          : `M${a1.x} ${a1.y}A${r} ${r} 0 0 1 ${a2.x} ${a2.y}`;
        return (
          <g key={s}>
            <path id={`setor-${i}`} d={d} fill="none" />
            <text className={estilos.rotuloSetor} dominantBaseline="middle">
              <textPath href={`#setor-${i}`} startOffset="50%" textAnchor="middle">{s.toUpperCase()}</textPath>
            </text>
          </g>
        );
      })}
    </g>
  );
}
