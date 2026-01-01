import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { Session, User } from '@/types/auth.types';
import env from '@/app/utils/env.config';

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const SESSION_DURATION_SECONDS = SESSION_DURATION / 1000; // 7 days in seconds

export async function createSession(user: User): Promise<string> {
    const expiresAt = Date.now() + SESSION_DURATION;

    const payload = {
        user,
        expiresAt,
    };

    const token = jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: SESSION_DURATION_SECONDS,
        subject: user.id,
        algorithm: 'HS256',
    });

    return token;
}

export async function verifySession(token: string): Promise<Session | null> {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET, {
            algorithms: ['HS256'],
        }) as Session;

        if (!decoded.user || !decoded.expiresAt) {
            return null;
        }

        // Check if session has expired
        if (Date.now() > decoded.expiresAt) {
            return null;
        }

        return decoded;
    } catch (error) {
        console.error('Session verification failed:', error);
        return null;
    }
}

export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) {
        return null;
    }

    return verifySession(token);
}

export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();

    cookieStore.set('session', token, {
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'lax', // CSRF protection
        maxAge: SESSION_DURATION_SECONDS,
        path: '/',
    });
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
