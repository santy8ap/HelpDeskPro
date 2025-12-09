/**
 * Script de Seed para HelpDeskPro
 * 
 * Este script crea datos de prueba en la base de datos.
 * 
 * Uso:
 * 1. Asegúrate de tener MongoDB corriendo
 * 2. Configura MONGODB_URI en .env.local
 * 3. Ejecuta: npx tsx scripts/seed.ts
 * 
 * Nota: Requiere instalar tsx: npm install -D tsx
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Configuración de MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk-pro';

// Schemas
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
}, { timestamps: true });

const TicketSchema = new mongoose.Schema({
    title: String,
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: String,
    priority: String,
}, { timestamps: true });

const CommentSchema = new mongoose.Schema({
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
}, { timestamps: { createdAt: true, updatedAt: false } });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

async function seed() {
    try {
        console.log('🌱 Conectando a MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Limpiar datos existentes (opcional - comenta si no quieres borrar)
        console.log('🗑️  Limpiando datos existentes...');
        await User.deleteMany({});
        await Ticket.deleteMany({});
        await Comment.deleteMany({});

        // Crear usuarios
        console.log('👥 Creando usuarios...');
        const hashedPassword = await bcrypt.hash('123456', 10);

        const agent1 = await User.create({
            name: 'María García',
            email: 'agente1@helpdesk.com',
            password: hashedPassword,
            role: 'agent',
        });

        const agent2 = await User.create({
            name: 'Carlos López',
            email: 'agente2@helpdesk.com',
            password: hashedPassword,
            role: 'agent',
        });

        const client1 = await User.create({
            name: 'Juan Pérez',
            email: 'cliente1@test.com',
            password: hashedPassword,
            role: 'client',
        });

        const client2 = await User.create({
            name: 'Ana Martínez',
            email: 'cliente2@test.com',
            password: hashedPassword,
            role: 'client',
        });

        const client3 = await User.create({
            name: 'Pedro Sánchez',
            email: 'cliente3@test.com',
            password: hashedPassword,
            role: 'client',
        });

        console.log('✅ Usuarios creados');

        // Crear tickets
        console.log('🎫 Creando tickets...');

        const ticket1 = await Ticket.create({
            title: 'No puedo iniciar sesión en el sistema',
            description: 'He intentado recuperar mi contraseña varias veces pero no recibo el correo de recuperación.',
            createdBy: client1._id,
            assignedTo: agent1._id,
            status: 'in_progress',
            priority: 'high',
        });

        const ticket2 = await Ticket.create({
            title: 'Error al cargar el dashboard',
            description: 'Cuando ingreso al dashboard aparece un error 500 y no puedo ver mis datos.',
            createdBy: client1._id,
            status: 'open',
            priority: 'high',
        });

        const ticket3 = await Ticket.create({
            title: 'Solicitud de nueva funcionalidad',
            description: 'Me gustaría poder exportar mis reportes a PDF.',
            createdBy: client2._id,
            assignedTo: agent2._id,
            status: 'open',
            priority: 'low',
        });

        const ticket4 = await Ticket.create({
            title: 'La página carga muy lento',
            description: 'Desde hace unos días la aplicación está muy lenta, tarda mucho en cargar.',
            createdBy: client2._id,
            assignedTo: agent1._id,
            status: 'resolved',
            priority: 'medium',
        });

        const ticket5 = await Ticket.create({
            title: 'No aparece mi usuario en el listado',
            description: 'Creé un usuario nuevo pero no aparece en mi listado de usuarios.',
            createdBy: client3._id,
            status: 'closed',
            priority: 'medium',
        });

        const ticket6 = await Ticket.create({
            title: 'Necesito ayuda con la configuración',
            description: 'Soy nuevo en la plataforma y necesito ayuda para configurar mi perfil y preferencias.',
            createdBy: client3._id,
            assignedTo: agent2._id,
            status: 'in_progress',
            priority: 'low',
        });

        console.log('✅ Tickets creados');

        // Crear comentarios
        console.log('💬 Creando comentarios...');

        await Comment.create({
            ticketId: ticket1._id,
            author: agent1._id,
            message: 'Hola Juan, estoy revisando el problema con el correo de recuperación. ¿Podrías confirmarme el email que estás usando?',
        });

        await Comment.create({
            ticketId: ticket1._id,
            author: client1._id,
            message: 'Claro, estoy usando juan.perez@example.com',
        });

        await Comment.create({
            ticketId: ticket1._id,
            author: agent1._id,
            message: 'Perfecto, ya envié un correo de prueba. ¿Lo recibiste?',
        });

        await Comment.create({
            ticketId: ticket4._id,
            author: agent1._id,
            message: 'Hemos optimizado el servidor, debería cargar más rápido ahora. Por favor confirma si se solucionó.',
        });

        await Comment.create({
            ticketId: ticket4._id,
            author: client2._id,
            message: '¡Excelente! Ahora carga mucho más rápido. Gracias!',
        });

        await Comment.create({
            ticketId: ticket6._id,
            author: agent2._id,
            message: 'Bienvenido Pedro. Te enviaré un manual de configuración por correo. Cualquier duda me avisas.',
        });

        console.log('✅ Comentarios creados');

        // Resumen
        console.log('\n📊 Resumen de datos creados:');
        console.log('👥 Usuarios:');
        console.log('   - 2 Agentes (password: 123456)');
        console.log('     • agente1@helpdesk.com');
        console.log('     • agente2@helpdesk.com');
        console.log('   - 3 Clientes (password: 123456)');
        console.log('     • cliente1@test.com');
        console.log('     • cliente2@test.com');
        console.log('     • cliente3@test.com');
        console.log('🎫 Tickets: 6');
        console.log('💬 Comentarios: 6');
        console.log('\n✨ Seed completado exitosamente!');

    } catch (error) {
        console.error('❌ Error en seed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
    }
}

seed();
