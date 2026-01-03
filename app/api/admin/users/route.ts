import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';
import { withLoggingAndErrorHandling } from '@/app/api/middleware/errorHandler';
import RouteError from '@/app/api/error/routeError';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/user.model';
import { getPresignedUrlFromKey } from '@/lib/s3';

async function getHandler(request: NextRequest) {
    // Verify admin session
    const isAdmin = await verifyAdminSession();

    if (!isAdmin) {
        throw new RouteError('Unauthorized', 401);
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    await connectDB();

    // Build search query
    const query = search
        ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ],
        }
        : {};

    // Get total count
    const total = await User.countDocuments(query);

    // Get paginated users
    const users = await User.find(query)
        .select('name email picture socialLinks audioUrl audioRecorded audioRecordedAt profileCompleted hireableStatus strengths weaknesses createdAt emailSent emailSentAt isBeginnerLevel')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    // Generate presigned URLs for audio files
    const usersWithPresignedUrls = await Promise.all(
        users.map(async (user) => {
            if (user.audioUrl) {
                try {
                    // Generate presigned URL
                    const presignedUrl = await getPresignedUrlFromKey(user.audioUrl);
                    return { ...user, audioUrl: presignedUrl };
                } catch (error) {
                    console.error('Error generating presigned URL for user:', user.email, error);
                    return user;
                }
            }
            return user;
        })
    );

    return NextResponse.json({
        success: true,
        users: usersWithPresignedUrls,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    });
}

export const GET = withLoggingAndErrorHandling(getHandler);
