import { ChevronDown, HelpCircle } from "lucide-react";
import { BUSINESS } from "../config/business";
import { SectionHeading } from "./SectionHeading";

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
      "Sí. Al reservar elegís el servicio, el barbero y la fecha. El sistema te muestra los horarios disponibles según esa selección.",
  },
  {
    question: "¿Qué pasa si no hay horarios disponibles?",
    answer:
      "Si para una fecha no hay horarios libres, probá con otro día, otro servicio u otro barbero, o consultanos por WhatsApp.",
  },
  {
    question: "¿Dónde queda la barbería?",
    answer: `Estamos en ${BUSINESS.address}. También podés abrir la ubicación en Google Maps desde la sección Contacto.`,
  },
  {
    question: "¿Cómo veo mis turnos?",
    answer:
      "Después de iniciar sesión, bajá a la sección Mis turnos y tocá Actualizar mis turnos para ver tus reservas.",
  },
  {
    question: "¿Por qué la página tarda la primera vez?",
    answer:
      "El servidor está en un plan gratuito que se duerme cuando nadie lo usa. La primera carga puede tardar hasta un minuto; después funciona rápido.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-6 py-16">
      <SectionHeading
        eyebrow="Preguntas frecuentes"
        accent="purple"
        title="Dudas antes de reservar"
        description="Información rápida sobre cómo reservar, cancelar y consultar tus turnos."
      />

      <div className="grid gap-3">
        {faqs.map((faq, index) => (
          <details
            key={faq.question}
            data-reveal
            open={index === 0}
            className="group rounded-3xl border border-white/10 bg-white/[0.04] transition hover:border-purple-500/40 hover:bg-white/[0.06] open:border-purple-500/30 open:bg-white/[0.06]"
          >
            <summary className="flex cursor-pointer list-none items-center gap-4 p-5 md:p-6 [&::-webkit-details-marker]:hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300">
                <HelpCircle size={20} />
              </div>
              <h3 className="flex-1 font-bold text-white">{faq.question}</h3>
              <ChevronDown
                size={20}
                className="shrink-0 text-zinc-400 transition duration-300 group-open:rotate-180"
              />
            </summary>

            <p className="px-5 pb-6 pl-[4.75rem] text-sm leading-6 text-zinc-400 md:px-6 md:pl-[5.25rem]">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
