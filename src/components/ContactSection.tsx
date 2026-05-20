import { useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
  UserRound,
} from "lucide-react";

export function ContactSection() {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientMessage, setClientMessage] = useState("");

  const phoneNumber = "5492320598170";

  const whatsappLink =
    "https://wa.me/5492320598170?text=Hola%20Nacho%2C%20quiero%20consultar%20por%20un%20turno";

  const mapsLink =
    "https://www.google.com/maps/search/?api=1&query=Hip%C3%B3lito%20Bouchard%202086";

  function sendContactMessage() {
    const message = `Hola Nacho, quiero hacer una consulta.

Nombre: ${clientName || "No indicado"}
Teléfono: ${clientPhone || "No indicado"}
Consulta: ${clientMessage || "Quiero consultar por un turno."}`;

    const encodedMessage = encodeURIComponent(message);

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  }

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

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white">
              <Send size={22} />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-400">
              Consulta rápida
            </p>

            <h3 className="mt-3 text-2xl font-black text-white md:text-3xl">
              Mandá tu consulta directo por WhatsApp
            </h3>

            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Completá tus datos y se va a abrir WhatsApp con el mensaje listo
              para enviar. Ideal para preguntar por horarios, precios, cortes o
              disponibilidad.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="relative">
              <UserRound
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                size={17}
              />

              <input
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-11 py-3 text-sm text-white outline-none focus:border-green-500"
              />
            </div>

            <div className="relative">
              <Phone
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                size={17}
              />

              <input
                value={clientPhone}
                onChange={(event) => setClientPhone(event.target.value)}
                placeholder="Tu teléfono"
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-11 py-3 text-sm text-white outline-none focus:border-green-500"
              />
            </div>

            <textarea
              value={clientMessage}
              onChange={(event) => setClientMessage(event.target.value)}
              placeholder="Escribí tu consulta..."
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
            />

            <button
              onClick={sendContactMessage}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
            >
              <MessageCircle size={18} />
              Enviar consulta por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}