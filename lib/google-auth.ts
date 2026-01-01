import type { User } from '@/types/auth.types';

interface GoogleTokenPayload {
    sub: string;
    email: string;
    name: string;
    picture?: string;
    email_verified: boolean;
}

export async function verifyGoogleToken(token: string): Promise<User | null> {
    try {
        // Verify token with Google's tokeninfo endpoint
        const response = await fetch(
            `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
        );

        if (!response.ok) {
            return null;
        }

        const payload: GoogleTokenPayload = await response.json();

        // Verify email is verified
        if (!payload.email_verified) {
            return null;
        }

        return {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
        };
    } catch (error) {
        console.error('Error verifying Google token:', error);
        return null;
    }
}
