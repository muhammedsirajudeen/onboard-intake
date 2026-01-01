import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { withLoggingAndErrorHandling } from '@/app/api/middleware/errorHandler';
import RouteError from '@/app/api/error/routeError';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/user.model';

async function patchHandler(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    // Verify admin session
    const isAdmin = await verifyAdminSession();

    if (!isAdmin) {
        throw new RouteError('Unauthorized', 401);
    }

    const { userId } = await params;
    const body = await request.json();
    const { hireableStatus, strengths, weaknesses } = body;

    console.log('📝 Updating user:', userId);
    console.log('📊 Update data:', { hireableStatus, strengths, weaknesses });

    if (!userId) {
        throw new RouteError('User ID is required', 400);
    }

    await connectDB();

    const updateData: any = {};

    if (hireableStatus !== undefined) {
        updateData.hireableStatus = hireableStatus;
    }

    if (strengths !== undefined) {
        updateData.strengths = strengths;
    }

    if (weaknesses !== undefined) {
        updateData.weaknesses = weaknesses;
    }

    console.log('💾 Applying updates:', updateData);

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
    ).select('name email hireableStatus strengths weaknesses');

    if (!user) {
        console.error('❌ User not found:', userId);
        throw new RouteError('User not found', 404);
    }

    console.log('✅ User updated successfully:', user);

    return NextResponse.json({
        success: true,
        user,
    });
}

export const PATCH = withLoggingAndErrorHandling(patchHandler);
