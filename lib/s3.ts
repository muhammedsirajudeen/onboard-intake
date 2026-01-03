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
 * Upload audio to S3
 * @param audioBuffer - Audio file buffer
 * @param userEmail - User's email (used for S3 key)
 * @returns S3 URL of uploaded audio
 */
export async function uploadAudioToS3(audioBuffer: Buffer, userEmail: string): Promise<string> {
    const key = `${userEmail}/audio.webm`;

    const command = new PutObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
        Body: audioBuffer,
        ContentType: 'audio/webm',
    });

    await s3Client.send(command);

    // Return the S3 URL
    return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
}

/**
 * Get signed URL for audio (valid for 1 hour)
 * @param userEmail - User's email
 * @returns Signed URL for audio access
 */
export async function getAudioUrl(userEmail: string): Promise<string> {
    const key = `${userEmail}/audio.webm`;

    const command = new GetObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
    });

    // Generate signed URL valid for 1 hour
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
}

/**
 * Get presigned URL from S3 key or URL
 * @param s3KeyOrUrl - S3 key or full S3 URL
 * @returns Presigned URL for access
 */
export async function getPresignedUrlFromKey(s3KeyOrUrl: string): Promise<string> {
    // Extract key from URL if full URL is provided
    let key = s3KeyOrUrl;
    if (s3KeyOrUrl.includes('amazonaws.com/')) {
        key = s3KeyOrUrl.split('amazonaws.com/')[1];
    }

    const command = new GetObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
    });

    // Generate signed URL valid for 1 hour
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
}

/**
 * Delete audio from S3
 * @param userEmail - User's email
 */
export async function deleteAudio(userEmail: string): Promise<void> {
    const key = `${userEmail}/audio.webm`;

    const command = new DeleteObjectCommand({
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
    });

    await s3Client.send(command);
}
