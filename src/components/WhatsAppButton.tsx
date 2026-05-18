import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phoneNumber = "5492320598170";

  const message = encodeURIComponent(
    "Hola Nacho, quiero consultar por un turno en la barbería."
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-[9999] inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-4 font-bold text-white shadow-2xl shadow-black/50 transition hover:scale-105 hover:bg-green-400"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={24} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}