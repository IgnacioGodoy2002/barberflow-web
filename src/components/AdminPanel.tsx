import { useEffect, useRef, useState } from "react";
import {
  Ban,
  Eye,
  ListOrdered,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Loader2,
  LogOut,
  Scissors,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { API_URL } from "../config/api";
import { AdminAppointments } from "./AdminAppointments";
import { AdminAssignServices } from "./AdminAssignServices";
import { AdminBarbers } from "./AdminBarbers";
import { AdminCalendar } from "./AdminCalendar";
import { AdminClients } from "./AdminClients";
import { AdminDashboard } from "./AdminDashboard";
import { AdminScheduleBlocks } from "./AdminScheduleBlocks";
import { AdminServices } from "./AdminServices";
import { AdminWorkingHours } from "./AdminWorkingHours";
import { AdminWaitlist } from "./AdminWaitlist";

const TOKEN_KEY = "barberflow_admin_token";
const DEMO_KEY = "barberflow_admin_demo";

type AdminTab =
  | "services"
  | "barbers"
  | "assign"
  | "appointments"
  | "calendar"
  | "workingHours"
  | "scheduleBlocks"
  | "clients"
  | "waitlist";

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
    id: "calendar",
    label: "Calendario",
    icon: CalendarDays,
  },
  {
    id: "workingHours",
    label: "Horarios",
    icon: CalendarClock,
  },
  {
    id: "scheduleBlocks",
    label: "Bloqueos",
    icon: Ban,
  },
  {
    id: "clients",
    label: "Clientes",
    icon: Users,
  },
  {
    id: "waitlist",
    label: "Espera",
    icon: ListOrdered,
  },
] as const;

export function AdminPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [isDemo, setIsDemo] = useState(localStorage.getItem(DEMO_KEY) === "true");

  const [activeTab, setActiveTab] = useState<AdminTab>(isDemo ? "calendar" : "services");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [message, setMessage] = useState("");
  const autoDemoStarted = useRef(false);

  /**
   * Modo demo: entra con una cuenta de solo lectura (la API oculta los datos
   * de los clientes). Pensado para quien llega desde el portfolio.
   */
  async function enterDemo() {
    try {
      setLoadingDemo(true);
      setMessage("");

      const response = await fetch(`${API_URL}/v1/auth/demo`, { method: "POST" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.message || "El modo demo no está disponible en este momento.");
        return;
      }

      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.setItem(DEMO_KEY, "true");
      setIsDemo(true);
      setActiveTab("calendar");
      setToken(data.accessToken);
    } catch {
      setMessage("No se pudo conectar con la API. Si es la primera visita, el servidor puede estar despertando: probá en unos segundos.");
    } finally {
      setLoadingDemo(false);
    }
  }

  // /admin?demo=1 entra directo al modo demo (link del portfolio).
  useEffect(() => {
    if (autoDemoStarted.current || token) return;
    if (new URLSearchParams(window.location.search).get("demo") !== "1") return;
    autoDemoStarted.current = true;
    // Se difiere un tick para no cambiar estado durante el montaje.
    void Promise.resolve().then(enterDemo);
    // Solo debe correr una vez al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      localStorage.setItem(TOKEN_KEY, data.accessToken);
      localStorage.removeItem(DEMO_KEY);
      setIsDemo(false);
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
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(DEMO_KEY);
    setIsDemo(false);
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
    if (activeTab === "calendar") return <AdminCalendar />;
    if (activeTab === "workingHours") return <AdminWorkingHours />;
    if (activeTab === "scheduleBlocks") return <AdminScheduleBlocks />;
    if (activeTab === "waitlist") return <AdminWaitlist />;

    return <AdminClients />;
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
            asignaciones, turnos, calendario, horarios, bloqueos y clientes.
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

        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-5 text-center md:p-6">
          <p className="font-bold text-white">¿Venís a ver el proyecto?</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
            Recorré el panel completo en modo demo: solo lectura y con los datos
            de los clientes ocultos. No hace falta usuario ni contraseña.
          </p>
          <button
            type="button"
            onClick={enterDemo}
            disabled={loadingDemo}
            data-cursor-label="Demo"
            className="magnetic mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {loadingDemo ? <Loader2 className="animate-spin" size={18} /> : <Eye size={18} />}
            {loadingDemo ? "Entrando…" : "Probar el panel en modo demo"}
          </button>
        </div>
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
            Gestioná servicios, barberos, asignaciones, turnos, calendario,
            horarios, bloqueos y clientes desde un solo lugar.
          </p>
        </div>

        <button
          onClick={logoutAdmin}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 md:w-auto"
        >
          <LogOut size={18} />
          {isDemo ? "Salir del modo demo" : "Cerrar sesión"}
        </button>
      </div>

      {isDemo && (
        <div className="mb-6 flex flex-col items-start gap-2 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-100 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2">
            <Eye size={18} className="shrink-0" />
            <span>
              <b>Modo demo:</b> podés recorrer todo, pero no se guardan cambios. Los
              nombres, emails y teléfonos de los clientes están ocultos.
            </span>
          </p>
        </div>
      )}

      <AdminDashboard />

      <div className="mb-4 rounded-3xl border border-white/10 bg-zinc-950 p-2">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5 xl:grid-cols-9">
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