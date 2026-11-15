"use client";

import { useMemo } from "react";
import {
  RAIO_NUCLEO, RAIO_EXTERNO, SETORES,
  raiosDoAnel, caminhoOndulado, caminhoCasca, caminhoFaixa, centroPara, ponto, semente, naTela, ESCALA_X, TRANSFORMACAO_CORTE,
} from "@/lib/geometria";
import estilos from "./Tronco.module.css";

// Desenho do tronco. Cada anel é uma gestão; cada ponto é um caso.
export default function Tronco({ gestoes, casos, posicoes, selecionado, gestaoAtiva, padraoAtivo, relevancia, aoEscolherCaso, aoEscolherGestao, decorativo = false }) {
  const total = gestoes.length;

  // Linhas finas de crescimento dentro de cada anel, para dar textura de madeira.
  const linhasDeCrescimento = useMemo(() => {
    const linhas = [];
    gestoes.forEach((g, i) => {
      if (g.status === "em_formacao") return;
      const { interno, externo } = raiosDoAnel(i, total);
      for (let k = 1; k <= 10; k++) {
        const r = interno + ((externo - interno) * k) / 11 + (semente(g.codigo + k) - 0.5) * 2;
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

  // Corpo da tora: a lateral da casca aparece atrás do corte, indo para o fundo.
  const tora = useMemo(() => {
    const R = RAIO_EXTERNO + 40;
    const c = naTela(centroPara(R));
    const rx = R * ESCALA_X, ry = R;
    const dx = -230, dy = -70;
    const lado = (x0, y0, chave) => {
      let d = "";
      for (let k = 1; k <= 20; k++) {
        const x = x0 + (dx * k) / 20, y = y0 + (dy * k) / 20 + (semente(chave + k) - 0.5) * 6;
        d += `L${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      return d;
    };
    const corpo = `M${c.x} ${c.y - ry}` + lado(c.x, c.y - ry, "t") +
      `A${rx} ${ry} 0 0 0 ${c.x + dx} ${c.y + ry + dy}` +
      `L${c.x} ${c.y + ry}Z`;
    const veias = Array.from({ length: 11 }, (_, i) => {
      const ang = 110 + (140 * i) / 10 + (semente("va" + i) - 0.5) * 8;
      const a = (ang * Math.PI) / 180;
      const x0 = c.x + rx * Math.cos(a), y0 = c.y + ry * Math.sin(a);
      let d = `M${x0.toFixed(1)} ${y0.toFixed(1)}`;
      for (let k = 1; k <= 16; k++) {
        const t = k / 16;
        const x = x0 + dx * t * 1.05, y = y0 + dy * t * 1.05 + Math.sin(k * 0.45 + i * 1.7) * 5;
        d += `L${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      return { d, forte: semente("vf" + i) > 0.5 };
    });
    const sulcos = Array.from({ length: 80 }, (_, i) => {
      const ang = 92 + (176 * i) / 79;
      const a = (ang * Math.PI) / 180;
      const x0 = c.x + rx * Math.cos(a), y0 = c.y + ry * Math.sin(a);
      const t = 0.6 + 0.45 * semente("sl" + i);
      return `M${x0.toFixed(1)} ${y0.toFixed(1)}L${(x0 + dx * t).toFixed(1)} ${(y0 + dy * t + (semente("sy" + i) - 0.5) * 6).toFixed(1)}`;
    });
    return { corpo, veias, sulcos, fundo: { x: c.x + dx, y: c.y + dy, rx, ry } };
  }, []);

  // Painel HUD ligado ao tronco: casos por gestão, do centro para a casca.
  const hud = useMemo(() => {
    const contagem = gestoes.map((g) => casos.filter((c) => c.gestao === g.codigo).length);
    const max = Math.max(...contagem);
    const alvo = naTela(ponto(RAIO_EXTERNO + 30, 38));
    return { contagem, max, alvo };
  }, [gestoes, casos]);

  // Feixes de luz verde ao fundo.
  const feixes = [
    "M-50 760 C 300 700, 520 820, 820 640 S 1300 520, 1700 600",
    "M-50 840 C 260 800, 600 880, 900 760 S 1350 700, 1700 760",
    "M1700 180 C 1400 260, 1200 140, 980 230",
  ];

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
        <linearGradient id="sombraTora" gradientUnits="userSpaceOnUse" x1="560" y1="0" x2="240" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.85" />
        </linearGradient>
        <filter id="texturaCasca" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09 0.02" numOctaves="3" seed="4" result="r" />
          <feColorMatrix in="r" type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 1.6 -0.75" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      {/* Feixes de luz */}
      <g className={estilos.feixes} filter="url(#brilho)">{feixes.map((d, i) => <path key={i} d={d} />)}</g>

      {/* Corpo da tora: lateral da casca com veias de seiva */}
      <g>
        <path d={tora.corpo} className={estilos.toraCorpo} />
        <path d={tora.corpo} className={estilos.toraTextura} />
        <g className={estilos.sulcos}>{tora.sulcos.map((d, i) => <path key={i} d={d} />)}</g>
        <path d={tora.corpo} className={estilos.toraSombra} />
        <g filter="url(#brilho)">
          {tora.veias.map((v, i) => <path key={i} d={v.d} className={v.forte ? estilos.veiaForte : estilos.veia} />)}
        </g>
      </g>

      {/* Corte do tronco, visto em perspectiva */}
      <g transform={TRANSFORMACAO_CORTE}>
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

      </g>

      {/* HUD: casos por gestão */}
      {!decorativo && <g className={estilos.hud} aria-hidden="true">
        <polyline className={estilos.linha} points={`${hud.alvo.x},${hud.alvo.y} 1040,${hud.alvo.y + 40} 1040,742`} />
        <circle className={estilos.ponta} cx={hud.alvo.x} cy={hud.alvo.y} r="3" />
        <rect className={estilos.caixa} x="1040" y="742" width="150" height="86" />
        <text x="1052" y="760">CASOS POR ANEL</text>
        <text x="1052" y="783" className={estilos.numero}>{casos.length}</text>
        {hud.contagem.map((n, i) => {
          const h = (n / hud.max) * 38;
          return <rect key={i} x={1104 + i * 11} y={816 - h} width="7" height={h} className={i === hud.contagem.length - 2 ? estilos.barraAtual : estilos.barra} />;
        })}
      </g>}

      {/* Nomes das áreas, curvados ao longo da casca (fora da perspectiva, para o texto não deformar) */}
      {!decorativo && SETORES.map((s, i) => {
        const fatia = 360 / SETORES.length;
        const meio = -90 + i * fatia + fatia / 2;
        const r = RAIO_EXTERNO + 64;
        const embaixo = Math.sin((meio * Math.PI) / 180) > 0.2;
        const angs = Array.from({ length: 13 }, (_, k) => meio - 26 + (52 * k) / 12);
        const pts = (embaixo ? angs.reverse() : angs).map((a) => naTela(ponto(r, a)));
        const d = "M" + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("L");
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
