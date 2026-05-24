import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  Edit3,
  Filter,
  Loader2,
  MessageCircle,
  RefreshCcw,
  Save,
  Search,
  UserRound,
  UserX,
  XCircle,
} from "lucide-react";
import { API_URL } from "../config/api";

type Service = {
  id: string;
  name: string;
};

type Barber = {
  id: string;
  displayName: string;
};

type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

type Appointment = {
  id: string;
  startAt: string;
  status: AppointmentStatus | string;
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

export function AdminAppointments() {
  const editFormRef = useRef<HTMLDivElement | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);

  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingStatusId, setLoadingStatusId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [barberFilter, setBarberFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const [editingAppointmentId, setEditingAppointmentId] = useState<
    string | null
  >(null);
  const [editBarberId, setEditBarberId] = useState("");
  const [editServiceId, setEditServiceId] = useState("");
  const [editStartAt, setEditStartAt] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!editingAppointmentId) return;

    const timer = window.setTimeout(() => {
      editFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [editingAppointmentId]);

  async function loadData() {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    try {
      setLoadingAppointments(true);
      setMessage("");

      const [appointmentsResponse, servicesResponse, barbersResponse] =
        await Promise.all([
          fetch(`${API_URL}/v1/appointments`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_URL}/v1/services`),
          fetch(`${API_URL}/v1/barbers`),
        ]);

      const appointmentsData = await appointmentsResponse
        .json()
        .catch(() => ({}));
      const servicesData = await servicesResponse.json().catch(() => []);
      const barbersData = await barbersResponse.json().catch(() => []);

      if (!appointmentsResponse.ok) {
        const apiMessage = Array.isArray(appointmentsData.message)
          ? appointmentsData.message.join(", ")
          : appointmentsData.message || "No se pudieron cargar los turnos.";

        setMessage(apiMessage);
        return;
      }

      if (!servicesResponse.ok) {
        setMessage("No se pudieron cargar los servicios.");
        return;
      }

      if (!barbersResponse.ok) {
        setMessage("No se pudieron cargar los barberos.");
        return;
      }

      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setBarbers(Array.isArray(barbersData) ? barbersData : []);

      if (Array.isArray(appointmentsData) && appointmentsData.length === 0) {
        setMessage("Todavía no hay turnos registrados.");
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
    setLoadingStatusId(appointmentId);
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
    await loadData();
  } catch {
    setMessage("No se pudo conectar con la API.");
  } finally {
    setLoadingStatusId(null);
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
      setLoadingStatusId(appointmentId);
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
      await loadData();
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingStatusId(null);
    }
  }

  function startEditAppointment(appointment: Appointment) {
    if (appointment.status === "CANCELLED") {
      setMessage("No se puede editar un turno cancelado.");
      return;
    }

    setEditingAppointmentId(appointment.id);
    setEditBarberId(appointment.barber?.id || "");
    setEditServiceId(appointment.service?.id || "");
    setEditStartAt(toDateTimeLocal(appointment.startAt));
    setEditNotes(appointment.notes || "");
    setMessage("Editando turno seleccionado.");
  }

  function cancelEdit() {
    setEditingAppointmentId(null);
    setEditBarberId("");
    setEditServiceId("");
    setEditStartAt("");
    setEditNotes("");
  }

  async function saveAppointmentChanges() {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    if (!editingAppointmentId) {
      setMessage("Seleccioná un turno para editar.");
      return;
    }

    if (!editBarberId || !editServiceId || !editStartAt) {
      setMessage("Completá barbero, servicio y fecha/hora.");
      return;
    }

    try {
      setLoadingEdit(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/v1/appointments/${editingAppointmentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            barberId: editBarberId,
            serviceId: editServiceId,
            startAt: new Date(editStartAt).toISOString(),
            notes: editNotes,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo editar el turno.";

        setMessage(apiMessage);
        return;
      }

      setMessage("Turno editado correctamente.");
      cancelEdit();
      await loadData();
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingEdit(false);
    }
  }

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter("ALL");
    setBarberFilter("ALL");
    setDateFilter("");
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date(date));
  }

  function getDateInputValue(date: string) {
    return new Date(date).toLocaleDateString("en-CA", {
      timeZone: "America/Argentina/Buenos_Aires",
    });
  }

  function toDateTimeLocal(date: string) {
    const parsedDate = new Date(date);
    parsedDate.setMinutes(
      parsedDate.getMinutes() - parsedDate.getTimezoneOffset()
    );
    return parsedDate.toISOString().slice(0, 16);
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

  function getClientEmail(appointment: Appointment) {
    return appointment.client?.email || appointment.user?.email || "Sin email";
  }

  function getClientPhone(appointment: Appointment) {
    return appointment.client?.phone || appointment.user?.phone || "";
  }

  function getClientPhoneLabel(appointment: Appointment) {
    return getClientPhone(appointment) || "Sin teléfono";
  }

  function getPrice(appointment: Appointment) {
    const price = Number(appointment.service?.price || 0);

    if (Number.isNaN(price)) return 0;

    return price;
  }

  function normalizePhoneForWhatsApp(phone: string) {
    let digits = phone.replace(/\D/g, "");

    if (!digits) return "";

    if (digits.startsWith("549")) {
      return digits;
    }

    if (digits.startsWith("54")) {
      return `549${digits.slice(2)}`;
    }

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
Fecha: ${formatDate(appointment.startAt)}
Estado: ${getStatusLabel(appointment.status)}

Cualquier consulta nos avisás.`;

    window.open(
      `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  function escapeCsvValue(value: string | number) {
    const text = String(value ?? "");
    return `"${text.replaceAll('"', '""')}"`;
  }

  function exportFilteredAppointmentsToCsv() {
    if (filteredAppointments.length === 0) {
      setMessage("No hay turnos para exportar con los filtros actuales.");
      return;
    }

    const headers = [
      "ID",
      "Fecha",
      "Estado",
      "Cliente",
      "Email",
      "Telefono",
      "Servicio",
      "Barbero",
      "Precio",
      "Notas",
      "Motivo cancelacion",
    ];

    const rows = filteredAppointments.map((appointment) => [
      appointment.id,
      formatDate(appointment.startAt),
      getStatusLabel(appointment.status),
      getClientName(appointment),
      getClientEmail(appointment),
      getClientPhoneLabel(appointment),
      appointment.service?.name || "Sin servicio",
      appointment.barber?.displayName || "Sin barbero",
      getPrice(appointment),
      appointment.notes || "",
      appointment.cancelReason || "",
    ]);

    const csvContent = [
      headers.map(escapeCsvValue).join(";"),
      ...rows.map((row) => row.map(escapeCsvValue).join(";")),
    ].join("\n");

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const todayForFile = new Date().toLocaleDateString("en-CA", {
      timeZone: "America/Argentina/Buenos_Aires",
    });

    link.href = url;
    link.download = `turnos-barberflow-${todayForFile}.csv`;
    link.click();

    URL.revokeObjectURL(url);
    setMessage("Archivo CSV generado correctamente.");
  }

  const barberOptions = useMemo(() => {
    const map = new Map<string, string>();

    appointments.forEach((appointment) => {
      const barberId = appointment.barber?.id;
      const displayName = appointment.barber?.displayName;

      if (barberId && displayName) {
        map.set(barberId, displayName);
      }
    });

    barbers.forEach((barber) => {
      map.set(barber.id, barber.displayName);
    });

    return Array.from(map.entries()).map(([id, displayName]) => ({
      id,
      displayName,
    }));
  }, [appointments, barbers]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const search = searchTerm.toLowerCase().trim();

      const clientName = getClientName(appointment).toLowerCase();
      const clientEmail = getClientEmail(appointment).toLowerCase();
      const clientPhone = getClientPhoneLabel(appointment).toLowerCase();
      const serviceName = appointment.service?.name?.toLowerCase() || "";
      const barberName = appointment.barber?.displayName?.toLowerCase() || "";

      const matchesSearch =
        !search ||
        clientName.includes(search) ||
        clientEmail.includes(search) ||
        clientPhone.includes(search) ||
        serviceName.includes(search) ||
        barberName.includes(search);

      const matchesStatus =
        statusFilter === "ALL" || appointment.status === statusFilter;

      const matchesBarber =
        barberFilter === "ALL" || appointment.barber?.id === barberFilter;

      const appointmentDate = getDateInputValue(appointment.startAt);
      const matchesDate = !dateFilter || appointmentDate === dateFilter;

      return matchesSearch && matchesStatus && matchesBarber && matchesDate;
    });
  }, [appointments, searchTerm, statusFilter, barberFilter, dateFilter]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white md:h-12 md:w-12">
            <CalendarDays size={21} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-300 md:text-sm">
              Turnos
            </p>

            <h3 className="text-xl font-black text-white md:text-2xl">
              Gestión de turnos
            </h3>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loadingAppointments}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60 md:w-auto"
        >
          {loadingAppointments ? (
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

      {editingAppointmentId && (
        <div
          ref={editFormRef}
          className="mb-5 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4"
        >
          <div className="mb-4 flex items-center gap-2">
            <Edit3 size={18} className="text-blue-300" />
            <h4 className="font-bold text-white">Editar turno</h4>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <select
              value={editBarberId}
              onChange={(event) => setEditBarberId(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="">Seleccionar barbero</option>

              {barberOptions.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.displayName}
                </option>
              ))}
            </select>

            <select
              value={editServiceId}
              onChange={(event) => setEditServiceId(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            >
              <option value="">Seleccionar servicio</option>

              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>

            <input
              value={editStartAt}
              onChange={(event) => setEditStartAt(event.target.value)}
              type="datetime-local"
              className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-blue-500 md:col-span-2"
            />

            <textarea
              value={editNotes}
              onChange={(event) => setEditNotes(event.target.value)}
              placeholder="Notas del turno"
              className="min-h-24 rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-blue-500 md:col-span-2"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={saveAppointmentChanges}
              disabled={loadingEdit}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
            >
              {loadingEdit ? (
                <>
                  <Loader2 className="animate-spin" size={17} />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Guardar cambios
                </>
              )}
            </button>

            <button
              onClick={cancelEdit}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <XCircle size={17} />
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="mb-5 rounded-2xl border border-white/10 bg-zinc-950 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
          <Filter size={17} />
          Filtros
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              size={17}
            />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar cliente, email, teléfono..."
              className="w-full rounded-2xl border border-white/10 bg-black px-11 py-3 text-sm text-white outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
          >
            <option value="ALL">Todos los estados</option>
            <option value="CONFIRMED">Confirmados</option>
            <option value="CANCELLED">Cancelados</option>
            <option value="PENDING">Pendientes</option>
            <option value="COMPLETED">Completados</option>
            <option value="NO_SHOW">No asistió</option>
          </select>

          <select
            value={barberFilter}
            onChange={(event) => setBarberFilter(event.target.value)}
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
          >
            <option value="ALL">Todos los barberos</option>

            {barberOptions.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.displayName}
              </option>
            ))}
          </select>

          <input
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            type="date"
            className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
          />
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

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              onClick={exportFilteredAppointmentsToCsv}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-green-500/40 px-5 py-2.5 text-sm font-semibold text-green-300 transition hover:bg-green-500/10 md:w-auto"
            >
              <Download size={16} />
              Exportar CSV
            </button>

            <button
              onClick={clearFilters}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 md:w-auto"
            >
              <XCircle size={16} />
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 text-center">
          <CalendarDays className="mx-auto mb-3 text-zinc-500" size={32} />

          <p className="font-bold text-white">No hay turnos cargados</p>

          <p className="mt-2 text-sm text-zinc-400">
            Tocá “Actualizar” para consultar las reservas registradas.
          </p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 text-center">
          <Filter className="mx-auto mb-3 text-zinc-500" size={32} />

          <p className="font-bold text-white">No hay resultados</p>

          <p className="mt-2 text-sm text-zinc-400">
            Probá limpiar filtros o cambiar la búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-2xl border border-white/10 bg-zinc-950 p-4 md:p-5"
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

                  <div className="grid gap-1 text-sm text-zinc-400">
                    <p className="flex items-center gap-2">
                      <UserRound size={15} />
                      Cliente:{" "}
                      <span className="text-zinc-200">
                        {getClientName(appointment)}
                      </span>
                    </p>

                    <p>
                      Email:{" "}
                      <span className="text-zinc-200">
                        {getClientEmail(appointment)}
                      </span>
                    </p>

                    <p>
                      Teléfono:{" "}
                      <span className="text-zinc-200">
                        {getClientPhoneLabel(appointment)}
                      </span>
                    </p>

                    <p>
                      Barbero:{" "}
                      <span className="text-zinc-200">
                        {appointment.barber?.displayName || "Sin asignar"}
                      </span>
                    </p>

                    <p>
                      Fecha:{" "}
                      <span className="text-zinc-200">
                        {formatDate(appointment.startAt)}
                      </span>
                    </p>

                    <p>
                      Precio:{" "}
                      <span className="text-zinc-200">
                        ${getPrice(appointment).toLocaleString("es-AR")}
                      </span>
                    </p>
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

                <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
                  {appointment.status !== "CANCELLED" && (
                    <button
                      onClick={() => startEditAppointment(appointment)}
                      disabled={
                        loadingAppointments ||
                        loadingStatusId === appointment.id
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-500/40 px-5 py-2.5 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/10 disabled:opacity-60"
                    >
                      <Edit3 size={17} />
                      Editar
                    </button>
                  )}

                  <button
                    onClick={() => sendWhatsAppToClient(appointment)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500/40 px-5 py-2.5 text-sm font-semibold text-green-300 transition hover:bg-green-500/10"
                  >
                    <MessageCircle size={17} />
                    WhatsApp
                  </button>

                  {appointment.status !== "CANCELLED" &&
                    appointment.status !== "COMPLETED" && (
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, "COMPLETED")
                        }
                        disabled={loadingStatusId === appointment.id}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500/40 px-5 py-2.5 text-sm font-semibold text-green-300 transition hover:bg-green-500/10 disabled:opacity-60"
                      >
                        {loadingStatusId === appointment.id ? (
                          <Loader2 className="animate-spin" size={17} />
                        ) : (
                          <CheckCircle2 size={17} />
                        )}
                        Completado
                      </button>
                    )}

                  {appointment.status !== "CANCELLED" &&
                    appointment.status !== "NO_SHOW" && (
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, "NO_SHOW")
                        }
                        disabled={loadingStatusId === appointment.id}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-500/40 px-5 py-2.5 text-sm font-semibold text-orange-300 transition hover:bg-orange-500/10 disabled:opacity-60"
                      >
                        {loadingStatusId === appointment.id ? (
                          <Loader2 className="animate-spin" size={17} />
                        ) : (
                          <UserX size={17} />
                        )}
                        No asistió
                      </button>
                    )}

                  {appointment.status !== "CANCELLED" &&
                    appointment.status !== "CONFIRMED" && (
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, "CONFIRMED")
                        }
                        disabled={loadingStatusId === appointment.id}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-yellow-500/40 px-5 py-2.5 text-sm font-semibold text-yellow-300 transition hover:bg-yellow-500/10 disabled:opacity-60"
                      >
                        {loadingStatusId === appointment.id ? (
                          <Loader2 className="animate-spin" size={17} />
                        ) : (
                          <RefreshCcw size={17} />
                        )}
                        Reconfirmar
                      </button>
                    )}

                  {appointment.status !== "CANCELLED" && (
                    <button
                      onClick={() => cancelAppointment(appointment.id)}
                      disabled={
                        loadingAppointments ||
                        loadingStatusId === appointment.id
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/40 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
                    >
                      <XCircle size={17} />
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}