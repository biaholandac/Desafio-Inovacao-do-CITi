import vetor from "./marca-vetor.json";

// Marca do LegaCITi em vetor: "Lega" na Syne (com a cauda do g arredondada),
// "CITi" em itálico pesado e um anel de árvore no lugar do ponto do i.
export default function Marca({ altura = 30 }) {
  const { largura, partes, anel } = vetor;
  return (
    <svg viewBox={`0 -880 ${largura} 1180`} height={altura} role="img" aria-label="LegaCITi" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <filter id="brilhoMarca" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="28" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {partes.map(([tipo, d], i) => (
        <path key={i} d={d} fill={tipo === "lega" ? "var(--texto)" : "var(--verde)"} />
      ))}
      <g filter="url(#brilhoMarca)" fill="none" stroke="var(--verde)">
        <circle cx={anel.cx} cy={anel.cy} r={anel.r} strokeWidth="34" />
        <circle cx={anel.cx} cy={anel.cy} r={anel.r * 0.45} strokeWidth="20" />
      </g>
    </svg>
  );
}
