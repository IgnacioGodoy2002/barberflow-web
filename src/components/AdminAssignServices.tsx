import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, RefreshCcw } from "lucide-react";
import { API_URL } from "../config/api";

type Service = {
  id: string;
  name: string;
  price?: string | number;
  durationMinutes?: number;
  bufferMinutes?: number;
};

type Barber = {
  id: string;
  displayName: string;
  services?: {
    service: Service;
  }[];
};

export function AdminAssignServices() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barberId, setBarberId] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const [loadingLists, setLoadingLists] = useState(false);
  const [loadingAssign, setLoadingAssign] = useState(false);
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      setLoadingLists(true);
      setMessage("");

      const [barbersResponse, servicesResponse] = await Promise.all([
        fetch(`${API_URL}/v1/barbers`),
        fetch(`${API_URL}/v1/services`),
      ]);

      const barbersData = await barbersResponse.json().catch(() => []);
      const servicesData = await servicesResponse.json().catch(() => []);

      if (!barbersResponse.ok || !servicesResponse.ok) {
        setMessage("No se pudieron cargar barberos o servicios.");
        return;
      }

      setBarbers(Array.isArray(barbersData) ? barbersData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingLists(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const selectedBarber = barbers.find((barber) => barber.id === barberId);

    if (!selectedBarber) {
      setSelectedServiceIds([]);
      return;
    }

    const currentServices =
      selectedBarber.services?.map((item) => item.service.id) || [];

    setSelectedServiceIds(currentServices);
  }, [barberId, barbers]);

  function toggleService(serviceId: string) {
    setSelectedServiceIds((current) => {
      if (current.includes(serviceId)) {
        return current.filter((id) => id !== serviceId);
      }

      return [...current, serviceId];
    });
  }

  async function assignServices() {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    if (!barberId) {
      setMessage("Seleccioná un barbero.");
      return;
    }

    try {
      setLoadingAssign(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/barbers/${barberId}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceIds: selectedServiceIds,
        }),
      });

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
      setLoadingAssign(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white">
          <CheckCircle2 size={22} />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-300">
            Servicios por barbero
          </p>
          <h3 className="text-xl font-black text-white">
            Asignar servicios a un barbero
          </h3>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 md:flex-row">
        <select
          value={barberId}
          onChange={(event) => setBarberId(event.target.value)}
          className="flex-1 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-green-500"
        >
          <option value="">Seleccionar barbero</option>
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.displayName}
            </option>
          ))}
        </select>

        <button
          onClick={loadData}
          disabled={loadingLists}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
        >
          {loadingLists ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Cargando...
            </>
          ) : (
            <>
              <RefreshCcw size={18} />
              Actualizar listas
            </>
          )}
        </button>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
          No hay servicios disponibles para asignar.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {services.map((service) => {
            const checked = selectedServiceIds.includes(service.id);

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  checked
                    ? "border-green-500 bg-green-500/15"
                    : "border-white/10 bg-zinc-950 hover:border-green-500/50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-white">{service.name}</p>

                    <p className="mt-1 text-xs text-zinc-400">
                      {service.durationMinutes ?? "-"} min +{" "}
                      {service.bufferMinutes ?? "-"} min buffer
                    </p>
                  </div>

                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                      checked
                        ? "border-green-400 bg-green-500 text-white"
                        : "border-white/20"
                    }`}
                  >
                    {checked && <CheckCircle2 size={16} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-5 rounded-2xl bg-zinc-950 p-4 text-sm text-zinc-400">
        Servicios seleccionados:{" "}
        <span className="font-bold text-white">{selectedServiceIds.length}</span>
      </div>

      <button
        onClick={assignServices}
        disabled={loadingAssign}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-500 disabled:opacity-60"
      >
        {loadingAssign ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Asignando servicios...
          </>
        ) : (
          <>
            <CheckCircle2 size={18} />
            Guardar servicios del barbero
          </>
        )}
      </button>

      {message && (
        <div className="mt-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}
    </div>
  );
}