export type Testimonial = {
  /** Nombre (o nombre + inicial) del cliente, con su permiso. */
  name: string;
  text: string;
  service: string;
  /** Opcional: de dónde salió la reseña (Google, Instagram, WhatsApp…). */
  source?: string;
};

/**
 * Reseñas REALES de clientes. Mientras la lista esté vacía, la sección
 * muestra una invitación a dejar la opinión por WhatsApp en lugar de
 * reseñas inventadas.
 *
 * Ejemplo:
 * { name: "Juan P.", text: "…", service: "Degradé", source: "Google" },
 */
export const testimonials: Testimonial[] = [];
