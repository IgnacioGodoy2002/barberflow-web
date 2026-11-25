import { CalendarCheck, Clock, ReceiptText, Scissors } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const steps = [
  {
    icon: Scissors,
    title: "Elegí el servicio",
    description: "Seleccioná el corte, la barba o el color que querés hacerte.",
  },
  {
    icon: Clock,
    title: "Consultá horarios",
    description: "La web muestra la disponibilidad real según barbero, servicio y fecha.",
  },
  {
    icon: CalendarCheck,
    title: "Reservá online",
    description: "Iniciá sesión o creá tu cuenta y confirmá el turno en el momento.",
  },
  {
    icon: ReceiptText,
    title: "Recibí tu comprobante",
    description: "Guardalo o mandalo por WhatsApp. Si no podés ir, lo cancelás desde Mis turnos.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16">
      <SectionHeading
        eyebrow="Proceso"
        title="¿Cómo funciona BarberFlow?"
        description="Simple para el cliente y completo para la administración de la barbería."
      />

      <div className="relative">
        {/* Línea que une los pasos en escritorio */}
        <div
          aria-hidden="true"
          className="absolute left-[12%] right-[12%] top-[52px] hidden h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-purple-500/0 md:block"
        />

      <ol className="relative grid gap-5 md:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <li
              key={step.title}
              data-reveal
              className="group relative rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white transition duration-300 group-hover:scale-110 group-hover:bg-blue-500">
                  <Icon size={22} />
                </div>

                <span className="text-4xl font-black text-white/10 transition group-hover:text-white/20">
                  0{index + 1}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{step.description}</p>
            </li>
          );
        })}
      </ol>
      </div>
    </section>
  );
}
