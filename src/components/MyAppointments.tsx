import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  Filter,
  Loader2,
  RefreshCcw,
  Scissors,
  Search,
  UserRound,
  XCircle,
} from "lucide-react";
import { API_URL } from "../config/api";

type Appointment = {
  id: string;
  startAt: string;
  endAt?: string;
  status: string;
  notes?: string;
  cancelReason?: string;
  barber?: {
    id?: string;
    displayName?: string;
  };
  service?: {
    id?: string;
    name?: string;
    durationMinutes?: number;
    price?: string | number;
  };
};

export function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCancelId, setLoadingCancelId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMyAppointments();
  }, []);

  async function loadMyAppointments() {
    const token = localStorage.getItem("barberflow_token");

    if (!token) {
      setAppointments([]);
      setMessage("Iniciá sesión para ver tus turnos.");
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
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudieron cargar tus turnos.";

        setMessage(apiMessage);
        return;
      }

      if (!Array.isArray(data)) {
        setMessage("La API respondió con un formato inesperado.");
        return;
      }

      setAppointments(data);

      if (data.length === 0) {
        setMessage("Todavía no tenés turnos registrados.");
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
      setMessage("Primero iniciá sesión para cancelar un turno.");
      return;
    }

    const confirmed = window.confirm(
      "¿Seguro que querés cancelar este turno?"
    );

    if (!confirmed) return;

    try {
      setLoadingCancelId(appointmentId);
      setMessage("");

      const response = await fetch(
        `${API_URL}/v1/appointments/${appointmentId}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason: "Cancelado por el cliente desde la web",
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo cancelar el turno.";

        setMessage(apiMessage);
        return;
      }

      setMessage("Turno cancelado correctamente.");
      await loadMyAppointments();
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingCancelId(null);
    }
  }

  function getStatusLabel(status: string) {
    if (status === "CONFIRMED") return "Confirmado";
    if (status === "CANCELLED") return "Cancelado";
    if (status === "PENDING") return "Pendiente";
    if (status === "COMPLETED") return "Completado";
    if (status === "NO_SHOW") return "No asistió";

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

    if (status === "NO_SHOW") {
      return "border-orange-500/30 bg-orange-500/10 text-orange-300";
    }

    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date(date));
  }

  function formatPrice(value?: string | number) {
    if (value === undefined || value === null) return "Sin precio";

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return `$${value}`;
    }

    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(numberValue);
  }

  function clearFilters() {
    setStatusFilter("ALL");
    setSearchTerm("");
  }

  const filteredAppointments = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return appointments.filter((appointment) => {
      const serviceName = appointment.service?.name?.toLowerCase() || "";
      const barberName = appointment.barber?.displayName?.toLowerCase() || "";

      const matchesSearch =
        !search ||
        serviceName.includes(search) ||
        barberName.includes(search) ||
        appointment.status.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "ALL" || appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  const confirmedCount = appointments.filter(
    (appointment) => appointment.status === "CONFIRMED"
  ).length;

  const cancelledCount = appointments.filter(
    (appointment) => appointment.status === "CANCELLED"
  ).length;

  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
            Mis turnos
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Tus reservas
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Consultá tus turnos confirmados, cancelados y el detalle de cada
            reserva.
          </p>
        </div>

        <button
          onClick={loadMyAppointments}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60 md:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Cargando...
            </>
          ) : (
            <>
              <RefreshCcw size={18} />
              Actualizar
            </>
          )}
        </button>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-500">Total</p>
          <p className="mt-1 text-2xl font-black text-white">
            {appointments.length}
          </p>
        </div>

        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
          <p className="text-xs text-green-300">Confirmados</p>
          <p className="mt-1 text-2xl font-black text-white">
            {confirmedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-xs text-red-300">Cancelados</p>
          <p className="mt-1 text-2xl font-black text-white">
            {cancelledCount}
          </p>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-white/10 bg-zinc-950 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
          <Filter size={17} />
          Filtros
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              size={17}
            />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por servicio o barbero..."
              className="w-full rounded-2xl border border-white/10 bg-black px-11 py-3 text-sm text-white outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
          >
            <option value="ALL">Todos</option>
            <option value="CONFIRMED">Confirmados</option>
            <option value="CANCELLED">Cancelados</option>
            <option value="PENDING">Pendientes</option>
            <option value="COMPLETED">Completados</option>
            <option value="NO_SHOW">No asistió</option>
          </select>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-zinc-400">
            Mostrando{" "}
            <span className="font-bold text-white">
              {filteredAppointments.length}
            </span>{" "}
            de{" "}
            <span className="font-bold text-white">{appointments.length}</span>
          </p>

          <button
            onClick={clearFilters}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 md:w-auto"
          >
            <XCircle size={16} />
            Limpiar filtros
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 text-center">
          <CalendarDays className="mx-auto mb-3 text-zinc-500" size={34} />

          <p className="font-bold text-white">No hay turnos para mostrar</p>

          <p className="mt-2 text-sm text-zinc-400">
            Iniciá sesión y tocá “Actualizar” para consultar tus reservas.
          </p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 text-center">
          <Search className="mx-auto mb-3 text-zinc-500" size={34} />

          <p className="font-bold text-white">No hay resultados</p>

          <p className="mt-2 text-sm text-zinc-400">
            Probá limpiar filtros o cambiar la búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <article
              key={appointment.id}
              className="rounded-2xl border border-white/10 bg-zinc-950 p-4 md:p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
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

                  <div className="grid gap-2 text-sm text-zinc-400">
                    <p className="flex items-center gap-2">
                      <CalendarDays size={15} />
                      Fecha:{" "}
                      <span className="font-semibold text-zinc-200">
                        {formatDate(appointment.startAt)}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <UserRound size={15} />
                      Barbero:{" "}
                      <span className="font-semibold text-zinc-200">
                        {appointment.barber?.displayName || "Sin asignar"}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Scissors size={15} />
                      Precio:{" "}
                      <span className="font-semibold text-zinc-200">
                        {formatPrice(appointment.service?.price)}
                      </span>
                    </p>

                    {appointment.service?.durationMinutes && (
                      <p className="flex items-center gap-2">
                        <Clock size={15} />
                        Duración:{" "}
                        <span className="font-semibold text-zinc-200">
                          {appointment.service.durationMinutes} min
                        </span>
                      </p>
                    )}
                  </div>

                  {appointment.notes && (
                    <p className="mt-3 rounded-2xl bg-white/[0.04] p-3 text-sm text-zinc-400">
                      Nota:{" "}
                      <span className="text-zinc-200">
                        {appointment.notes}
                      </span>
                    </p>
                  )}

                  {appointment.cancelReason && (
                    <p className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                      Motivo de cancelación: {appointment.cancelReason}
                    </p>
                  )}
                </div>

                {appointment.status !== "CANCELLED" && (
                  <button
                    onClick={() => cancelAppointment(appointment.id)}
                    disabled={loadingCancelId === appointment.id}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-500/40 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-60 md:w-auto"
                  >
                    {loadingCancelId === appointment.id ? (
                      <>
                        <Loader2 className="animate-spin" size={17} />
                        Cancelando...
                      </>
                    ) : (
                      <>
                        <XCircle size={17} />
                        Cancelar turno
                      </>
                    )}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}