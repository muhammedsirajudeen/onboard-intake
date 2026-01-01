import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createAdminSession } from '@/lib/admin-auth';
import { withLoggingAndErrorHandling } from '@/app/api/middleware/errorHandler';
import RouteError from '@/app/api/error/routeError';

async function postHandler(request: NextRequest) {
    const { password } = await request.json();

    if (!password) {
        throw new RouteError('Password is required', 400);
    }

    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
        throw new RouteError('Invalid password', 401);
    }

    // Create admin session
    await createAdminSession();

    return NextResponse.json({
        success: true,
        message: 'Admin authenticated successfully',
    });
}

export const POST = withLoggingAndErrorHandling(postHandler);
