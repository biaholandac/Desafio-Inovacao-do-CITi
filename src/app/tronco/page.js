import { Suspense } from "react";
import PalcoComPessoa from "@/components/PalcoComPessoa";

export default function PaginaTronco() {
  return (
    <Suspense>
      <PalcoComPessoa />
    </Suspense>
  );
}
