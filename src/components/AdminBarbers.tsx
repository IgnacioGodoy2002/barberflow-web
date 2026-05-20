import { useEffect, useState } from "react";
import {
  Edit3,
  Loader2,
  PlusCircle,
  RefreshCcw,
  Save,
  Trash2,
  UserRound,
  XCircle,
} from "lucide-react";
import { API_URL } from "../config/api";

type Barber = {
  id: string;
  displayName: string;
  bio?: string;
  user?: {
    fullName?: string;
    email?: string;
  };
  services?: {
    service: {
      id: string;
      name: string;
    };
  }[];
};

type AdminBarbersProps = {
  onBarberCreated?: () => void;
};

export function AdminBarbers({ onBarberCreated }: AdminBarbersProps) {
  const [barbers, setBarbers] = useState<Barber[]>([]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  const [editingBarberId, setEditingBarberId] = useState<string | null>(null);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function loadBarbers() {
    try {
      setLoadingList(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/barbers`);
      const data = await response.json().catch(() => []);

      if (!response.ok) {
        setMessage("No se pudieron cargar los barberos.");
        return;
      }

      setBarbers(Array.isArray(data) ? data : []);
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadBarbers();
  }, []);

  function resetForm() {
    setFullName("");
    setEmail("");
    setPassword("123456");
    setDisplayName("");
    setBio("");
    setEditingBarberId(null);
  }

  function startEdit(barber: Barber) {
    setEditingBarberId(barber.id);
    setFullName(barber.user?.fullName || "");
    setEmail(barber.user?.email || "");
    setPassword("");
    setDisplayName(barber.displayName);
    setBio(barber.bio || "");
    setMessage("Editando barbero seleccionado.");
  }

  async function saveBarber() {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    if (!displayName || !bio) {
      setMessage("Completá nombre visible y descripción del barbero.");
      return;
    }

    try {
      setLoadingSave(true);
      setMessage("");

      if (editingBarberId) {
        const response = await fetch(`${API_URL}/v1/barbers/${editingBarberId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            displayName,
            bio,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const apiMessage = Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "No se pudo actualizar el barbero.";

          setMessage(apiMessage);
          return;
        }

        setMessage("Barbero actualizado correctamente.");
      } else {
        if (!fullName || !email || !password || !displayName || !bio) {
          setMessage("Completá todos los campos para crear el barbero.");
          return;
        }

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
      }

      resetForm();
      await loadBarbers();
      onBarberCreated?.();
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingSave(false);
    }
  }

  async function deactivateBarber(barber: Barber) {
    const token = localStorage.getItem("barberflow_admin_token");

    if (!token) {
      setMessage("Primero iniciá sesión como admin.");
      return;
    }

    const confirmed = window.confirm(
      `¿Seguro que querés desactivar al barbero "${barber.displayName}"?`
    );

    if (!confirmed) return;

    try {
      setLoadingDeleteId(barber.id);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/barbers/${barber.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo desactivar el barbero.";

        setMessage(apiMessage);
        return;
      }

      setMessage("Barbero desactivado correctamente.");

      if (editingBarberId === barber.id) {
        resetForm();
      }

      await loadBarbers();
      onBarberCreated?.();
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingDeleteId(null);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white md:h-12 md:w-12">
            <UserRound size={21} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-300 md:text-sm">
              Barberos
            </p>

            <h3 className="text-xl font-black text-white md:text-2xl">
              {editingBarberId ? "Editar barbero" : "Agregar barbero"}
            </h3>
          </div>
        </div>

        <button
          onClick={loadBarbers}
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
        {!editingBarberId && (
          <>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Nombre completo"
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
              className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-purple-500 md:col-span-2"
            />
          </>
        )}

        {editingBarberId && (
          <>
            <div className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-400">
              Usuario:{" "}
              <span className="font-semibold text-white">
                {fullName || "Sin nombre"}
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-400">
              Email:{" "}
              <span className="font-semibold text-white">
                {email || "Sin email"}
              </span>
            </div>
          </>
        )}

        <input
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Nombre visible. Ej: Nacho Barber"
          className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-purple-500 md:col-span-2"
        />

        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          placeholder="Descripción del barbero"
          className="min-h-24 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-purple-500 md:col-span-2"
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={saveBarber}
          disabled={loadingSave}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-60 md:text-base"
        >
          {loadingSave ? (
            <>
              <Loader2 className="animate-spin" size={17} />
              Guardando...
            </>
          ) : editingBarberId ? (
            <>
              <Save size={17} />
              Guardar cambios
            </>
          ) : (
            <>
              <PlusCircle size={17} />
              Crear barbero
            </>
          )}
        </button>

        {editingBarberId && (
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
          Barberos activos
        </h4>

        {barbers.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm text-zinc-400">
            No hay barberos cargados.
          </div>
        ) : (
          <div className="grid gap-4">
            {barbers.map((barber) => (
              <div
                key={barber.id}
                className="rounded-2xl border border-white/10 bg-zinc-950 p-4 md:p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-bold text-white">
                      {barber.displayName}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-zinc-400">
                      {barber.bio || "Sin descripción"}
                    </p>

                    <p className="mt-2 text-xs text-zinc-500">
                      Usuario: {barber.user?.fullName || "Sin nombre"} ·{" "}
                      {barber.user?.email || "Sin email"}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-zinc-500">
                      Servicios:{" "}
                      {barber.services && barber.services.length > 0
                        ? barber.services
                            .map((item) => item.service.name)
                            .join(", ")
                        : "Sin servicios asignados"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
                    <button
                      onClick={() => startEdit(barber)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-purple-500/40 px-4 py-2.5 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/10"
                    >
                      <Edit3 size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => deactivateBarber(barber)}
                      disabled={loadingDeleteId === barber.id}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/40 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
                    >
                      {loadingDeleteId === barber.id ? (
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