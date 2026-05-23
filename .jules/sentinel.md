# Sentinel Security Journal 🛡️

## 2025-05-23 - [CRITICAL] IDOR and Unauthorized Resource Consumption in API Routes
**Vulnerability:** Multiple API endpoints (`/api/campaigns`, `/api/generate`, `/api/generate-images`) were using client-supplied `userId` or lacked authentication entirely. This allowed attackers to access other users' data (IDOR) or trigger expensive AI generations on the server's dime.
**Learning:** The application initially relied on `localStorage` for authentication on the client-side and passed the `userId` to the backend. This is insecure as the backend must independently verify the user's identity via a secure session cookie.
**Prevention:** Always retrieve the `userId` from an authenticated server-side session (e.g., `supabase.auth.getUser()`) using a secure, HTTP-only cookie. Never trust a `userId` sent in a request body or query parameter for sensitive operations.
