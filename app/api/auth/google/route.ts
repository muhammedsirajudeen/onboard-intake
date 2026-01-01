import { NextRequest, NextResponse } from 'next/server';
import { verifyGoogleToken } from '@/lib/google-auth';
import { createSession, setSessionCookie } from '@/lib/auth';
import { withLoggingAndErrorHandling } from '@/app/api/middleware/errorHandler';
import RouteError from '@/app/api/error/routeError';
import connectToDatabase from '@/lib/mongodb';
import User from '@/app/models/user.model';

async function handler(request: NextRequest) {
    const { credential } = await request.json();

    if (!credential) {
        throw new RouteError('Missing credential', 400);
    }

    // Verify the Google token
    const googleUser = await verifyGoogleToken(credential);

    if (!googleUser) {
        throw new RouteError('Invalid token', 401);
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Find or create user in database
    let user = await User.findOne({ googleId: googleUser.id });

    if (user) {
        // Update last login time
        user.lastLoginAt = new Date();
        await user.save();
    } else {
        // Create new user
        user = await User.create({
            googleId: googleUser.id,
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
            lastLoginAt: new Date(),
        });
    }

    // Create session with user data
    const sessionUser = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        picture: user.picture,
    };

    const sessionToken = await createSession(sessionUser);

    // Set session cookie
    await setSessionCookie(sessionToken);

    return NextResponse.json({
        success: true,
        user: sessionUser,
        profileCompleted: user.profileCompleted || false,
    });
}

export const POST = withLoggingAndErrorHandling(handler);
