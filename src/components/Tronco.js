"use client";

import { useMemo } from "react";
import {
  RAIO_NUCLEO, RAIO_EXTERNO, SETORES,
  raiosDoAnel, caminhoOndulado, caminhoAnel, caminhoCasca, caminhoFaixa, centroPara, ponto, semente, naTela, TRANSFORMACAO_CORTE, IMAGEM_TRONCO, ZOOM,
} from "@/lib/geometria";
import estilos from "./Tronco.module.css";

// O corte da foto (public/corte.webp) é um recorte de 430 x 240 px da imagem original, com o centro
// da madeira em (212,5; 114,5) e raios de 162 x 95 px. Aqui ele é esticado para coincidir com a madeira do desenho.
const RAIO_MADEIRA = RAIO_EXTERNO + 5;
// O miolo da foto fica exatamente sobre o núcleo desenhado.
const CENTRO_MADEIRA = centroPara(RAIO_NUCLEO);
const FOTO_CORTE = {
  x: CENTRO_MADEIRA.x - 212.5 * (RAIO_MADEIRA / 162),
  y: CENTRO_MADEIRA.y - 114.5 * (RAIO_MADEIRA / 95),
  largura: 430 * (RAIO_MADEIRA / 162),
  altura: 240 * (RAIO_MADEIRA / 95),
};

// Desenho do tronco. Cada anel é uma gestão; cada ponto é um caso.
export default function Tronco({ gestoes, casos, posicoes, selecionado, gestaoAtiva, padraoAtivo, relevancia, aoEscolherCaso, aoEscolherGestao, decorativo = false, novo = null, celebrando = null }) {
  const total = gestoes.length;

  // Linhas finas de crescimento dentro de cada anel, para dar textura de madeira.
  const linhasDeCrescimento = useMemo(() => {
    const linhas = [];
    gestoes.forEach((g, i) => {
      if (g.status === "em_formacao") return;
      const { interno, externo } = raiosDoAnel(i, total);
      for (let k = 1; k <= 16; k++) {
        const r = interno + ((externo - interno) * k) / 17 + (semente(g.codigo + k) - 0.5) * 1.6;
        linhas.push({ chave: g.codigo + k, d: caminhoOndulado(r, g.codigo + k, 0.008) });
      }
    });
    return linhas;
  }, [gestoes, total]);

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

  // Painel HUD ligado ao tronco: casos por gestão, do centro para a casca.
  const hud = useMemo(() => {
    const contagem = gestoes.map((g) => casos.filter((c) => c.gestao === g.codigo).length);
    const max = Math.max(...contagem);
    const alvo = naTela(ponto(RAIO_EXTERNO + 24, 218));
    return { contagem, max, alvo };
  }, [gestoes, casos]);

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
        <linearGradient id="sombraTronco" gradientUnits="userSpaceOnUse" x1="380" y1="0" x2="1220" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.75" />
          <stop offset="35%" stopColor="#000" stopOpacity="0.1" />
          <stop offset="65%" stopColor="#000" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id="chao">
          <stop offset="0%" stopColor="#2fd97a" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#2fd97a" stopOpacity="0" />
        </radialGradient>
        <filter id="texturaCasca" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09 0.02" numOctaves="3" seed="4" result="r" />
          <feColorMatrix in="r" type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 1.6 -0.75" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        {/* A foto do tronco se dissolve no fundo nas bordas */}
        <radialGradient id="fundirFoto" gradientUnits="userSpaceOnUse" cx="795" cy="470" r="650" gradientTransform="translate(795 470) scale(1 0.92) translate(-795 -470)">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="58%" stopColor="#fff" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <mask id="mascaraFoto" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900">
          <rect width="1600" height="900" fill="url(#fundirFoto)" />
        </mask>
        <radialGradient id="sombraCorte">
          <stop offset="70%" stopColor="#000" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Tronco com raízes: imagem de referência da autora, com o corte coberto pelo desenho interativo */}
      <image href="/tronco.webp" x={IMAGEM_TRONCO.x} y={IMAGEM_TRONCO.y} width={IMAGEM_TRONCO.largura} height={IMAGEM_TRONCO.altura}
        preserveAspectRatio="none" className={estilos.foto} />
      {/* Sombra sob a borda do corte, para ele assentar no tronco */}
      <ellipse cx={naTela(centroPara(0)).x} cy={naTela(centroPara(0)).y + 22} rx={372 * ZOOM} ry={214 * ZOOM} fill="url(#sombraCorte)" opacity="0.7" />

      {/* Corte do tronco, visto em perspectiva */}
      <g transform={TRANSFORMACAO_CORTE}>
      {/* Madeira e casca da própria foto, ampliadas na medida dos anéis interativos (sem a rachadura) */}
      <clipPath id="recorteCorte"><path d={casca} /></clipPath>
      <image href="/corte.webp" x={FOTO_CORTE.x} y={FOTO_CORTE.y} width={FOTO_CORTE.largura} height={FOTO_CORTE.altura}
        preserveAspectRatio="none" clipPath="url(#recorteCorte)" className={estilos.foto} />
      {/* Véu escuro sobre a madeira, para os anéis das gestões e os casos se destacarem */}
      <path d={cascaInterna} className={estilos.veuMadeira} />

      {/* Pulso do coração do tronco */}
      <circle cx={centroPara(RAIO_EXTERNO / 2).x} cy={centroPara(RAIO_EXTERNO / 2).y} r={RAIO_EXTERNO} className={estilos.pulso} />


      {/* Anéis: uma gestão cada, desenhados como anéis de madeira */}
      {gestoes.map((g, i) => {
        const { interno, externo } = raiosDoAnel(i, total);
        const ativo = gestaoAtiva === g.codigo;
        if (g.status === "em_formacao") {
          return <path key={g.codigo} d={caminhoOndulado(externo, g.codigo, 0.012)} className={`${estilos.anelFormacao} ${ativo ? estilos.anelAtivo : ""}`} />;
        }
        const largura = externo - interno;
        // Lenho tardio: a faixa escura e mais densa que fecha cada ano de crescimento.
        const tardio = caminhoAnel(externo - 1.5, g.codigo + "t", { minima: largura * 0.12, maxima: largura * 0.38 });
        const fim = g.status === "fechando" ? -90 + 360 * (g.conversas.feitas / g.conversas.esperadas) : 270;
        const linha = caminhoAnel(externo, g.codigo, { minima: ativo ? 3 : 2, maxima: ativo ? 8 : 5.5, inicio: -90, fim });
        return (
          <g key={g.codigo} className={`${estilos.anel} ${ativo ? estilos.anelAtivo : ""} ${celebrando === g.codigo ? estilos.anelCelebrando : ""}`}>
            <path d={tardio} className={estilos.anelTardio} />
            <path d={linha} className={estilos.anelLinha} filter="url(#brilho)" />
            {g.status === "fechando" && <path d={caminhoOndulado(externo, g.codigo, 0.012, fim, 270)} className={estilos.anelPendente} />}
          </g>
        );
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

      </g>

      {/* Casos: luzes verdes que respiram, cada uma no seu tempo; os casos em destaque emitem um pulso */}
      {casos.map((c) => {
        const p = naTela(posicoes[c.id]);
        const doPadrao = padraoAtivo && c.padroes.includes(padraoAtivo);
        const rel = relevancia ? relevancia[c.id] : null;
        const apagado = (padraoAtivo && !doPadrao) || rel === 0;
        const destaque = (rel === 2 && !padraoAtivo) || doPadrao;
        const escolhido = selecionado === c.id;
        const estado = escolhido ? estilos.casoEscolhido : destaque ? estilos.casoDestaque : apagado ? estilos.casoApagado : estilos.casoNormal;
        const atraso = { animationDelay: `${(semente(c.id + "t") * -6).toFixed(2)}s` };
        return (
          <g key={c.id} onClick={() => aoEscolherCaso(c.id)} className={`${estilos.caso} ${estado} ${c.origem === "em_andamento" ? estilos.casoAndamento : ""} ${novo === c.id ? estilos.casoNasceu : ""}`}>
            {novo === c.id && <><circle cx={p.x} cy={p.y} r={10} className={estilos.nascimento} /><circle cx={p.x} cy={p.y} r={10} className={estilos.nascimento} style={{ animationDelay: "0.5s" }} /></>}
            <circle cx={p.x} cy={p.y} r={11} fill="transparent" />
            {(destaque || escolhido) && <circle cx={p.x} cy={p.y} r={7} className={estilos.onda} style={atraso} />}
            <circle cx={p.x} cy={p.y} r={escolhido ? 13 : destaque ? 10 : 8} className={estilos.halo} style={atraso} />
            <circle cx={p.x} cy={p.y} r={escolhido ? 6.5 : destaque ? 5.5 : apagado ? 3.6 : 4.4} className={estilos.ponto} style={atraso} />
            <title>{c.titulo}</title>
          </g>
        );
      })}

      {/* HUD: casos por gestão */}
      {!decorativo && <g className={estilos.hud} aria-hidden="true">
        <polyline className={estilos.linha} points={`${hud.alvo.x},${hud.alvo.y} 210,74`} />
        <circle className={estilos.ponta} cx={hud.alvo.x} cy={hud.alvo.y} r="3" />
        <rect className={estilos.caixa} x="40" y="30" width="170" height="86" />
        <text x="52" y="48">CASOS POR ANEL</text>
        <text x="52" y="71" className={estilos.numero}>{casos.length}</text>
        {hud.contagem.map((n, i) => {
          const h = (n / hud.max) * 38;
          return <rect key={i} x={112 + i * 12} y={104 - h} width="8" height={h} className={i === hud.contagem.length - 2 ? estilos.barraAtual : estilos.barra} />;
        })}
      </g>}

      {/* Nomes das áreas, curvados ao longo da casca (fora da perspectiva, para o texto não deformar) */}
      {!decorativo && SETORES.map((s, i) => {
        const fatia = 360 / SETORES.length;
        let meio = -90 + i * fatia + fatia / 2;
        // Rótulos nas laterais ficariam atrás dos painéis: o da direita desce e o da esquerda sobe dentro da própria fatia.
        if (Math.abs(Math.cos((meio * Math.PI) / 180)) > 0.85) meio += 30;
        const r = RAIO_EXTERNO + 46;
        const embaixo = Math.sin((meio * Math.PI) / 180) > 0.2;
        const angs = Array.from({ length: 13 }, (_, k) => meio - 26 + (52 * k) / 12);
        const pts = (embaixo ? angs.reverse() : angs).map((a) => naTela(ponto(r, a)));
        const d = "M" + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("L");
        return (
          <g key={s}>
            <path id={`setor-${i}`} d={d} fill="none" />
            <text className={estilos.rotuloSetor} dominantBaseline="middle" paintOrder="stroke">
              <textPath href={`#setor-${i}`} startOffset="50%" textAnchor="middle">{s.toUpperCase()}</textPath>
            </text>
          </g>
        );
      })}
    </g>
  );
}
