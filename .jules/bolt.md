## 2025-05-14 - Payload Reduction and Server-Side Mapping

**Learning:** Selecting specific fields and only IDs for joined tables in Supabase queries can reduce payload size by 60-90%. Providing a server-side `adsCount` property allows the frontend to display counts without fetching full related objects, improving initial load speed and reducing memory consumption.

**Action:** Always prefer selective field queries for list views. Use server-side mapping to provide summary data (like counts) instead of sending full nested arrays when they aren't fully needed on the client.
