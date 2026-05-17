import { ExternalLink, MapPin, Scissors } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-zinc-950">
              <Scissors size={20} />
            </div>

            <div>
              <p className="font-black text-white">Nacho Barbershop</p>
              <p className="text-xs text-zinc-500">
                BarberFlow · Turnos inteligentes
              </p>
            </div>
          </div>

          <p className="text-sm leading-6 text-zinc-400">
            Sistema web para consultar servicios, revisar disponibilidad,
            reservar turnos y gestionar reservas de barbería.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">Navegación</h3>

          <div className="grid gap-2 text-sm text-zinc-400">
            <a href="#servicios" className="transition hover:text-white">
              Servicios
            </a>
            <a href="#barberos" className="transition hover:text-white">
              Barberos
            </a>
            <a href="#reservar" className="transition hover:text-white">
              Reservar turno
            </a>
            <a href="#admin" className="transition hover:text-white">
              Panel interno
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-white">Ubicación</h3>

          <p className="flex items-start gap-2 text-sm text-zinc-400">
            <MapPin size={18} className="mt-0.5 text-blue-400" />
            Hipólito Bouchard 2086
          </p>

          <a
            href="https://github.com/IgnacioGodoy2002/barberflow-web"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
          >
            Ver código del frontend <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-zinc-500">
        Proyecto fullstack desarrollado por Ignacio Gabriel Godoy · React,
        TypeScript, NestJS, PostgreSQL y Prisma.
      </div>
    </footer>
  );
}