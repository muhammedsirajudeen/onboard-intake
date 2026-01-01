interface Env {
    GOOGLE_CLIENT_ID: string
}

const env: Env = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!
}

export default env