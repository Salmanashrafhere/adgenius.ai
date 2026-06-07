## 2025-05-14 - IDOR in Campaigns API
**Vulnerability:** The `/api/campaigns` endpoint accepted a `userId` query parameter and used it to fetch data via `supabaseAdmin`, allowing any user to access another's campaigns.
**Learning:** Using `supabaseAdmin` bypasses Row Level Security (RLS), making manual session verification via `supabase.auth.getUser()` mandatory for any user-specific data retrieval. Relying on client-provided IDs in API routes is a classic BOLA/IDOR pattern.
**Prevention:** Always verify the user's identity server-side using secure session cookies and use the verified ID for database queries. Centralize the server-side Supabase client initialization to ensure consistent session handling.
