## 2025-06-24 - IDOR Vulnerability in Campaign Fetching
**Vulnerability:** The `GET /api/campaigns` endpoint used a client-provided `userId` query parameter to filter campaigns, allowing any authenticated or unauthenticated user to access any other user's campaign data if they knew the target `userId`.
**Learning:** Relying on client-provided identifiers for sensitive data retrieval is a common source of Insecure Direct Object Reference (IDOR) vulnerabilities, especially when using administrative database clients that bypass Row Level Security (RLS).
**Prevention:** Always use server-side session verification to retrieve the authenticated user's identity and use that identity to filter data queries. Create a centralized server-side Supabase client helper to standardize this pattern.
