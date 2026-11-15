"use client";

import { useSearchParams } from "next/navigation";
import Palco from "./Palco";

// Lê quem entrou (?pessoa=) e abre o tronco para essa pessoa.
export default function PalcoComPessoa() {
  const pessoa = useSearchParams().get("pessoa");
  return <Palco pessoa={pessoa} />;
}
