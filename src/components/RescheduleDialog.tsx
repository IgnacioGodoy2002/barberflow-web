import { useEffect, useRef, useState } from "react";
import { CalendarClock, Loader2, X } from "lucide-react";
import { API_URL } from "../config/api";

type Slot = { startAt: string; endAt: string; label: string };

type RescheduleDialogProps = {
  appointment: {
    id: string;
    startAt: string;
    barber?: { id?: string; displayName?: string };
    service?: { id?: string; name?: string };
  };
  onClose: () => void;
  onDone: (message: string) => void;
};

const todayInArgentina = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });

/** Elegir un nuevo horario para un turno propio (mismo barbero y servicio). */
export function RescheduleDialog({ appointment, onClose, onDone }: RescheduleDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [date, setDate] = useState(() =>
    new Date(appointment.startAt).toLocaleDateString("en-CA", {
      timeZone: "America/Argentina/Buenos_Aires",
    }),
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    const barberId = appointment.barber?.id;
    const serviceId = appointment.service?.id;
    if (!barberId || !serviceId) return undefined;

    let cancelled = false;
    fetch(`${API_URL}/v1/availability?barberId=${barberId}&serviceId=${serviceId}&date=${date}`)
      .then((response) => response.json())
      .then((data: { slots?: Slot[]; message?: string }) => {
        if (cancelled) return;
        setSlots(Array.isArray(data.slots) ? data.slots : []);
        setError(data.slots ? "" : data.message ?? "No se pudo consultar la disponibilidad.");
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo conectar con la API.");
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [appointment.barber?.id, appointment.service?.id, date]);

  async function save() {
    if (!selected) return;
    const token = localStorage.getItem("barberflow_token");

    try {
      setSaving(true);
      setError("");
      const response = await fetch(`${API_URL}/v1/appointments/${appointment.id}/reschedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ startAt: selected.startAt }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(Array.isArray(data.message) ? data.message.join(", ") : data.message || "No se pudo reprogramar.");
        return;
      }

      dialogRef.current?.close();
      onDone(`Listo: tu turno pasó al ${date.split("-").reverse().join("/")} a las ${selected.label}.`);
    } catch {
      setError("No se pudo conectar con la API.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      aria-label="Reprogramar turno"
      className="m-auto w-[min(92vw,560px)] rounded-3xl border border-white/10 bg-zinc-950 p-0 text-white outline-none backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 [animation:lightbox-in_.3s_cubic-bezier(.2,.7,.2,1)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
              <CalendarClock size={16} /> Reprogramar
            </p>
            <h3 className="mt-2 text-xl font-black">
              {appointment.service?.name} con {appointment.barber?.displayName}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Cerrar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <label className="block text-sm font-semibold text-zinc-300">
          Nueva fecha
          <input
            type="date"
            value={date}
            min={todayInArgentina()}
            onChange={(event) => {
              setDate(event.target.value);
              setSelected(null);
              setLoadingSlots(true);
            }}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
          />
        </label>

        <div className="mt-5 min-h-24">
          {loadingSlots ? (
            <p className="flex items-center gap-2 text-sm text-zinc-400">
              <Loader2 size={16} className="animate-spin" /> Buscando horarios…
            </p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-zinc-400">{error || "No hay horarios libres ese día. Probá con otra fecha."}</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => (
                <button
                  key={slot.startAt}
                  type="button"
                  onClick={() => setSelected(slot)}
                  className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                    selected?.startAt === slot.startAt
                      ? "border-purple-400 bg-purple-500/20 text-white"
                      : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-purple-500/40"
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && slots.length > 0 && <p className="mt-4 text-sm text-red-300">{error}</p>}

        <p className="mt-5 text-xs text-zinc-500">
          Podés reprogramar hasta 2 veces y con al menos 2 horas de anticipación.
        </p>

        <button
          type="button"
          onClick={save}
          disabled={!selected || saving}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-50"
        >
          {saving ? <Loader2 size={17} className="animate-spin" /> : <CalendarClock size={17} />}
          {selected ? `Mover a las ${selected.label}` : "Elegí un horario"}
        </button>
      </div>
    </dialog>
  );
}
