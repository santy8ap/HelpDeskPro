import nodemailer from 'nodemailer';
import { ITicket, IUser, IComment } from '@/app/types';

// Configurar transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

// Enviar email genérico
async function sendEmail(options: EmailOptions): Promise<boolean> {
    try {
        await transporter.sendMail({
            from: `"HelpDeskPro" <${process.env.EMAIL_USER}>`,
            ...options,
        });
        console.log(`Email enviado a: ${options.to}`);
        return true;
    } catch (error) {
        console.error('Error enviando email:', error);
        return false;
    }
}

// Template base
function baseTemplate(content: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .badge-open { background: #dbeafe; color: #1d4ed8; }
        .badge-high { background: #fee2e2; color: #dc2626; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>HelpDeskPro</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>Este es un correo automático de HelpDeskPro. Por favor no responda a este email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Email: Ticket creado
export async function sendTicketCreatedEmail(ticket: ITicket, user: IUser): Promise<boolean> {
    const content = `
    <h2>¡Tu ticket ha sido creado exitosamente!</h2>
    <p>Hola <strong>${user.name}</strong>,</p>
    <p>Hemos recibido tu solicitud de soporte. Un agente la revisará pronto.</p>
    <br>
    <h3>Detalles del ticket:</h3>
    <ul>
      <li><strong>Título:</strong> ${ticket.title}</li>
      <li><strong>Descripción:</strong> ${ticket.description}</li>
      <li><strong>Prioridad:</strong> <span class="badge badge-${ticket.priority === 'high' ? 'high' : 'open'}">${ticket.priority}</span></li>
      <li><strong>Estado:</strong> <span class="badge badge-open">${ticket.status}</span></li>
    </ul>
    <br>
    <p>Te notificaremos cuando haya actualizaciones.</p>
    <br>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/tickets/${ticket._id}" class="button">Ver Ticket</a>
  `;

    return sendEmail({
        to: user.email,
        subject: `Ticket #${ticket._id.toString().slice(-6)} creado - ${ticket.title}`,
        html: baseTemplate(content),
    });
}

// Email: Respuesta de agente
export async function sendAgentResponseEmail(
    ticket: ITicket,
    user: IUser,
    comment: IComment,
    agentName: string
): Promise<boolean> {
    const content = `
    <h2>Respuesta a tu ticket</h2>
    <p>Hola <strong>${user.name}</strong>,</p>
    <p>El agente <strong>${agentName}</strong> ha respondido a tu ticket:</p>
    <br>
    <h3>Ticket: ${ticket.title}</h3>
    <div style="background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 15px 0;">
      <p><strong>Respuesta:</strong></p>
      <p>${comment.message}</p>
    </div>
    <br>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/tickets/${ticket._id}" class="button">Ver Conversación</a>
  `;

    return sendEmail({
        to: user.email,
        subject: `Nueva respuesta en ticket #${ticket._id.toString().slice(-6)}`,
        html: baseTemplate(content),
    });
}

// Email: Ticket cerrado
export async function sendTicketClosedEmail(ticket: ITicket, user: IUser): Promise<boolean> {
    const content = `
    <h2>Tu ticket ha sido cerrado</h2>
    <p>Hola <strong>${user.name}</strong>,</p>
    <p>Tu ticket ha sido marcado como <strong>cerrado</strong>.</p>
    <br>
    <h3>Ticket: ${ticket.title}</h3>
    <p>Esperamos que tu problema haya sido resuelto satisfactoriamente.</p>
    <br>
    <p>Si necesitas más ayuda, no dudes en crear un nuevo ticket.</p>
    <br>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/client" class="button">Ir a mi Panel</a>
  `;

    return sendEmail({
        to: user.email,
        subject: `Ticket #${ticket._id.toString().slice(-6)} cerrado`,
        html: baseTemplate(content),
    });
}

// Email: Recordatorio de ticket sin respuesta (para agentes)
export async function sendReminderEmail(ticket: ITicket, agent: IUser): Promise<boolean> {
    const content = `
    <h2>Recordatorio: Ticket sin respuesta</h2>
    <p>Hola <strong>${agent.name}</strong>,</p>
    <p>El siguiente ticket lleva más de 24 horas sin respuesta:</p>
    <br>
    <h3>Ticket: ${ticket.title}</h3>
    <ul>
      <li><strong>Prioridad:</strong> ${ticket.priority}</li>
      <li><strong>Estado:</strong> ${ticket.status}</li>
      <li><strong>Creado:</strong> ${new Date(ticket.createdAt).toLocaleString('es-ES')}</li>
    </ul>
    <br>
    <p>Por favor, atiende este ticket lo antes posible.</p>
    <br>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/agent/tickets/${ticket._id}" class="button">Atender Ticket</a>
  `;

    return sendEmail({
        to: agent.email,
        subject: `Recordatorio: Ticket #${ticket._id.toString().slice(-6)} sin respuesta`,
        html: baseTemplate(content),
    });
}

export default {
    sendTicketCreatedEmail,
    sendAgentResponseEmail,
    sendTicketClosedEmail,
    sendReminderEmail,
};