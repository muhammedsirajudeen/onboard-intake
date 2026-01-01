import { NextRequest, NextResponse } from 'next/server';
import { verifyGoogleToken } from '@/lib/google-auth';
import { createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { credential } = await request.json();

        if (!credential) {
            return NextResponse.json(
                { error: 'Missing credential' },
                { status: 400 }
            );
        }

        // Verify the Google token
        const user = await verifyGoogleToken(credential);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        // Create session
        const sessionToken = await createSession(user);

        // Set session cookie
        await setSessionCookie(sessionToken);

        return NextResponse.json({
            success: true,
            user,
        });
    } catch (error) {
        console.error('Google auth error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}
