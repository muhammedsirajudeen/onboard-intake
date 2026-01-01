'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import env from './utils/env.config';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
            {children}
        </GoogleOAuthProvider>
    );
}
