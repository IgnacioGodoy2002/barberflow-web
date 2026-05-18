import { useState } from "react";
import { CalendarDays, Loader2, RefreshCcw, XCircle } from "lucide-react";
import { API_URL } from "../config/api";

type Appointment = {
  id: string;
  startAt: string;
  status: string;
  notes?: string;
  client?: {
    name?: string;
    email?: string;
  };
  user?: {
    name?: string;
    email?: string;
  };
  barber?: {
    displayName?: string;
  };
  service?: {
    name?: string;
  };
};

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [message, setMessage] = useState("");

  async function loadAppointments() {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    try {
      setLoadingAppointments(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.message || "No se pudieron cargar los turnos.");
        return;
      }

      if (Array.isArray(data)) {
        setAppointments(data);

        if (data.length === 0) {
          setMessage("Todavía no hay turnos registrados.");
        }
      } else {
        setMessage("La API respondió con un formato inesperado.");
      }
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingAppointments(false);
    }
  }

  async function cancelAppointment(appointmentId: string) {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    const confirmed = window.confirm(
      "¿Seguro que querés cancelar este turno?"
    );

    if (!confirmed) return;

    try {
      setLoadingAppointments(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/v1/appointments/${appointmentId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.message || "No se pudo cancelar el turno.");
        return;
      }

      setMessage("Turno cancelado correctamente.");
      await loadAppointments();
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingAppointments(false);
    }
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date(date));
  }

  function getStatusLabel(status: string) {
    if (status === "CONFIRMED") return "Confirmado";
    if (status === "CANCELLED") return "Cancelado";
    if (status === "PENDING") return "Pendiente";
    if (status === "COMPLETED") return "Completado";

    return status;
  }

  function getStatusClass(status: string) {
    if (status === "CONFIRMED") {
      return "border-green-500/30 bg-green-500/10 text-green-300";
    }

    if (status === "CANCELLED") {
      return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    if (status === "COMPLETED") {
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    }

    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white">
            <CalendarDays size={22} />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
              Turnos
            </p>
            <h3 className="text-xl font-black text-white">
              Gestión de turnos
            </h3>
            <p className="mt-1 text-sm text-zinc-400">
              Consultá todos los turnos registrados y cancelá reservas activas.
            </p>
          </div>
        </div>

        <button
          onClick={loadAppointments}
          disabled={loadingAppointments}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-60"
        >
          {loadingAppointments ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Cargando...
            </>
          ) : (
            <>
              <RefreshCcw size={18} />
              Actualizar turnos
            </>
          )}
        </button>
      </div>

      {message && (
        <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 text-center">
          <CalendarDays className="mx-auto mb-3 text-zinc-500" size={32} />
          <p className="font-bold text-white">No hay turnos cargados</p>
          <p className="mt-2 text-sm text-zinc-400">
            Tocá “Actualizar turnos” para consultar las reservas registradas.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-2xl border border-white/10 bg-zinc-950 p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <p className="text-lg font-bold text-white">
                      {appointment.service?.name || "Servicio"}
                    </p>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClass(
                        appointment.status
                      )}`}
                    >
                      {getStatusLabel(appointment.status)}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-zinc-400">
                    Cliente:{" "}
                    <span className="text-zinc-200">
                      {appointment.client?.email ||
                        appointment.user?.email ||
                        "Sin datos"}
                    </span>
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    Barbero:{" "}
                    <span className="text-zinc-200">
                      {appointment.barber?.displayName || "Sin asignar"}
                    </span>
                  </p>

                  <p className="mt-1 text-sm text-zinc-400">
                    Fecha:{" "}
                    <span className="text-zinc-200">
                      {formatDate(appointment.startAt)}
                    </span>
                  </p>

                  {appointment.notes && (
                    <p className="mt-2 text-sm text-zinc-500">
                      Nota: {appointment.notes}
                    </p>
                  )}
                </div>

                {appointment.status !== "CANCELLED" && (
                  <button
                    onClick={() => cancelAppointment(appointment.id)}
                    disabled={loadingAppointments}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/40 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
                  >
                    <XCircle size={18} />
                    Cancelar turno
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}