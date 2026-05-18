import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AdminPanel } from "../components/AdminPanel";

export function AdminPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-700/10 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <a
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={18} />
            Volver a la web
          </a>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-3 text-sm font-semibold text-purple-200">
            <ShieldCheck size={18} />
            Acceso interno
          </div>
        </div>

        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-purple-400">
            BarberFlow Admin
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl">
            Panel administrativo
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            Gestión interna de servicios, barberos, asignaciones y turnos de la
            barbería.
          </p>
        </div>

        <AdminPanel />
      </section>
    </main>
  );
}