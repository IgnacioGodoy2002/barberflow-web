import {
  CalendarDays,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";

export function ContactSection() {
  const whatsappLink =
    "https://wa.me/5492320598170?text=Hola%20Nacho%2C%20quiero%20consultar%20por%20un%20turno";

  const mapsLink =
    "https://www.google.com/maps/search/?api=1&query=Hip%C3%B3lito%20Bouchard%202086";

  return (
    <section id="contacto" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
          Contacto
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Ubicación, horarios y contacto
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Consultá la ubicación de la barbería, horarios de atención y escribí
          por WhatsApp para cualquier duda antes de reservar.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 text-green-300">
            <MapPin size={22} />
          </div>

          <h3 className="text-xl font-bold text-white">Dirección</h3>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Hipólito Bouchard 2086.
          </p>

          <a
            href={mapsLink}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-green-500/40 px-5 py-3 text-sm font-semibold text-green-300 transition hover:bg-green-500/10"
          >
            <Navigation size={18} />
            Ver en Google Maps
          </a>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
            <Clock size={22} />
          </div>

          <h3 className="text-xl font-bold text-white">Horarios</h3>

          <div className="mt-3 grid gap-2 text-sm text-zinc-400">
            <p>
              Lunes a viernes:{" "}
              <span className="font-semibold text-white">10:00 a 20:00</span>
            </p>

            <p>
              Sábados:{" "}
              <span className="font-semibold text-white">10:00 a 18:00</span>
            </p>

            <p>
              Domingos:{" "}
              <span className="font-semibold text-white">Cerrado</span>
            </p>
          </div>

          <a
            href="#reservar"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-blue-500/40 px-5 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/10"
          >
            <CalendarDays size={18} />
            Reservar turno
          </a>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
            <Phone size={22} />
          </div>

          <h3 className="text-xl font-bold text-white">WhatsApp</h3>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Escribí para consultar disponibilidad, servicios o cualquier duda
            antes de reservar.
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
          >
            <MessageCircle size={18} />
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}