import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarX,
  Loader2,
  RefreshCcw,
  Scissors,
  UserRound,
} from "lucide-react";
import { API_URL } from "../config/api";

type Appointment = {
  id: string;
  startAt: string;
  status: string;
};

type Service = {
  id: string;
};

type Barber = {
  id: string;
};

export function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadDashboard() {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    try {
      setLoading(true);
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
        .catch(() => []);
      const servicesData = await servicesResponse.json().catch(() => []);
      const barbersData = await barbersResponse.json().catch(() => []);

      if (!appointmentsResponse.ok) {
        setMessage("No se pudieron cargar los turnos del dashboard.");
        return;
      }

      if (!servicesResponse.ok) {
        setMessage("No se pudieron cargar los servicios del dashboard.");
        return;
      }

      if (!barbersResponse.ok) {
        setMessage("No se pudieron cargar los barberos del dashboard.");
        return;
      }

      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setBarbers(Array.isArray(barbersData) ? barbersData : []);
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  function getArgentinaDate(date: string) {
    return new Date(date).toLocaleDateString("en-CA", {
      timeZone: "America/Argentina/Buenos_Aires",
    });
  }

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  });

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "CONFIRMED"
  ).length;

  const cancelledAppointments = appointments.filter(
    (appointment) => appointment.status === "CANCELLED"
  ).length;

  const todayAppointments = appointments.filter(
    (appointment) => getArgentinaDate(appointment.startAt) === today
  ).length;

  const cards = [
    {
      title: "Totales",
      value: appointments.length,
      icon: CalendarDays,
      className: "border-purple-500/30 bg-purple-500/10 text-purple-300",
    },
    {
      title: "Confirmados",
      value: confirmedAppointments,
      icon: CalendarCheck,
      className: "border-green-500/30 bg-green-500/10 text-green-300",
    },
    {
      title: "Cancelados",
      value: cancelledAppointments,
      icon: CalendarX,
      className: "border-red-500/30 bg-red-500/10 text-red-300",
    },
    {
      title: "Hoy",
      value: todayAppointments,
      icon: CalendarClock,
      className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    },
    {
      title: "Servicios",
      value: services.length,
      icon: Scissors,
      className: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    },
    {
      title: "Barberos",
      value: barbers.length,
      icon: UserRound,
      className: "border-pink-500/30 bg-pink-500/10 text-pink-300",
    },
  ];

  return (
    <div className="mb-6 rounded-3xl border border-white/10 bg-zinc-950 p-4 md:mb-8 md:p-5">
      <div className="mb-4 flex flex-col gap-3 md:mb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300 md:text-sm">
            Resumen general
          </p>

          <h3 className="mt-1 text-xl font-black text-white md:mt-2 md:text-2xl">
            Dashboard
          </h3>

          <p className="mt-1 text-xs text-zinc-400 md:mt-2 md:text-sm">
            Estado actual de turnos, servicios y barberos.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60 md:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={17} />
              Actualizando...
            </>
          ) : (
            <>
              <RefreshCcw size={17} />
              Actualizar
            </>
          )}
        </button>
      </div>

      {message && (
        <div className="mb-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-black p-3 md:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-zinc-400 md:text-sm">
                    {card.title}
                  </p>

                  <p className="mt-1 text-2xl font-black text-white md:mt-2 md:text-3xl">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl border md:h-12 md:w-12 ${card.className}`}
                >
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}