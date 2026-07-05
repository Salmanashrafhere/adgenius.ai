## 2025-05-14 - Optimized Campaigns API and Dashboard Load
**Learning:** Sequential aggregate queries in API routes can be a bottleneck, but simply wrapping them in `Promise.all` without robust error handling can lead to fragile 500 errors if one part of the complex query fails or times out.
**Action:** Always provide defensive defaults and `.catch()` handlers for secondary statistics queries in API routes to ensure the primary data can still be returned even if optional metrics fail.
