import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { Session, User } from '@/types/auth.types';

const SECRET_KEY = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createSession(user: User): Promise<string> {
    const expiresAt = Date.now() + SESSION_DURATION;

    const token = await new SignJWT({ user, expiresAt })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(SECRET_KEY);

    return token;
}

export async function verifySession(token: string): Promise<Session | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);

        if (!payload.user || !payload.expiresAt) {
            return null;
        }

        const session = payload as unknown as Session;

        if (Date.now() > session.expiresAt) {
            return null;
        }

        return session;
    } catch (error) {
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
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_DURATION / 1000,
        path: '/',
    });
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
