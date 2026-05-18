import { useState } from "react";
import { Loader2, PlusCircle, UserRound } from "lucide-react";
import { API_URL } from "../config/api";

type AdminBarbersProps = {
  onBarberCreated?: () => void;
};

export function AdminBarbers({ onBarberCreated }: AdminBarbersProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function createBarber() {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    if (!fullName || !email || !password || !displayName || !bio) {
      setMessage("Completá todos los campos del barbero.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/barbers/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          displayName,
          bio,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo crear el barbero.";

        setMessage(apiMessage);
        return;
      }

      setMessage("Barbero creado correctamente.");

      setFullName("");
      setEmail("");
      setPassword("123456");
      setDisplayName("");
      setBio("");

      onBarberCreated?.();
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white">
          <UserRound size={22} />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
            Barberos
          </p>
          <h3 className="text-xl font-black text-white">
            Agregar nuevo barbero
          </h3>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Nombre completo"
          className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
        />

        <input
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Nombre visible. Ej: Nacho Barber"
          className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
        />

        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email del barbero"
          type="email"
          className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
        />

        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Contraseña inicial"
          type="password"
          className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
        />

        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder="Descripción del barbero"
          className="min-h-24 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-purple-500 md:col-span-2"
        />
      </div>

      <button
        onClick={createBarber}
        disabled={loading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-500 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Creando barbero...
          </>
        ) : (
          <>
            <PlusCircle size={18} />
            Crear barbero
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