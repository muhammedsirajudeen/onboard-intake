import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { withLoggingAndErrorHandling } from '@/app/api/middleware/errorHandler';
import RouteError from '@/app/api/error/routeError';
import User from '@/app/models/user.model';
import connectDB from '@/lib/mongodb';
import { uploadAudioToS3 } from '@/lib/s3';

// POST /api/user/audio/upload - Upload audio to S3
async function postHandler(request: NextRequest) {
    const session = await getSession();

    if (!session) {
        throw new RouteError('Not authenticated', 401);
    }

    try {
        // Get the audio blob from the request
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File;

        if (!audioFile) {
            throw new RouteError('No audio file provided', 400);
        }

        // Convert File to Buffer
        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to S3
        const audioUrl = await uploadAudioToS3(buffer, session.user.email);

        console.log('✅ Audio uploaded to S3:', audioUrl);

        // Update user record
        await connectDB();

        console.log('📝 Updating user record for:', session.user.email);

        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                $set: {
                    audioUrl,
                    audioRecorded: true,
                    audioRecordedAt: new Date(),
                },
            },
            { new: true }
        ).select('name email audioUrl audioRecorded audioRecordedAt');

        if (!user) {
            console.error('❌ User not found:', session.user.email);
            throw new RouteError('User not found', 404);
        }

        console.log('✅ User record updated:', {
            email: user.email,
            audioRecorded: user.audioRecorded,
            audioUrl: user.audioUrl,
            audioRecordedAt: user.audioRecordedAt
        });

        return NextResponse.json({
            success: true,
            message: 'Audio uploaded successfully',
            audioUrl,
            user: {
                name: user.name,
                email: user.email,
                audioUrl: user.audioUrl,
                audioRecorded: user.audioRecorded,
                audioRecordedAt: user.audioRecordedAt,
            },
        });
    } catch (error: any) {
        console.error('Audio upload error:', error);
        throw new RouteError(
            error.message || 'Failed to upload audio',
            error.statusCode || 500
        );
    }
}

export const POST = withLoggingAndErrorHandling(postHandler);
