import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "./motionUtils";

const INTERACTIVE = 'a, button, [role="tab"], summary, label, select';
const TEXT_INPUT = 'input, textarea, select, [contenteditable="true"]';
const MAGNETIC = ".magnetic";

/** Texto que muestra el cursor según el elemento que tiene debajo. */
function labelFor(target: Element) {
  const own = target.closest("[data-cursor-label]");
  return own ? own.getAttribute("data-cursor-label") ?? "" : "";
}

/**
 * Cursor animado (el mismo del portfolio): un círculo que invierte los colores
 * de lo que tiene debajo (mix-blend-mode: difference), sigue al mouse con un
 * resorte suave y se estira según la velocidad. Sobre links y botones crece;
 * sobre elementos con `data-cursor-label` se vuelve un disco con texto.
 * Los elementos con clase `magnetic` se acercan levemente al cursor.
 * Solo se activa con mouse: nunca en pantallas táctiles ni con "reducir movimiento".
 */
export function CustomCursor() {
  const shellRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return undefined;

    const shell = shellRef.current;
    const label = labelRef.current;
    if (!shell || !label) return undefined;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let mx = -200;
    let my = -200;
    let x = -200;
    let y = -200;
    let vx = 0;
    let vy = 0;
    let frame = 0;
    let visible = false;
    let magnet: HTMLElement | null = null;

    const render = () => {
      // Resorte amortiguado: rápido pero sin pasarse de largo.
      const ax = (mx - x) * 0.22;
      const ay = (my - y) * 0.22;
      vx = (vx + ax) * 0.62;
      vy = (vy + ay) * 0.62;
      x += vx;
      y += vy;

      const speed = Math.min(Math.hypot(vx, vy), 40);
      const stretch = 1 + speed / 70;
      const angle = (Math.atan2(vy, vx) * 180) / Math.PI;

      shell.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}deg) scale(${stretch}, ${1 / stretch})`;
      label.style.transform = `rotate(${-angle}deg)`;
      frame = requestAnimationFrame(render);
    };

    const release = () => {
      if (!magnet) return;
      magnet.style.translate = "";
      magnet.classList.remove("is-magnetized");
      magnet = null;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      mx = event.clientX;
      my = event.clientY;

      if (!visible) {
        visible = true;
        x = mx;
        y = my;
        root.classList.add("cursor-visible");
      }

      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const overText = target.closest(TEXT_INPUT);
      const text = overText ? "" : labelFor(target);
      const interactive = !overText && target.closest(INTERACTIVE);

      root.classList.toggle("cursor-text", Boolean(overText));
      root.classList.toggle("cursor-hover", Boolean(interactive) && !text);
      root.classList.toggle("cursor-label", Boolean(text));
      if (label.textContent !== text) label.textContent = text;

      const nextMagnet = overText
        ? null
        : (target.closest(MAGNETIC) as HTMLElement | null);
      if (nextMagnet !== magnet) release();

      if (nextMagnet) {
        magnet = nextMagnet;
        nextMagnet.classList.add("is-magnetized");
        const rect = nextMagnet.getBoundingClientRect();
        const dx = (mx - (rect.left + rect.width / 2)) * 0.18;
        const dy = (my - (rect.top + rect.height / 2)) * 0.28;
        // Usamos `translate` (no `transform`) para no pisar los hover de Tailwind.
        nextMagnet.style.translate = `${Math.max(-8, Math.min(8, dx))}px ${Math.max(-6, Math.min(6, dy))}px`;
      }
    };

    const onLeave = () => {
      visible = false;
      root.classList.remove("cursor-visible");
      release();
    };
    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("blur", onLeave);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      release();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onLeave);
      root.classList.remove(
        "has-custom-cursor",
        "cursor-visible",
        "cursor-hover",
        "cursor-text",
        "cursor-label",
        "cursor-down",
      );
    };
  }, []);

  return (
    <div className="cursor-layer" aria-hidden="true">
      <div ref={shellRef} className="cursor-shell">
        <div className="cursor-blob" />
        <span ref={labelRef} className="cursor-text-label" />
      </div>
    </div>
  );
}
