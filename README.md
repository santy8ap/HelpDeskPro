# 🎫 HelpDeskPro

Sistema de gestión de tickets de soporte técnico desarrollado con **Next.js**, **TypeScript**, **MongoDB** y **Node.js**.

## 📋 Descripción

HelpDeskPro es una aplicación web que permite gestionar tickets de soporte de manera eficiente, centralizando la comunicación entre clientes y agentes.

## 🏗️ Arquitectura de Datos (ERD)

El sistema se basa en tres entidades principales relacionadas entre sí:

### 1. User (Usuario)
Representa a los actores del sistema (Clientes y Agentes).
- **_id**: ObjectId (PK)
- **name**: String
- **email**: String (Unique)
- **password**: String (Hashed)
- **role**: Enum ['client', 'agent']
- **createdAt**: Date

### 2. Ticket (Solicitud)
Representa un requerimiento de soporte.
- **_id**: ObjectId (PK)
- **title**: String
- **description**: String
- **status**: Enum ['open', 'in_progress', 'resolved', 'closed']
- **priority**: Enum ['low', 'medium', 'high']
- **createdBy**: ObjectId (Ref: User) -> El cliente que reporta
- **assignedTo**: ObjectId (Ref: User, Opcional) -> El agente encargado
- **createdAt**: Date
- **updatedAt**: Date

### 3. Comment (Comentario)
Representa el hilo de conversación de un ticket.
- **_id**: ObjectId (PK)
- **ticketId**: String (Ref: Ticket) -> Ticket al que pertenece
- **author**: String (Ref: User) -> Usuario que comenta
- **message**: String
- **createdAt**: Date

### 🔗 Relaciones
- **1 Usuario (Cliente)** puede crear **N Tickets**.
- **1 Usuario (Agente)** puede tener asignados **N Tickets**.
- **1 Ticket** puede tener **N Comentarios**.

---

## 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Autenticación**: JWT, bcryptjs, Context API
- **Emails**: Nodemailer (Gmail SMTP)
- **Cron Jobs**: Vercel Cron / node-cron

## 📦 Instalación y Despliegue

### Local
1. Clonar repositorio.
2. `npm install`
3. Configurar `.env.local` (ver `.env.example`).
4. `npm run dev`

### Despliegue en Vercel (Producción)
Este proyecto está optimizado para Vercel.

1. Sube tu código a GitHub.
2. Importa el proyecto en Vercel.
3. Configura las variables de entorno en Vercel (Settings -> Environment Variables):
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`...
   - `CRON_SECRET`
4. ¡Listo! Vercel detectará Next.js y desplegará automáticamente.

## 🧪 Funcionalidades (Happy Path)

1. **Login**: Ingresa como Cliente o Agente.
2. **Cliente**: Crea un ticket -> Recibe email de confirmación.
3. **Agente**: Ve el ticket -> Lo asigna -> Responde (Cliente recibe email).
4. **Cliente**: Ve la respuesta -> Responde de vuelta.
5. **Agente**: Cierra el ticket (Cliente recibe email de cierre).
6. **Sistema**: Si un ticket queda olvidado > 24h, el Cron Job avisa a los agentes.

---
Desarrollado para Prueba de Desempeño.
