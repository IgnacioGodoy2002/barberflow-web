import { useState } from "react";
import { CalendarDays, CheckCircle2, Clock, Loader2 } from "lucide-react";

type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  bufferMinutes: number;
  price: string | number;
};

type Barber = {
  id: string;
  displayName: string;
  services: {
    service: Service;
  }[];
};

type AvailabilitySlot = {
  startAt: string;
  endAt: string;
  label: string;
};

type AvailabilityResponse = {
  totalSlots: number;
  slots: AvailabilitySlot[];
};

type BookingFormProps = {
  services: Service[];
  barbers: Barber[];
};

const API_URL = import.meta.env.VITE_API_URL;

export function BookingForm({ services, barbers }: BookingFormProps) {
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [date, setDate] = useState("2026-05-18");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null
  );

  const [email, setEmail] = useState("ignacio@test.com");
  const [password, setPassword] = useState("123456");
  const [notes, setNotes] = useState("Quiero un corte prolijo.");

  const [token, setToken] = useState(localStorage.getItem("barberflow_token") || "");
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [message, setMessage] = useState("");

  const selectedService = services.find((service) => service.id === serviceId);
  const selectedBarber = barbers.find((barber) => barber.id === barberId);

  async function searchAvailability() {
    if (!serviceId || !barberId || !date) {
      setMessage("Seleccioná servicio, barbero y fecha.");
      return;
    }

    try {
      setLoadingAvailability(true);
      setMessage("");
      setSlots([]);
      setSelectedSlot(null);

      const response = await fetch(
        `${API_URL}/v1/availability?barberId=${barberId}&serviceId=${serviceId}&date=${date}`
      );

      const data: AvailabilityResponse | { message?: string | string[] } =
        await response.json();

      if (!response.ok) {
        const apiMessage =
          "message" in data && data.message
            ? Array.isArray(data.message)
              ? data.message.join(", ")
              : data.message
            : "No se pudo consultar disponibilidad.";

        setMessage(apiMessage);
        return;
      }

      if ("slots" in data) {
        setSlots(data.slots);

        if (data.slots.length === 0) {
          setMessage("No hay horarios disponibles para esa fecha.");
        }
      }
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingAvailability(false);
    }
  }

  async function loginClient() {
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

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "No se pudo iniciar sesión.");
        return;
      }

      localStorage.setItem("barberflow_token", data.accessToken);
      setToken(data.accessToken);
      setMessage("Sesión iniciada correctamente.");
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingLogin(false);
    }
  }

  function logoutClient() {
    localStorage.removeItem("barberflow_token");
    setToken("");
    setMessage("Sesión cerrada.");
  }

  async function confirmBooking() {
    if (!selectedSlot) {
      setMessage("Seleccioná un horario.");
      return;
    }

    if (!token) {
      setMessage("Primero iniciá sesión para confirmar el turno.");
      return;
    }

    try {
      setLoadingBooking(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          barberId,
          serviceId,
          startAt: selectedSlot.startAt,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo confirmar el turno.";

        setMessage(apiMessage);
        return;
      }

      setMessage("Turno confirmado correctamente.");
      setSelectedSlot(null);
      await searchAvailability();
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingBooking(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
          Reservas
        </p>
        <h2 className="mt-3 text-3xl font-black">Reservá tu turno</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400">
          Elegí un servicio, un barbero y una fecha para consultar horarios
          disponibles en tiempo real.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Servicio
          </label>
          <select
            value={serviceId}
            onChange={(event) => setServiceId(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="">Seleccionar servicio</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Barbero
          </label>
          <select
            value={barberId}
            onChange={(event) => setBarberId(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="">Seleccionar barbero</option>
            {barbers.map((barber) => (
              <option key={barber.id} value={barber.id}>
                {barber.displayName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-zinc-300">
            Fecha
          </label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={searchAvailability}
          disabled={loadingAvailability}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAvailability ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Consultando...
            </>
          ) : (
            <>
              <CalendarDays size={18} />
              Ver horarios disponibles
            </>
          )}
        </button>
      </div>

      {selectedService && selectedBarber && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900 p-4 text-sm text-zinc-300">
          <p>
            Servicio:{" "}
            <span className="font-semibold text-white">
              {selectedService.name}
            </span>
          </p>
          <p>
            Barbero:{" "}
            <span className="font-semibold text-white">
              {selectedBarber.displayName}
            </span>
          </p>
        </div>
      )}

      {message && (
        <div className="mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}

      {slots.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-zinc-300">
            <Clock size={18} />
            <h3 className="font-bold">Horarios disponibles</h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {slots.map((slot) => (
              <button
                key={slot.startAt}
                onClick={() => setSelectedSlot(slot)}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  selectedSlot?.startAt === slot.startAt
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-white/10 bg-white/5 text-white hover:border-blue-500 hover:bg-blue-500/20"
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedSlot && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
            <h3 className="mb-4 font-bold">Datos del cliente</h3>

            <div className="grid gap-3">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              />

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Contraseña"
                className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              />

              {!token ? (
                <button
                  onClick={loginClient}
                  disabled={loadingLogin}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-60"
                >
                  {loadingLogin ? "Ingresando..." : "Iniciar sesión"}
                </button>
              ) : (
                <button
                  onClick={logoutClient}
                  className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
            <h3 className="mb-4 font-bold">Confirmar reserva</h3>

            <div className="mb-4 rounded-2xl bg-white/5 p-4 text-sm text-zinc-300">
              <p>
                Horario seleccionado:{" "}
                <span className="font-bold text-white">{selectedSlot.label}</span>
              </p>
              <p>
                Fecha: <span className="font-bold text-white">{date}</span>
              </p>
            </div>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Notas para el barbero"
              className="mb-4 min-h-24 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
            />

            <button
              onClick={confirmBooking}
              disabled={loadingBooking}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-500 disabled:opacity-60"
            >
              {loadingBooking ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Confirmando...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Confirmar turno
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}