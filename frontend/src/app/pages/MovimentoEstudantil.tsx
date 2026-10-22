import { Megaphone } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { SectionLayout } from "../components/layout/SectionLayout";
import { conteudoMovimentoEstudantil } from "./conteudo/movimentoEstudantil";

const related = [
  { label: "Eventos", to: "/eventos" },
  { label: "Assistência Estudantil", to: "/assistencia-estudantil" },
  { label: "Unidades e Localização", to: "/unidades-localizacao" },
];

export function MovimentoEstudantil() {
  return (
    <>
      <PageHeader
        eyebrow="Movimento Estudantil e Lazer"
        title="Representação, esporte e vida no campus."
        description="Encontre informações sobre representação estudantil, Centros Acadêmicos, esporte, lazer e reserva de espaços."
        icon={Megaphone}
      />
      <SectionLayout
        popular={conteudoMovimentoEstudantil.popular}
        tags={conteudoMovimentoEstudantil.tags}
        searchPlaceholder="Busque por DCE, Centros Acadêmicos, esporte, lazer ou reserva de espaços"
        sections={conteudoMovimentoEstudantil.secoes}
        related={related}
      />
    </>
  );
}
