## 2025-05-14 - IDOR Vulnerability in Campaigns API
**Vulnerability:** Insecure Direct Object Reference (IDOR) in `/api/campaigns`. The endpoint accepted a `userId` query parameter and returned campaigns for that user without verifying the requester's identity.
**Learning:** The application was mixing client-side `localStorage` authentication with server-side API calls. This led to a pattern where the frontend passed its known `userId` to the API, which the API trusted blindly.
**Prevention:** Always retrieve user identity from a secure, server-verified session (e.g., Supabase session cookies) in API routes. Avoid passing user identifiers in request parameters when they can be derived from the authenticated session.
