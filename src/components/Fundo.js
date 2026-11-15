import estilos from "./Fundo.module.css";

// Formas fluidas e escuras ao fundo, inspiradas na identidade do CITi.
export default function Fundo() {
  return (
    <div className={estilos.fundo} aria-hidden="true">
      <svg className={estilos.camada} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="marmore" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.0016 0.0028" numOctaves="4" seed="11" result="ruido" />
            <feColorMatrix in="ruido" type="matrix"
              values="0 0 0 0 0.05
                      0 0 0 0 0.55
                      0 0 0 0 0.28
                      0 0 0 6 -3.1" />
          </filter>
        </defs>
        <rect width="1600" height="1000" filter="url(#marmore)" />
      </svg>
      <div className={estilos.vinheta} />
    </div>
  );
}
