import { useEffect, useState } from "react";
import {
  ChevronUp,
  ExternalLink,
  FileCode2,
  HelpCircle,
  MapPin,
  MessageCircle,
  Scissors,
} from "lucide-react";
import { BUSINESS, MAPS_LINK, whatsappLink } from "../config/business";

const navigation = [
  { label: "Servicios", href: "#servicios" },
  { label: "Galería", href: "#galeria" },
  { label: "Barberos", href: "#barberos" },
  { label: "Reservar turno", href: "#reservar" },
  { label: "Sobre nosotros", href: "#sobre" },
  { label: "Opiniones", href: "#opiniones" },
];

const stack = ["React", "TypeScript", "Tailwind", "NestJS", "PostgreSQL", "Prisma", "JWT", "Swagger"];

export function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <footer className="border-t border-white/10 bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-zinc-950">
                <Scissors size={18} />
              </div>
              <div>
                <p className="font-black text-white">{BUSINESS.name}</p>
                <p className="text-xs text-zinc-500">
                  {BUSINESS.product} · {BUSINESS.tagline}
                </p>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-6 text-zinc-400">
              Sistema web para consultar servicios, revisar disponibilidad, reservar turnos y
              gestionar la agenda de la barbería.
            </p>
          </div>

          <nav aria-label="Pie de página">
            <h3 className="mb-4 font-bold text-white">Navegación</h3>
            <div className="grid gap-3 text-sm text-zinc-400">
              {navigation.map((item) => (
                <a key={item.href} href={item.href} className="w-fit transition hover:translate-x-1 hover:text-white">
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          <div>
            <h3 className="mb-4 font-bold text-white">Ayuda</h3>
            <div className="grid gap-3 text-sm text-zinc-400">
              <a href="#faq" className="inline-flex w-fit items-center gap-2 transition hover:text-white">
                <HelpCircle size={15} /> Preguntas frecuentes
              </a>
              <a href="#contacto" className="inline-flex w-fit items-center gap-2 transition hover:text-white">
                <MapPin size={15} /> Contacto y ubicación
              </a>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 transition hover:text-green-400"
              >
                <MessageCircle size={15} /> WhatsApp
              </a>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-start gap-2 transition hover:text-white"
              >
                <MapPin size={15} className="mt-0.5 text-blue-400" /> {BUSINESS.address}
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-bold text-white">El proyecto</h3>
            <div className="grid gap-3 text-sm">
              <a
                href={BUSINESS.repos.web}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 font-semibold text-blue-400 transition hover:text-blue-300"
              >
                <FileCode2 size={15} /> Código del frontend <ExternalLink size={13} />
              </a>
              <a
                href={BUSINESS.repos.api}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 font-semibold text-purple-400 transition hover:text-purple-300"
              >
                <FileCode2 size={15} /> Código del backend <ExternalLink size={13} />
              </a>
              <a
                href={BUSINESS.repos.docs}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 font-semibold text-zinc-300 transition hover:text-white"
              >
                <FileCode2 size={15} /> Documentación API (Swagger) <ExternalLink size={13} />
              </a>
              <a href="/admin" className="w-fit text-zinc-400 transition hover:text-purple-400">
                Panel admin
              </a>
            </div>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-5">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-zinc-500 sm:flex-row">
            <p>
              © {new Date().getFullYear()} {BUSINESS.name}. Todos los derechos reservados.
            </p>
            <p>
              Diseñado y desarrollado por{" "}
              <a
                href={BUSINESS.author.portfolio}
                target="_blank"
                rel="noreferrer"
                data-cursor-label="Portfolio"
                className="font-semibold text-zinc-300 underline decoration-purple-500/50 underline-offset-4 transition hover:text-white hover:decoration-purple-400"
              >
                {BUSINESS.author.name}
              </a>
            </p>
          </div>
        </div>
      </footer>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Volver arriba"
        tabIndex={showBackToTop ? 0 : -1}
        className={`fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white text-zinc-950 shadow-2xl shadow-black/40 transition duration-300 hover:scale-105 hover:bg-zinc-200 ${
          showBackToTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ChevronUp size={22} />
      </button>
    </>
  );
}
