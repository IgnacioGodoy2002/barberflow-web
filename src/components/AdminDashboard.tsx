import { useEffect, useMemo, useState } from "react";
import {
  Ban,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarX,
  Clock,
  DollarSign,
  Loader2,
  Medal,
  RefreshCcw,
  Scissors,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import { API_URL } from "../config/api";

type DashboardPeriod = "TODAY" | "WEEK" | "MONTH" | "TOTAL";

type Appointment = {
  id: string;
  startAt: string;
  status: string;
  client?: {
    id?: string;
    fullName?: string;
    name?: string;
    email?: string;
  };
  user?: {
    id?: string;
    fullName?: string;
    name?: string;
    email?: string;
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

type Service = {
  id: string;
};

type Barber = {
  id: string;
};

type ScheduleBlock = {
  id: string;
  isActive?: boolean;
};

export function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);

  const [period, setPeriod] = useState<DashboardPeriod>("TODAY");
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

      const safeAppointments = Array.isArray(appointmentsData)
        ? appointmentsData
        : [];

      const safeServices = Array.isArray(servicesData) ? servicesData : [];
      const safeBarbers = Array.isArray(barbersData) ? barbersData : [];

      setAppointments(safeAppointments);
      setServices(safeServices);
      setBarbers(safeBarbers);

      const blockResults = await Promise.allSettled(
        safeBarbers.map((barber) =>
          fetch(`${API_URL}/v1/schedule-blocks/barber/${barber.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((response) => response.json())
        )
      );

      const allBlocks = blockResults.flatMap((result) => {
        if (result.status !== "fulfilled") return [];
        return Array.isArray(result.value) ? result.value : [];
      });

      setBlocks(allBlocks);
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

  function formatTime(date: string) {
    return new Intl.DateTimeFormat("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
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

  function addDaysToDateString(dateString: string, days: number) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    date.setUTCDate(date.getUTCDate() + days);

    return date.toISOString().slice(0, 10);
  }

  function getWeekRange(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const dayOfWeek = date.getUTCDay();
    const mondayDiff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const start = addDaysToDateString(dateString, mondayDiff);
    const end = addDaysToDateString(start, 6);

    return { start, end };
  }

  function getAppointmentPrice(appointment: Appointment) {
    const price = Number(appointment.service?.price || 0);

    if (Number.isNaN(price)) {
      return 0;
    }

    return price;
  }

  function isRevenueAppointment(appointment: Appointment) {
    return (
      appointment.status === "CONFIRMED" || appointment.status === "COMPLETED"
    );
  }

  function isValidRankingAppointment(appointment: Appointment) {
    return (
      appointment.status !== "CANCELLED" && appointment.status !== "NO_SHOW"
    );
  }

  function getClientName(appointment: Appointment) {
    return (
      appointment.client?.fullName ||
      appointment.client?.name ||
      appointment.user?.fullName ||
      appointment.user?.name ||
      "Cliente"
    );
  }

  function getClientEmail(appointment: Appointment) {
    return appointment.client?.email || appointment.user?.email || "Sin email";
  }

  function getBarberName(appointment: Appointment) {
    return appointment.barber?.displayName || "Sin barbero";
  }

  function getPeriodLabel(selectedPeriod: DashboardPeriod) {
    if (selectedPeriod === "TODAY") return "Hoy";
    if (selectedPeriod === "WEEK") return "Esta semana";
    if (selectedPeriod === "MONTH") return "Este mes";
    return "Total";
  }

  function getPeriodDescription(selectedPeriod: DashboardPeriod) {
    if (selectedPeriod === "TODAY") {
      return "Mostrando métricas solo del día actual.";
    }

    if (selectedPeriod === "WEEK") {
      return "Mostrando métricas desde el lunes hasta el domingo de esta semana.";
    }

    if (selectedPeriod === "MONTH") {
      return "Mostrando métricas del mes actual.";
    }

    return "Mostrando métricas históricas de todos los turnos.";
  }

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  });

  const periodAppointments = useMemo(() => {
    if (period === "TOTAL") {
      return appointments;
    }

    if (period === "TODAY") {
      return appointments.filter(
        (appointment) => getArgentinaDate(appointment.startAt) === today
      );
    }

    if (period === "MONTH") {
      return appointments.filter((appointment) =>
        getArgentinaDate(appointment.startAt).startsWith(today.slice(0, 7))
      );
    }

    const weekRange = getWeekRange(today);

    return appointments.filter((appointment) => {
      const appointmentDate = getArgentinaDate(appointment.startAt);

      return (
        appointmentDate >= weekRange.start && appointmentDate <= weekRange.end
      );
    });
  }, [appointments, period, today]);

  const confirmedAppointments = periodAppointments.filter(
    (appointment) => appointment.status === "CONFIRMED"
  ).length;

  const cancelledAppointments = periodAppointments.filter(
    (appointment) => appointment.status === "CANCELLED"
  ).length;

  const completedAppointments = periodAppointments.filter(
    (appointment) => appointment.status === "COMPLETED"
  ).length;

  const noShowAppointments = periodAppointments.filter(
    (appointment) => appointment.status === "NO_SHOW"
  ).length;

  const totalClients = useMemo(() => {
    const clients = new Set<string>();

    periodAppointments.forEach((appointment) => {
      const clientKey =
        appointment.client?.id ||
        appointment.user?.id ||
        appointment.client?.email ||
        appointment.user?.email;

      if (clientKey) {
        clients.add(clientKey);
      }
    });

    return clients.size;
  }, [periodAppointments]);

  const activeBlocks = blocks.filter((block) => block.isActive !== false).length;

  const estimatedPeriodIncome = useMemo(() => {
    return periodAppointments
      .filter((appointment) => isRevenueAppointment(appointment))
      .reduce(
        (total, appointment) => total + getAppointmentPrice(appointment),
        0
      );
  }, [periodAppointments]);

  const completedIncome = useMemo(() => {
    return periodAppointments
      .filter((appointment) => appointment.status === "COMPLETED")
      .reduce(
        (total, appointment) => total + getAppointmentPrice(appointment),
        0
      );
  }, [periodAppointments]);

  const averageIncomePerAppointment = useMemo(() => {
    const revenueAppointments = periodAppointments.filter((appointment) =>
      isRevenueAppointment(appointment)
    );

    if (revenueAppointments.length === 0) {
      return 0;
    }

    return Math.round(estimatedPeriodIncome / revenueAppointments.length);
  }, [periodAppointments, estimatedPeriodIncome]);

  const serviceRanking = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        count: number;
        income: number;
      }
    >();

    periodAppointments
      .filter((appointment) => isValidRankingAppointment(appointment))
      .forEach((appointment) => {
        const serviceId = appointment.service?.id || "sin-servicio";
        const serviceName = appointment.service?.name || "Sin servicio";
        const current = map.get(serviceId);

        if (!current) {
          map.set(serviceId, {
            id: serviceId,
            name: serviceName,
            count: 1,
            income: getAppointmentPrice(appointment),
          });
          return;
        }

        current.count += 1;
        current.income += getAppointmentPrice(appointment);
      });

    return Array.from(map.values())
      .sort((a, b) => b.count - a.count || b.income - a.income)
      .slice(0, 5);
  }, [periodAppointments]);

  const clientRanking = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        email: string;
        count: number;
        income: number;
      }
    >();

    periodAppointments
      .filter((appointment) => isValidRankingAppointment(appointment))
      .forEach((appointment) => {
        const clientId =
          appointment.client?.id ||
          appointment.user?.id ||
          appointment.client?.email ||
          appointment.user?.email ||
          "sin-cliente";

        const current = map.get(clientId);

        if (!current) {
          map.set(clientId, {
            id: clientId,
            name: getClientName(appointment),
            email: getClientEmail(appointment),
            count: 1,
            income: getAppointmentPrice(appointment),
          });
          return;
        }

        current.count += 1;
        current.income += getAppointmentPrice(appointment);
      });

    return Array.from(map.values())
      .sort((a, b) => b.count - a.count || b.income - a.income)
      .slice(0, 5);
  }, [periodAppointments]);

  const barberRanking = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        count: number;
        income: number;
        completed: number;
        noShow: number;
      }
    >();

    periodAppointments
      .filter((appointment) => isValidRankingAppointment(appointment))
      .forEach((appointment) => {
        const barberId = appointment.barber?.id || "sin-barbero";
        const barberName = getBarberName(appointment);
        const current = map.get(barberId);

        if (!current) {
          map.set(barberId, {
            id: barberId,
            name: barberName,
            count: 1,
            income: getAppointmentPrice(appointment),
            completed: appointment.status === "COMPLETED" ? 1 : 0,
            noShow: appointment.status === "NO_SHOW" ? 1 : 0,
          });
          return;
        }

        current.count += 1;
        current.income += getAppointmentPrice(appointment);

        if (appointment.status === "COMPLETED") {
          current.completed += 1;
        }

        if (appointment.status === "NO_SHOW") {
          current.noShow += 1;
        }
      });

    return Array.from(map.values())
      .sort((a, b) => b.count - a.count || b.income - a.income)
      .slice(0, 5);
  }, [periodAppointments]);

  const todayUpcomingAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => {
        return (
          getArgentinaDate(appointment.startAt) === today &&
          appointment.status === "CONFIRMED"
        );
      })
      .sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
      )
      .slice(0, 5);
  }, [appointments, today]);

  const cards = [
    {
      title: "Turnos",
      value: periodAppointments.length,
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
      title: "Completados",
      value: completedAppointments,
      icon: CalendarClock,
      className: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    },
    {
      title: "Servicios",
      value: services.length,
      icon: Scissors,
      className: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    },
    {
      title: "Barberos",
      value: barbers.length,
      icon: UserRound,
      className: "border-pink-500/30 bg-pink-500/10 text-pink-300",
    },
    {
      title: "Clientes",
      value: totalClients,
      icon: Users,
      className: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
    },
    {
      title: "Bloqueos",
      value: activeBlocks,
      icon: Ban,
      className: "border-red-500/30 bg-red-500/10 text-red-300",
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
            {getPeriodDescription(period)}
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

      <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black p-2 md:grid-cols-4">
        {(["TODAY", "WEEK", "MONTH", "TOTAL"] as DashboardPeriod[]).map(
          (item) => (
            <button
              key={item}
              onClick={() => setPeriod(item)}
              className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                period === item
                  ? "bg-purple-600 text-white"
                  : "text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {getPeriodLabel(item)}
            </button>
          )
        )}
      </div>

      {message && (
        <div className="mb-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}

      <div className="mb-4 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
          Período seleccionado
        </p>

        <p className="mt-2 text-2xl font-black text-white">
          {getPeriodLabel(period)}
        </p>

        <p className="mt-1 text-sm text-purple-100">
          Los ingresos, rankings, clientes y turnos se calculan sobre este
          período.
        </p>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-300">
                Ingresos período
              </p>

              <p className="mt-2 text-2xl font-black text-white md:text-3xl">
                {formatCurrency(estimatedPeriodIncome)}
              </p>

              <p className="mt-1 text-xs text-green-100">
                Confirmados y completados.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10 text-green-300">
              <DollarSign size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                Ingresos atendidos
              </p>

              <p className="mt-2 text-2xl font-black text-white md:text-3xl">
                {formatCurrency(completedIncome)}
              </p>

              <p className="mt-1 text-xs text-blue-100">
                Solo turnos completados.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-300">
              <DollarSign size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
                Ticket promedio
              </p>

              <p className="mt-2 text-2xl font-black text-white md:text-3xl">
                {formatCurrency(averageIncomePerAppointment)}
              </p>

              <p className="mt-1 text-xs text-yellow-100">
                Promedio por turno activo.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-300">
              <DollarSign size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            Atendidos
          </p>

          <p className="mt-2 text-3xl font-black text-white">
            {completedAppointments}
          </p>

          <p className="mt-1 text-sm text-blue-100">
            Turnos marcados como completados.
          </p>
        </div>

        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
            No asistieron
          </p>

          <p className="mt-2 text-3xl font-black text-white">
            {noShowAppointments}
          </p>

          <p className="mt-1 text-sm text-orange-100">
            Clientes marcados como no asistidos.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-black p-4 md:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-300">
              <Trophy size={21} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
                Ranking
              </p>

              <h4 className="text-lg font-black text-white">
                Servicios más pedidos
              </h4>
            </div>
          </div>

          {serviceRanking.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 text-center">
              <Scissors className="mx-auto mb-3 text-zinc-500" size={32} />

              <p className="font-bold text-white">Sin datos suficientes</p>

              <p className="mt-2 text-sm text-zinc-400">
                Cuando haya turnos activos en este período, se va a armar el
                ranking.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {serviceRanking.map((service, index) => (
                <div
                  key={service.id}
                  className="rounded-2xl border border-white/10 bg-zinc-950 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-yellow-500/30 bg-yellow-500/10 text-sm font-black text-yellow-300">
                        #{index + 1}
                      </div>

                      <div>
                        <p className="font-bold text-white">{service.name}</p>

                        <p className="mt-1 text-sm text-zinc-400">
                          {service.count} turno{service.count === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-zinc-500">Estimado</p>

                      <p className="font-bold text-green-300">
                        {formatCurrency(service.income)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-black p-4 md:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 text-purple-300">
              <Medal size={21} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
                Clientes
              </p>

              <h4 className="text-lg font-black text-white">
                Clientes frecuentes
              </h4>
            </div>
          </div>

          {clientRanking.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 text-center">
              <Users className="mx-auto mb-3 text-zinc-500" size={32} />

              <p className="font-bold text-white">Sin clientes frecuentes</p>

              <p className="mt-2 text-sm text-zinc-400">
                Cuando los clientes reserven turnos en este período, van a
                aparecer acá.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {clientRanking.map((client, index) => (
                <div
                  key={client.id}
                  className="rounded-2xl border border-white/10 bg-zinc-950 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 text-sm font-black text-purple-300">
                        #{index + 1}
                      </div>

                      <div>
                        <p className="font-bold text-white">{client.name}</p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {client.email}
                        </p>

                        <p className="mt-1 text-sm text-zinc-400">
                          {client.count} turno{client.count === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-zinc-500">Estimado</p>

                      <p className="font-bold text-green-300">
                        {formatCurrency(client.income)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-black p-4 md:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-500/30 bg-pink-500/10 text-pink-300">
              <UserRound size={21} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-300">
                Barberos
              </p>

              <h4 className="text-lg font-black text-white">
                Barberos con más turnos
              </h4>
            </div>
          </div>

          {barberRanking.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 text-center">
              <UserRound className="mx-auto mb-3 text-zinc-500" size={32} />

              <p className="font-bold text-white">Sin datos de barberos</p>

              <p className="mt-2 text-sm text-zinc-400">
                Cuando haya turnos activos en este período, se va a armar el
                ranking.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {barberRanking.map((barber, index) => (
                <div
                  key={barber.id}
                  className="rounded-2xl border border-white/10 bg-zinc-950 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-pink-500/30 bg-pink-500/10 text-sm font-black text-pink-300">
                        #{index + 1}
                      </div>

                      <div>
                        <p className="font-bold text-white">{barber.name}</p>

                        <p className="mt-1 text-sm text-zinc-400">
                          {barber.count} turno{barber.count === 1 ? "" : "s"}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {barber.completed} completado
                          {barber.completed === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-zinc-500">Estimado</p>

                      <p className="font-bold text-green-300">
                        {formatCurrency(barber.income)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-white/10 bg-black p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
              Agenda de hoy
            </p>

            <h4 className="mt-1 text-lg font-black text-white">
              Próximos turnos confirmados
            </h4>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-200">
            <Clock size={16} />
            {todayUpcomingAppointments.length} pendientes
          </div>
        </div>

        {todayUpcomingAppointments.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 text-center">
            <CalendarDays className="mx-auto mb-3 text-zinc-500" size={32} />

            <p className="font-bold text-white">
              No quedan turnos confirmados para hoy
            </p>

            <p className="mt-2 text-sm text-zinc-400">
              Cuando haya turnos confirmados del día, van a aparecer acá.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {todayUpcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-2xl border border-white/10 bg-zinc-950 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-bold text-white">
                        {formatTime(appointment.startAt)}
                      </p>

                      <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-300">
                        Confirmado
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-zinc-400">
                      Cliente:{" "}
                      <span className="font-semibold text-zinc-200">
                        {getClientName(appointment)}
                      </span>
                    </p>

                    <p className="mt-1 text-sm text-zinc-400">
                      Servicio:{" "}
                      <span className="font-semibold text-zinc-200">
                        {appointment.service?.name || "Servicio"}
                      </span>
                    </p>

                    <p className="mt-1 text-sm text-zinc-400">
                      Barbero:{" "}
                      <span className="font-semibold text-zinc-200">
                        {appointment.barber?.displayName || "Sin asignar"}
                      </span>
                    </p>
                  </div>

                  <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-yellow-300">
                      Turno
                    </p>

                    <p className="mt-1 text-xl font-black text-white">
                      {formatTime(appointment.startAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}