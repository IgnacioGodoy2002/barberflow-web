import { useState } from "react";
import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Loader2,
  LogOut,
  Scissors,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { API_URL } from "../config/api";
import { AdminAppointments } from "./AdminAppointments";
import { AdminAssignServices } from "./AdminAssignServices";
import { AdminBarbers } from "./AdminBarbers";
import { AdminDashboard } from "./AdminDashboard";
import { AdminServices } from "./AdminServices";
import { AdminWorkingHours } from "./AdminWorkingHours";

type AdminTab =
  | "services"
  | "barbers"
  | "assign"
  | "appointments"
  | "workingHours";

const tabs = [
  {
    id: "services",
    label: "Servicios",
    icon: Scissors,
  },
  {
    id: "barbers",
    label: "Barberos",
    icon: UserRound,
  },
  {
    id: "assign",
    label: "Asignar",
    icon: CheckCircle2,
  },
  {
    id: "appointments",
    label: "Turnos",
    icon: CalendarDays,
  },
  {
    id: "workingHours",
    label: "Horarios",
    icon: CalendarClock,
  },
] as const;

export function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(
    localStorage.getItem("barberflow_admin_token") || ""
  );

  const [activeTab, setActiveTab] = useState<AdminTab>("services");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [message, setMessage] = useState("");

  async function loginAdmin() {
    if (!email || !password) {
      setMessage("Ingresá email y contraseña de administrador.");
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

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiMessage = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo iniciar sesión.";

        setMessage(apiMessage);
        return;
      }

      if (data.user?.role !== "ADMIN") {
        setMessage("Esta cuenta no tiene permisos de administrador.");
        return;
      }

      localStorage.setItem("barberflow_admin_token", data.accessToken);
      setToken(data.accessToken);
      setPassword("");
      setMessage("Sesión de administrador iniciada correctamente.");
    } catch {
      setMessage("No se pudo conectar con la API.");
    } finally {
      setLoadingLogin(false);
    }
  }

  function logoutAdmin() {
    localStorage.removeItem("barberflow_admin_token");
    setToken("");
    setEmail("");
    setPassword("");
    setMessage("Sesión de administrador cerrada.");
  }

  function renderContent() {
    if (activeTab === "services") return <AdminServices />;
    if (activeTab === "barbers") return <AdminBarbers />;
    if (activeTab === "assign") return <AdminAssignServices />;
    if (activeTab === "appointments") return <AdminAppointments />;

    return <AdminWorkingHours />;
  }

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  if (!token) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white md:h-14 md:w-14">
            <ShieldCheck size={24} />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-400 md:text-sm">
            Panel interno
          </p>

          <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">
            Acceso administrador
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400">
            Iniciá sesión como administrador para gestionar servicios, barberos,
            asignaciones, turnos y horarios.
          </p>
        </div>

        <div className="mx-auto grid max-w-2xl gap-3 md:grid-cols-2">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email admin"
            className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
          />

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Contraseña admin"
            className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
          />
        </div>

        <div className="mt-5 flex justify-center">
          <button
            onClick={loginAdmin}
            disabled={loadingLogin}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-500 disabled:opacity-60 sm:w-auto"
          >
            {loadingLogin ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Ingresando...
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                Entrar al panel
              </>
            )}
          </button>
        </div>

        {message && (
          <div className="mt-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center text-sm text-yellow-200">
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-3 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-400 md:text-sm">
            Panel interno
          </p>

          <h2 className="mt-2 text-2xl font-black text-white md:mt-3 md:text-3xl">
            Administración BarberFlow
          </h2>

          <p className="mt-2 max-w-2xl text-sm text-zinc-400 md:mt-3">
            Gestioná servicios, barberos, asignaciones, turnos y horarios desde
            un solo lugar.
          </p>
        </div>

        <button
          onClick={logoutAdmin}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 md:w-auto"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>

      <AdminDashboard />

      <div className="mb-4 rounded-3xl border border-white/10 bg-zinc-950 p-2">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "border-purple-500 bg-purple-500/20 text-purple-200"
                    : "border-white/10 bg-black text-zinc-300 hover:border-purple-500/40 hover:bg-purple-500/10"
                }`}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-400">
        Sección actual:{" "}
        <span className="font-bold text-white">{activeTabData?.label}</span>
      </div>

      {message && (
        <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-center text-sm text-yellow-200">
          {message}
        </div>
      )}

      {renderContent()}
    </div>
  );
}