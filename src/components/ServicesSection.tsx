import { CalendarDays, Clock, Scissors, Sparkles } from "lucide-react";
import type { Service } from "../types";
import { formatPrice } from "../types";
import { SectionHeading } from "./SectionHeading";
import { ApiError, SkeletonGrid } from "./StatusMessages";

type ServicesSectionProps = {
  services: Service[];
  loading: boolean;
  waking: boolean;
  error: string;
  onRetry: () => void;
  onSelectService: (serviceId: string) => void;
};

export function ServicesSection({
  services,
  loading,
  waking,
  error,
  onRetry,
  onSelectService,
}: ServicesSectionProps) {
  return (
    <section id="servicios" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16">
      <SectionHeading
        eyebrow="Servicios"
        title="Elegí tu servicio"
        description="Conocé los servicios disponibles, la duración estimada y el precio antes de reservar tu turno."
      />

      {loading && (
        <>
          {waking && (
            <p className="mb-5 flex items-center justify-center gap-2 text-center text-sm text-yellow-200">
              <Clock size={16} className="animate-pulse" />
              Despertando el servidor… la primera carga puede tardar hasta un minuto.
            </p>
          )}
          <SkeletonGrid count={3} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" />
        </>
      )}

      {error && <ApiError message={error} onRetry={onRetry} />}

      {!loading && !error && services.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
          <Scissors className="mx-auto mb-4 text-zinc-500" size={38} />
          <p className="text-lg font-bold text-white">No hay servicios cargados</p>
          <p className="mt-2 text-sm text-zinc-400">
            Cuando el administrador cargue servicios, van a aparecer en esta sección.
          </p>
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={service.id}
              data-reveal
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-blue-900/20"
            >
              {index === 0 && (
                <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300">
                  <Sparkles size={13} />
                  Destacado
                </div>
              )}

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300 transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
                <Scissors size={22} />
              </div>

              <h3 className={`${index === 0 ? "pr-24" : ""} text-xl font-bold text-white`}>
                {service.name}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-6 text-zinc-400">
                {service.description || "Servicio profesional de barbería."}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-3">
                  <p className="text-xs text-zinc-500">Duración</p>
                  <p className="mt-1 font-bold text-white">{service.durationMinutes} min</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-3">
                  <p className="text-xs text-zinc-500">Precio</p>
                  <p className="mt-1 font-bold text-white">{formatPrice(service.price)}</p>
                </div>
              </div>

              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="mb-4 text-xs text-zinc-500">
                  Incluye {service.bufferMinutes} min de margen para organizar el siguiente turno.
                </p>

                <button
                  type="button"
                  onClick={() => onSelectService(service.id)}
                  data-cursor-label="Reservar"
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
