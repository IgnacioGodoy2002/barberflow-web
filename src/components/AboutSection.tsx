import { MapPin, Scissors, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BUSINESS } from "../config/business";

const features: { icon: LucideIcon; color: string; title: string; text: string }[] = [
  {
    icon: Scissors,
    color: "bg-blue-500/20 text-blue-300",
    title: "Cortes profesionales",
    text: "Degradés, color, barba, perfilado y mantenimiento.",
  },
  {
    icon: Sparkles,
    color: "bg-purple-500/20 text-purple-300",
    title: "Reserva online",
    text: "Elegís servicio, barbero, fecha y horario disponible desde la web.",
  },
  {
    icon: ShieldCheck,
    color: "bg-green-500/20 text-green-300",
    title: "Turnos organizados",
    text: "El sistema evita conflictos de agenda y dobles reservas.",
  },
  {
    icon: MapPin,
    color: "bg-yellow-500/20 text-yellow-300",
    title: "Ubicación",
    text: `${BUSINESS.address}.`,
  },
];

export function AboutSection() {
  return (
    <section id="sobre" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div data-reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
            Sobre la barbería
          </p>

          <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
            {BUSINESS.name}: cortes prolijos y turnos simples.
          </h2>

          <p className="mt-5 text-sm leading-7 text-zinc-400 md:text-base">
            En {BUSINESS.name} combinamos atención personalizada, prolijidad y
            organización para que cada cliente reserve su turno rápido, elija el
            servicio que necesita y no tenga que esperar de más.
          </p>

          <p className="mt-4 text-sm leading-7 text-zinc-400 md:text-base">
            {BUSINESS.product} nació de la experiencia real atendiendo en la
            barbería: gestiona servicios, barberos, horarios, bloqueos de agenda
            y reservas desde una plataforma web conectada a una API propia.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#reservar"
              className="magnetic rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-500"
            >
              Reservar ahora
            </a>

            <a
              href="#servicios"
              className="magnetic rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              Ver servicios
            </a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, color, title, text }) => (
            <div
              key={title}
              data-reveal
              className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-110 ${color}`}
              >
                <Icon size={22} />
              </div>

              <h3 className="font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
