import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  RefreshCcw,
  Save,
  Scissors,
  UserRound,
} from "lucide-react";
import { API_URL } from "../config/api";

type Service = {
  id: string;
  name: string;
  description?: string;
  durationMinutes?: number;
  bufferMinutes?: number;
  price?: string | number;
};

type Barber = {
  id: string;
  displayName: string;
  bio?: string;
  services?: {
    service: Service;
  }[];
};

export function AdminAssignServices() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [selectedBarberId, setSelectedBarberId] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const [loadingData, setLoadingData] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [message, setMessage] = useState("");

  const selectedBarber = barbers.find(
    (barber) => barber.id === selectedBarberId
  );

  async function loadData() {
    try {
      setLoadingData(true);
      setMessage("");

      const [barbersResponse, servicesResponse] = await Promise.all([
        fetch(`${API_URL}/v1/barbers`),
        fetch(`${API_URL}/v1/services`),
      ]);

      const barbersData = await barbersResponse.json().catch(() => []);
      const servicesData = await servicesResponse.json().catch(() => []);

      if (!barbersResponse.ok) {
        setMessage("No se pudieron cargar los barberos.");
        return;
      }

      if (!servicesResponse.ok) {
        setMessage("No se pudieron cargar los servicios.");
        return;
      }

      setBarbers(Array.isArray(barbersData) ? barbersData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleSelectBarber(barberId: string) {
    setSelectedBarberId(barberId);
    setMessage("");

    const barber = barbers.find((item) => item.id === barberId);

    if (!barber) {
      setSelectedServiceIds([]);
      return;
    }

    const currentServiceIds =
      barber.services?.map((item) => item.service.id) || [];

    setSelectedServiceIds(currentServiceIds);
  }

  function toggleService(serviceId: string) {
    setSelectedServiceIds((currentIds) => {
      if (currentIds.includes(serviceId)) {
        return currentIds.filter((id) => id !== serviceId);
      }

      return [...currentIds, serviceId];
    });
  }

  async function saveAssignments() {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    if (!selectedBarberId) {
      setMessage("Seleccioná un barbero.");
      return;
    }

    try {
      setLoadingSave(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/v1/barbers/${selectedBarberId}/services`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceIds: selectedServiceIds,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudieron asignar los servicios.";

        setMessage(apiMessage);
        return;
      }

      setMessage("Servicios asignados correctamente.");
      await loadData();
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingSave(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white md:h-12 md:w-12">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-300 md:text-sm">
              Asignaciones
            </p>

            <h3 className="text-xl font-black text-white md:text-2xl">
              Asignar servicios
            </h3>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loadingData}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60 md:w-auto"
        >
          {loadingData ? (
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

      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
        <label className="mb-2 block text-sm font-semibold text-zinc-300">
          Barbero
        </label>

        <select
          value={selectedBarberId}
          onChange={(event) => handleSelectBarber(event.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-green-500"
        >
          <option value="">Seleccionar barbero</option>

          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.displayName}
            </option>
          ))}
        </select>

        {selectedBarber && (
          <div className="mt-4 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-600 text-white">
                <UserRound size={18} />
              </div>

              <div>
                <p className="font-bold text-white">
                  {selectedBarber.displayName}
                </p>

                <p className="mt-1 text-sm leading-6 text-green-100">
                  {selectedBarber.bio || "Barbero seleccionado."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-950 p-4">
        <div className="mb-4 flex items-center gap-2">
          <Scissors size={18} className="text-green-300" />
          <h4 className="font-bold text-white">Servicios disponibles</h4>
        </div>

        {services.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black p-4 text-sm text-zinc-400">
            No hay servicios activos cargados.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {services.map((service) => {
              const isSelected = selectedServiceIds.includes(service.id);

              return (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  disabled={!selectedBarberId}
                  className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    isSelected
                      ? "border-green-500 bg-green-500/15"
                      : "border-white/10 bg-black hover:border-green-500/40 hover:bg-green-500/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">{service.name}</p>

                      <p className="mt-1 text-sm leading-6 text-zinc-400">
                        {service.description || "Servicio de barbería."}
                      </p>
                    </div>

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-white/10 text-zinc-500"
                      }`}
                    >
                      <CheckCircle2 size={17} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-950 p-4">
        <p className="text-sm text-zinc-400">
          Servicios seleccionados:{" "}
          <span className="font-bold text-white">
            {selectedServiceIds.length}
          </span>
        </p>

        <button
          onClick={saveAssignments}
          disabled={loadingSave || !selectedBarberId}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
        >
          {loadingSave ? (
            <>
              <Loader2 className="animate-spin" size={17} />
              Guardando...
            </>
          ) : (
            <>
              <Save size={17} />
              Guardar asignación
            </>
          )}
        </button>
      </div>

      {message && (
        <div className="mt-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}
    </div>
  );
}