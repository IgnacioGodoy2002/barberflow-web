import { useEffect, useRef, useState } from "react";
import "./App.css";
import { API_URL } from "./config/api";
import type { ApiStatus, Barber, SelectionRequest, Service } from "./types";
import { AdminPage } from "./pages/AdminPage";
import { SiteHeader } from "./components/SiteHeader";
import { HeroSection } from "./components/HeroSection";
import { ServicesSection } from "./components/ServicesSection";
import { GallerySection } from "./components/GallerySection";
import { BarbersSection } from "./components/BarbersSection";
import { HowItWorks } from "./components/HowItWorks";
import { BookingForm } from "./components/BookingForm";
import { MyAppointments } from "./components/MyAppointments";
import { AboutSection } from "./components/AboutSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { FaqSection } from "./components/FaqSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { CustomCursor } from "./components/motion/CustomCursor";
import { ScrollProgress } from "./components/motion/ScrollProgress";
import { MouseGradient } from "./components/motion/MouseGradient";
import { useScrollReveal } from "./components/motion/useScrollReveal";

/** El backend gratis de Render se duerme: si tarda más de esto, avisamos. */
const WAKING_DELAY_MS = 4000;

async function fetchCatalog(): Promise<{ services: Service[]; barbers: Barber[] }> {
  const [servicesResponse, barbersResponse] = await Promise.all([
    fetch(`${API_URL}/v1/services`),
    fetch(`${API_URL}/v1/barbers`),
  ]);

  if (!servicesResponse.ok || !barbersResponse.ok) {
    throw new Error("No se pudieron cargar los datos");
  }

  const [servicesData, barbersData] = await Promise.all([
    servicesResponse.json(),
    barbersResponse.json(),
  ]);

  return {
    services: Array.isArray(servicesData) ? servicesData : [],
    barbers: Array.isArray(barbersData) ? barbersData : [],
  };
}

function App() {
  const isAdminPage = window.location.pathname.startsWith("/admin");

  if (isAdminPage) {
    return (
      <>
        <CustomCursor />
        <AdminPage />
      </>
    );
  }

  return <PublicSite />;
}

function PublicSite() {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [status, setStatus] = useState<ApiStatus>("loading");

  const [serviceRequest, setServiceRequest] = useState<SelectionRequest | null>(null);
  const [barberRequest, setBarberRequest] = useState<SelectionRequest | null>(null);
  const nonce = useRef(0);

  useScrollReveal();

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const wakingTimer = window.setTimeout(() => {
      if (!cancelled) setStatus((current) => (current === "loading" ? "waking" : current));
    }, WAKING_DELAY_MS);

    fetchCatalog()
      .then(({ services: nextServices, barbers: nextBarbers }) => {
        if (cancelled) return;
        setServices(nextServices);
        setBarbers(nextBarbers);
        setStatus("online");
      })
      .catch(() => {
        if (!cancelled) setStatus("offline");
      })
      .finally(() => window.clearTimeout(wakingTimer));

    return () => {
      cancelled = true;
      window.clearTimeout(wakingTimer);
    };
  }, [reloadKey]);

  function retry() {
    setStatus("loading");
    setReloadKey((key) => key + 1);
  }

  function scrollToBooking() {
    window.setTimeout(() => {
      document.getElementById("reservar")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  function handleSelectService(serviceId: string) {
    nonce.current += 1;
    setServiceRequest({ id: serviceId, nonce: nonce.current });
    scrollToBooking();
  }

  function handleSelectBarber(barberId: string) {
    nonce.current += 1;
    setBarberRequest({ id: barberId, nonce: nonce.current });
    scrollToBooking();
  }

  const loading = status === "loading" || status === "waking";
  const error = status === "offline" ? "No se pudo conectar con BarberFlow API." : "";

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <a
        href="#main-content"
        className="fixed left-4 top-[-80px] z-[70] rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white focus:top-4"
      >
        Saltar al contenido
      </a>

      <main id="main-content" className="min-h-screen overflow-x-clip bg-zinc-950 text-white">
        <div className="relative overflow-hidden">
          <MouseGradient />
          <SiteHeader />
          <HeroSection
            status={status}
            services={services}
            barbers={barbers}
            onRetry={retry}
          />
        </div>

        <ServicesSection
          services={services}
          loading={loading}
          waking={status === "waking"}
          error={error}
          onRetry={retry}
          onSelectService={handleSelectService}
        />

        <GallerySection />

        <BarbersSection
          barbers={barbers}
          loading={loading}
          error={error}
          onRetry={retry}
          onSelectBarber={handleSelectBarber}
        />

        <HowItWorks />

        <section id="reservar" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16">
          <BookingForm
            services={services}
            barbers={barbers}
            serviceRequest={serviceRequest}
            barberRequest={barberRequest}
          />

          <MyAppointments />
        </section>

        <AboutSection />

        <TestimonialsSection />

        <FaqSection />

        <ContactSection />
      </main>

      <Footer />

      <WhatsAppButton />
    </>
  );
}

export default App;
