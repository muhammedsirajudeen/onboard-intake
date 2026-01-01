import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import env from '@/app/utils/env.config';

// Initialize S3 Client
const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

/**
 * Upload video to S3
 * @param videoBuffer - Video file buffer
 * @param userEmail - User's email (used for S3 key)
 * @returns S3 URL of uploaded video
 */
export async function uploadVideoToS3(videoBuffer: Buffer, userEmail: string): Promise<string> {
    const key = `${userEmail}/video.mp4`;

    const command = new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
        Body: videoBuffer,
        ContentType: 'video/mp4',
    });

    await s3Client.send(command);

    // Return the S3 URL
    return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
}

/**
 * Get signed URL for video (valid for 1 hour)
 * @param userEmail - User's email
 * @returns Signed URL for video access
 */
export async function getVideoUrl(userEmail: string): Promise<string> {
    const key = `${userEmail}/video.mp4`;

    const command = new GetObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
    });

    // Generate signed URL valid for 1 hour
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
}

/**
 * Delete video from S3
 * @param userEmail - User's email
 */
export async function deleteVideo(userEmail: string): Promise<void> {
    const key = `${userEmail}/video.mp4`;

    const command = new DeleteObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
    });

    await s3Client.send(command);
}
