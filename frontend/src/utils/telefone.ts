/**
 * Telefones do catálogo da Unimontes, escritos de muitos jeitos na fonte:
 * "(38) 3229 8100/8103", "3229 8256 e 8015", "3229 8340-8303",
 * "(38) 3224 – 8372", "(38)3821 2756/ 1378/9200 8855"...
 * Aqui cada texto vira uma lista de números discáveis.
 */

export interface Telefone {
  /** Para mostrar: "(38) 3229-8101" */
  exibicao: string;
  /** Para o link: "+553832298101" */
  tel: string;
}

const DDD_PADRAO = "38";

function formatar(ddd: string, numero: string): Telefone {
  return {
    exibicao: `(${ddd}) ${numero.slice(0, -4)}-${numero.slice(-4)}`,
    tel: `+55${ddd}${numero}`,
  };
}

/** Fixo começa com 2 a 5; só ele serve de prefixo para os ramais que vêm depois */
const ehFixo = (numero: string) => numero.length === 8 && /^[2-5]/.test(numero);

export function numerosDoTelefone(texto: string): Telefone[] {
  const numeros: Telefone[] = [];
  let ddd = texto.match(/\((\d{2})\)/)?.[1] ?? DDD_PADRAO;
  let prefixo: string | null = null;

  // Cada parte separada por "/" ou " e " é um número completo ou um ramal
  for (const parte of texto.split(/\s*\/\s*|\s+e\s+/i)) {
    const dddDaParte = parte.match(/\((\d{2})\)/)?.[1];
    if (dddDaParte) ddd = dddDaParte;
    const blocos = parte.replace(/\(\d{2}\)/g, " ").match(/\d+/g) ?? [];

    for (let i = 0; i < blocos.length; i++) {
      const bloco = blocos[i];
      let numero: string | null = null;

      if (bloco.length >= 8) {
        numero = bloco; // "32298101"
      } else if (bloco.length === 4 && blocos[i + 1]?.length === 4 && (i === 0 || !prefixo)) {
        numero = bloco + blocos[i + 1]; // "3229 8101", "3229-8101"
        i++;
      } else if (bloco.length === 4 && prefixo) {
        numero = prefixo + bloco; // ramal: "/8103", "e 8015", "-8303"
      }

      if (!numero) continue;
      if (ehFixo(numero)) prefixo = numero.slice(0, 4);
      numeros.push(formatar(ddd, numero));
    }
  }

  return numeros;
}

/** Só os dígitos, para achar um setor pelo número ("8101", "32298101") */
export function digitosDoTelefone(texto: string): string[] {
  return numerosDoTelefone(texto).flatMap((t) => {
    const local = t.tel.slice(5); // sem +55 e DDD
    return [local, local.slice(-4)];
  });
}
