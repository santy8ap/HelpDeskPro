import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🧪 Probando conexión a MongoDB...');
console.log(`📝 URI configurada: ${MONGODB_URI?.replace(/:([^:@]+)@/, ':****@')}`); // Ocultar password en logs

if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI no está definida en .env.local');
    process.exit(1);
}

if (MONGODB_URI.includes('cluster.mongodb.net')) {
    console.warn('⚠️  ADVERTENCIA: La URI parece genérica ("cluster.mongodb.net").');
    console.warn('   Debería ser algo como "cluster0.xyz12.mongodb.net"');
}

async function testConnection() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log('✅ ¡Conexión exitosa a MongoDB!');
        console.log(`📊 Base de datos: ${mongoose.connection.name}`);
        console.log(`🔌 Host: ${mongoose.connection.host}`);

        await mongoose.connection.close();
        console.log('👋 Conexión cerrada correctamente');
        process.exit(0);
    } catch (error: any) {
        console.error('❌ Error de conexión:');
        console.error(error.message);

        if (error.code === 'ENOTFOUND') {
            console.error('\n💡 PISTA: El host no se encuentra. Verifica que el nombre del cluster en la URI sea correcto.');
        } else if (error.code === 'bad auth') {
            console.error('\n💡 PISTA: Error de autenticación. Verifica tu usuario y contraseña.');
        }

        process.exit(1);
    }
}

testConnection();
