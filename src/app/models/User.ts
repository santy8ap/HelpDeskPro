import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from '@/app/types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            required: [true, 'El nombre es requerido'],
            trim: true,
            minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        },
        email: {
            type: String,
            required: [true, 'El email es requerido'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
        },
        password: {
            type: String,
            required: [true, 'La contraseña es requerida'],
            minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
            select: false,
        },
        role: {
            type: String,
            enum: ['client', 'agent'] as UserRole[],
            default: 'client',
        },
    },
    {
        timestamps: true,
    }
);

// Hash password antes de guardar
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    try {
        if (!this.password) return;
        const salt = await bcrypt.genSalt(10);
        this.password = (await bcrypt.hash(this.password, salt)) as any;
    } catch (error: any) {
        throw error;
    }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Evitar recompilación del modelo
const User: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;