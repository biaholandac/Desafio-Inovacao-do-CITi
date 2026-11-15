"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Marca from "./Marca";
import Fundo from "./Fundo";
import Tronco from "./Tronco";
import { casos, gestoes, personagens, pessoaPorId } from "@/data";
import { posicionarCasos } from "@/lib/geometria";
import estilos from "./Entrada.module.css";

const SUGESTOES = [6, 10, 22];

// Tela de entrada: login simulado. A pessoa escolhe com quem entrar.
export default function Entrada() {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const posicoes = useMemo(() => posicionarCasos(casos, gestoes, pessoaPorId), []);
  const ativos = useMemo(() => personagens.filter((p) => p.status === "ativo"), []);
  const resultados = busca.trim().length > 0
    ? ativos.filter((p) => p.nome.toLowerCase().includes(busca.trim().toLowerCase())).slice(0, 5)
    : [];

  function entrar(id) {
    router.push(`/tronco?pessoa=${id}`);
  }

  return (
    <main className={estilos.tela}>
      <Fundo />
      <div className={estilos.conteudo}>
        <svg viewBox="420 90 760 760" className={estilos.tronco} aria-hidden="true">
          <Tronco gestoes={gestoes} casos={casos} posicoes={posicoes}
            selecionado={null} gestaoAtiva={null} padraoAtivo={null}
            aoEscolherCaso={() => {}} aoEscolherGestao={() => {}} decorativo />
        </svg>

        <div className={estilos.marca}><Marca altura={58} /></div>
        <h1 className={estilos.titulo}>
          Tudo o que o CITi já viveu, <span>de volta para quem faz agora.</span>
        </h1>

        <form className={estilos.pilula} onSubmit={(e) => { e.preventDefault(); if (resultados[0]) entrar(resultados[0].id); }}>
          <input value={busca} onChange={(e) => setBusca(e.target.value)}
            placeholder="Entrar como… digite o nome de um membro" aria-label="Nome do membro" autoComplete="off" />
          <button type="submit" aria-label="Entrar" disabled={!resultados[0]}>→</button>
          {resultados.length > 0 && (
            <ul className={estilos.resultados}>
              {resultados.map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={() => entrar(p.id)}>
                    <strong>{p.nome}</strong><span>{p.cargoAtual}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>

        <div className={estilos.atalhos}>
          <span className={estilos.ou}>ou entre como</span>
          {SUGESTOES.map((id) => (
            <button key={id} className={estilos.atalho} onClick={() => entrar(id)}>
              {pessoaPorId[id].nome.split(" ")[0]} <em>{pessoaPorId[id].cargoAtual}</em>
            </button>
          ))}
          <button className={`${estilos.atalho} ${estilos.newPig}`} onClick={() => entrar("novo")}>
            New Pig
          </button>
        </div>

        <p className={estilos.rodape}>Demonstração com dados simulados · personagens e casos fictícios</p>
      </div>
    </main>
  );
}
