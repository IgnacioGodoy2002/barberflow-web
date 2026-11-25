import { MessageCircle, Quote, Star } from "lucide-react";
import { testimonials } from "../data/testimonials";
import { whatsappLink } from "../config/business";
import { SectionHeading } from "./SectionHeading";

const reviewLink = whatsappLink("Hola Nacho, te quiero dejar mi opinión sobre el corte: ");

export function TestimonialsSection() {
  return (
    <section id="opiniones" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16">
      <SectionHeading
        eyebrow="Opiniones"
        accent="yellow"
        title="Lo que dicen los clientes"
        description={
          testimonials.length > 0
            ? "Reseñas de clientes de Nacho Barbershop."
            : "¿Ya te cortaste con nosotros? Tu opinión ayuda a otros a elegir."
        }
      />

      {testimonials.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={`${testimonial.name}-${testimonial.service}`}
              data-reveal
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-yellow-500/40 hover:bg-white/[0.07]"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex gap-1 text-yellow-300" aria-label="5 de 5 estrellas">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} size={18} fill="currentColor" />
                  ))}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-300">
                  <Quote size={20} />
                </div>
              </div>

              <blockquote className="text-sm leading-7 text-zinc-300">“{testimonial.text}”</blockquote>

              <figcaption className="mt-6 border-t border-white/10 pt-5">
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {testimonial.service}
                  {testimonial.source ? ` · ${testimonial.source}` : ""}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div
          data-reveal
          className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-white/[0.03] to-transparent p-8 text-center md:p-10"
        >
          <div className="flex gap-1 text-yellow-300" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} size={22} fill="currentColor" />
            ))}
          </div>
          <p className="max-w-xl text-zinc-300">
            Contanos cómo te fue con tu corte. Las opiniones de clientes reales
            se van a publicar en esta sección.
          </p>
          <a
            href={reviewLink}
            target="_blank"
            rel="noreferrer"
            className="magnetic inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-bold text-zinc-950 hover:bg-yellow-300"
          >
            <MessageCircle size={18} />
            Dejar mi opinión por WhatsApp
          </a>
        </div>
      )}
    </section>
  );
}
