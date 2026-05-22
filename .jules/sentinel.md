# Sentinel's Security Journal

## 2025-05-15 - Addressing IDOR and Authentication Gaps
**Vulnerability:** IDOR in `/api/campaigns` and unauthenticated access to `/api/generate-images`.
**Learning:** The application was relying on client-provided `userId` in API requests without server-side verification against the session. Additionally, some resource-intensive endpoints like image generation were completely unprotected.
**Prevention:** Always derive `userId` from a secure, server-side session. Ensure all API endpoints that consume external credits or access user data require authentication.
