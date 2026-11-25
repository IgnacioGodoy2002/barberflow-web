import type { ReactNode } from "react";
import {
  CalendarDays,
  Clock,
  Loader2,
  RefreshCw,
  Scissors,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { ApiStatus, Barber, Service } from "../types";
import { formatPrice } from "../types";
import { AnimatedNumber } from "./motion/AnimatedNumber";

type HeroSectionProps = {
  status: ApiStatus;
  services: Service[];
  barbers: Barber[];
  onRetry: () => void;
};

const STATUS_COPY: Record<ApiStatus, { title: string; text: string; dot: string }> = {
  loading: {
    title: "Conectando…",
    text: "Consultando la API de BarberFlow.",
    dot: "bg-yellow-400",
  },
  waking: {
    title: "Despertando el servidor…",
    text: "El backend gratuito se duerme por inactividad. Puede tardar hasta un minuto la primera vez.",
    dot: "bg-yellow-400",
  },
  online: {
    title: "Backend online",
    text: "Datos en vivo desde NestJS + PostgreSQL.",
    dot: "bg-green-400 animate-glow-pulse",
  },
  offline: {
    title: "Sin conexión con la API",
    text: "No pudimos conectar con el servidor. Probá de nuevo en unos segundos.",
    dot: "bg-red-400",
  },
};

export function HeroSection({ status, services, barbers, onRetry }: HeroSectionProps) {
  const copy = STATUS_COPY[status];
  const prices = services.map((service) => Number(service.price)).filter((n) => !Number.isNaN(n));
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

  return (
    <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-12 md:pb-24 md:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="hero-enter">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
            <Sparkles size={16} className="text-purple-300" />
            Reservas online 24/7 · sin llamadas ni esperas
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Reservá tu turno de barbería{" "}
            <span className="text-shimmer">en pocos clics.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
            Elegí el servicio, tu barbero y el horario que te queda cómodo.
            BarberFlow calcula la disponibilidad real y evita dobles reservas,
            conflictos de agenda y horarios bloqueados.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#reservar"
              className="magnetic inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
            >
              <CalendarDays size={18} />
              Reservar turno
            </a>

            <a
              href="#servicios"
              className="magnetic rounded-full border border-white/15 px-6 py-3 font-semibold text-zinc-200 hover:bg-white/10"
            >
              Ver servicios y precios
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-green-400" /> Sin doble reserva
            </li>
            <li className="flex items-center gap-2">
              <Clock size={16} className="text-blue-300" /> Horarios en tiempo real
            </li>
            <li className="flex items-center gap-2">
              <Scissors size={16} className="text-purple-300" /> Cancelás desde la web
            </li>
          </ul>
        </div>

        <div className="animate-rise-in [animation-delay:300ms]">
          <div className="animate-float-soft rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/40 backdrop-blur sm:p-6 hover:[animation-play-state:paused]">
            <div className="rounded-2xl bg-zinc-900 p-5 sm:p-6">
              <div className="mb-6 flex items-start justify-between gap-4" aria-live="polite">
                <div>
                  <p className="text-sm text-zinc-400">Estado del sistema</p>
                  <p className="mt-1 flex items-center gap-3 text-2xl font-bold">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${copy.dot}`} />
                    {copy.title}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">{copy.text}</p>
                </div>

                {status === "offline" ? (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                  >
                    <RefreshCw size={15} /> Reintentar
                  </button>
                ) : status === "online" ? (
                  <ShieldCheck className="shrink-0 text-green-400" />
                ) : (
                  <Loader2 className="shrink-0 animate-spin text-yellow-300" />
                )}
              </div>

              <div className="mb-5 grid grid-cols-3 gap-3">
                <Stat label="Servicios" ready={status === "online"}>
                  <AnimatedNumber value={services.length} />
                </Stat>
                <Stat label="Barberos" ready={status === "online"}>
                  <AnimatedNumber value={barbers.length} />
                </Stat>
                <Stat label="Desde" ready={status === "online" && minPrice !== null}>
                  {minPrice !== null && (
                    <AnimatedNumber value={minPrice} format={(n) => formatPrice(Math.round(n))} />
                  )}
                </Stat>
              </div>

              <div className="grid gap-3">
                <InfoCard
                  icon={<CalendarDays size={20} />}
                  title="Reservas"
                  text="Turnos confirmados, comprobante y cancelación."
                />
                <InfoCard
                  icon={<Clock size={20} />}
                  title="Disponibilidad"
                  text="Horarios calculados según agenda y bloqueos."
                />
                <InfoCard
                  icon={<UserRound size={20} />}
                  title="Roles"
                  text="ADMIN, BARBER y CLIENT con JWT."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, ready, children }: { label: string; ready: boolean; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-2 py-3 text-center">
      {ready ? (
        <p className="whitespace-nowrap text-base font-black tracking-tight text-white sm:text-xl">{children}</p>
      ) : (
        <div className="skeleton mx-auto h-7 w-12 rounded-lg" />
      )}
      <p className="mt-1 text-xs text-zinc-400">{label}</p>
    </div>
  );
}

function InfoCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-blue-500/30 hover:bg-white/[0.07]">
      <div className="text-blue-300">{icon}</div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-zinc-400">{text}</p>
      </div>
    </div>
  );
}
