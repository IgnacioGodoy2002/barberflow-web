import { MapPin, Scissors, ShieldCheck, Sparkles, Users } from "lucide-react";

export function AboutSection() {
  return (
    <section id="sobre" className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
            Sobre la barbería
          </p>

          <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
            Nacho Barbershop, cortes prolijos y turnos simples.
          </h2>

          <p className="mt-5 text-sm leading-7 text-zinc-400 md:text-base">
            En Nacho Barbershop combinamos atención personalizada, prolijidad y
            organización para que cada cliente pueda reservar su turno de forma
            rápida, elegir el servicio que necesita y evitar esperas
            innecesarias.
          </p>

          <p className="mt-4 text-sm leading-7 text-zinc-400 md:text-base">
            BarberFlow permite gestionar servicios, barberos, disponibilidad y
            reservas desde una plataforma web conectada a una API real.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#reservar"
              className="rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
            >
              Reservar ahora
            </a>

            <a
              href="#servicios"
              className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              Ver servicios
            </a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
              <Scissors size={22} />
            </div>

            <h3 className="font-bold text-white">Cortes profesionales</h3>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Servicios pensados para cortes, barba, perfilado y mantenimiento.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300">
              <Sparkles size={22} />
            </div>

            <h3 className="font-bold text-white">Reserva online</h3>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Elegís servicio, barbero, fecha y horario disponible desde la web.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 text-green-300">
              <ShieldCheck size={22} />
            </div>

            <h3 className="font-bold text-white">Turnos organizados</h3>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              El sistema evita conflictos de agenda y doble reserva de horarios.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/20 text-yellow-300">
              <MapPin size={22} />
            </div>

            <h3 className="font-bold text-white">Ubicación</h3>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Hipólito Bouchard 2086.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-3xl border border-white/10 bg-zinc-900 p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-zinc-950">
              <Users size={22} />
            </div>

            <div>
              <p className="text-2xl font-black text-white">Clientes</p>
              <p className="text-sm text-zinc-400">Reserva simple y rápida</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-zinc-950">
              <Scissors size={22} />
            </div>

            <div>
              <p className="text-2xl font-black text-white">Servicios</p>
              <p className="text-sm text-zinc-400">Cortes, barba y perfilado</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-zinc-950">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-2xl font-black text-white">Sistema</p>
              <p className="text-sm text-zinc-400">API real + base de datos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}