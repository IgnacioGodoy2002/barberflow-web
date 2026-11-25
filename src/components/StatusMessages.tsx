import { RefreshCw, WifiOff } from "lucide-react";

/** Cards "fantasma" mientras carga la API. */
export function SkeletonGrid({ count, className }: { count: number; className: string }) {
  return (
    <div className={className} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="skeleton mb-5 h-12 w-12 rounded-2xl" />
          <div className="skeleton h-6 w-2/3 rounded-lg" />
          <div className="skeleton mt-4 h-4 w-full rounded-lg" />
          <div className="skeleton mt-2 h-4 w-4/5 rounded-lg" />
          <div className="skeleton mt-6 h-11 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function ApiError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-200"
    >
      <WifiOff size={28} />
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-full border border-red-300/30 px-5 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/20"
      >
        <RefreshCw size={15} />
        Reintentar
      </button>
    </div>
  );
}
