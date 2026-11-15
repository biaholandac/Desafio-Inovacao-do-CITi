// Geometria do tronco de pé e das raízes, desenhada a partir de sementes fixas
// (a árvore é sempre a mesma, mas nenhuma raiz é igual à outra).
import { semente, naTela, ponto, RAIO_EXTERNO } from "./geometria";

const n = (v) => v.toFixed(1);

// Curva suave passando por todos os pontos (Catmull-Rom convertido em Bézier).
export function suave(pts, fechado = false) {
  const p = fechado ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${n(p[1].x)} ${n(p[1].y)}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [a, b, c, e] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    d += `C${n(b.x + (c.x - a.x) / 6)} ${n(b.y + (c.y - a.y) / 6)} ${n(c.x - (e.x - b.x) / 6)} ${n(c.y - (e.y - b.y) / 6)} ${n(c.x)} ${n(c.y)}`;
  }
  return fechado ? d + "Z" : d;
}

// Linha central de uma raiz: sai do tronco, serpenteia e vai mergulhando no chão.
function linhaCentral({ x, y, ang, comp, chave, queda = 0.4 }) {
  const passos = 30;
  const pts = [{ x, y }];
  let a = ang;
  let px = x, py = y;
  for (let k = 1; k <= passos; k++) {
    const t = k / passos;
    const alvo = ang + (90 - ang) * queda * Math.pow(t, 1.6);
    a = alvo + Math.sin(t * 7 + semente(chave) * 9) * 9 + (semente(chave + k) - 0.5) * 6;
    px += Math.cos((a * Math.PI) / 180) * (comp / passos);
    py += Math.sin((a * Math.PI) / 180) * (comp / passos) * 0.75;
    pts.push({ x: px, y: py, ang: a });
  }
  pts[0].ang = pts[1].ang;
  return pts;
}

// Contorno da raiz: grossa e nodosa perto do tronco, afinando até uma ponta.
function contorno(linha, largura, chave, alargarInicio) {
  const esq = [], dir = [];
  linha.forEach((p, k) => {
    const t = k / (linha.length - 1);
    let w = largura * Math.pow(1 - t, 1.05) * (1 + 0.18 * Math.sin(t * 11 + semente(chave) * 7)) + 0.8;
    if (alargarInicio && t < 0.28) w *= 1 + 0.5 * Math.pow(1 - t / 0.28, 2);
    const r = ((p.ang + 90) * Math.PI) / 180;
    const torto = (semente(chave + "w" + k) - 0.5) * w * 0.12;
    esq.push({ x: p.x + Math.cos(r) * (w / 2 + torto), y: p.y + Math.sin(r) * (w / 2 + torto) * 0.8 });
    dir.push({ x: p.x - Math.cos(r) * (w / 2 - torto), y: p.y - Math.sin(r) * (w / 2 - torto) * 0.8 });
  });
  return suave([...esq, ...dir.reverse()], true);
}

function raiz(spec, profundidade = 2) {
  const linha = linhaCentral(spec);
  const formas = [contorno(linha, spec.largura, spec.chave, profundidade === 2)];
  const linhas = [{ linha, largura: spec.largura }];
  if (profundidade > 0) {
    const ramos = profundidade === 2 ? 2 : 1;
    for (let b = 0; b < ramos; b++) {
      const t = 0.3 + 0.3 * b + semente(spec.chave + "t" + b) * 0.12;
      const i = Math.round(t * (linha.length - 1));
      const base = linha[i];
      const lado = (b + (semente(spec.chave) > 0.5 ? 1 : 0)) % 2 ? 1 : -1;
      const filho = raiz({
        x: base.x, y: base.y,
        ang: base.ang + lado * (24 + semente(spec.chave + "a" + b) * 18),
        comp: spec.comp * (1 - t) * (0.55 + semente(spec.chave + "c" + b) * 0.25),
        largura: spec.largura * (1 - t) * 0.62,
        chave: spec.chave + "r" + b,
        queda: spec.queda + 0.15,
      }, profundidade - 1);
      formas.push(...filho.formas);
      linhas.push(...filho.linhas);
    }
  }
  return { formas, linhas };
}

// Fissura luminosa em zigue-zague, como um raio, entre dois pontos.
function relampago(a, b, chave, partes = 9, amplitude = 14) {
  const pts = [a];
  for (let k = 1; k < partes; k++) {
    const t = k / partes;
    const jit = (semente(chave + k) - 0.5) * amplitude * 2 * Math.sin(Math.PI * t);
    pts.push({ x: a.x + (b.x - a.x) * t + jit, y: a.y + (b.y - a.y) * t + (semente(chave + "y" + k) - 0.5) * 6 });
  }
  pts.push(b);
  return pts;
}

const linhaReta = (pts) => "M" + pts.map((p) => `${n(p.x)} ${n(p.y)}`).join("L");

export function montarArvore() {
  const R = RAIO_EXTERNO + 40;
  const esq = naTela(ponto(R, 180)), dir = naTela(ponto(R, 0));
  const lx = esq.x, rx = dir.x, cx = 800;
  const base = 730;

  // Corpo: desce do corte e se alarga um pouco antes das raízes.
  const corpo = [
    `M${n(lx)} ${n(esq.y)}`,
    `C${n(lx - 2)} 520 ${n(lx + 2)} 640 ${n(lx - 70)} ${base}`,
    `C${n(lx + 120)} ${base + 40} ${n(rx - 120)} ${base + 40} ${n(rx + 70)} ${base}`,
    `C${n(rx - 2)} 640 ${n(rx + 2)} 520 ${n(rx)} ${n(dir.y)}`,
    "Z",
  ].join("");

  const frente = [
    { x: lx - 30, y: 704, ang: 178, comp: 300, largura: 96, chave: "ra", queda: 0.25 },
    { x: lx + 70, y: 748, ang: 150, comp: 210, largura: 82, chave: "rb", queda: 0.3 },
    { x: cx - 100, y: 770, ang: 108, comp: 110, largura: 74, chave: "rc", queda: 0.1 },
    { x: cx + 130, y: 768, ang: 68, comp: 130, largura: 76, chave: "rd", queda: 0.1 },
    { x: rx - 70, y: 748, ang: 30, comp: 220, largura: 84, chave: "re", queda: 0.3 },
    { x: rx + 30, y: 700, ang: 2, comp: 320, largura: 98, chave: "rf", queda: 0.25 },
  ];
  const atras = [
    { x: lx + 90, y: 672, ang: 200, comp: 210, largura: 70, chave: "rg", queda: 0.05 },
    { x: cx - 160, y: 668, ang: 232, comp: 110, largura: 60, chave: "rh", queda: 0 },
    { x: rx - 90, y: 668, ang: -20, comp: 230, largura: 74, chave: "ri", queda: 0.05 },
  ];

  const raizesFrente = frente.map((s) => raiz(s, 2));
  const raizesAtras = atras.map((s) => raiz(s, 1));

  // Fissuras: cada raiz da frente leva a seiva da ponta até o tronco e dali até a borda do corte.
  const fissuras = [0, 3, 5].map((i) => {
    const r = raizesFrente[i];
    const linha = r.linhas[0].linha;
    const ate = Math.round(linha.length * 0.82);
    const naRaiz = linha.slice(0, ate).reverse().map((p, k) => ({
      x: p.x + (semente("fz" + i + k) - 0.5) * 7,
      y: p.y + (semente("fy" + i + k) - 0.5) * 5,
    }));
    const inicio = naRaiz[naRaiz.length - 1];
    const frac = Math.max(-0.96, Math.min(0.96, (inicio.x - cx) / (rx - cx)));
    const destino = naTela(ponto(R - 8, (Math.acos(frac) * 180) / Math.PI));
    const subida = relampago({ x: inicio.x, y: inicio.y - 6 }, destino, "fs" + i, 11, 16);
    const pts = [...naRaiz, ...subida];
    // Ramificações curtas, como os galhos de um raio.
    const ramos = [0.3, 0.55, 0.72, 0.86].map((t, k) => {
      const a = pts[Math.round(t * (pts.length - 1))];
      const lado = (i + k) % 2 ? 1 : -1;
      const fim = { x: a.x + lado * (18 + semente("fb" + i + k) * 26), y: a.y + (semente("fc" + i + k) - 0.6) * 40 };
      return linhaReta(relampago(a, fim, "fr" + i + k, 4, 6));
    });
    return { d: linhaReta(pts), ramos };
  });

  // Placas da casca: sulcos verticais escuros e irregulares no corpo.
  const sulcos = Array.from({ length: 46 }, (_, i) => {
    const t = (i + semente("st" + i) * 0.6) / 46;
    const x = lx + (rx - lx) * t;
    const topo = naTela(ponto(R, 180 - 180 * t)).y - 4;
    const fim = base - 10 + semente("sf" + i) * 30;
    const pts = relampago({ x, y: topo }, { x: x + (t - 0.5) * 60, y: fim }, "sg" + i, 7, 5);
    return { d: linhaReta(pts), forte: semente("sh" + i) > 0.55 };
  });

  return {
    corpo,
    raizesFrente: raizesFrente.flatMap((r) => r.formas),
    raizesAtras: raizesAtras.flatMap((r) => r.formas),
    fissuras, sulcos, cx, base,
  };
}
