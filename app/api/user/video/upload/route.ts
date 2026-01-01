import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { withLoggingAndErrorHandling } from '@/app/api/middleware/errorHandler';
import RouteError from '@/app/api/error/routeError';
import User from '@/app/models/user.model';
import connectDB from '@/lib/mongodb';
import { uploadVideoToS3 } from '@/lib/s3';

// POST /api/user/video/upload - Upload video to S3
async function postHandler(request: NextRequest) {
    const session = await getSession();

    if (!session) {
        throw new RouteError('Not authenticated', 401);
    }

    try {
        // Get the video blob from the request
        const formData = await request.formData();
        const videoFile = formData.get('video') as File;

        if (!videoFile) {
            throw new RouteError('No video file provided', 400);
        }

        // Convert File to Buffer
        const arrayBuffer = await videoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to S3
        const videoUrl = await uploadVideoToS3(buffer, session.user.email);

        console.log('✅ Video uploaded to S3:', videoUrl);

        // Update user record
        await connectDB();

        console.log('📝 Updating user record for:', session.user.email);

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                $set: {
                    videoUrl,
                    videoRecorded: true,
                    videoRecordedAt: new Date(),
                },
            },
            { new: true }
        ).select('name email videoUrl videoRecorded videoRecordedAt');

        if (!user) {
            console.error('❌ User not found:', session.user.email);
            throw new RouteError('User not found', 404);
        }

        console.log('✅ User record updated:', {
            email: user.email,
            videoRecorded: user.videoRecorded,
            videoUrl: user.videoUrl,
            videoRecordedAt: user.videoRecordedAt
        });

        return NextResponse.json({
            success: true,
            message: 'Video uploaded successfully',
            videoUrl,
            user: {
                name: user.name,
                email: user.email,
                videoUrl: user.videoUrl,
                videoRecorded: user.videoRecorded,
                videoRecordedAt: user.videoRecordedAt,
            },
        });
    } catch (error: any) {
        console.error('Video upload error:', error);
        throw new RouteError(
            error.message || 'Failed to upload video',
            error.statusCode || 500
        );
    }
}

export const POST = withLoggingAndErrorHandling(postHandler);
