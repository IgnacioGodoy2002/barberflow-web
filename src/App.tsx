import { useEffect, useState, type ReactNode } from "react";
import {
  CalendarDays,
  Clock,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import "./App.css";
import logoBarberia from "./assets/logo-barberia-pro.png";
import { BookingForm } from "./components/BookingForm";
import { API_URL } from "./config/api";
import { MyAppointments } from "./components/MyAppointments";
import { HowItWorks } from "./components/HowItWorks";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { AdminPage } from "./pages/AdminPage";
import { AboutSection } from "./components/AboutSection";
import { GallerySection } from "./components/GallerySection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { ContactSection } from "./components/ContactSection";
import { FaqSection } from "./components/FaqSection";
import { ServicesSection } from "./components/ServicesSection";
import { BarbersSection } from "./components/BarbersSection";

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
  const isAdminPage = window.location.pathname === "/admin";

  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdminPage) {
      setLoading(false);
      return;
    }

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

        setServices(Array.isArray(servicesData) ? servicesData : []);
        setBarbers(Array.isArray(barbersData) ? barbersData : []);
      } catch {
        setError("No se pudo conectar con BarberFlow API.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAdminPage]);

  if (isAdminPage) {
    return <AdminPage />;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.25),_transparent_35%),radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),_transparent_30%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <nav className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-zinc-900 p-1.5 shadow-xl shadow-black/40 sm:h-32 sm:w-32 md:h-40 md:w-40">
                <img
                  src={logoBarberia}
                  alt="Logo de Nacho Barbershop"
                  className="h-full w-full rounded-2xl object-contain"
                />
              </div>

              <div>
                <p className="text-2xl font-black text-white">
                  Nacho Barbershop
                </p>

                <p className="text-sm text-zinc-300">
                  BarberFlow · Turnos inteligentes
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Hipólito Bouchard 2086
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center md:justify-end">
              <a
                href="#sobre"
                className="rounded-full border border-white/10 px-5 py-2 text-center text-sm font-semibold text-zinc-300 transition hover:bg-white/10"
              >
                Sobre
              </a>

              <a
                href="#galeria"
                className="rounded-full border border-white/10 px-5 py-2 text-center text-sm font-semibold text-zinc-300 transition hover:bg-white/10"
              >
                Galería
              </a>

              <a
                href="#testimonios"
                className="rounded-full border border-white/10 px-5 py-2 text-center text-sm font-semibold text-zinc-300 transition hover:bg-white/10"
              >
                Testimonios
              </a>

              <a
                href="#contacto"
                className="rounded-full border border-white/10 px-5 py-2 text-center text-sm font-semibold text-zinc-300 transition hover:bg-white/10"
              >
                Contacto
              </a>

              <a
                href="#faq"
                className="rounded-full border border-white/10 px-5 py-2 text-center text-sm font-semibold text-zinc-300 transition hover:bg-white/10"
              >
                FAQ
              </a>

              <a
                href="#reservar"
                className="rounded-full bg-white px-5 py-2 text-center text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                Reservar
              </a>

              <a
                href="/admin"
                className="rounded-full border border-purple-500/40 px-5 py-2 text-center text-sm font-semibold text-purple-300 transition hover:bg-purple-500/10"
              >
                Panel interno
              </a>
            </div>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
                <Sparkles size={16} />
                API real conectada a NestJS + PostgreSQL
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
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
                    <p className="text-sm text-zinc-400">
                      Estado del sistema
                    </p>

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

      <AboutSection />

      <GallerySection />

      <TestimonialsSection />

      <ContactSection />

      <FaqSection />

      <ServicesSection services={services} loading={loading} error={error} />

      <BarbersSection barbers={barbers} loading={loading} error={error} />

      <HowItWorks />

      <section id="reservar" className="mx-auto max-w-6xl px-6 py-16">
        <BookingForm services={services} barbers={barbers} />
        <MyAppointments />
      </section>

      <Footer />

      <div className="mx-auto max-w-6xl px-6 pb-8">
        <a
          href="/admin"
          className="text-xs text-zinc-600 transition hover:text-purple-400"
        >
          Acceso interno
        </a>
      </div>

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

export default App;