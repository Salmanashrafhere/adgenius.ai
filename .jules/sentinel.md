# Sentinel Journal

## 2025-05-14 - [Authentication gap in AI generation API]
**Vulnerability:** The `/api/generate-images` endpoint lacked authentication, allowing any client to trigger costly AI generation calls using Gemini and Hugging Face.
**Learning:** Even if a route doesn't directly manipulate database records (which would be a classic IDOR), it must be protected if it consumes resources or uses sensitive API keys. In Next.js with Supabase SSR, `supabase.auth.getUser()` is the preferred way to verify a session on the server.
**Prevention:** Always implement session-aware authentication checks in API routes that interact with external services or sensitive internal data, following the established `@supabase/ssr` pattern.
