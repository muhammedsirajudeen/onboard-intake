import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/admin-auth';
import { withLoggingAndErrorHandling } from '@/app/api/middleware/errorHandler';

async function postHandler() {
    await clearAdminSession();

    return NextResponse.json({
        success: true,
        message: 'Logged out successfully',
    });
}

export const POST = withLoggingAndErrorHandling(postHandler);
