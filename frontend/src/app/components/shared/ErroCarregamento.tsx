/** Estado de falha ao buscar dados da API, com opção de tentar de novo */
export function ErroCarregamento({
  titulo,
  onTentarNovamente,
}: {
  titulo: string;
  onTentarNovamente: () => void;
}) {
  return (
    <div className="py-24 text-center" role="alert">
      <p className="text-[18px] font-bold text-[#1a1a1a]">{titulo}</p>
      <p className="mt-2 text-[14px] text-[#1a1a1a]/55">
        Verifique sua conexão e tente novamente em instantes.
      </p>
      <button
        onClick={onTentarNovamente}
        className="mt-6 inline-flex items-center gap-1.5 rounded-[6px] border border-[#6E3AFF] px-4 py-2.5 text-[13px] font-bold text-[#6E3AFF] transition-colors hover:bg-[#6E3AFF] hover:text-white"
      >
        Tentar novamente
      </button>
    </div>
  );
}
