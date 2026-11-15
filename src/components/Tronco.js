"use client";

import { useMemo } from "react";
import {
  CENTRO, RAIO_NUCLEO, RAIO_EXTERNO, SETORES,
  raiosDoAnel, caminhoOndulado, ponto, semente,
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
      for (let k = 1; k <= 5; k++) {
        const r = interno + ((externo - interno) * k) / 6;
        linhas.push({ chave: g.codigo + k, d: caminhoOndulado(r, g.codigo + k, 0.005) });
      }
    });
    return linhas;
  }, [gestoes, total]);

  // Rachaduras radiais, como na madeira cortada.
  const rachaduras = useMemo(() => [24, 151, 262].map((ang, i) => {
    const a = ponto(RAIO_NUCLEO + 20, ang);
    const meio = ponto(RAIO_EXTERNO * 0.6, ang + 3 * (semente("r" + i) - 0.5));
    const b = ponto(RAIO_EXTERNO * (0.82 + 0.1 * semente("q" + i)), ang + 2);
    return `M${a.x} ${a.y}L${meio.x} ${meio.y}L${b.x} ${b.y}`;
  }), []);

  // Casca: borda irregular por fora do último anel.
  const casca = useMemo(() => caminhoOndulado(RAIO_EXTERNO + 22, "casca", 0.014), []);
  const marcasCasca = useMemo(() => Array.from({ length: 90 }, (_, i) => {
    const ang = i * 4 + semente("m" + i) * 3;
    const a = ponto(RAIO_EXTERNO + 4, ang);
    const b = ponto(RAIO_EXTERNO + 14 + 10 * semente("n" + i), ang + 1);
    return `M${a.x} ${a.y}L${b.x} ${b.y}`;
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
        <radialGradient id="madeira" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0f2a1a" />
          <stop offset="70%" stopColor="#08140d" />
          <stop offset="100%" stopColor="#050a07" />
        </radialGradient>
        <filter id="brilho" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="brilhoForte" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Casca e corte da madeira */}
      <path d={casca} className={estilos.casca} />
      <g className={estilos.marcasCasca}>{marcasCasca.map((d, i) => <path key={i} d={d} />)}</g>
      <circle cx={CENTRO.x} cy={CENTRO.y} r={RAIO_EXTERNO + 2} fill="url(#madeira)" />

      {/* Pulso do coração do tronco */}
      <circle cx={CENTRO.x} cy={CENTRO.y} r={RAIO_EXTERNO} className={estilos.pulso} />

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
      <circle cx={CENTRO.x} cy={CENTRO.y} r={RAIO_NUCLEO} className={estilos.nucleo} filter="url(#brilhoForte)" />
      <circle cx={CENTRO.x} cy={CENTRO.y} r={6} className={estilos.centro} />

      {/* Áreas clicáveis de cada anel */}
      {gestoes.map((g, i) => {
        const { interno, externo } = raiosDoAnel(i, total);
        const meio = (interno + externo) / 2;
        return (
          <circle key={"alvo" + g.codigo} cx={CENTRO.x} cy={CENTRO.y} r={meio} className={estilos.alvoAnel}
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
        const r = RAIO_EXTERNO + 44;
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
