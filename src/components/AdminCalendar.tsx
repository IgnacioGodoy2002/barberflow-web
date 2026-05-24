import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Filter,
  Loader2,
  MessageCircle,
  RefreshCcw,
  UserRound,
  UserX,
  XCircle,
} from "lucide-react";
import { API_URL } from "../config/api";

type Appointment = {
  id: string;
  startAt: string;
  status: string;
  notes?: string;
  cancelReason?: string;
  client?: {
    fullName?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  user?: {
    fullName?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  barber?: {
    id?: string;
    displayName?: string;
  };
  service?: {
    id?: string;
    name?: string;
    price?: string | number;
  };
};

type WeekDay = {
  date: string;
  label: string;
  shortLabel: string;
};

export function AdminCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [weekStart, setWeekStart] = useState(getCurrentWeekStart());
  const [loading, setLoading] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [expandedActionsId, setExpandedActionsId] = useState<string | null>(
    null
  );
  const [message, setMessage] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [barberFilter, setBarberFilter] = useState("ALL");
  const [hideCancelled, setHideCancelled] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudieron cargar los turnos.";

        setMessage(apiMessage);
        return;
      }

      setAppointments(Array.isArray(data) ? data : []);

      if (Array.isArray(data) && data.length === 0) {
        setMessage("Todavía no hay turnos cargados.");
      }
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoading(false);
    }
  }

  async function updateAppointmentStatus(
    appointmentId: string,
    status: "CONFIRMED" | "COMPLETED" | "NO_SHOW"
  ) {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    const statusText =
      status === "COMPLETED"
        ? "completado"
        : status === "NO_SHOW"
        ? "no asistió"
        : "confirmado";

    const confirmed = window.confirm(
      `¿Seguro que querés marcar este turno como ${statusText}?`
    );

    if (!confirmed) return;

    try {
      setLoadingActionId(appointmentId);
      setMessage("");

      const response = await fetch(
        `${API_URL}/v1/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo actualizar el estado del turno.";

        setMessage(apiMessage);
        return;
      }

      setMessage(`Turno marcado como ${statusText}.`);
      setExpandedActionsId(null);
      await loadAppointments();
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingActionId(null);
    }
  }

  async function cancelAppointment(appointmentId: string) {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    const reason = window.prompt(
      `Ingresá el motivo de cancelación:

Ejemplos:
- Cliente avisó que no puede venir
- Reprogramó para otro día
- Cancelado por la barbería
- No respondió`
    );

    if (reason === null) return;

    const cleanReason = reason.trim();

    if (!cleanReason) {
      setMessage("Para cancelar el turno tenés que ingresar un motivo.");
      return;
    }

    const confirmed = window.confirm(
      `¿Seguro que querés cancelar este turno?

Motivo: ${cleanReason}`
    );

    if (!confirmed) return;

    try {
      setLoadingActionId(appointmentId);
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
            reason: cleanReason,
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

      setMessage("Turno cancelado correctamente con motivo guardado.");
      setExpandedActionsId(null);
      await loadAppointments();
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingActionId(null);
    }
  }

  function getCurrentWeekStart() {
    const today = new Date();
    const argentinaDate = today.toLocaleDateString("en-CA", {
      timeZone: "America/Argentina/Buenos_Aires",
    });

    return getWeekStartFromDate(argentinaDate);
  }

  function getWeekStartFromDate(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const dayOfWeek = date.getUTCDay();
    const mondayDiff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    date.setUTCDate(date.getUTCDate() + mondayDiff);

    return date.toISOString().slice(0, 10);
  }

  function addDays(dateString: string, days: number) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    date.setUTCDate(date.getUTCDate() + days);

    return date.toISOString().slice(0, 10);
  }

  function moveWeek(days: number) {
    setWeekStart((current) => addDays(current, days));
    setExpandedActionsId(null);
  }

  function goToCurrentWeek() {
    setWeekStart(getCurrentWeekStart());
    setExpandedActionsId(null);
  }

  function clearFilters() {
    setStatusFilter("ALL");
    setBarberFilter("ALL");
    setHideCancelled(false);
    setExpandedActionsId(null);
  }

  function toggleActions(appointmentId: string) {
    setExpandedActionsId((current) =>
      current === appointmentId ? null : appointmentId
    );
  }

  function getArgentinaDate(date: string) {
    return new Date(date).toLocaleDateString("en-CA", {
      timeZone: "America/Argentina/Buenos_Aires",
    });
  }

  function formatTime(date: string) {
    return new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date(date));
  }

  function formatFullDate(date: string) {
    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date(date));
  }

  function formatDayLabel(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return new Intl.DateTimeFormat("es-AR", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
    }).format(date);
  }

  function formatShortDayLabel(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return new Intl.DateTimeFormat("es-AR", {
      weekday: "short",
      timeZone: "UTC",
    }).format(date);
  }

  function formatWeekRange() {
    const end = addDays(weekStart, 6);

    const startText = new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
    }).format(new Date(`${weekStart}T00:00:00Z`));

    const endText = new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${end}T00:00:00Z`));

    return `${startText} al ${endText}`;
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

  function getClientName(appointment: Appointment) {
    return (
      appointment.client?.fullName ||
      appointment.client?.name ||
      appointment.user?.fullName ||
      appointment.user?.name ||
      "Sin nombre"
    );
  }

  function getClientPhone(appointment: Appointment) {
    return appointment.client?.phone || appointment.user?.phone || "";
  }

  function normalizePhoneForWhatsApp(phone: string) {
    let digits = phone.replace(/\D/g, "");

    if (!digits) return "";

    if (digits.startsWith("549")) return digits;

    if (digits.startsWith("54")) return `549${digits.slice(2)}`;

    if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }

    if (digits.startsWith("15")) {
      digits = digits.slice(2);
    }

    return `549${digits}`;
  }

  function sendWhatsAppToClient(appointment: Appointment) {
    const rawPhone = getClientPhone(appointment);
    const whatsappPhone = normalizePhoneForWhatsApp(rawPhone);

    if (!whatsappPhone) {
      setMessage("Este cliente no tiene teléfono cargado.");
      return;
    }

    const message = `Hola ${getClientName(
      appointment
    )}, te escribimos de Nacho Barbershop por tu turno:

Servicio: ${appointment.service?.name || "Servicio"}
Barbero: ${appointment.barber?.displayName || "Barbero"}
Fecha: ${formatFullDate(appointment.startAt)}
Estado: ${getStatusLabel(appointment.status)}

Cualquier consulta nos avisás.`;

    window.open(
      `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  const weekDays = useMemo<WeekDay[]>(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);

      return {
        date,
        label: formatDayLabel(date),
        shortLabel: formatShortDayLabel(date),
      };
    });
  }, [weekStart]);

  const barberOptions = useMemo(() => {
    const map = new Map<string, string>();

    appointments.forEach((appointment) => {
      const barberId = appointment.barber?.id;
      const barberName = appointment.barber?.displayName;

      if (barberId && barberName) {
        map.set(barberId, barberName);
      }
    });

    return Array.from(map.entries())
      .map(([id, displayName]) => ({
        id,
        displayName,
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [appointments]);

  const weekAppointments = useMemo(() => {
    const start = weekStart;
    const end = addDays(weekStart, 6);

    return appointments
      .filter((appointment) => {
        const appointmentDate = getArgentinaDate(appointment.startAt);
        return appointmentDate >= start && appointmentDate <= end;
      })
      .sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
      );
  }, [appointments, weekStart]);

  const filteredWeekAppointments = useMemo(() => {
    return weekAppointments.filter((appointment) => {
      const matchesStatus =
        statusFilter === "ALL" || appointment.status === statusFilter;

      const matchesBarber =
        barberFilter === "ALL" || appointment.barber?.id === barberFilter;

      const matchesCancelled =
        !hideCancelled || appointment.status !== "CANCELLED";

      return matchesStatus && matchesBarber && matchesCancelled;
    });
  }, [weekAppointments, statusFilter, barberFilter, hideCancelled]);

  const confirmedCount = weekAppointments.filter(
    (appointment) => appointment.status === "CONFIRMED"
  ).length;

  const completedCount = weekAppointments.filter(
    (appointment) => appointment.status === "COMPLETED"
  ).length;

  const cancelledCount = weekAppointments.filter(
    (appointment) => appointment.status === "CANCELLED"
  ).length;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white md:h-12 md:w-12">
            <CalendarDays size={21} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300 md:text-sm">
              Calendario
            </p>

            <h3 className="text-xl font-black text-white md:text-2xl">
              Vista semanal de turnos
            </h3>
          </div>
        </div>

        <button
          onClick={loadAppointments}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60 md:w-auto"
        >
          {loading ? (
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

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 md:col-span-2">
          <p className="text-xs text-zinc-500">Semana seleccionada</p>

          <p className="mt-1 text-xl font-black text-white">
            {formatWeekRange()}
          </p>
        </div>

        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
          <p className="text-xs text-green-300">Confirmados</p>

          <p className="mt-1 text-2xl font-black text-white">
            {confirmedCount}
          </p>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
          <p className="text-xs text-blue-300">Completados</p>

          <p className="mt-1 text-2xl font-black text-white">
            {completedCount}
          </p>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-white/10 bg-zinc-950 p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <button
            onClick={() => moveWeek(-7)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ChevronLeft size={17} />
            Semana anterior
          </button>

          <button
            onClick={goToCurrentWeek}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Esta semana
          </button>

          <button
            onClick={() => moveWeek(7)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Semana siguiente
            <ChevronRight size={17} />
          </button>
        </div>

        <p className="mt-4 text-sm text-zinc-400">
          Total de turnos en esta semana:{" "}
          <span className="font-bold text-white">{weekAppointments.length}</span>
          {" · "}
          Mostrando:{" "}
          <span className="font-bold text-blue-300">
            {filteredWeekAppointments.length}
          </span>
          {" · "}
          Cancelados:{" "}
          <span className="font-bold text-red-300">{cancelledCount}</span>
        </p>
      </div>

      <div className="mb-5 rounded-2xl border border-white/10 bg-zinc-950 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
          <Filter size={17} />
          Filtros del calendario
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setExpandedActionsId(null);
            }}
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="ALL">Todos los estados</option>
            <option value="CONFIRMED">Confirmados</option>
            <option value="CANCELLED">Cancelados</option>
            <option value="COMPLETED">Completados</option>
            <option value="NO_SHOW">No asistió</option>
            <option value="PENDING">Pendientes</option>
          </select>

          <select
            value={barberFilter}
            onChange={(event) => {
              setBarberFilter(event.target.value);
              setExpandedActionsId(null);
            }}
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="ALL">Todos los barberos</option>

            {barberOptions.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.displayName}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setHideCancelled((current) => !current);
              setExpandedActionsId(null);
            }}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
              hideCancelled
                ? "border-red-500/40 bg-red-500/10 text-red-300"
                : "border-white/10 bg-black text-zinc-300 hover:bg-white/10"
            }`}
          >
            {hideCancelled ? "Mostrando sin cancelados" : "Ocultar cancelados"}
          </button>
        </div>

        <button
          onClick={clearFilters}
          className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 md:w-auto"
        >
          Limpiar filtros
        </button>
      </div>

      {message && (
        <div className="mb-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}

      <div className="-mx-4 overflow-x-auto px-4 pb-3 md:-mx-6 md:px-6">
        <div className="grid min-w-[1540px] grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const dayAppointments = filteredWeekAppointments.filter(
              (appointment) =>
                getArgentinaDate(appointment.startAt) === day.date
            );

            return (
              <div
                key={day.date}
                className="rounded-3xl border border-white/10 bg-zinc-950 p-3"
              >
                <div className="mb-3 rounded-2xl border border-white/10 bg-black p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300">
                        {day.shortLabel}
                      </p>

                      <h4 className="mt-1 text-base font-black capitalize leading-tight text-white">
                        {day.label}
                      </h4>

                      <p className="mt-1 text-[11px] text-zinc-500">
                        {day.date}
                      </p>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-bold text-zinc-300">
                      {dayAppointments.length}
                    </span>
                  </div>
                </div>

                <div className="max-h-[680px] overflow-y-auto pr-1">
                  {dayAppointments.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black p-5 text-center">
                      <CalendarDays
                        className="mx-auto mb-2 text-zinc-600"
                        size={24}
                      />

                      <p className="text-sm font-semibold text-zinc-400">
                        Sin turnos
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {dayAppointments.map((appointment) => {
                        const isExpanded = expandedActionsId === appointment.id;

                        return (
                          <article
                            key={appointment.id}
                            className="rounded-2xl border border-white/10 bg-black p-3"
                          >
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <p className="whitespace-nowrap text-xl font-black leading-none text-white">
                                {formatTime(appointment.startAt)}
                              </p>

                              <span
                                className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold ${getStatusClass(
                                  appointment.status
                                )}`}
                              >
                                {getStatusLabel(appointment.status)}
                              </span>
                            </div>

                            <p className="truncate text-sm font-black text-white">
                              {appointment.service?.name || "Servicio"}
                            </p>

                            <div className="mt-2 grid gap-1 text-xs text-zinc-400">
                              <p className="flex items-center gap-1.5">
                                <UserRound size={13} />
                                <span className="truncate">
                                  {getClientName(appointment)}
                                </span>
                              </p>

                              <p className="truncate">
                                Barbero:{" "}
                                <span className="text-zinc-200">
                                  {appointment.barber?.displayName ||
                                    "Sin asignar"}
                                </span>
                              </p>
                            </div>

                            {appointment.notes && (
                              <p className="mt-3 line-clamp-1 rounded-xl bg-white/[0.04] p-2 text-[11px] text-zinc-400">
                                Nota: {appointment.notes}
                              </p>
                            )}

                            {appointment.cancelReason && (
                              <p className="mt-3 line-clamp-1 rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-[11px] text-red-200">
                                Motivo: {appointment.cancelReason}
                              </p>
                            )}

                            <div className="mt-3 grid grid-cols-2 gap-2">
                              <button
                                onClick={() =>
                                  sendWhatsAppToClient(appointment)
                                }
                                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-green-500/40 px-3 py-2 text-xs font-semibold text-green-300 transition hover:bg-green-500/10"
                              >
                                <MessageCircle size={14} />
                                WhatsApp
                              </button>

                              <button
                                onClick={() => toggleActions(appointment.id)}
                                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp size={14} />
                                    Ocultar
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown size={14} />
                                    Acciones
                                  </>
                                )}
                              </button>
                            </div>

                            {isExpanded && (
                              <div className="mt-3 grid gap-2 rounded-2xl border border-white/10 bg-zinc-950 p-2">
                                {appointment.status !== "CANCELLED" &&
                                  appointment.status !== "COMPLETED" && (
                                    <button
                                      onClick={() =>
                                        updateAppointmentStatus(
                                          appointment.id,
                                          "COMPLETED"
                                        )
                                      }
                                      disabled={
                                        loadingActionId === appointment.id
                                      }
                                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-blue-500/40 px-3 py-2 text-xs font-semibold text-blue-300 transition hover:bg-blue-500/10 disabled:opacity-60"
                                    >
                                      {loadingActionId === appointment.id ? (
                                        <Loader2
                                          className="animate-spin"
                                          size={14}
                                        />
                                      ) : (
                                        <CheckCircle2 size={14} />
                                      )}
                                      Completado
                                    </button>
                                  )}

                                {appointment.status !== "CANCELLED" &&
                                  appointment.status !== "NO_SHOW" && (
                                    <button
                                      onClick={() =>
                                        updateAppointmentStatus(
                                          appointment.id,
                                          "NO_SHOW"
                                        )
                                      }
                                      disabled={
                                        loadingActionId === appointment.id
                                      }
                                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-orange-500/40 px-3 py-2 text-xs font-semibold text-orange-300 transition hover:bg-orange-500/10 disabled:opacity-60"
                                    >
                                      {loadingActionId === appointment.id ? (
                                        <Loader2
                                          className="animate-spin"
                                          size={14}
                                        />
                                      ) : (
                                        <UserX size={14} />
                                      )}
                                      No asistió
                                    </button>
                                  )}

                                {appointment.status !== "CANCELLED" &&
                                  appointment.status !== "CONFIRMED" && (
                                    <button
                                      onClick={() =>
                                        updateAppointmentStatus(
                                          appointment.id,
                                          "CONFIRMED"
                                        )
                                      }
                                      disabled={
                                        loadingActionId === appointment.id
                                      }
                                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-yellow-500/40 px-3 py-2 text-xs font-semibold text-yellow-300 transition hover:bg-yellow-500/10 disabled:opacity-60"
                                    >
                                      {loadingActionId === appointment.id ? (
                                        <Loader2
                                          className="animate-spin"
                                          size={14}
                                        />
                                      ) : (
                                        <RefreshCcw size={14} />
                                      )}
                                      Reconfirmar
                                    </button>
                                  )}

                                {appointment.status !== "CANCELLED" && (
                                  <button
                                    onClick={() =>
                                      cancelAppointment(appointment.id)
                                    }
                                    disabled={
                                      loadingActionId === appointment.id
                                    }
                                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
                                  >
                                    <XCircle size={14} />
                                    Cancelar
                                  </button>
                                )}
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-zinc-500">
        En pantallas chicas o medianas podés deslizar horizontalmente para ver
        todos los días de la semana.
      </p>
    </section>
  );
}