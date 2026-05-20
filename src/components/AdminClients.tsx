import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Loader2,
  Mail,
  Phone,
  RefreshCcw,
  Search,
  Scissors,
  UserRound,
  Users,
} from "lucide-react";
import { API_URL } from "../config/api";

type Appointment = {
  id: string;
  startAt: string;
  status: string;
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
    displayName?: string;
  };
  service?: {
    name?: string;
  };
};

type ClientSummary = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  totalAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  lastAppointment?: Appointment;
};

export function AdminClients() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

      if (!Array.isArray(data)) {
        setMessage("La API respondió con un formato inesperado.");
        return;
      }

      setAppointments(data);

      if (data.length === 0) {
        setMessage("Todavía no hay clientes con turnos registrados.");
      }
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  function getClientId(appointment: Appointment) {
    return (
      appointment.client?.id ||
      appointment.user?.id ||
      appointment.client?.email ||
      appointment.user?.email ||
      "sin-id"
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
    return appointment.client?.phone || appointment.user?.phone || "Sin teléfono";
  }

  function formatDate(date?: string) {
    if (!date) return "Sin turnos";

    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date(date));
  }

  const clients = useMemo(() => {
    const map = new Map<string, ClientSummary>();

    appointments.forEach((appointment) => {
      const clientId = getClientId(appointment);
      const currentClient = map.get(clientId);

      if (!currentClient) {
        map.set(clientId, {
          id: clientId,
          fullName: getClientName(appointment),
          email: getClientEmail(appointment),
          phone: getClientPhone(appointment),
          totalAppointments: 1,
          confirmedAppointments:
            appointment.status === "CONFIRMED" ? 1 : 0,
          cancelledAppointments:
            appointment.status === "CANCELLED" ? 1 : 0,
          lastAppointment: appointment,
        });

        return;
      }

      currentClient.totalAppointments += 1;

      if (appointment.status === "CONFIRMED") {
        currentClient.confirmedAppointments += 1;
      }

      if (appointment.status === "CANCELLED") {
        currentClient.cancelledAppointments += 1;
      }

      const currentLastDate = currentClient.lastAppointment
        ? new Date(currentClient.lastAppointment.startAt).getTime()
        : 0;

      const appointmentDate = new Date(appointment.startAt).getTime();

      if (appointmentDate > currentLastDate) {
        currentClient.lastAppointment = appointment;
      }

      map.set(clientId, currentClient);
    });

    return Array.from(map.values()).sort((a, b) => {
      const dateA = a.lastAppointment
        ? new Date(a.lastAppointment.startAt).getTime()
        : 0;

      const dateB = b.lastAppointment
        ? new Date(b.lastAppointment.startAt).getTime()
        : 0;

      return dateB - dateA;
    });
  }, [appointments]);

  const filteredClients = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return clients;

    return clients.filter((client) => {
      return (
        client.fullName.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search) ||
        client.phone.toLowerCase().includes(search)
      );
    });
  }, [clients, searchTerm]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-6">
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
              Historial de clientes
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

      <div className="mb-5 rounded-2xl border border-white/10 bg-zinc-950 p-4">
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

        <p className="mt-4 text-sm text-zinc-400">
          Mostrando{" "}
          <span className="font-bold text-white">{filteredClients.length}</span>{" "}
          de <span className="font-bold text-white">{clients.length}</span>{" "}
          clientes.
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}

      {filteredClients.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6 text-center">
          <Users className="mx-auto mb-3 text-zinc-500" size={32} />

          <p className="font-bold text-white">No hay clientes para mostrar</p>

          <p className="mt-2 text-sm text-zinc-400">
            Cuando haya turnos registrados, los clientes van a aparecer acá.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="rounded-2xl border border-white/10 bg-zinc-950 p-4 md:p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
                      <UserRound size={18} />
                    </div>

                    <div>
                      <p className="text-lg font-bold text-white">
                        {client.fullName}
                      </p>

                      <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                        <Mail size={15} />
                        {client.email}
                      </p>

                      <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                        <Phone size={15} />
                        {client.phone}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2 text-sm text-zinc-400">
                    <p>
                      Turnos totales:{" "}
                      <span className="font-bold text-white">
                        {client.totalAppointments}
                      </span>
                    </p>

                    <p>
                      Confirmados:{" "}
                      <span className="font-bold text-green-300">
                        {client.confirmedAppointments}
                      </span>{" "}
                      · Cancelados:{" "}
                      <span className="font-bold text-red-300">
                        {client.cancelledAppointments}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <CalendarDays size={15} />
                      Último turno:{" "}
                      <span className="text-zinc-200">
                        {formatDate(client.lastAppointment?.startAt)}
                      </span>
                    </p>

                    <p className="flex items-center gap-2">
                      <Scissors size={15} />
                      Último servicio:{" "}
                      <span className="text-zinc-200">
                        {client.lastAppointment?.service?.name || "Sin servicio"}
                      </span>
                    </p>

                    <p>
                      Último barbero:{" "}
                      <span className="text-zinc-200">
                        {client.lastAppointment?.barber?.displayName ||
                          "Sin barbero"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    Reservas
                  </p>

                  <p className="mt-1 text-2xl font-black text-white">
                    {client.totalAppointments}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}