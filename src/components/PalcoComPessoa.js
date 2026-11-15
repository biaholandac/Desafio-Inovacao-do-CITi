"use client";

import { useSearchParams } from "next/navigation";
import Palco from "./Palco";

// Lê o cargo de quem entrou (?cargo=) e abre o tronco.
export default function PalcoComPessoa() {
  const cargo = useSearchParams().get("cargo");
  return <Palco cargo={cargo} />;
}
