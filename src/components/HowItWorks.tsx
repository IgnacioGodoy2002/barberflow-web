import { CalendarCheck, Clock, Scissors, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Scissors,
    title: "Elegí el servicio",
    description:
      "Seleccioná el corte, barba o color que querés realizarte.",
  },
  {
    icon: Clock,
    title: "Consultá horarios",
    description:
      "La web muestra disponibilidad real según barbero, servicio y fecha.",
  },
  {
    icon: CalendarCheck,
    title: "Reservá online",
    description:
      "Iniciá sesión y confirmá tu turno desde la página.",
  },
  {
    icon: ShieldCheck,
    title: "Gestión interna",
    description:
      "El admin puede ver y cancelar turnos desde el panel interno.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
          Proceso
        </p>
        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          ¿Cómo funciona BarberFlow?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-400">
          Un sistema simple para el cliente y completo para la administración de
          la barbería.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <Icon size={22} />
                </div>

                <span className="text-4xl font-black text-white/10">
                  0{index + 1}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{step.title}</h3>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}