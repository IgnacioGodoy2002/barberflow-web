# BarberFlow Web

Frontend profesional para BarberFlow, un sistema inteligente de turnos para barbería.

Este proyecto permite consultar servicios, ver barberos disponibles, revisar horarios en tiempo real e iniciar una reserva conectándose con la API de BarberFlow.

## Sitio online

Frontend:

https://barberflow-a0u8cix0l-ignaciogodoy2002s-projects.vercel.app/

Backend / Swagger:

https://barberflow-api-9feo.onrender.com/api/docs

## Funcionalidades

- Página principal moderna para barbería.
- Visualización de servicios desde la API.
- Visualización de barberos desde la API.
- Consulta de disponibilidad por servicio, barbero y fecha.
- Inicio de sesión como cliente.
- Confirmación de turno desde la web.
- Conexión real con backend NestJS desplegado en Render.
- Diseño responsive con React, TypeScript y Tailwind CSS.

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Fetch API
- Vercel

## Backend conectado

Este frontend consume la API REST de BarberFlow desarrollada con:

- NestJS
- TypeScript
- PostgreSQL
- Prisma
- JWT
- Swagger
- Render
- Neon

Repositorio del backend:

https://github.com/IgnacioGodoy2002/barberflow-api

## Variables de entorno

Crear un archivo `.env` basado en `.env.example`:

```env
VITE_API_URL=https://barberflow-api-9feo.onrender.com