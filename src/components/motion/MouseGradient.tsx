import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./motionUtils";

/**
 * Fondo de luces que sigue al mouse con retardo suave (como en el portfolio).
 * Va dentro de un contenedor `relative overflow-hidden`.
 */
export function MouseGradient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    let tx = 70;
    let ty = 20;
    let mx = 70;
    let my = 20;
    let raf = 0;

    const loop = () => {
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      el.style.setProperty("--mx", `${mx}%`);
      el.style.setProperty("--my", `${my}%`);
      raf =
        Math.abs(tx - mx) > 0.1 || Math.abs(ty - my) > 0.1
          ? requestAnimationFrame(loop)
          : 0;
    };

    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      if (event.clientY > rect.bottom) return;
      tx = ((event.clientX - rect.left) / rect.width) * 100;
      ty = ((event.clientY - rect.top) / rect.height) * 100;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(circle 560px at var(--mx, 70%) var(--my, 20%), rgba(59,130,246,0.28) 0%, transparent 60%)," +
          "radial-gradient(circle 680px at calc(var(--mx, 70%) - 40%) calc(var(--my, 20%) + 10%), rgba(168,85,247,0.20) 0%, transparent 60%)",
        filter: "blur(30px) saturate(140%)",
      }}
    />
  );
}
