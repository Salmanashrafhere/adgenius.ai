# Bolt's Performance Journal

This journal tracks critical performance learnings, bottlenecks, and optimizations for the AdGenius SaaS platform.

## 2025-05-14 - Payload Reduction via Server-side Pre-calculation
**Learning:** Fetching all columns from related tables (e.g., `ad_creatives(*)`) for list views creates massive JSON payloads that slow down response serialization and client-side parsing. By selecting only the `id` and calculating the count on the server, we can reduce payload size significantly while maintaining functionality.
**Action:** Always prefer selecting only required fields and pre-calculating counts for high-traffic list views.
