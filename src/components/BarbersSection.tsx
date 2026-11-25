import { CalendarDays, Scissors, Sparkles, UserRound } from "lucide-react";
import type { Barber } from "../types";
import { SectionHeading } from "./SectionHeading";
import { ApiError, SkeletonGrid } from "./StatusMessages";

type BarbersSectionProps = {
  barbers: Barber[];
  loading: boolean;
  error: string;
  onRetry: () => void;
  onSelectBarber: (barberId: string) => void;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function BarbersSection({ barbers, loading, error, onRetry, onSelectBarber }: BarbersSectionProps) {
  return (
    <section id="barberos" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16">
      <SectionHeading
        eyebrow="Barberos"
        accent="purple"
        title="Profesionales disponibles"
        description="Elegí el profesional que preferís y reservá un turno según sus servicios y disponibilidad."
      />

      {loading && <SkeletonGrid count={2} className="grid gap-5 md:grid-cols-2" />}

      {error && <ApiError message={error} onRetry={onRetry} />}

      {!loading && !error && barbers.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
          <UserRound className="mx-auto mb-4 text-zinc-500" size={38} />
          <p className="text-lg font-bold text-white">No hay barberos cargados</p>
          <p className="mt-2 text-sm text-zinc-400">
            Cuando el administrador cargue barberos, van a aparecer en esta sección.
          </p>
        </div>
      )}

      {!loading && !error && barbers.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2">
          {barbers.map((barber, index) => (
            <article
              key={barber.id}
              data-reveal
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-purple-900/20"
            >
              {index === 0 && barbers.length > 1 && (
                <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300">
                  <Sparkles size={13} />
                  Destacado
                </div>
              )}

              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/30 to-blue-500/20 text-xl font-black text-purple-100 transition duration-300 group-hover:scale-105">
                  {initials(barber.displayName) || <UserRound size={28} />}
                </div>

                <div className="pr-20">
                  <h3 className="text-xl font-bold text-white">{barber.displayName}</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    {barber.services?.length
                      ? `${barber.services.length} ${barber.services.length === 1 ? "servicio" : "servicios"}`
                      : "Barbero"}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-6 text-zinc-400">
                {barber.bio || "Especialista en cortes y barba."}
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-950 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                  <Scissors size={16} className="text-purple-300" />
                  Servicios que realiza
                </div>

                {barber.services && barber.services.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {barber.services.map((item) => (
                      <span
                        key={item.service.id}
                        className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-200"
                      >
                        {item.service.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">Todavía no tiene servicios asignados.</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => onSelectBarber(barber.id)}
                data-cursor-label="Reservar"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
              >
                <CalendarDays size={17} />
                Reservar con {barber.displayName.split(" ")[0]}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
