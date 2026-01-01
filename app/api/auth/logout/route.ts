import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';
import { withLoggingAndErrorHandling } from '@/app/api/middleware/errorHandler';

async function handler() {
    await clearSession();

    return NextResponse.json({
        success: true,
    });
}

export const POST = withLoggingAndErrorHandling(handler);
