const works = [
  {
    title: "Degrade",
    description: "Terminación prolija, laterales limpios.",
    tag: "Degrade",
    image: "/gallery/corte1.jpg",
  },
  {
    title: "Claritos",
    description: "Claritos grises + mantencion del color.",
    tag: "Claritos",
    image: "/gallery/corte2.jpg",
  },
  {
    title: "Franja Gris",
    description: "Franja con color a eleccion + mantencion del color.",
    tag: "Franjas",
    image: "/gallery/corte3.jpg",
  },
  {
    title: "Global blanco",
    description: "Global con color a eleccion + mantencion del color.",
    tag: "Global",
    image: "/gallery/corte4.jpg",
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
          Algunos trabajos realizados en Nacho Barbershop: cortes clásicos,
          fades, barba, perfilado y cambios de look.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {works.map((work, index) => (
          <article
            key={work.title}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/[0.07]"
          >
            <div className="relative h-64 overflow-hidden bg-zinc-900">
              <img
                src={work.image}
                alt={work.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-bold text-zinc-200 backdrop-blur">
                {work.tag}
              </div>

              <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs text-zinc-300 backdrop-blur">
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
        ))}
      </div>
    </section>
  );
}