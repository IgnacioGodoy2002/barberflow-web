import { MessageCircle } from "lucide-react";
import { whatsappLink } from "../config/business";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      data-cursor-label="Chat"
      className="animate-wa-pulse fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-4 font-bold text-white shadow-2xl shadow-black/50 transition hover:scale-105 hover:bg-green-400"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={24} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
