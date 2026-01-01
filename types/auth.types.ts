export interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
}

export interface Session {
    user: User;
    expiresAt: number;
}

export interface GoogleCredentialResponse {
    credential: string;
    select_by?: string;
}
