import mongoose from 'mongoose';
import env from '@/app/utils/env.config';

let isConnected = false;

export async function connectToDatabase() {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        const db = await mongoose.connect(env.MONGODB_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw new Error('Failed to connect to MongoDB');
    }
}

export default connectToDatabase;
