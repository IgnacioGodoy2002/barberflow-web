import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const works = [
  {
    title: "Degradé",
    description: "Terminación prolija y laterales limpios.",
    tag: "Degradé",
    image: "/gallery/corte1.webp",
    alt: "Corte degradé con laterales rebajados, visto de perfil",
  },
  {
    title: "Claritos",
    description: "Claritos grises con mantenimiento del color.",
    tag: "Claritos",
    image: "/gallery/corte2.webp",
    alt: "Corte con flequillo y claritos grises",
  },
  {
    title: "Franja gris",
    description: "Franja con el color que elijas y mantenimiento del color.",
    tag: "Franjas",
    image: "/gallery/corte3.webp",
    alt: "Corte con franja de color gris claro y barba perfilada",
  },
  {
    title: "Global blanco",
    description: "Color global a elección con mantenimiento del color.",
    tag: "Global",
    image: "/gallery/corte4.webp",
    alt: "Corte con decoloración global en blanco, visto de perfil",
  },
];

export function GallerySection() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const open = (index: number) => {
    setActive(index);
    dialogRef.current?.showModal();
  };

  const close = () => dialogRef.current?.close();

  const step = useCallback((direction: 1 | -1) => {
    setActive((current) =>
      current === null ? current : (current + direction + works.length) % works.length,
    );
  }, []);

  useEffect(() => {
    if (active === null) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, step]);

  const current = active === null ? null : works[active];

  return (
    <section id="galeria" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16">
      <SectionHeading
        eyebrow="Galería"
        title="Trabajos y estilos"
        description="Algunos trabajos realizados en Nacho Barbershop: degradés, claritos, franjas y cambios de color."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {works.map((work, index) => (
          <article
            key={work.title}
            data-reveal
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/[0.07]"
          >
            <button
              type="button"
              onClick={() => open(index)}
              data-cursor-label="Ver"
              aria-label={`Ampliar foto: ${work.title}`}
              className="relative block h-72 w-full overflow-hidden bg-zinc-900 text-left"
            >
              <img
                src={work.image}
                alt={work.alt}
                width={600}
                height={750}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-bold text-zinc-200 backdrop-blur">
                {work.tag}
              </div>

              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs text-zinc-300 opacity-90 backdrop-blur transition group-hover:opacity-100">
                <Expand size={13} /> Ver foto
              </div>
            </button>

            <div className="p-5">
              <h3 className="text-lg font-bold text-white">{work.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{work.description}</p>
            </div>
          </article>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        aria-label={current ? current.title : "Foto ampliada"}
        className="m-auto max-h-[92dvh] outline-none w-[min(92vw,560px)] overflow-visible bg-transparent p-0 text-white backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        {current && (
          <figure key={current.image} className="relative [animation:lightbox-in_.35s_cubic-bezier(.2,.7,.2,1)]">
            <img
              src={current.image}
              alt={current.alt}
              className="max-h-[78dvh] w-full rounded-3xl object-contain"
            />
            <figcaption className="mt-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold">{current.title}</p>
                <p className="text-sm text-zinc-400">{current.description}</p>
              </div>
              <span className="text-xs text-zinc-500">
                {(active ?? 0) + 1} / {works.length}
              </span>
            </figcaption>

            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur transition hover:bg-black/80"
            >
              <X size={20} />
            </button>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/3 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 backdrop-blur transition hover:bg-black/80"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/3 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 backdrop-blur transition hover:bg-black/80"
            >
              <ChevronRight size={22} />
            </button>
          </figure>
        )}
      </dialog>
    </section>
  );
}
