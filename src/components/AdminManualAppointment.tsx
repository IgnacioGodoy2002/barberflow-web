import { useEffect, useMemo, useState } from "react";
import {
  CalendarPlus,
  Loader2,
  RefreshCcw,
  Save,
  UserRound,
} from "lucide-react";
import { API_URL } from "../config/api";

type Service = {
  id: string;
  name: string;
};

type BarberService = {
  serviceId?: string;
  service?: Service;
};

type Barber = {
  id: string;
  displayName: string;
  services?: BarberService[];
};

type AdminManualAppointmentProps = {
  onCreated?: () => void;
};

export function AdminManualAppointment({
  onCreated,
}: AdminManualAppointmentProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarberServiceIds, setSelectedBarberServiceIds] = useState<
    string[]
  >([]);

  const [clientFullName, setClientFullName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [barberId, setBarberId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [startAt, setStartAt] = useState("");
  const [notes, setNotes] = useState("");

  const [loadingData, setLoadingData] = useState(false);
  const [loadingBarberServices, setLoadingBarberServices] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    if (!barberId) {
      setSelectedBarberServiceIds([]);
      setServiceId("");
      return;
    }

    loadSelectedBarberServices(barberId);
  }, [barberId]);

  async function loadOptions() {
    try {
      setLoadingData(true);
      setMessage("");

      const [servicesResponse, barbersResponse] = await Promise.all([
        fetch(`${API_URL}/v1/services`),
        fetch(`${API_URL}/v1/barbers`),
      ]);

      const servicesData = await servicesResponse.json().catch(() => []);
      const barbersData = await barbersResponse.json().catch(() => []);

      if (!servicesResponse.ok) {
        setMessage("No se pudieron cargar los servicios.");
        return;
      }

      if (!barbersResponse.ok) {
        setMessage("No se pudieron cargar los barberos.");
        return;
      }

      setServices(Array.isArray(servicesData) ? servicesData : []);
      setBarbers(Array.isArray(barbersData) ? barbersData : []);
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingData(false);
    }
  }

  async function loadSelectedBarberServices(selectedBarberId: string) {
    try {
      setLoadingBarberServices(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/barbers/${selectedBarberId}`);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setSelectedBarberServiceIds([]);
        setServiceId("");
        setMessage("No se pudieron cargar los servicios de este barbero.");
        return;
      }

      const barberServices = Array.isArray(data.services) ? data.services : [];

      const serviceIds = barberServices
        .map((barberService: BarberService) => {
          return barberService.serviceId || barberService.service?.id || "";
        })
        .filter(Boolean);

      setSelectedBarberServiceIds(serviceIds);

      if (serviceId && !serviceIds.includes(serviceId)) {
        setServiceId("");
      }

      if (serviceIds.length === 0) {
        setMessage("Este barbero todavía no tiene servicios asignados.");
      }
    } catch {
      setSelectedBarberServiceIds([]);
      setServiceId("");
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingBarberServices(false);
    }
  }

  function clearForm() {
    setClientFullName("");
    setClientEmail("");
    setClientPhone("");
    setBarberId("");
    setServiceId("");
    setStartAt("");
    setNotes("");
    setSelectedBarberServiceIds([]);
  }

  async function createManualAppointment() {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    if (!clientFullName.trim()) {
      setMessage("Ingresá el nombre del cliente.");
      return;
    }

    if (!clientEmail.trim()) {
      setMessage("Ingresá el email del cliente.");
      return;
    }

    if (!barberId) {
      setMessage("Seleccioná un barbero.");
      return;
    }

    if (!serviceId) {
      setMessage("Seleccioná un servicio.");
      return;
    }

    if (!startAt) {
      setMessage("Seleccioná fecha y hora del turno.");
      return;
    }

    try {
      setLoadingCreate(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/appointments/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clientFullName: clientFullName.trim(),
          clientEmail: clientEmail.trim().toLowerCase(),
          clientPhone: clientPhone.trim() || undefined,
          barberId,
          serviceId,
          startAt: new Date(startAt).toISOString(),
          notes: notes.trim() || "Turno creado manualmente desde admin",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo crear el turno manual.";

        setMessage(apiMessage);
        return;
      }

      setMessage("Turno manual creado correctamente.");
      clearForm();
      onCreated?.();
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingCreate(false);
    }
  }

  const availableServices = useMemo(() => {
    if (!barberId) {
      return [];
    }

    if (selectedBarberServiceIds.length === 0) {
      return [];
    }

    return services.filter((service) =>
      selectedBarberServiceIds.includes(service.id)
    );
  }, [services, barberId, selectedBarberServiceIds]);

  return (
    <div className="mb-5 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600 text-white">
            <CalendarPlus size={20} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
              Reserva manual
            </p>

            <h4 className="font-black text-white">Crear turno desde admin</h4>
          </div>
        </div>

        <button
          onClick={loadOptions}
          disabled={loadingData}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
        >
          {loadingData ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Cargando...
            </>
          ) : (
            <>
              <RefreshCcw size={16} />
              Recargar datos
            </>
          )}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="relative">
          <UserRound
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            size={17}
          />

          <input
            value={clientFullName}
            onChange={(event) => setClientFullName(event.target.value)}
            placeholder="Nombre del cliente"
            className="w-full rounded-2xl border border-white/10 bg-black px-11 py-3 text-sm text-white outline-none focus:border-purple-500"
          />
        </div>

        <input
          value={clientEmail}
          onChange={(event) => setClientEmail(event.target.value)}
          placeholder="Email del cliente"
          type="email"
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
        />

        <input
          value={clientPhone}
          onChange={(event) => setClientPhone(event.target.value)}
          placeholder="Teléfono del cliente"
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
        />

        <input
          value={startAt}
          onChange={(event) => setStartAt(event.target.value)}
          type="datetime-local"
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
        />

        <select
          value={barberId}
          onChange={(event) => {
            setBarberId(event.target.value);
            setServiceId("");
          }}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
        >
          <option value="">Seleccionar barbero</option>

          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.displayName}
            </option>
          ))}
        </select>

        <select
          value={serviceId}
          onChange={(event) => setServiceId(event.target.value)}
          disabled={!barberId || loadingBarberServices}
          className="rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {!barberId && <option value="">Primero seleccioná un barbero</option>}

          {barberId && loadingBarberServices && (
            <option value="">Cargando servicios...</option>
          )}

          {barberId && !loadingBarberServices && availableServices.length === 0 && (
            <option value="">Sin servicios asignados</option>
          )}

          {barberId && !loadingBarberServices && availableServices.length > 0 && (
            <option value="">Seleccionar servicio</option>
          )}

          {availableServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>

        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Notas. Ej: Turno pedido por WhatsApp, cliente quiere corte clásico..."
          className="min-h-24 rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-purple-500 md:col-span-2"
        />
      </div>

      {barberId && !loadingBarberServices && availableServices.length > 0 && (
        <p className="mt-3 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
          Mostrando solo los servicios asignados al barbero seleccionado.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {message && (
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
            {message}
          </div>
        )}

        <button
          onClick={createManualAppointment}
          disabled={loadingCreate}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-60"
        >
          {loadingCreate ? (
            <>
              <Loader2 className="animate-spin" size={17} />
              Creando...
            </>
          ) : (
            <>
              <Save size={17} />
              Crear turno manual
            </>
          )}
        </button>
      </div>
    </div>
  );
}