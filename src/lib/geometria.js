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

export function ponto(raio, anguloGraus) {
  const a = (anguloGraus * Math.PI) / 180;
  return { x: CENTRO.x + raio * Math.cos(a), y: CENTRO.y + raio * Math.sin(a) };
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
    const r = raio * (1 + intensidade * Math.sin(3 * t + fase1) + intensidade * 0.6 * Math.sin(7 * t + fase2));
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
