## 2025-05-14 - Payload Reduction via Field Selection

**Learning:** In scenarios where only the count of related records is needed for high-level UI (like lists or dashboard cards), fetching all fields from joined tables (e.g., `ad_creatives(*)`) causes significant and unnecessary overhead. Reducing this to only `id` and calculating the count on the server reduces JSON serialization time and network transmission size.

**Action:** Always prefer specific field selection or specialized count queries for list views, and keep full object fetching reserved for detail views.
