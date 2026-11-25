import { useEffect, useState } from "react";
import { CalendarDays, ListOrdered, Loader2, MailCheck, RefreshCw } from "lucide-react";
import { API_URL } from "../config/api";

type WaitlistEntry = {
  id: string;
  date: string;
  notifiedAt: string | null;
  createdAt: string;
  service: { name: string };
  barber: { displayName: string } | null;
  client: { fullName: string; email: string; phone?: string | null };
};

async function fetchWaitlist(): Promise<WaitlistEntry[]> {
  const token = localStorage.getItem("barberflow_admin_token");
  const response = await fetch(`${API_URL}/v1/waitlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("No se pudo cargar la lista de espera");
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

function formatDate(date: string) {
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

/** Clientes que pidieron que les avisen si se libera un turno. */
export function AdminWaitlist() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchWaitlist()
      .then((data) => {
        if (!cancelled) {
          setEntries(data);
          setError("");
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950 p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold text-white">
            <ListOrdered size={20} className="text-purple-300" /> Lista de espera
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Cuando se cancela o reprograma un turno, el sistema avisa por email a los primeros 3 del día.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setReloadKey((key) => key + 1);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/10"
        >
          <RefreshCw size={15} /> Actualizar
        </button>
      </div>

      {loading && (
        <p className="flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 size={16} className="animate-spin" /> Cargando…
        </p>
      )}

      {!loading && error && <p className="text-sm text-red-300">{error}</p>}

      {!loading && !error && entries.length === 0 && (
        <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-zinc-400">
          No hay nadie en lista de espera para los próximos días.
        </p>
      )}

      {!loading && !error && entries.length > 0 && (
        <ul className="grid gap-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold text-white">{entry.client.fullName}</p>
                <p className="text-xs text-zinc-500">
                  {entry.client.email}
                  {entry.client.phone ? ` · ${entry.client.phone}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-zinc-300">
                  <CalendarDays size={13} /> {formatDate(entry.date)}
                </span>
                <span className="rounded-full bg-purple-500/10 px-3 py-1 text-purple-200">{entry.service.name}</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-zinc-300">
                  {entry.barber?.displayName ?? "Cualquier barbero"}
                </span>
                {entry.notifiedAt ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-green-300">
                    <MailCheck size={13} /> Avisado
                  </span>
                ) : (
                  <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-yellow-200">Esperando</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
