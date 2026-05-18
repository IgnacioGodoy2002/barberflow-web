import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Cliente frecuente",
    text: "Muy buena atención, corte prolijo y el sistema de turnos hace todo más rápido.",
    service: "Corte clásico",
  },
  {
    name: "Cliente nuevo",
    text: "Reservé desde la web, elegí horario y cuando llegué ya estaba todo organizado.",
    service: "Fade moderno",
  },
  {
    name: "Cliente de barba",
    text: "Excelente perfilado de barba, buena terminación y atención personalizada.",
    service: "Barba y perfilado",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonios" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-400">
          Testimonios
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Clientes que confían en Nacho Barbershop
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Opiniones de referencia para mostrar la experiencia de atención,
          organización y reserva online.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.name}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-yellow-500/40 hover:bg-white/[0.07]"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex gap-1 text-yellow-300">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-300">
                <Quote size={20} />
              </div>
            </div>

            <p className="text-sm leading-7 text-zinc-300">
              “{testimonial.text}”
            </p>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="font-bold text-white">{testimonial.name}</p>
              <p className="mt-1 text-xs text-zinc-500">
                Servicio: {testimonial.service}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}