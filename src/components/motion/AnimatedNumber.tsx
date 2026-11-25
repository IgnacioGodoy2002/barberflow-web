import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./motionUtils";

type AnimatedNumberProps = {
  value: number;
  duration?: number;
  format?: (value: number) => string;
};

/** Número que cuenta desde 0 hasta `value` cuando aparece en pantalla. */
export function AnimatedNumber({
  value,
  duration = 1200,
  format = (n) => String(Math.round(n)),
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let raf = 0;
    const run = () => {
      if (prefersReducedMotion()) {
        setDisplay(value);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(value * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      run();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return <span ref={ref}>{format(display)}</span>;
}
