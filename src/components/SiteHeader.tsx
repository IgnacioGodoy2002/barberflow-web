import { useEffect, useState } from "react";
import { CalendarDays, Menu, X } from "lucide-react";
import logoBarberia from "../assets/logo-barberia-pro.webp";
import { BUSINESS } from "../config/business";

const NAV_LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Galería", href: "#galeria" },
  { label: "Barberos", href: "#barberos" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Contacto", href: "#contacto" },
  { label: "FAQ", href: "#faq" },
];

/** En el encabezado grande mostramos menos links para que no se amontonen. */
const MAIN_NAV_LINKS = NAV_LINKS.filter((link) => link.href !== "#como-funciona");

/**
 * Encabezado: arriba de todo muestra el logo grande; al bajar aparece una
 * barra compacta fija con desenfoque para tener siempre a mano "Reservar".
 */
export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Barra compacta que aparece al scrollear */}
      <div
        className={`fixed inset-x-0 top-[3px] z-50 border-b border-white/10 bg-zinc-950/75 backdrop-blur-xl transition duration-500 ${
          isCompact ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
        }`}
        aria-hidden={!isCompact}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <a href="#top" className="flex items-center gap-3" tabIndex={isCompact ? 0 : -1}>
            <img
              src={logoBarberia}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-xl border border-white/10 object-contain"
            />
            <span className="font-black">{BUSINESS.name}</span>
          </a>

          <nav aria-label="Secciones" className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                tabIndex={isCompact ? 0 : -1}
                className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#reservar"
            tabIndex={isCompact ? 0 : -1}
            className="magnetic inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-zinc-950 hover:bg-zinc-200"
          >
            <CalendarDays size={16} />
            Reservar
          </a>
        </div>
      </div>

      {/* Encabezado principal */}
      <header id="top" className="relative z-10 mx-auto max-w-6xl px-6 pt-8 md:pt-14">
        <div className="hero-enter flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-zinc-900 p-1.5 shadow-xl shadow-black/40 sm:h-24 sm:w-24">
              <img
                src={logoBarberia}
                alt={`Logo de ${BUSINESS.name}`}
                width={112}
                height={112}
                className="h-full w-full rounded-2xl object-contain"
              />
            </div>

            <div>
              <p className="text-xl font-black text-white sm:whitespace-nowrap sm:text-2xl">{BUSINESS.name}</p>
              <p className="hidden text-sm text-zinc-300 sm:block sm:whitespace-nowrap">
                {BUSINESS.product} · {BUSINESS.tagline}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{BUSINESS.address}</p>
            </div>
          </a>

          <nav aria-label="Principal" className="hidden items-center justify-end gap-2 xl:flex">
            {MAIN_NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}

            <a
              href="#reservar"
              className="magnetic rounded-full bg-white px-5 py-2 text-sm font-bold text-zinc-950 hover:bg-zinc-200"
            >
              Reservar
            </a>

            <a
              href="/admin"
              className="rounded-full border border-purple-500/40 px-4 py-2 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/10"
            >
              Panel admin
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 xl:hidden"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div
          id="mobile-menu"
          className={`grid transition-all duration-500 ease-out xl:hidden ${
            isMenuOpen ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <nav
              aria-label="Menú móvil"
              className="grid gap-2 rounded-3xl border border-white/10 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  tabIndex={isMenuOpen ? 0 : -1}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10"
                >
                  {link.label}
                </a>
              ))}

              <a
                href="#reservar"
                onClick={closeMenu}
                tabIndex={isMenuOpen ? 0 : -1}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200"
              >
                Reservar turno
              </a>

              <a
                href="/admin"
                onClick={closeMenu}
                tabIndex={isMenuOpen ? 0 : -1}
                className="rounded-2xl border border-purple-500/40 bg-purple-500/10 px-5 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-500/20"
              >
                Panel admin
              </a>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
