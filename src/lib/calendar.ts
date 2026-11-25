import { BUSINESS } from "../config/business";

type CalendarEvent = {
  title: string;
  start: string | Date;
  end: string | Date;
  details?: string;
};

/** 2026-12-05T13:00:00.000Z → 20261205T130000Z (formato de Google Calendar e .ics) */
function toCalendarDate(value: string | Date) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Link "Agregar a Google Calendar" (no necesita API ni permisos). */
export function googleCalendarUrl(event: CalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toCalendarDate(event.start)}/${toCalendarDate(event.end)}`,
    details: event.details ?? "",
    location: `${BUSINESS.name}, ${BUSINESS.address}`,
    ctz: "America/Argentina/Buenos_Aires",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcs(value: string) {
  const replacements: Record<string, string> = { "\\": "\\\\", ";": "\\;", ",": "\\,", "\n": "\\n" };
  return value.replace(/[\\;,\n]/g, (char) => replacements[char]);
}

/** Descarga un archivo .ics (Apple Calendar, Outlook y cualquier otro calendario). */
export function downloadIcs(event: CalendarEvent, fileName = "turno-barberia.ics") {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BarberFlow//Turnos//ES",
    "BEGIN:VEVENT",
    `UID:${toCalendarDate(event.start)}-${Math.random().toString(36).slice(2)}@barberflow`,
    `DTSTAMP:${toCalendarDate(new Date())}`,
    `DTSTART:${toCalendarDate(event.start)}`,
    `DTEND:${toCalendarDate(event.end)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.details ?? "")}`,
    `LOCATION:${escapeIcs(`${BUSINESS.name}, ${BUSINESS.address}`)}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Turno en la barbería",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
