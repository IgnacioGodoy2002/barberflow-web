import { useState, type FormEvent } from "react";
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
import { BUSINESS, MAPS_EMBED, MAPS_LINK, whatsappLink } from "../config/business";
import { SectionHeading } from "./SectionHeading";

export function ContactSection() {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientMessage, setClientMessage] = useState("");
  const [showMap, setShowMap] = useState(false);

  function sendContactMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = `Hola Nacho, quiero hacer una consulta.

Nombre: ${clientName.trim() || "No indicado"}
Teléfono: ${clientPhone.trim() || "No indicado"}
Consulta: ${clientMessage.trim() || "Quiero consultar por un turno."}`;

    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  }

  return (
    <section id="contacto" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16">
      <SectionHeading
        eyebrow="Contacto"
        accent="green"
        title="Ubicación, horarios y contacto"
        description="Consultá la ubicación de la barbería, los horarios de atención y escribinos por WhatsApp ante cualquier duda."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div data-reveal className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/20 text-green-300">
            <MapPin size={22} />
          </div>

          <h3 className="text-xl font-bold text-white">Dirección</h3>
          <p className="mt-3 text-sm leading-6 text-zinc-400">{BUSINESS.address}.</p>

          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noreferrer"
            className="magnetic mt-5 inline-flex items-center gap-2 rounded-full border border-green-500/40 px-5 py-3 text-sm font-semibold text-green-300 hover:bg-green-500/10"
          >
            <Navigation size={18} />
            Cómo llegar
          </a>
        </div>

        <div data-reveal className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
            <Clock size={22} />
          </div>

          <h3 className="text-xl font-bold text-white">Horarios</h3>

          <dl className="mt-3 grid gap-2 text-sm text-zinc-400">
            {BUSINESS.hours.map((item) => (
              <div key={item.label} className="flex justify-between gap-4 border-b border-white/5 pb-2 last:border-0">
                <dt>{item.label}</dt>
                <dd className="font-semibold text-white">{item.value}</dd>
              </div>
            ))}
          </dl>

          <a
            href="#reservar"
            className="magnetic mt-5 inline-flex items-center gap-2 rounded-full border border-blue-500/40 px-5 py-3 text-sm font-semibold text-blue-300 hover:bg-blue-500/10"
          >
            <CalendarDays size={18} />
            Reservar turno
          </a>
        </div>

        <div data-reveal className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
            <Phone size={22} />
          </div>

          <h3 className="text-xl font-bold text-white">WhatsApp</h3>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Escribinos para consultar disponibilidad, servicios o cualquier duda antes de reservar.
          </p>

          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="magnetic mt-5 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-500"
          >
            <MessageCircle size={18} />
            Escribir por WhatsApp
          </a>
        </div>
      </div>

      {/* Mapa: se carga recién cuando el usuario lo pide (no frena la página). */}
      <div data-reveal className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
        {showMap ? (
          <iframe
            title={`Mapa de ${BUSINESS.name}`}
            src={MAPS_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full border-0 grayscale-[60%] invert-[90%] hue-rotate-180"
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowMap(true)}
            data-cursor-label="Mapa"
            className="flex h-40 w-full flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.15),_transparent_60%)] text-sm font-semibold text-green-300 transition hover:bg-white/[0.04]"
          >
            <MapPin size={26} />
            Ver mapa de la barbería
            <span className="text-xs font-normal text-zinc-500">{BUSINESS.address}</span>
          </button>
        )}
      </div>

      <div data-reveal className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white">
              <Send size={22} />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-400">Consulta rápida</p>

            <h3 className="mt-3 text-2xl font-black text-white md:text-3xl">
              Mandá tu consulta directo por WhatsApp
            </h3>

            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Completá tus datos y se abre WhatsApp con el mensaje listo para enviar. Ideal para
              preguntar por horarios, precios, cortes o disponibilidad.
            </p>
          </div>

          <form onSubmit={sendContactMessage} className="grid gap-3">
            <label className="relative">
              <span className="sr-only">Tu nombre</span>
              <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
              <input
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-11 py-3 text-sm text-white outline-none transition focus:border-green-500"
              />
            </label>

            <label className="relative">
              <span className="sr-only">Tu teléfono</span>
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={17} />
              <input
                type="tel"
                inputMode="tel"
                value={clientPhone}
                onChange={(event) => setClientPhone(event.target.value)}
                placeholder="Tu teléfono"
                autoComplete="tel"
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-11 py-3 text-sm text-white outline-none transition focus:border-green-500"
              />
            </label>

            <label>
              <span className="sr-only">Tu consulta</span>
              <textarea
                value={clientMessage}
                onChange={(event) => setClientMessage(event.target.value)}
                placeholder="Escribí tu consulta..."
                className="min-h-28 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-green-500"
              />
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
            >
              <MessageCircle size={18} />
              Enviar consulta por WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
