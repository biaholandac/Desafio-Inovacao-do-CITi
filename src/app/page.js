import { casos } from "@/data";

export default function Inicio() {
  const gestoes = new Set(casos.map((c) => c.gestao));
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 32 }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <h1 style={{ fontSize: 44, color: "var(--madeira-clara)", marginBottom: 12 }}>LegaCITi</h1>
        <p style={{ color: "var(--texto-suave)", lineHeight: 1.6 }}>
          A memória coletiva do CITi. Em construção: {casos.length} casos de {gestoes.size} gestões já carregados.
        </p>
      </div>
    </main>
  );
}
