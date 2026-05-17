import { useState } from "react";
import { CalendarDays, Loader2, ShieldCheck, XCircle } from "lucide-react";
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
  const [email, setEmail] = useState("admin@barberflow.com");
  const [password, setPassword] = useState("123456");
  const [token, setToken] = useState(
    localStorage.getItem("barberflow_admin_token") || ""
  );

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [message, setMessage] = useState("");

  async function loginAdmin() {
    if (!email || !password) {
      setMessage("Ingresá email y contraseña.");
      return;
    }

    try {
      setLoadingLogin(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.message || "No se pudo iniciar sesión.");
        return;
      }

      localStorage.setItem("barberflow_admin_token", data.accessToken);
      setToken(data.accessToken);
      setMessage("Sesión admin iniciada correctamente.");
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingLogin(false);
    }
  }

  function logoutAdmin() {
    localStorage.removeItem("barberflow_admin_token");
    setToken("");
    setAppointments([]);
    setMessage("Sesión admin cerrada.");
  }

  async function loadAppointments() {
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
    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

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

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
          Panel interno
        </p>
        <h2 className="mt-3 text-3xl font-black">Gestión de turnos</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400">
          Accedé como administrador para ver todos los turnos registrados y
          cancelar reservas activas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email admin"
          className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
        />

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Contraseña"
          className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
        />

        {!token ? (
          <button
            onClick={loginAdmin}
            disabled={loadingLogin}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-500 disabled:opacity-60"
          >
            {loadingLogin ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Ingresando...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Entrar como admin
              </>
            )}
          </button>
        ) : (
          <button
            onClick={logoutAdmin}
            className="rounded-2xl border border-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Cerrar sesión admin
          </button>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={loadAppointments}
          disabled={loadingAppointments}
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-60"
        >
          {loadingAppointments ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Cargando...
            </>
          ) : (
            <>
              <CalendarDays size={18} />
              Ver todos los turnos
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