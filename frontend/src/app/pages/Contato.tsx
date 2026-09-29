import { useState } from "react";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Send, MessageCircle, Loader2 } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { Reveal } from "../components/shared/Reveal";
import { toast } from "sonner";

export function Contato() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", assunto: "", mensagem: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.mensagem) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success("Mensagem enviada", { description: "Retornaremos em até 2 dias úteis." });
    setForm({ nome: "", email: "", assunto: "", mensagem: "" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Contato"
        title="Fale com a Unimontes"
        description="Tire dúvidas, faça sugestões ou solicite atendimento. Estamos aqui para ajudar você."
        icon={MessageCircle}
      />

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
            <Reveal className="lg:col-span-2">
              <div className="divide-y divide-[#e5e5e5] border-y border-[#e5e5e5]">
                {[
                  { icon: Phone, l: "Telefone", v: "(38) 3229-8000", s: "Seg–Sex · 8h às 18h" },
                  {
                    icon: Mail,
                    l: "E-mail",
                    v: "secretaria@unimontes.br",
                    s: "Resposta em até 48h",
                  },
                  {
                    icon: MapPin,
                    l: "Endereço",
                    v: "Av. Prof. Rui Braga, s/n",
                    s: "Vila Mauricéia · Montes Claros/MG",
                  },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <motion.div
                      key={c.l}
                      whileHover={{ x: 4 }}
                      className="group flex items-start gap-5 py-7 transition-colors"
                    >
                      <Icon className="mt-1 h-5 w-5 text-[#6E3AFF]" strokeWidth={1.75} />
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1a1a1a]/50">
                          {c.l}
                        </div>
                        <div className="mt-2 text-[22px] font-bold tracking-[-0.02em] text-[#1a1a1a]">
                          {c.v}
                        </div>
                        <div className="mt-1 text-[13px] text-[#1a1a1a]/60">{c.s}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-3">
              <form
                onSubmit={submit}
                className="rounded-[4px] border border-[#e5e5e5] bg-white p-8 lg:p-12"
              >
                <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.18em] text-[#6E3AFF]">
                  <span className="h-px w-10 bg-[#6E3AFF]" />
                  Formulário
                </div>
                <h2 className="mt-5 text-balance text-[32px] font-bold leading-[1] tracking-[-0.03em] text-[#1a1a1a] lg:text-[40px]">
                  Envie sua mensagem.
                </h2>
                <p className="mt-3 text-[14px] text-[#1a1a1a]/60">
                  Preenchimento em menos de 1 minuto.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Nome completo *"
                    value={form.nome}
                    onChange={(v) => setForm({ ...form, nome: v })}
                    placeholder="Seu nome"
                  />
                  <Field
                    label="E-mail *"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    placeholder="voce@email.com"
                  />
                </div>

                <div className="mt-5">
                  <Field
                    label="Assunto"
                    value={form.assunto}
                    onChange={(v) => setForm({ ...form, assunto: v })}
                    placeholder="Sobre o que você quer falar?"
                  />
                </div>

                <div className="mt-5">
                  <label className="block">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/60">
                      Mensagem *
                    </div>
                    <textarea
                      rows={5}
                      value={form.mensagem}
                      onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                      placeholder="Escreva sua mensagem aqui..."
                      className="w-full resize-none rounded-[4px] border border-[#e5e5e5] bg-white p-4 text-[15px] text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 transition-colors focus:border-[#1a1a1a] focus:outline-none"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#6E3AFF] py-4 text-[12px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#5829d9] disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Enviar mensagem
                    </>
                  )}
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#1a1a1a]/60">
        {label}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[4px] border border-[#e5e5e5] bg-white p-3.5 text-[15px] text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 transition-colors focus:border-[#1a1a1a] focus:outline-none"
      />
    </label>
  );
}
