export type Service = {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  bufferMinutes: number;
  price: string | number;
};

export type Barber = {
  id: string;
  displayName: string;
  bio?: string;
  services: {
    service: Service;
  }[];
};

/** Pedido de preselección desde una card. `nonce` permite repetir el mismo id. */
export type SelectionRequest = {
  id: string;
  nonce: number;
};

export type ApiStatus = "loading" | "waking" | "online" | "offline";

export function formatPrice(value: string | number) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return `$${value}`;
  }

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(numberValue);
}
