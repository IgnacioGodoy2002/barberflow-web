import { CalendarDays, Scissors, Sparkles, UserRound } from "lucide-react";

type Service = {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  bufferMinutes: number;
  price: string | number;
};

type Barber = {
  id: string;
  displayName: string;
  bio?: string;
  services: {
    service: Service;
  }[];
};

type BarbersSectionProps = {
  barbers: Barber[];
  loading: boolean;
  error: string;
};

export function BarbersSection({
  barbers,
  loading,
  error,
}: BarbersSectionProps) {
  return (
    <section id="barberos" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
          Barberos
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Profesionales disponibles
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Elegí el profesional que preferís y reservá un turno según sus
          servicios y disponibilidad.
        </p>
      </div>

      {loading && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300">
            <UserRound className="animate-pulse" size={22} />
          </div>

          <p className="font-bold text-white">Cargando barberos...</p>

          <p className="mt-2 text-sm text-zinc-400">
            Estamos consultando los profesionales disponibles.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-center text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && barbers.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
          <UserRound className="mx-auto mb-4 text-zinc-500" size={38} />

          <p className="text-lg font-bold text-white">
            No hay barberos cargados
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Cuando el administrador cargue barberos, van a aparecer en esta
            sección.
          </p>
        </div>
      )}

      {!loading && !error && barbers.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2">
          {barbers.map((barber, index) => (
            <article
              key={barber.id}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-purple-500/40 hover:bg-white/[0.07]"
            >
              {index === 0 && (
                <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300">
                  <Sparkles size={13} />
                  Destacado
                </div>
              )}

              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-purple-500/20 text-purple-300 transition group-hover:scale-105">
                  <UserRound size={28} />
                </div>

                <div className="pr-20">
                  <h3 className="text-xl font-bold text-white">
                    {barber.displayName}
                  </h3>

                  <p className="mt-1 text-sm text-zinc-400">
                    Barbero disponible
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
                  <p className="text-sm text-zinc-500">
                    Todavía no tiene servicios asignados.
                  </p>
                )}
              </div>

              <a
                href="#reservar"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
              >
                <CalendarDays size={17} />
                Reservar con este barbero
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}