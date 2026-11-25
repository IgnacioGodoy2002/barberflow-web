/**
 * Datos de la barbería en un solo lugar.
 * Si cambia el teléfono, la dirección o los horarios, se edita acá
 * y se actualiza en toda la web (hero, contacto, footer, WhatsApp, SEO).
 */
export const BUSINESS = {
  name: "Nacho Barbershop",
  product: "BarberFlow",
  tagline: "Turnos inteligentes",
  address: "Hipólito Bouchard 2086",
  whatsappNumber: "5492320598170",
  whatsappDefaultMessage: "Hola Nacho, quiero consultar por un turno en la barbería.",
  hours: [
    { label: "Lunes a viernes", value: "10:00 a 20:00" },
    { label: "Sábados", value: "10:00 a 18:00" },
    { label: "Domingos", value: "Cerrado" },
  ],
  repos: {
    web: "https://github.com/IgnacioGodoy2002/barberflow-web",
    api: "https://github.com/IgnacioGodoy2002/barberflow-api",
    docs: "https://barberflow-api-9feo.onrender.com/api/docs",
  },
  author: {
    name: "Ignacio Gabriel Godoy",
    portfolio: "https://portfolio-ignacio-pi.vercel.app/",
    github: "https://github.com/IgnacioGodoy2002",
  },
} as const;

export function whatsappLink(message: string = BUSINESS.whatsappDefaultMessage) {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const MAPS_QUERY = encodeURIComponent(BUSINESS.address);
export const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;
export const MAPS_EMBED = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;
