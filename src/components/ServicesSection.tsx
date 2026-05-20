import { CalendarDays, Clock, Scissors, Sparkles } from "lucide-react";

type Service = {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  bufferMinutes: number;
  price: string | number;
};

type ServicesSectionProps = {
  services: Service[];
  loading: boolean;
  error: string;
  onSelectService: (serviceId: string) => void;
};

export function ServicesSection({
  services,
  loading,
  error,
  onSelectService,
}: ServicesSectionProps) {
  function formatPrice(value: string | number) {
    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return `$${value}`;
    }

    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(numberValue);
  }

  return (
    <section id="servicios" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
          Servicios
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Elegí tu servicio
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Conocé los servicios disponibles, duración estimada y precio antes de
          reservar tu turno.
        </p>
      </div>

      {loading && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
            <Clock className="animate-pulse" size={22} />
          </div>

          <p className="font-bold text-white">Cargando servicios...</p>

          <p className="mt-2 text-sm text-zinc-400">
            Estamos consultando la API de BarberFlow.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-center text-red-200">
          {error}
        </div>
      )}

      {!loading && !error && services.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
          <Scissors className="mx-auto mb-4 text-zinc-500" size={38} />

          <p className="text-lg font-bold text-white">
            No hay servicios cargados
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Cuando el administrador cargue servicios, van a aparecer en esta
            sección.
          </p>
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/[0.07]"
            >
              {index === 0 && (
                <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300">
                  <Sparkles size={13} />
                  Destacado
                </div>
              )}

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300 transition group-hover:scale-110">
                <Scissors size={22} />
              </div>

              <h3 className="pr-24 text-xl font-bold text-white">
                {service.name}
              </h3>

              <p className="mt-3 min-h-16 text-sm leading-6 text-zinc-400">
                {service.description || "Servicio profesional de barbería."}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-3">
                  <p className="text-xs text-zinc-500">Duración</p>

                  <p className="mt-1 font-bold text-white">
                    {service.durationMinutes} min
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-3">
                  <p className="text-xs text-zinc-500">Precio</p>

                  <p className="mt-1 font-bold text-white">
                    {formatPrice(service.price)}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="mb-4 text-xs text-zinc-500">
                  Incluye {service.bufferMinutes} min de margen para organizar
                  el siguiente turno.
                </p>

                <button
                  onClick={() => onSelectService(service.id)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  <CalendarDays size={17} />
                  Reservar este servicio
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}