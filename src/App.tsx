import { useEffect, useState, type ReactNode } from "react";
import {
  CalendarDays,
  Clock,
  Loader2,
  Scissors,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import "./App.css";
import logoBarberia from './assets/logo-barberia-pro.png'
import { BookingForm } from "./components/BookingForm";
import { API_URL } from "./config/api";
import { MyAppointments } from "./components/MyAppointments";
import { AdminAppointments } from "./components/AdminAppointments";
import { HowItWorks } from "./components/HowItWorks";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { AdminServices } from "./components/AdminServices";
import { AdminBarbers } from "./components/AdminBarbers";
import { AdminAssignServices } from "./components/AdminAssignServices";

type Service = {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  bufferMinutes: number;
  price: string | number;
};

type Barber = {
  id: string;
  displayName: string;
  bio?: string;
  services: {
    service: Service;
  }[];
};


function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesResponse, barbersResponse] = await Promise.all([
          fetch(`${API_URL}/v1/services`),
          fetch(`${API_URL}/v1/barbers`),
        ]);

        if (!servicesResponse.ok || !barbersResponse.ok) {
          throw new Error("No se pudieron cargar los datos");
        }

        const servicesData = await servicesResponse.json();
        const barbersData = await barbersResponse.json();

        setServices(servicesData);
        setBarbers(barbersData);
      } catch {
        setError("No se pudo conectar con BarberFlow API.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.25),_transparent_35%),radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),_transparent_30%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-20">
         <nav className="mb-20 flex items-center justify-between">
  <div className="flex items-center gap-4">
    <div className="flex h-40 w-40 items-center justify-center rounded-3xl border border-white/10 bg-zinc-900 p-1.5 shadow-xl shadow-black/40">
      <img
        src={logoBarberia}
        alt="Logo de Nacho Barbershop"
        className="h-full w-full rounded-2xl object-contain"
      />
    </div>

    <div>
      <p className="text-2xl font-black text-white">Nacho Barbershop</p>
      <p className="text-sm text-zinc-300">
        BarberFlow · Turnos inteligentes
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        Hipólito Bouchard 2086
      </p>
    </div>
  </div>

  <a
    href="#reservar"
    className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
  >
    Reservar turno
  </a>
</nav>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
                <Sparkles size={16} />
                API real conectada a NestJS + PostgreSQL
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
                Reservá tu turno de barbería de forma simple, rápida y
                profesional.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
                BarberFlow permite consultar servicios, elegir barbero, ver
                horarios disponibles y reservar turnos evitando doble reserva,
                conflictos de agenda y horarios bloqueados.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#servicios"
                  className="rounded-full bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
                >
                  Ver servicios
                </a>

                <a
                  href="#barberos"
                  className="rounded-full border border-white/15 px-6 py-3 font-semibold text-zinc-200 transition hover:bg-white/10"
                >
                  Ver barberos
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <div className="rounded-2xl bg-zinc-900 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">Estado del sistema</p>
                    <p className="text-2xl font-bold">Backend online</p>
                  </div>
                  <ShieldCheck className="text-green-400" />
                </div>

                <div className="grid gap-4">
                  <InfoCard
                    icon={<CalendarDays size={20} />}
                    title="Reservas"
                    text="Turnos confirmados y cancelaciones."
                  />

                  <InfoCard
                    icon={<Clock size={20} />}
                    title="Disponibilidad"
                    text="Horarios calculados automáticamente."
                  />

                  <InfoCard
                    icon={<UserRound size={20} />}
                    title="Roles"
                    text="ADMIN, BARBER y CLIENT."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
            Servicios
          </p>
          <h2 className="mt-3 text-3xl font-black">Elegí tu servicio</h2>
        </div>

        {loading && <LoadingMessage />}

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:bg-white/[0.07]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
                  <Scissors size={22} />
                </div>

                <h3 className="text-xl font-bold">{service.name}</h3>

                <p className="mt-3 min-h-16 text-sm leading-6 text-zinc-400">
                  {service.description || "Servicio profesional de barbería."}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-sm text-zinc-400">
                    {service.durationMinutes} min + {service.bufferMinutes} min
                  </span>

                  <span className="text-lg font-bold">
                    ${Number(service.price).toLocaleString("es-AR")}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="barberos" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-400">
            Barberos
          </p>
          <h2 className="mt-3 text-3xl font-black">
            Profesionales disponibles
          </h2>
        </div>

        {!loading && !error && (
          <div className="grid gap-5 md:grid-cols-2">
            {barbers.map((barber) => (
              <article
                key={barber.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300">
                    <UserRound size={24} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">{barber.displayName}</h3>
                    <p className="text-sm text-zinc-400">Barbero disponible</p>
                  </div>
                </div>

                <p className="text-sm leading-6 text-zinc-400">
                  {barber.bio || "Especialista en cortes y barba."}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {barber.services.map((item) => (
                    <span
                      key={item.service.id}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300"
                    >
                      {item.service.name}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
<HowItWorks />

            <section id="reservar" className="mx-auto max-w-6xl px-6 py-16">
  <BookingForm services={services} barbers={barbers} />
  <MyAppointments />
</section>
<section id="admin" className="mx-auto max-w-6xl px-6 pb-16">
  <details className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
    <summary className="cursor-pointer list-none text-center">
      <span className="inline-flex rounded-full border border-purple-500/40 px-6 py-3 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/10">
        Acceso interno para administración
      </span>
    </summary>

    <div className="mt-8 grid gap-6">
  <AdminServices />
  <AdminBarbers />
  <AdminAssignServices />
  <AdminAppointments />
</div>
  </details>
</section>

<Footer />
<WhatsAppButton />
</main>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-blue-300">{icon}</div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-zinc-400">{text}</p>
      </div>
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-zinc-300">
      <Loader2 className="animate-spin" size={20} />
      Cargando datos desde BarberFlow API...
    </div>
  );
}

export default App;