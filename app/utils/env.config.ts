interface Env {
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
}

const env: Env = {
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!
}

export default env