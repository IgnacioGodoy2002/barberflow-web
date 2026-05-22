import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Download,
  Loader2,
  MessageCircle,
  RefreshCcw,
  Scissors,
  Search,
  UserRound,
  Users,
} from "lucide-react";
import { API_URL } from "../config/api";

type Appointment = {
  id: string;
  startAt: string;
  status: string;
  notes?: string;
  cancelReason?: string;
  client?: {
    id?: string;
    fullName?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  user?: {
    id?: string;
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

type ClientSummary = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  estimatedIncome: number;
  lastAppointment?: Appointment;
  nextAppointment?: Appointment;
  appointments: Appointment[];
};

export function AdminClients() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
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
          : data.message || "No se pudieron cargar los clientes.";

        setMessage(apiMessage);
        return;
      }

      setAppointments(Array.isArray(data) ? data : []);

      if (Array.isArray(data) && data.length === 0) {
        setMessage("Todavía no hay clientes registrados por turnos.");
      }
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoading(false);
    }
  }

  function getClientId(appointment: Appointment) {
    return (
      appointment.client?.id ||
      appointment.user?.id ||
      appointment.client?.email ||
      appointment.user?.email ||
      "sin-cliente"
    );
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

  function getAppointmentPrice(appointment: Appointment) {
    const price = Number(appointment.service?.price || 0);

    if (Number.isNaN(price)) return 0;

    return price;
  }

  function isRevenueAppointment(appointment: Appointment) {
    return (
      appointment.status === "CONFIRMED" || appointment.status === "COMPLETED"
    );
  }

  function formatDate(date?: string) {
    if (!date) return "Sin fecha";

    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date(date));
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(value);
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

  function sendWhatsAppToClient(client: ClientSummary) {
    const whatsappPhone = normalizePhoneForWhatsApp(client.phone);

    if (!whatsappPhone) {
      setMessage("Este cliente no tiene teléfono cargado.");
      return;
    }

    const message = `Hola ${client.name}, te escribimos de Nacho Barbershop.

Vimos tu historial de turnos y queríamos saber si necesitás reservar un nuevo corte.

Podés respondernos por acá.`;

    window.open(
      `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  function escapeCsvValue(value: string | number) {
    const text = String(value ?? "");
    return `"${text.replaceAll('"', '""')}"`;
  }

  function exportClientsToCsv() {
    if (filteredClients.length === 0) {
      setMessage("No hay clientes para exportar con la búsqueda actual.");
      return;
    }

    const headers = [
      "Cliente",
      "Email",
      "Telefono",
      "Turnos",
      "Confirmados",
      "Completados",
      "Cancelados",
      "No asistio",
      "Ingreso estimado",
      "Ultimo turno",
      "Proximo turno",
    ];

    const rows = filteredClients.map((client) => [
      client.name,
      client.email,
      client.phone || "Sin teléfono",
      client.totalAppointments,
      client.confirmedAppointments,
      client.completedAppointments,
      client.cancelledAppointments,
      client.noShowAppointments,
      client.estimatedIncome,
      formatDate(client.lastAppointment?.startAt),
      formatDate(client.nextAppointment?.startAt),
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
    link.download = `clientes-barberflow-${todayForFile}.csv`;
    link.click();

    URL.revokeObjectURL(url);
    setMessage("Archivo CSV de clientes generado correctamente.");
  }

  function toggleClientHistory(clientId: string) {
    setExpandedClientId((current) => (current === clientId ? null : clientId));
  }

  const clients = useMemo(() => {
    const map = new Map<string, ClientSummary>();
    const now = new Date().getTime();

    appointments.forEach((appointment) => {
      const clientId = getClientId(appointment);
      const current = map.get(clientId);
      const appointmentTime = new Date(appointment.startAt).getTime();

      if (!current) {
        map.set(clientId, {
          id: clientId,
          name: getClientName(appointment),
          email: getClientEmail(appointment),
          phone: getClientPhone(appointment),
          totalAppointments: 1,
          confirmedAppointments: appointment.status === "CONFIRMED" ? 1 : 0,
          completedAppointments: appointment.status === "COMPLETED" ? 1 : 0,
          cancelledAppointments: appointment.status === "CANCELLED" ? 1 : 0,
          noShowAppointments: appointment.status === "NO_SHOW" ? 1 : 0,
          estimatedIncome: isRevenueAppointment(appointment)
            ? getAppointmentPrice(appointment)
            : 0,
          lastAppointment: appointmentTime <= now ? appointment : undefined,
          nextAppointment: appointmentTime > now ? appointment : undefined,
          appointments: [appointment],
        });

        return;
      }

      current.totalAppointments += 1;
      current.appointments.push(appointment);

      if (appointment.status === "CONFIRMED") current.confirmedAppointments += 1;
      if (appointment.status === "COMPLETED") current.completedAppointments += 1;
      if (appointment.status === "CANCELLED") current.cancelledAppointments += 1;
      if (appointment.status === "NO_SHOW") current.noShowAppointments += 1;

      if (isRevenueAppointment(appointment)) {
        current.estimatedIncome += getAppointmentPrice(appointment);
      }

      if (
        appointmentTime <= now &&
        (!current.lastAppointment ||
          appointmentTime > new Date(current.lastAppointment.startAt).getTime())
      ) {
        current.lastAppointment = appointment;
      }

      if (
        appointmentTime > now &&
        (!current.nextAppointment ||
          appointmentTime < new Date(current.nextAppointment.startAt).getTime())
      ) {
        current.nextAppointment = appointment;
      }

      if (!current.phone && getClientPhone(appointment)) {
        current.phone = getClientPhone(appointment);
      }
    });

    return Array.from(map.values())
      .map((client) => ({
        ...client,
        appointments: client.appointments.sort(
          (a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
        ),
      }))
      .sort((a, b) => b.totalAppointments - a.totalAppointments);
  }, [appointments]);

  const filteredClients = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return clients.filter((client) => {
      if (!search) return true;

      return (
        client.name.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search) ||
        client.phone.toLowerCase().includes(search)
      );
    });
  }, [clients, searchTerm]);

  const totalEstimatedIncome = clients.reduce(
    (total, client) => total + client.estimatedIncome,
    0
  );

  const totalFrequentClients = clients.filter(
    (client) => client.totalAppointments >= 2
  ).length;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-600 text-white md:h-12 md:w-12">
            <Users size={21} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300 md:text-sm">
              Clientes
            </p>

            <h3 className="text-xl font-black text-white md:text-2xl">
              Gestión de clientes
            </h3>
          </div>
        </div>

        <button
          onClick={loadClients}
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

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
          <p className="text-xs text-zinc-500">Clientes únicos</p>
          <p className="mt-1 text-2xl font-black text-white">
            {clients.length}
          </p>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4">
          <p className="text-xs text-purple-300">Clientes frecuentes</p>
          <p className="mt-1 text-2xl font-black text-white">
            {totalFrequentClients}
          </p>
        </div>

        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
          <p className="text-xs text-green-300">Ingreso estimado</p>
          <p className="mt-1 text-2xl font-black text-white">
            {formatCurrency(totalEstimatedIncome)}
          </p>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-white/10 bg-zinc-950 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              size={17}
            />

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por nombre, email o teléfono..."
              className="w-full rounded-2xl border border-white/10 bg-black px-11 py-3 text-sm text-white outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={exportClientsToCsv}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500/40 px-5 py-3 text-sm font-semibold text-green-300 transition hover:bg-green-500/10"
          >
            <Download size={17} />
            Exportar clientes
          </button>
        </div>

        <p className="mt-4 text-sm text-zinc-400">
          Mostrando{" "}
          <span className="font-bold text-white">{filteredClients.length}</span>{" "}
          de <span className="font-bold text-white">{clients.length}</span>
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}

      {clients.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 text-center">
          <UserRound className="mx-auto mb-3 text-zinc-500" size={34} />

          <p className="font-bold text-white">No hay clientes para mostrar</p>

          <p className="mt-2 text-sm text-zinc-400">
            Cuando haya turnos registrados, los clientes van a aparecer acá.
          </p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 text-center">
          <Search className="mx-auto mb-3 text-zinc-500" size={34} />

          <p className="font-bold text-white">No hay resultados</p>

          <p className="mt-2 text-sm text-zinc-400">
            Probá con otro nombre, email o teléfono.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredClients.map((client) => {
            const isExpanded = expandedClientId === client.id;

            return (
              <article
                key={client.id}
                className="rounded-2xl border border-white/10 bg-zinc-950 p-4 md:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-black text-white">
                        {client.name}
                      </h4>

                      {client.totalAppointments >= 2 && (
                        <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
                          Cliente frecuente
                        </span>
                      )}
                    </div>

                    <div className="grid gap-1 text-sm text-zinc-400">
                      <p>
                        Email:{" "}
                        <span className="text-zinc-200">{client.email}</span>
                      </p>

                      <p>
                        Teléfono:{" "}
                        <span className="text-zinc-200">
                          {client.phone || "Sin teléfono"}
                        </span>
                      </p>

                      <p>
                        Turnos:{" "}
                        <span className="text-zinc-200">
                          {client.totalAppointments}
                        </span>
                      </p>

                      <p>
                        Confirmados:{" "}
                        <span className="text-green-300">
                          {client.confirmedAppointments}
                        </span>
                      </p>

                      <p>
                        Completados:{" "}
                        <span className="text-blue-300">
                          {client.completedAppointments}
                        </span>
                      </p>

                      <p>
                        Cancelados:{" "}
                        <span className="text-red-300">
                          {client.cancelledAppointments}
                        </span>
                      </p>

                      <p>
                        No asistió:{" "}
                        <span className="text-orange-300">
                          {client.noShowAppointments}
                        </span>
                      </p>

                      <p>
                        Ingreso estimado:{" "}
                        <span className="font-bold text-green-300">
                          {formatCurrency(client.estimatedIncome)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 lg:min-w-80">
                    <div className="rounded-2xl border border-white/10 bg-black p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                        <CalendarDays size={16} />
                        Resumen
                      </div>

                      <p className="text-sm text-zinc-400">
                        Último turno:{" "}
                        <span className="text-zinc-200">
                          {formatDate(client.lastAppointment?.startAt)}
                        </span>
                      </p>

                      <p className="mt-1 text-sm text-zinc-400">
                        Próximo turno:{" "}
                        <span className="text-zinc-200">
                          {formatDate(client.nextAppointment?.startAt)}
                        </span>
                      </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <button
                        onClick={() => toggleClientHistory(client.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-500/40 px-5 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/10"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp size={17} />
                            Ocultar historial
                          </>
                        ) : (
                          <>
                            <ChevronDown size={17} />
                            Ver historial
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => sendWhatsAppToClient(client)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-green-500/40 px-5 py-3 text-sm font-semibold text-green-300 transition hover:bg-green-500/10"
                      >
                        <MessageCircle size={17} />
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                    <div className="mb-4 flex items-center gap-2">
                      <CalendarDays size={18} className="text-cyan-300" />
                      <h5 className="font-bold text-white">
                        Historial completo
                      </h5>
                    </div>

                    <div className="grid gap-3">
                      {client.appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="rounded-2xl border border-white/10 bg-black p-4"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <p className="font-bold text-white">
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
                                <p>
                                  Fecha:{" "}
                                  <span className="text-zinc-200">
                                    {formatDate(appointment.startAt)}
                                  </span>
                                </p>

                                <p>
                                  Barbero:{" "}
                                  <span className="text-zinc-200">
                                    {appointment.barber?.displayName ||
                                      "Sin barbero"}
                                  </span>
                                </p>

                                <p>
                                  Precio:{" "}
                                  <span className="text-zinc-200">
                                    {formatCurrency(
                                      getAppointmentPrice(appointment)
                                    )}
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
                                  Motivo de cancelación:{" "}
                                  {appointment.cancelReason}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
                              <Scissors size={16} />
                              {appointment.service?.name || "Servicio"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}