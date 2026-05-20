import { useEffect, useState } from "react";
import {
  CalendarClock,
  Edit3,
  Loader2,
  PlusCircle,
  RefreshCcw,
  Save,
  Trash2,
  XCircle,
} from "lucide-react";
import { API_URL } from "../config/api";

type Barber = {
  id: string;
  displayName: string;
};

type WorkingHour = {
  id: string;
  barberId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
};

const days = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

export function AdminWorkingHours() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);

  const [selectedBarberId, setSelectedBarberId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("20:00");
  const [editingHourId, setEditingHourId] = useState<string | null>(null);

  const [loadingBarbers, setLoadingBarbers] = useState(false);
  const [loadingHours, setLoadingHours] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBarbers();
  }, []);

  useEffect(() => {
    if (selectedBarberId) {
      loadWorkingHours(selectedBarberId);
    } else {
      setWorkingHours([]);
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

  async function loadWorkingHours(barberId: string) {
    try {
      setLoadingHours(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/working-hours/barber/${barberId}`);
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        setMessage("No se pudieron cargar los horarios.");
        return;
      }

      setWorkingHours(Array.isArray(data) ? data : []);
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingHours(false);
    }
  }

  function resetForm() {
    setDayOfWeek("1");
    setStartTime("10:00");
    setEndTime("20:00");
    setEditingHourId(null);
  }

  function startEdit(hour: WorkingHour) {
    setEditingHourId(hour.id);
    setDayOfWeek(String(hour.dayOfWeek));
    setStartTime(hour.startTime);
    setEndTime(hour.endTime);
    setMessage("Editando horario seleccionado.");
  }

  async function saveWorkingHour() {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    if (!selectedBarberId) {
      setMessage("Seleccioná un barbero.");
      return;
    }

    if (!startTime || !endTime) {
      setMessage("Completá hora de inicio y fin.");
      return;
    }

    if (startTime >= endTime) {
      setMessage("La hora de inicio debe ser menor a la hora de fin.");
      return;
    }

    const payload = {
      barberId: selectedBarberId,
      dayOfWeek: Number(dayOfWeek),
      startTime,
      endTime,
    };

    try {
      setLoadingSave(true);
      setMessage("");

      const url = editingHourId
        ? `${API_URL}/v1/working-hours/${editingHourId}`
        : `${API_URL}/v1/working-hours`;

      const method = editingHourId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo guardar el horario.";

        setMessage(apiMessage);
        return;
      }

      setMessage(
        editingHourId
          ? "Horario actualizado correctamente."
          : "Horario creado correctamente."
      );

      resetForm();
      await loadWorkingHours(selectedBarberId);
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingSave(false);
    }
  }

  async function deleteWorkingHour(hour: WorkingHour) {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    const confirmed = window.confirm(
      `¿Seguro que querés desactivar el horario de ${getDayLabel(hour.dayOfWeek)} ${hour.startTime} a ${hour.endTime}?`
    );

    if (!confirmed) return;

    try {
      setLoadingDeleteId(hour.id);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/working-hours/${hour.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo desactivar el horario.";

        setMessage(apiMessage);
        return;
      }

      setMessage("Horario desactivado correctamente.");

      if (editingHourId === hour.id) {
        resetForm();
      }

      await loadWorkingHours(selectedBarberId);
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingDeleteId(null);
    }
  }

  function getDayLabel(value: number) {
    return days.find((day) => day.value === value)?.label || "Día";
  }

  const selectedBarber = barbers.find((barber) => barber.id === selectedBarberId);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-600 text-white md:h-12 md:w-12">
            <CalendarClock size={21} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-300 md:text-sm">
              Horarios
            </p>

            <h3 className="text-xl font-black text-white md:text-2xl">
              Horarios laborales
            </h3>
          </div>
        </div>

        <button
          onClick={() => {
            loadBarbers();
            if (selectedBarberId) loadWorkingHours(selectedBarberId);
          }}
          disabled={loadingBarbers || loadingHours}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60 md:w-auto"
        >
          {loadingBarbers || loadingHours ? (
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
          className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-yellow-500"
        >
          <option value="">Seleccionar barbero</option>

          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.displayName}
            </option>
          ))}
        </select>

        {selectedBarber && (
          <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
            Configurando horarios para{" "}
            <span className="font-bold text-white">
              {selectedBarber.displayName}
            </span>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-950 p-4">
        <div className="mb-4">
          <h4 className="font-bold text-white">
            {editingHourId ? "Editar horario" : "Agregar horario"}
          </h4>

          <p className="mt-1 text-sm text-zinc-400">
            Definí día, hora de inicio y hora de fin para calcular
            disponibilidad.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <select
            value={dayOfWeek}
            onChange={(event) => setDayOfWeek(event.target.value)}
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-yellow-500"
          >
            {days.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>

          <input
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            type="time"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-yellow-500"
          />

          <input
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            type="time"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-yellow-500"
          />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={saveWorkingHour}
            disabled={loadingSave || !selectedBarberId}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-yellow-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingSave ? (
              <>
                <Loader2 className="animate-spin" size={17} />
                Guardando...
              </>
            ) : editingHourId ? (
              <>
                <Save size={17} />
                Guardar cambios
              </>
            ) : (
              <>
                <PlusCircle size={17} />
                Crear horario
              </>
            )}
          </button>

          {editingHourId && (
            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <XCircle size={17} />
              Cancelar
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="mt-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}

      <div className="mt-7">
        <h4 className="mb-4 text-lg font-bold text-white">
          Horarios activos
        </h4>

        {!selectedBarberId ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-400">
            Seleccioná un barbero para ver sus horarios.
          </div>
        ) : workingHours.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-400">
            Este barbero todavía no tiene horarios cargados.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {workingHours.map((hour) => (
              <div
                key={hour.id}
                className="rounded-2xl border border-white/10 bg-zinc-950 p-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">
                      {getDayLabel(hour.dayOfWeek)}
                    </p>

                    <p className="mt-1 text-sm text-zinc-400">
                      {hour.startTime} a {hour.endTime}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 md:flex">
                    <button
                      onClick={() => startEdit(hour)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-yellow-500/40 px-4 py-2.5 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-500/10"
                    >
                      <Edit3 size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => deleteWorkingHour(hour)}
                      disabled={loadingDeleteId === hour.id}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/40 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
                    >
                      {loadingDeleteId === hour.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      Desactivar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}