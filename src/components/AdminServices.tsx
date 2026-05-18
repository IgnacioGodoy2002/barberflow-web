import { useState } from "react";
import { Loader2, PlusCircle, Scissors } from "lucide-react";
import { API_URL } from "../config/api";

type AdminServicesProps = {
  onServiceCreated?: () => void;
};

export function AdminServices({ onServiceCreated }: AdminServicesProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [bufferMinutes, setBufferMinutes] = useState("10");
  const [price, setPrice] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function createService() {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    if (!name || !description || !durationMinutes || !bufferMinutes || !price) {
      setMessage("Completá todos los campos del servicio.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          durationMinutes: Number(durationMinutes),
          bufferMinutes: Number(bufferMinutes),
          price: Number(price),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo crear el servicio.";

        setMessage(apiMessage);
        return;
      }

      setMessage("Servicio creado correctamente.");

      setName("");
      setDescription("");
      setDurationMinutes("30");
      setBufferMinutes("10");
      setPrice("");

      onServiceCreated?.();
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
          <Scissors size={22} />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Servicios
          </p>
          <h3 className="text-xl font-black text-white">
            Agregar nuevo servicio
          </h3>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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

        <input
          value={durationMinutes}
          onChange={(event) => setDurationMinutes(event.target.value)}
          placeholder="Duración en minutos"
          type="number"
          className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
        />

        <input
          value={bufferMinutes}
          onChange={(event) => setBufferMinutes(event.target.value)}
          placeholder="Buffer en minutos"
          type="number"
          className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
        />

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Descripción del servicio"
          className="min-h-24 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 md:col-span-2"
        />
      </div>

      <button
        onClick={createService}
        disabled={loading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Creando servicio...
          </>
        ) : (
          <>
            <PlusCircle size={18} />
            Crear servicio
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