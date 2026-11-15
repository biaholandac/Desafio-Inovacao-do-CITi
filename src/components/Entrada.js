"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Marca from "./Marca";
import Fundo from "./Fundo";
import Tronco from "./Tronco";
import { casos, gestoes, pessoaPorId } from "@/data";
import { AREAS } from "@/data/cargos";
import { posicionarCasos } from "@/lib/geometria";
import estilos from "./Entrada.module.css";

// Tela de entrada: login simulado por área e cargo.
export default function Entrada() {
  const router = useRouter();
  const [area, setArea] = useState(null);
  const [subarea, setSubarea] = useState(null);
  const posicoes = useMemo(() => posicionarCasos(casos, gestoes, pessoaPorId), []);

  function escolherArea(a) {
    if (a.cargos.length === 1 && !a.cargos[0].cargos) return entrar(a.cargos[0].id);
    setArea(a);
  }

  function escolherItem(item) {
    if (!item.cargos) return entrar(item.id);
    if (item.cargos.length === 1) return entrar(item.cargos[0].id);
    setSubarea(item);
  }

  function voltar() {
    if (subarea) setSubarea(null);
    else setArea(null);
  }

  function entrar(cargoId) {
    router.push(`/tronco?cargo=${cargoId}`);
  }

  return (
    <main className={estilos.tela}>
      <Fundo />
      <div className={estilos.conteudo}>
        <svg viewBox="190 60 1000 860" className={estilos.tronco} aria-hidden="true">
          <Tronco gestoes={gestoes} casos={casos} posicoes={posicoes}
            selecionado={null} gestaoAtiva={null} padraoAtivo={null}
            aoEscolherCaso={() => {}} aoEscolherGestao={() => {}} decorativo />
        </svg>

        <div className={estilos.marca}><Marca altura={58} /></div>
        <h1 className={estilos.titulo}>
          Tudo o que o CITi já viveu, <span>de volta para quem faz agora.</span>
        </h1>

        <div className={estilos.pilula} aria-live="polite">
          {area ? (
            <>
              <button className={estilos.voltar} onClick={voltar} aria-label="Voltar">←</button>
              <span className={estilos.passo}>
                <strong>{area.nome}{subarea ? ` › ${subarea.nome}` : ""}</strong> · {subarea ? "escolha o seu cargo" : area.pergunta ?? "escolha o seu cargo"}
              </span>
            </>
          ) : (
            <span className={estilos.passo}>Entrar como… <strong>escolha a sua área</strong></span>
          )}
        </div>

        <div className={estilos.atalhos}>
          {subarea
            ? subarea.cargos.map((c) => (
                <button key={c.id} className={estilos.atalho} onClick={() => entrar(c.id)}>{c.nome}</button>
              ))
            : area
            ? area.cargos.map((c) => (
                <button key={c.id} className={estilos.atalho} onClick={() => escolherItem(c)}>{c.nome}</button>
              ))
            : AREAS.map((a) => (
                <button key={a.id} onClick={() => escolherArea(a)}
                  className={`${estilos.atalho} ${a.id === "new-pig" ? estilos.newPig : ""}`}>
                  {a.nome}
                </button>
              ))}
        </div>

        <p className={estilos.rodape}>Demonstração com dados simulados · personagens e casos fictícios</p>
      </div>
    </main>
  );
}
