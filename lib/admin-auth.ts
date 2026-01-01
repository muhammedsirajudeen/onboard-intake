import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import env from '@/app/utils/env.config';

const ADMIN_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function verifyAdminPassword(password: string): Promise<boolean> {
    // Direct password comparison (password stored in env)
    // In production, you should use bcrypt.compare with a hashed password
    return password === env.ADMIN_PASSWORD;
}

export async function createAdminSession(): Promise<void> {
    const cookieStore = await cookies();

    cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ADMIN_SESSION_DURATION / 1000,
        path: '/',
    });
}

export async function verifyAdminSession(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');

    return session?.value === 'authenticated';
}

export async function clearAdminSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
}
