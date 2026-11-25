import { useEffect } from "react";
import { prefersReducedMotion } from "./motionUtils";

const SELECTOR = "[data-reveal]";

/**
 * Hace aparecer los bloques marcados con `data-reveal` cuando entran en
 * pantalla (suben y se desvanecen). Los hermanos de una misma grilla entran
 * escalonados. También anima los que llegan después (por ejemplo, las cards
 * de servicios y barberos que vienen de la API).
 * Sin IntersectionObserver o con "reducir movimiento", todo queda visible.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const prepare = (element: HTMLElement) => {
      if (element.dataset.revealReady) return;
      element.dataset.revealReady = "true";

      const siblings = element.parentElement
        ? Array.from(element.parentElement.children).filter((child) =>
            child.matches(SELECTOR),
          )
        : [];
      const index = Math.max(0, siblings.indexOf(element));
      element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 90}ms`);

      element.classList.add("reveal");
      observer.observe(element);
    };

    document.querySelectorAll<HTMLElement>(SELECTOR).forEach(prepare);

    const mutations = new MutationObserver((records) => {
      records.forEach((record) =>
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches(SELECTOR)) prepare(node);
          node.querySelectorAll<HTMLElement>(SELECTOR).forEach(prepare);
        }),
      );
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);
}
