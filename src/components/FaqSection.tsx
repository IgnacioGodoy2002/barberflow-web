import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "¿Tengo que crear una cuenta para reservar?",
    answer:
      "Sí. Para confirmar un turno necesitás crear una cuenta o iniciar sesión. Así después podés consultar tus reservas en la sección Mis turnos.",
  },
  {
    question: "¿Puedo cancelar un turno?",
    answer:
      "Sí. Desde la sección Mis turnos podés ver tus reservas y cancelar un turno activo con confirmación.",
  },
  {
    question: "¿Puedo elegir el barbero?",
    answer:
      "Sí. Al reservar podés elegir el servicio, el barbero y la fecha. El sistema te muestra los horarios disponibles según esa selección.",
  },
  {
    question: "¿Qué pasa si no hay horarios disponibles?",
    answer:
      "Si para una fecha no hay horarios libres, podés probar con otro día, otro servicio o consultar por WhatsApp.",
  },
  {
    question: "¿Dónde queda la barbería?",
    answer:
      "La barbería está ubicada en Hipólito Bouchard 2086. También podés abrir la ubicación desde la sección Contacto.",
  },
  {
    question: "¿Cómo veo mis turnos?",
    answer:
      "Después de iniciar sesión, bajá a la sección Mis turnos y tocá Actualizar mis turnos para ver tus reservas.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
          Preguntas frecuentes
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Dudas antes de reservar
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Información rápida para que el cliente sepa cómo reservar, cancelar y
          consultar sus turnos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((faq) => (
          <article
            key={faq.question}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-purple-500/40 hover:bg-white/[0.07]"
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300">
                <HelpCircle size={20} />
              </div>

              <h3 className="font-bold text-white">{faq.question}</h3>
            </div>

            <p className="text-sm leading-6 text-zinc-400">{faq.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}