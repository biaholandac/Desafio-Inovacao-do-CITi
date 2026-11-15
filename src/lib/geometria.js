// Geometria do tronco: posição de cada anel e de cada caso no desenho.

export const CENTRO = { x: 800, y: 470 };
export const RAIO_NUCLEO = 34;
export const RAIO_EXTERNO = 330;

// Setores do tronco: seis fatias iguais de 60°, com o centro de Diretoria no topo.
// Tech e Produto ficam lado a lado, para poderem ser vistos juntos como Soluções.
export const SETORES = ["Diretoria", "Inovação", "Tech", "Produto", "Negócios", "Gente e Gestão"];
export const FATIA = 360 / SETORES.length;
export const INICIO_SETORES = -90 - FATIA / 2;
// Ângulo do meio de cada fatia, e o de Tech + Produto juntos.
export const meioDoSetor = (i) => INICIO_SETORES + i * FATIA + FATIA / 2;
export const MEIO_SOLUCOES = INICIO_SETORES + 3 * FATIA;

// Fatia de um caso: a área diz se é Tech ou Produto; nos demais, vale o grupo de quem contou.
const AREAS_TECH = ["Desenvolvimento", "Inteligência de Dados"];
export function setorDoCaso(c, pessoaPorId) {
  if (c.setor) return c.setor === "Soluções" ? (c.area === "Produto" ? "Produto" : "Tech") : c.setor;
  const grupo = pessoaPorId[c.autor]?.grupo;
  if (grupo === "Soluções") return c.area === "Produto" || /produto/i.test(c.cargoAutor) ? "Produto" : AREAS_TECH.includes(c.area) ? "Tech" : "Tech";
  return grupo;
}

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
    const setor = Math.max(0, SETORES.indexOf(setorDoCaso(c, pessoaPorId)));
    const chave = c.gestao + "|" + setor;
    (grupos[chave] ||= []).push(c);
  }
  const fatia = FATIA;
  const posicoes = {};
  for (const [chave, lista] of Object.entries(grupos)) {
    const [gestao, setorTxt] = chave.split("|");
    const setor = Number(setorTxt);
    const { interno, externo } = raiosDoAnel(indiceGestao[gestao], gestoes.length);
    lista.sort((a, b) => a.id.localeCompare(b.id));
    lista.forEach((c, i) => {
      const inicio = INICIO_SETORES + setor * fatia + 5;
      const angulo = inicio + ((i + 0.5) / lista.length) * (fatia - 10) + (semente(c.id) - 0.5) * 5;
      const raio = interno + (externo - interno) * (0.3 + 0.4 * semente(c.id + "r"));
      posicoes[c.id] = { ...ponto(raio, angulo), angulo, raio, interno, externo };
    });
  }
  return afastarCasos(posicoes);
}

// Espalha os casos que ficaram muito perto uns dos outros na tela, sem tirá-los do seu anel:
// cada par próximo se afasta ao longo do anel (ângulo) e um pouco na direção do centro (raio).
function afastarCasos(posicoes, distanciaMinima = 22, voltas = 80) {
  const ids = Object.keys(posicoes);
  const tela = (q) => ({ x: CENTRO_TELA.x + (q.x - CENTRO.x) * ESCALA_X, y: CENTRO_TELA.y + (q.y - CENTRO.y) * ESCALA_Y });
  for (let v = 0; v < voltas; v++) {
    let mexeu = false;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = posicoes[ids[i]], b = posicoes[ids[j]];
        const ta = tela(a), tb = tela(b);
        const d = Math.hypot(ta.x - tb.x, ta.y - tb.y);
        if (d >= distanciaMinima) continue;
        mexeu = true;
        const falta = (distanciaMinima - d) / 2 + 0.5;
        // Quanto um grau de ângulo anda na tela, aproximadamente, neste raio.
        const pxPorGrau = (r) => (r * Math.PI) / 180 * ((ESCALA_X + ESCALA_Y) / 2);
        const sinal = a.angulo <= b.angulo ? -1 : 1;
        a.angulo += (sinal * falta) / pxPorGrau(a.raio) * 0.7;
        b.angulo -= (sinal * falta) / pxPorGrau(b.raio) * 0.7;
        const sinalR = a.raio <= b.raio ? -1 : 1;
        const passoR = (falta / ESCALA_Y) * 0.35;
        a.raio = Math.min(a.externo - 6, Math.max(a.interno + 6, a.raio + sinalR * passoR));
        b.raio = Math.min(b.externo - 6, Math.max(b.interno + 6, b.raio - sinalR * passoR));
        Object.assign(a, ponto(a.raio, a.angulo));
        Object.assign(b, ponto(b.raio, b.angulo));
      }
    }
    if (!mexeu) break;
  }
  return posicoes;
}

// Anel de madeira desenhado como faixa: a borda ondula de forma irregular e a espessura
// engrossa e afina ao longo da volta, como os anéis de crescimento de um tronco de verdade.
export function caminhoAnel(raio, chave, { minima = 1, maxima = 4, intensidade = 0.012, inicio = 0, fim = 360 } = {}) {
  const f = [1, 2, 3, 4, 5].map((k) => semente(chave + "f" + k) * Math.PI * 2);
  const passos = Math.max(24, Math.round((fim - inicio) / 1.5));
  const fora = [], dentro = [];
  for (let i = 0; i <= passos; i++) {
    const ang = inicio + ((fim - inicio) * i) / passos;
    const t = (ang * Math.PI) / 180;
    const onda = intensidade * (Math.sin(3 * t + f[0]) + 0.55 * Math.sin(7 * t + f[1]) + 0.3 * Math.sin(13 * t + f[2]) + 0.12 * Math.sin(31 * t + f[3]));
    const r = raio * (1 + onda);
    const largura = minima + (maxima - minima) * (0.5 + 0.5 * Math.sin(2 * t + f[4])) * (0.65 + 0.35 * Math.sin(5 * t + f[1]));
    fora.push(ponto(r, ang));
    dentro.push(ponto(r - largura, ang));
  }
  const fmt = (p) => p.x.toFixed(1) + " " + p.y.toFixed(1);
  return "M" + fora.map(fmt).join("L") + "L" + dentro.reverse().map(fmt).join("L") + "Z";
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

// Perspectiva: o corte do tronco é visto de cima, então fica oval (achatado na vertical),
// e sobe um pouco na tela para dar espaço ao tronco e às raízes.
// ZOOM aproxima ou afasta o tronco inteiro (foto e corte juntos).
export const ZOOM = 1.52;
export const ESCALA_X = 0.95 * ZOOM;
export const ESCALA_Y = 0.56 * ZOOM;
// O x compensa o leve deslocamento dos anéis para a direita, para o tronco ficar no centro da tela.
export const CENTRO_TELA = { x: 778, y: 392 };

// Imagem do tronco com raízes (public/tronco.webp, 1632 x 1632), posicionada para que
// o corte da imagem fique sob o corte interativo. O corte interativo é maior que o da foto,
// para os anéis e os casos ficarem fáceis de ler e tocar.
// A foto (816 px) foi estendida nas bordas para as raízes chegarem até a beira da tela:
// 150 px à esquerda, 250 à direita, 120 em cima e 200 embaixo (1216 x 1136 no total).
// O ponto (445, 217) da foto original fica no centro do corte; ela é esticada 1,72 x 1,25.
const FOTO = { esticarX: 1.72, esticarY: 1.25, centro: { x: 445 + 150, y: 217 + 120 }, largura: 1216, altura: 1136 };
export const IMAGEM_TRONCO = {
  x: CENTRO_TELA.x - FOTO.centro.x * FOTO.esticarX * ZOOM,
  y: CENTRO_TELA.y - FOTO.centro.y * FOTO.esticarY * ZOOM,
  largura: FOTO.largura * FOTO.esticarX * ZOOM,
  altura: FOTO.altura * FOTO.esticarY * ZOOM,
};
export const TRANSFORMACAO_CORTE = `translate(${CENTRO_TELA.x} ${CENTRO_TELA.y}) scale(${ESCALA_X} ${ESCALA_Y}) translate(${-CENTRO.x} ${-CENTRO.y})`;
export function naTela(p) {
  return { x: CENTRO_TELA.x + (p.x - CENTRO.x) * ESCALA_X, y: CENTRO_TELA.y + (p.y - CENTRO.y) * ESCALA_Y };
}
