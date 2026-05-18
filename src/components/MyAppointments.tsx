import { useState } from "react";
import {
  CalendarCheck,
  CalendarDays,
  Clock,
  Loader2,
  RefreshCcw,
  Scissors,
  UserRound,
  XCircle,
} from "lucide-react";
import { API_URL } from "../config/api";

type Appointment = {
  id: string;
  startAt: string;
  status: string;
  notes?: string;
  barber?: {
    displayName?: string;
  };
  service?: {
    name?: string;
  };
};

export function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadAppointments() {
    const token = localStorage.getItem("barberflow_token");

    if (!token) {
      setAppointments([]);
      setMessage("Primero iniciá sesión desde el formulario de reserva.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/appointments/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.message || "No se pudieron cargar tus turnos.");
        return;
      }

      if (!Array.isArray(data)) {
        setMessage("La API respondió con un formato inesperado.");
        return;
      }

      setAppointments(data);

      if (data.length === 0) {
        setMessage("Todavía no tenés turnos reservados.");
      }
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoading(false);
    }
  }

  async function cancelAppointment(appointmentId: string) {
    const token = localStorage.getItem("barberflow_token");

    if (!token) {
      setMessage("Primero iniciá sesión.");
      return;
    }

    const confirmed = window.confirm(
      "¿Seguro que querés cancelar este turno?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);
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
      setLoading(false);
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

  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "CONFIRMED"
  ).length;

  const cancelledCount = appointments.filter(
    (appointment) => appointment.status === "CANCELLED"
  ).length;

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
          Cliente
        </p>

        <h2 className="mt-3 text-3xl font-black">Mis turnos</h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400">
          Consultá tus reservas realizadas y cancelá turnos activos desde la
          web.
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-zinc-400">Total</p>
              <p className="mt-2 text-3xl font-black text-white">
                {appointments.length}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 text-purple-300">
              <CalendarDays size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-zinc-400">Confirmados</p>
              <p className="mt-2 text-3xl font-black text-white">
                {confirmedCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10 text-green-300">
              <CalendarCheck size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-zinc-400">Cancelados</p>
              <p className="mt-2 text-3xl font-black text-white">
                {cancelledCount}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300">
              <XCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={loadAppointments}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Cargando...
            </>
          ) : (
            <>
              <RefreshCcw size={18} />
              Actualizar mis turnos
            </>
          )}
        </button>
      </div>

      {message && (
        <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}

      {!loading && appointments.length === 0 && (
        <div className="mt-8 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center">
          <CalendarDays className="mx-auto mb-4 text-zinc-500" size={38} />

          <p className="text-lg font-bold text-white">
            No hay turnos cargados
          </p>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-zinc-400">
            Tocá “Actualizar mis turnos” después de iniciar sesión para ver tus
            reservas. Cuando confirmes un turno, va a aparecer en esta sección.
          </p>
        </div>
      )}

      {appointments.length > 0 && (
        <div className="mt-8 grid gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-3xl border border-white/10 bg-zinc-950 p-5 transition hover:border-white/20"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-300">
                    <Scissors size={24} />
                  </div>

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

                    <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                      <UserRound size={16} />
                      Barbero:{" "}
                      <span className="text-zinc-200">
                        {appointment.barber?.displayName || "Sin asignar"}
                      </span>
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                      <Clock size={16} />
                      Fecha:{" "}
                      <span className="text-zinc-200">
                        {formatDate(appointment.startAt)}
                      </span>
                    </p>

                    {appointment.notes && (
                      <p className="mt-3 rounded-2xl bg-white/[0.04] p-3 text-sm text-zinc-400">
                        Nota:{" "}
                        <span className="text-zinc-200">
                          {appointment.notes}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {appointment.status !== "CANCELLED" && (
                  <button
                    onClick={() => cancelAppointment(appointment.id)}
                    disabled={loading}
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