"use client";

import { useSearchParams } from "next/navigation";
import Palco from "./Palco";

// Lê o cargo de quem entrou (?cargo=) e abre o tronco.
export default function PalcoComPessoa() {
  const cargo = useSearchParams().get("cargo");
  // A chave pelo cargo faz o tronco recomeçar do zero quando a pessoa troca de perfil.
  return <Palco key={cargo ?? "sem-cargo"} cargo={cargo} />;
}
