import { useEffect, useState } from "react";
import {
  Edit3,
  Loader2,
  PlusCircle,
  RefreshCcw,
  Save,
  Scissors,
  Trash2,
  XCircle,
} from "lucide-react";
import { API_URL } from "../config/api";

type Service = {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  bufferMinutes: number;
  price: string | number;
};

type AdminServicesProps = {
  onServiceCreated?: () => void;
};

export function AdminServices({ onServiceCreated }: AdminServicesProps) {
  const [services, setServices] = useState<Service[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [bufferMinutes, setBufferMinutes] = useState("10");
  const [price, setPrice] = useState("");

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function loadServices() {
    try {
      setLoadingList(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/services`);
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        setMessage("No se pudieron cargar los servicios.");
        return;
      }

      setServices(Array.isArray(data) ? data : []);
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  function resetForm() {
    setName("");
    setDescription("");
    setDurationMinutes("30");
    setBufferMinutes("10");
    setPrice("");
    setEditingServiceId(null);
  }

  function startEdit(service: Service) {
    setEditingServiceId(service.id);
    setName(service.name);
    setDescription(service.description || "");
    setDurationMinutes(String(service.durationMinutes));
    setBufferMinutes(String(service.bufferMinutes));
    setPrice(String(service.price));
    setMessage("Editando servicio seleccionado.");
  }

  async function saveService() {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    if (!name || !description || !durationMinutes || !bufferMinutes || !price) {
      setMessage("Completá todos los campos del servicio.");
      return;
    }

    const payload = {
      name,
      description,
      durationMinutes: Number(durationMinutes),
      bufferMinutes: Number(bufferMinutes),
      price: Number(price),
    };

    try {
      setLoadingSave(true);
      setMessage("");

      const url = editingServiceId
        ? `${API_URL}/v1/services/${editingServiceId}`
        : `${API_URL}/v1/services`;

      const method = editingServiceId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo guardar el servicio.";

        setMessage(apiMessage);
        return;
      }

      setMessage(
        editingServiceId
          ? "Servicio actualizado correctamente."
          : "Servicio creado correctamente."
      );

      resetForm();
      await loadServices();
      onServiceCreated?.();
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingSave(false);
    }
  }

  async function deactivateService(service: Service) {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    const confirmed = window.confirm(
      `¿Seguro que querés desactivar el servicio "${service.name}"?`
    );

    if (!confirmed) return;

    try {
      setLoadingDeleteId(service.id);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/services/${service.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo desactivar el servicio.";

        setMessage(apiMessage);
        return;
      }

      setMessage("Servicio desactivado correctamente.");
      await loadServices();
      onServiceCreated?.();

      if (editingServiceId === service.id) {
        resetForm();
      }
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingDeleteId(null);
    }
  }

  function formatPrice(value: string | number) {
    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return `$${value}`;
    }

    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(numberValue);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white md:h-12 md:w-12">
            <Scissors size={21} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300 md:text-sm">
              Servicios
            </p>

            <h3 className="text-xl font-black text-white md:text-2xl">
              {editingServiceId ? "Editar servicio" : "Agregar servicio"}
            </h3>
          </div>
        </div>

        <button
          onClick={loadServices}
          disabled={loadingList}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60 md:w-auto"
        >
          {loadingList ? (
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

      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nombre del servicio"
          className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
        />

        <input
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Precio. Ej: 12000"
          type="number"
          className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
        />

        <div className="grid grid-cols-2 gap-3 md:col-span-2">
          <input
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
            placeholder="Duración"
            type="number"
            className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          />

          <input
            value={bufferMinutes}
            onChange={(event) => setBufferMinutes(event.target.value)}
            placeholder="Buffer"
            type="number"
            className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          />
        </div>

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Descripción del servicio"
          className="min-h-24 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 md:col-span-2"
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={saveService}
          disabled={loadingSave}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60 md:text-base"
        >
          {loadingSave ? (
            <>
              <Loader2 className="animate-spin" size={17} />
              Guardando...
            </>
          ) : editingServiceId ? (
            <>
              <Save size={17} />
              Guardar cambios
            </>
          ) : (
            <>
              <PlusCircle size={17} />
              Crear servicio
            </>
          )}
        </button>

        {editingServiceId && (
          <button
            onClick={resetForm}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 md:text-base"
          >
            <XCircle size={17} />
            Cancelar
          </button>
        )}
      </div>

      {message && (
        <div className="mt-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}

      <div className="mt-7 md:mt-8">
        <h4 className="mb-4 text-lg font-bold text-white">
          Servicios activos
        </h4>

        {services.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-400">
            No hay servicios cargados.
          </div>
        ) : (
          <div className="grid gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-white/10 bg-zinc-950 p-4 md:p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">
                      {service.name}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      {service.description || "Sin descripción"}
                    </p>

                    <p className="mt-2 text-xs text-zinc-500">
                      {service.durationMinutes} min + {service.bufferMinutes}{" "}
                      min buffer · {formatPrice(service.price)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
                    <button
                      onClick={() => startEdit(service)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-500/40 px-4 py-2.5 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/10"
                    >
                      <Edit3 size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => deactivateService(service)}
                      disabled={loadingDeleteId === service.id}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/40 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
                    >
                      {loadingDeleteId === service.id ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      Desactivar
                    </button>
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