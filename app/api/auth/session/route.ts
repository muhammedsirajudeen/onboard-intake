import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { withLoggingAndErrorHandling } from '@/app/api/middleware/errorHandler';
import RouteError from '@/app/api/error/routeError';

async function handler() {
    const session = await getSession();

    if (!session) {
        throw new RouteError('Not authenticated', 401);
    }

    return NextResponse.json({
        user: session.user,
    });
}

export const GET = withLoggingAndErrorHandling(handler);
