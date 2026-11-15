// Geometria do tronco: posição de cada anel e de cada caso no desenho.

export const CENTRO = { x: 800, y: 470 };
export const RAIO_NUCLEO = 34;
export const RAIO_EXTERNO = 330;

// Setores do tronco: cada grupo de áreas ocupa uma fatia do círculo.
export const SETORES = ["Diretoria", "Soluções", "Negócios", "Gente e Gestão", "Inovação"];

// Gera um número pseudoaleatório estável a partir de um texto,
// para o desenho ser sempre o mesmo a cada carregamento.
export function semente(texto) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

export function larguraAnel(total) {
  return (RAIO_EXTERNO - RAIO_NUCLEO) / total;
}

export function raiosDoAnel(indice, total) {
  const w = larguraAnel(total);
  return { interno: RAIO_NUCLEO + indice * w, externo: RAIO_NUCLEO + (indice + 1) * w };
}

// Num tronco real o centro não fica no meio: cada anel cresce um pouco mais
// para um lado. O centro de cada círculo se desloca conforme o raio.
const EXCENTRICIDADE = { x: 0.045, y: -0.028 };
export function centroPara(raio) {
  return { x: CENTRO.x + raio * EXCENTRICIDADE.x, y: CENTRO.y + raio * EXCENTRICIDADE.y };
}

export function ponto(raio, anguloGraus) {
  const a = (anguloGraus * Math.PI) / 180;
  const c = centroPara(raio);
  return { x: c.x + raio * Math.cos(a), y: c.y + raio * Math.sin(a) };
}

// Círculo levemente irregular, como um anel de árvore de verdade.
export function caminhoOndulado(raio, chave, intensidade = 0.007, inicio = 0, fim = 360) {
  const fase1 = semente(chave + "a") * Math.PI * 2;
  const fase2 = semente(chave + "b") * Math.PI * 2;
  const passos = Math.max(24, Math.round((fim - inicio) / 3));
  let d = "";
  for (let i = 0; i <= passos; i++) {
    const ang = inicio + ((fim - inicio) * i) / passos;
    const t = (ang * Math.PI) / 180;
    const r = raio * (1 + intensidade * Math.sin(3 * t + fase1) + intensidade * 0.6 * Math.sin(7 * t + fase2)
      + intensidade * 0.3 * Math.sin(13 * t + fase1 * 2) + intensidade * 0.15 * Math.sin(29 * t + fase2 * 3));
    const p = ponto(r, ang);
    d += (i === 0 ? "M" : "L") + p.x.toFixed(1) + " " + p.y.toFixed(1);
  }
  return fim - inicio >= 360 ? d + "Z" : d;
}

// Posição de cada caso: o anel diz a gestão, a fatia diz a área.
export function posicionarCasos(casos, gestoes, pessoaPorId) {
  const indiceGestao = Object.fromEntries(gestoes.map((g, i) => [g.codigo, i]));
  const grupos = {};
  for (const c of casos) {
    const setor = Math.max(0, SETORES.indexOf(pessoaPorId[c.autor]?.grupo));
    const chave = c.gestao + "|" + setor;
    (grupos[chave] ||= []).push(c);
  }
  const fatia = 360 / SETORES.length;
  const posicoes = {};
  for (const [chave, lista] of Object.entries(grupos)) {
    const [gestao, setorTxt] = chave.split("|");
    const setor = Number(setorTxt);
    const { interno, externo } = raiosDoAnel(indiceGestao[gestao], gestoes.length);
    lista.sort((a, b) => a.id.localeCompare(b.id));
    lista.forEach((c, i) => {
      const inicio = -90 + setor * fatia + 6;
      const angulo = inicio + ((i + 0.5) / lista.length) * (fatia - 12) + (semente(c.id) - 0.5) * 6;
      const raio = interno + (externo - interno) * (0.3 + 0.4 * semente(c.id + "r"));
      posicoes[c.id] = { ...ponto(raio, angulo), angulo, raio };
    });
  }
  return posicoes;
}

// Contorno rugoso da casca: muitas irregularidades pequenas.
export function caminhoCasca(raio, chave = "casca") {
  const passos = 260;
  let d = "";
  for (let i = 0; i <= passos; i++) {
    const ang = (360 * i) / passos;
    const t = (ang * Math.PI) / 180;
    const rugas = 0.012 * Math.sin(3 * t + 1) + 0.006 * Math.sin(17 * t) + 0.009 * (semente(chave + i) - 0.5) + 0.004 * Math.sin(41 * t + 2);
    const p = ponto(raio * (1 + rugas), ang);
    d += (i === 0 ? "M" : "L") + p.x.toFixed(1) + " " + p.y.toFixed(1);
  }
  return d + "Z";
}

// Faixa entre dois raios (anel cheio), para pintar madeira clara e escura.
export function caminhoFaixa(raioInterno, raioExterno, chave) {
  return caminhoOndulado(raioExterno, chave + "e", 0.007) + caminhoOndulado(raioInterno, chave + "i", 0.007);
}
