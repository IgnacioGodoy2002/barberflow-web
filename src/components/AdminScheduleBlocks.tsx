import { useEffect, useState } from "react";
import {
  Ban,
  Loader2,
  PlusCircle,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { API_URL } from "../config/api";

type Barber = {
  id: string;
  displayName: string;
};

type ScheduleBlock = {
  id: string;
  barberId: string;
  startAt: string;
  endAt: string;
  type: string;
  reason?: string;
  isActive?: boolean;
};

const blockTypes = [
  { value: "BREAK", label: "Descanso" },
  { value: "PERSONAL", label: "Personal" },
  { value: "VACATION", label: "Vacaciones" },
  { value: "SICKNESS", label: "Enfermedad" },
  { value: "OTHER", label: "Otro" },
];

export function AdminScheduleBlocks() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);

  const [selectedBarberId, setSelectedBarberId] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [type, setType] = useState("BREAK");
  const [reason, setReason] = useState("");

  const [loadingBarbers, setLoadingBarbers] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBarbers();
  }, []);

  useEffect(() => {
    if (selectedBarberId) {
      loadBlocks(selectedBarberId);
    } else {
      setBlocks([]);
    }
  }, [selectedBarberId]);

  async function loadBarbers() {
    try {
      setLoadingBarbers(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/barbers`);
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        setMessage("No se pudieron cargar los barberos.");
        return;
      }

      setBarbers(Array.isArray(data) ? data : []);
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingBarbers(false);
    }
  }

  async function loadBlocks(barberId: string) {
  const token = localStorage.getItem("barberflow_admin_token");

  if (!token) {
    setMessage("Primero iniciá sesión como admin.");
    return;
  }

  try {
    setLoadingBlocks(true);
    setMessage("");

    const response = await fetch(
      `${API_URL}/v1/schedule-blocks/barber/${barberId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json().catch(() => []);

    if (!response.ok) {
      const apiMessage = Array.isArray(data.message)
        ? data.message.join(", ")
        : data.message || "No se pudieron cargar los bloqueos.";

      setMessage(apiMessage);
      return;
    }

    setBlocks(Array.isArray(data) ? data : []);
  } catch {
    setMessage("No se pudo conectar con la API.");
  } finally {
    setLoadingBlocks(false);
  }
}

  function resetForm() {
    setStartAt("");
    setEndAt("");
    setType("BREAK");
    setReason("");
  }

  async function createBlock() {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    if (!selectedBarberId) {
      setMessage("Seleccioná un barbero.");
      return;
    }

    if (!startAt || !endAt) {
      setMessage("Completá fecha/hora de inicio y fin.");
      return;
    }

    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (startDate >= endDate) {
      setMessage("La fecha/hora de inicio debe ser menor a la de fin.");
      return;
    }

    try {
      setLoadingSave(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/schedule-blocks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          barberId: selectedBarberId,
          startAt: startDate.toISOString(),
          endAt: endDate.toISOString(),
          type,
          reason,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo crear el bloqueo.";

        setMessage(apiMessage);
        return;
      }

      setMessage("Bloqueo creado correctamente.");
      resetForm();
      await loadBlocks(selectedBarberId);
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingSave(false);
    }
  }

  async function deleteBlock(block: ScheduleBlock) {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    const confirmed = window.confirm("¿Seguro que querés desactivar este bloqueo?");

    if (!confirmed) return;

    try {
      setLoadingDeleteId(block.id);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/schedule-blocks/${block.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo desactivar el bloqueo.";

        setMessage(apiMessage);
        return;
      }

      setMessage("Bloqueo desactivado correctamente.");
      await loadBlocks(selectedBarberId);
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingDeleteId(null);
    }
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date(date));
  }

  function getTypeLabel(value: string) {
    return blockTypes.find((item) => item.value === value)?.label || value;
  }

  const selectedBarber = barbers.find((barber) => barber.id === selectedBarberId);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white md:h-12 md:w-12">
            <Ban size={21} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300 md:text-sm">
              Bloqueos
            </p>

            <h3 className="text-xl font-black text-white md:text-2xl">
              Bloqueos de agenda
            </h3>
          </div>
        </div>

        <button
          onClick={() => {
            loadBarbers();
            if (selectedBarberId) loadBlocks(selectedBarberId);
          }}
          disabled={loadingBarbers || loadingBlocks}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60 md:w-auto"
        >
          {loadingBarbers || loadingBlocks ? (
            <>
              <Loader2 className="animate-spin" size={17} />
              Cargando...
            </>
          ) : (
            <>
              <RefreshCcw size={17} />
              Actualizar
            </>
          )}
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
        <label className="mb-2 block text-sm font-semibold text-zinc-300">
          Barbero
        </label>

        <select
          value={selectedBarberId}
          onChange={(event) => {
            setSelectedBarberId(event.target.value);
            resetForm();
          }}
          className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-red-500"
        >
          <option value="">Seleccionar barbero</option>

          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.displayName}
            </option>
          ))}
        </select>

        {selectedBarber && (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
            Gestionando bloqueos para{" "}
            <span className="font-bold text-white">
              {selectedBarber.displayName}
            </span>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-950 p-4">
        <div className="mb-4">
          <h4 className="font-bold text-white">Crear bloqueo</h4>

          <p className="mt-1 text-sm text-zinc-400">
            Bloqueá un rango horario para que no aparezca disponible en reservas.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={startAt}
            onChange={(event) => setStartAt(event.target.value)}
            type="datetime-local"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-red-500"
          />

          <input
            value={endAt}
            onChange={(event) => setEndAt(event.target.value)}
            type="datetime-local"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-red-500"
          />

          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-red-500"
          >
            {blockTypes.map((blockType) => (
              <option key={blockType.value} value={blockType.value}>
                {blockType.label}
              </option>
            ))}
          </select>

          <input
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Motivo. Ej: Almuerzo, trámite, feriado..."
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-red-500"
          />
        </div>

        <button
          onClick={createBlock}
          disabled={loadingSave || !selectedBarberId}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingSave ? (
            <>
              <Loader2 className="animate-spin" size={17} />
              Guardando...
            </>
          ) : (
            <>
              <PlusCircle size={17} />
              Crear bloqueo
            </>
          )}
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}

      <div className="mt-7">
        <h4 className="mb-4 text-lg font-bold text-white">
          Bloqueos activos
        </h4>

        {!selectedBarberId ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-400">
            Seleccioná un barbero para ver sus bloqueos.
          </div>
        ) : blocks.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-400">
            Este barbero no tiene bloqueos activos.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="rounded-2xl border border-white/10 bg-zinc-950 p-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">
                      {getTypeLabel(block.type)}
                    </p>

                    <p className="mt-1 text-sm text-zinc-400">
                      Desde: {formatDate(block.startAt)}
                    </p>

                    <p className="mt-1 text-sm text-zinc-400">
                      Hasta: {formatDate(block.endAt)}
                    </p>

                    {block.reason && (
                      <p className="mt-2 rounded-2xl bg-white/[0.04] p-3 text-sm text-zinc-400">
                        Motivo:{" "}
                        <span className="text-zinc-200">{block.reason}</span>
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteBlock(block)}
                    disabled={loadingDeleteId === block.id}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/40 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
                  >
                    {loadingDeleteId === block.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Trash2 size={16} />
                    )}
                    Desactivar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}