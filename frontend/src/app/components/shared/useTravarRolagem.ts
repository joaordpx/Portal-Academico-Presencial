import { useEffect } from "react";

/** Trava a rolagem da página enquanto um menu ou janela cobre a tela (no celular, o fundo rolava junto) */
export function useTravarRolagem(ativo: boolean) {
  useEffect(() => {
    if (!ativo) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [ativo]);
}
