# Sentinel Security Journal

## 2025-05-15 - IDOR in API Routes via client-provided User IDs
**Vulnerability:** API endpoints (`/api/campaigns`, `/api/generate`) were relying on `userId` provided in query params or request body without verifying it against the authenticated session.
**Learning:** Authenticated users could potentially access or create data for any other user by simply changing the `userId` in the request.
**Prevention:** Always retrieve the user ID from the server-side session (e.g., using `@supabase/ssr`) instead of trusting client-provided identifiers.
