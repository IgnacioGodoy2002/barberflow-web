# BarberFlow Web

Frontend profesional para BarberFlow, un sistema inteligente de turnos para barbería.

Este proyecto permite consultar servicios, ver barberos disponibles, revisar disponibilidad en tiempo real, registrar clientes, iniciar sesión, reservar turnos, consultar reservas propias y acceder a un panel interno de administración.

## Sitio online

Frontend:

[Ver demo online](https://barberflow-a0u8cix0l-ignaciogodoy2002s-projects.vercel.app/)

Backend / Swagger:

https://barberflow-api-9feo.onrender.com/api/docs

Repositorio backend:

https://github.com/IgnacioGodoy2002/barberflow-api

## Funcionalidades principales

- Landing page moderna para barbería.
- Visualización de servicios desde API.
- Visualización de barberos desde API.
- Consulta de disponibilidad por servicio, barbero y fecha.
- Registro de clientes.
- Inicio de sesión con JWT.
- Reserva de turnos online.
- Comprobante visual de turno confirmado.
- Sección “Mis turnos” para consultar reservas del cliente.
- Cancelación de turnos desde la web.
- Panel interno para administración de turnos.
- Botón flotante de WhatsApp.
- Footer profesional con enlaces rápidos.
- Favicon personalizado.
- Deploy online en Vercel.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Fetch API
- Vercel

## Backend conectado

Este frontend consume una API REST desarrollada con:

- NestJS
- TypeScript
- PostgreSQL
- Prisma
- JWT
- Swagger
- Render
- Neon

## Variables de entorno

Crear un archivo `.env` basado en `.env.example`:

```env
VITE_API_URL=https://barberflow-api-9feo.onrender.com
```

El proyecto también incluye una configuración de respaldo para producción en:

```text
src/config/api.ts
```

## Instalación local

```bash
npm install
npm run dev
```

En Windows PowerShell, si aparece un error de ejecución de scripts, usar:

```bash
npm.cmd install
npm.cmd run dev
```

## Build de producción

```bash
npm run build
```

En Windows PowerShell:

```bash
npm.cmd run build
```

## Estructura principal

```text
src/
├── assets/
├── components/
│   ├── AdminAppointments.tsx
│   ├── BookingForm.tsx
│   ├── Footer.tsx
│   ├── HowItWorks.tsx
│   ├── MyAppointments.tsx
│   └── WhatsAppButton.tsx
├── config/
│   └── api.ts
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## Autor

Ignacio Gabriel Godoy

Desarrollador Backend Jr.  
Proyecto personal desarrollado conectando experiencia real en barbería con desarrollo web fullstack.