interface Env {
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    MONGODB_URI: string
    AWS_SECRET_ACCESS_KEY: string
    AWS_ACCESS_KEY_ID: string
    AWS_REGION: string
    S3_BUCKET_NAME: string
    JWT_SECRET: string
    ADMIN_PASSWORD: string
    APP_PASSWORD: string
    GMAIL: string
}

const env: Env = {
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    MONGODB_URI: process.env.MONGODB_URI!,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
    AWS_REGION: process.env.AWS_REGION!,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME!,
    JWT_SECRET: process.env.JWT_SECRET!,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
    APP_PASSWORD: process.env.APP_PASSWORD!,
    GMAIL: process.env.GMAIL!,
}

export default env