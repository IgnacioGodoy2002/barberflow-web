import { Camera, Scissors, Sparkles, Star } from "lucide-react";

const works = [
  {
    title: "Corte clásico",
    description: "Terminación prolija, laterales limpios y estilo diario.",
    tag: "Clásico",
    icon: Scissors,
  },
  {
    title: "Fade moderno",
    description: "Degradado limpio con transición suave y terminación precisa.",
    tag: "Fade",
    icon: Sparkles,
  },
  {
    title: "Barba y perfilado",
    description: "Diseño de barba, contornos definidos y acabado profesional.",
    tag: "Barba",
    icon: Star,
  },
  {
    title: "Cambio de look",
    description: "Asesoramiento de estilo según rostro, cabello y preferencia.",
    tag: "Estilo",
    icon: Camera,
  },
];

export function GallerySection() {
  return (
    <section id="galeria" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
          Galería
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Trabajos y estilos
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Algunos estilos de referencia que pueden reservarse desde BarberFlow:
          cortes clásicos, fades, barba, perfilado y cambios de look.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {works.map((work, index) => {
          const Icon = work.icon;

          return (
            <article
              key={work.title}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/[0.07]"
            >
              <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_40%)]" />

                <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs font-bold text-zinc-300 backdrop-blur">
                  {work.tag}
                </div>

                <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-blue-300 shadow-2xl shadow-black/40 transition group-hover:scale-110">
                  <Icon size={34} />
                </div>

                <div className="absolute bottom-4 left-4 rounded-full bg-black/40 px-3 py-1 text-xs text-zinc-400 backdrop-blur">
                  Trabajo #{index + 1}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-white">{work.title}</h3>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {work.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}