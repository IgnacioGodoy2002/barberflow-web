import { useState } from "react";
import { CalendarCheck, Loader2, XCircle } from "lucide-react";
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

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "No se pudieron cargar tus turnos.");
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

      const data = await response.json();

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
    }).format(new Date(date));
  }

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
          Cliente
        </p>
        <h2 className="mt-3 text-3xl font-black">Mis turnos</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400">
          Consultá tus reservas realizadas y cancelá turnos activos desde la web.
        </p>
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
              <CalendarCheck size={18} />
              Ver mis turnos
            </>
          )}
        </button>
      </div>

      {message && (
        <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}

      {appointments.length > 0 && (
        <div className="mt-8 grid gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-2xl border border-white/10 bg-zinc-900 p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-bold text-white">
                    {appointment.service?.name || "Servicio"}
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

                  <p className="mt-1 text-sm text-zinc-400">
                    Estado:{" "}
                    <span className="font-semibold text-blue-300">
                      {appointment.status}
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