import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";

/* Componentes interativos da página Ajuda e Suporte; os dados ficam em ./ajudaSuporte */

/* ───────────── Formulário de contato ───────────── */

/**
 * O portal ainda não tem backend para receber mensagens: em vez de simular
 * um envio, o formulário abre o aplicativo de e-mail do estudante com a
 * mensagem pronta para o canal oficial Fale com a Unimontes.
 */
export function FormularioContato({ email }: { email: string }) {
  const [form, setForm] = useState({ nome: "", email: "", assunto: "", mensagem: "" });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.mensagem) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    const assunto = form.assunto || "Contato pelo Portal Acadêmico";
    const corpo = `${form.mensagem}\n\n— ${form.nome} (${form.email})`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
    toast.success("Abrimos o seu aplicativo de e-mail", {
      description: `A mensagem está pronta para envio a ${email}.`,
    });
  };

  const campo =
    "w-full rounded-[6px] border border-[#d4d4d4] bg-white px-4 py-3 text-[14px] text-[#1a1a1a] outline-none transition-colors placeholder:text-[#1a1a1a]/40 focus:border-[#6E3AFF]";

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-[13px] leading-[1.5] text-[#1a1a1a]/60">
        Ao enviar, seu aplicativo de e-mail abre com a mensagem pronta para{" "}
        <span className="font-semibold text-[#1a1a1a]/80">{email}</span>.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/50">
            Nome *
          </span>
          <input
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="Seu nome completo"
            className={`mt-1.5 ${campo}`}
          />
        </label>
        <label className="block">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/50">
            E-mail *
          </span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="seu@email.com"
            className={`mt-1.5 ${campo}`}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/50">
          Assunto
        </span>
        <input
          value={form.assunto}
          onChange={(e) => setForm({ ...form, assunto: e.target.value })}
          placeholder="Sobre o que você quer falar?"
          className={`mt-1.5 ${campo}`}
        />
      </label>

      <label className="block">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/50">
          Mensagem *
        </span>
        <textarea
          value={form.mensagem}
          onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
          rows={5}
          placeholder="Descreva sua dúvida ou solicitação"
          className={`mt-1.5 resize-y ${campo}`}
        />
      </label>

      <button
        type="submit"
        className="inline-flex cursor-pointer items-center gap-2 rounded-[6px] bg-[#1a1a1a] px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#6E3AFF]"
      >
        <Send className="h-4 w-4" /> Enviar por e-mail
      </button>
    </form>
  );
}

/* ───────────── Glossário de siglas ───────────── */

export function Glossario({ siglas }: { siglas: { sigla: string; significado: string }[] }) {
  const [q, setQ] = useState("");
  const filtradas = siglas.filter(
    (s) =>
      s.sigla.toLowerCase().includes(q.toLowerCase()) ||
      s.significado.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <p className="max-w-2xl text-[17px] leading-[1.6] text-[#1a1a1a]/70">
        Entenda as siglas mais usadas no dia a dia da universidade.
      </p>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar sigla ou significado..."
        className="mt-6 w-full rounded-[6px] border border-[#d4d4d4] bg-white px-4 py-3 text-[14px] text-[#1a1a1a] outline-none transition-colors placeholder:text-[#1a1a1a]/40 focus:border-[#6E3AFF]"
      />

      {filtradas.length === 0 ? (
        <p className="py-12 text-center text-[14px] text-[#1a1a1a]/55">
          Nenhuma sigla encontrada para "{q}".
        </p>
      ) : (
        <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filtradas.map((s) => (
            <div
              key={s.sigla}
              className="rounded-[8px] border border-[#e5e5e5] bg-white px-5 py-4 transition-colors hover:border-[#6E3AFF]/40"
            >
              <dt className="text-[15px] font-bold tracking-[-0.01em] text-[#6E3AFF]">{s.sigla}</dt>
              <dd className="mt-1 text-[13.5px] leading-[1.5] text-[#1a1a1a]/70">
                {s.significado}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
