# JWT Authentication Security

## Overview

The application uses JWT (JSON Web Tokens) for secure, stateless authentication using the `jsonwebtoken` library. Tokens are stored in HTTP-only cookies to prevent XSS attacks.

## Dependencies

- **jsonwebtoken**: Standard JWT library for Node.js
- **@types/jsonwebtoken**: TypeScript type definitions

## Security Features

### 1. JWT Token Generation
- **Library**: `jsonwebtoken` (industry standard)
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Secret Key**: Loaded from `JWT_SECRET` environment variable
- **Token Lifetime**: 7 days
- **Claims**:
  - `user`: User information (id, email, name, picture)
  - `expiresAt`: Expiration timestamp
  - `exp`: Expiration time (7 days)
  - `sub`: Subject (user ID)

### 2. Cookie Security
- **httpOnly**: `true` - Prevents JavaScript access to the cookie
- **secure**: `true` in production - HTTPS only
- **sameSite**: `lax` - CSRF protection
- **maxAge**: 7 days
- **path**: `/` - Available across the entire application

### 3. Session Verification
- Validates JWT signature using the secret key
- Checks token expiration
- Verifies required claims (user, expiresAt)
- Logs verification failures for debugging

## Environment Variables Required

```env
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
```

> **IMPORTANT**: Use a strong, random secret key in production. Generate one using:
> ```bash
> openssl rand -base64 32
> ```

## Authentication Flow

### Sign In
1. User signs in with Google OAuth
2. Google token is verified
3. User is created/updated in MongoDB
4. JWT token is generated with user data
5. Token is stored in HTTP-only cookie
6. User is redirected based on completion status

### Protected Routes
1. API route checks for session cookie
2. JWT token is verified
3. If valid, request proceeds
4. If invalid/expired, 401 Unauthorized is returned

### Sign Out
1. Session cookie is deleted
2. User is redirected to sign-in page

## API Routes Protection

All protected API routes use the `getSession()` function:

```typescript
import { getSession } from '@/lib/auth';

async function handler() {
    const session = await getSession();
    
    if (!session) {
        throw new RouteError('Not authenticated', 401);
    }
    
    // Access user data
    const userId = session.user.id;
    const userEmail = session.user.email;
    
    // ... rest of handler
}
```

## Security Best Practices

### ✅ Implemented
- JWT tokens with strong secret key
- HTTP-only cookies (XSS protection)
- HTTPS in production (secure flag)
- SameSite cookie attribute (CSRF protection)
- Token expiration (7 days)
- Session verification on every request
- Error logging for debugging

### 🔒 Additional Recommendations
1. **Rotate JWT Secret**: Change `JWT_SECRET` periodically
2. **Monitor Failed Logins**: Track authentication failures
3. **Rate Limiting**: Add rate limiting to auth endpoints
4. **CORS Configuration**: Configure CORS properly for production
5. **Refresh Tokens**: Consider implementing refresh tokens for longer sessions

## Troubleshooting

### "Not authenticated" errors
- Check if `JWT_SECRET` is set in environment variables
- Verify the secret is the same across deployments
- Check if cookie is being set (browser DevTools → Application → Cookies)
- Ensure HTTPS is enabled in production

### Session expires too quickly
- Adjust `SESSION_DURATION` in `/lib/auth.ts`
- Current default: 7 days

### Cookie not being set
- Check `secure` flag matches your environment (HTTP vs HTTPS)
- Verify `sameSite` setting is compatible with your setup
- Check browser console for cookie errors
