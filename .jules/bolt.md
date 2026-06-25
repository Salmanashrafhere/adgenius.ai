## 2025-05-14 - API Payload Optimization and Pagination
**Learning:** Optimizing API routes by selecting only necessary fields (e.g., `id` from joined tables) and implementing a `limit` parameter can significantly reduce payload size and database load, especially for list views like the dashboard. Using a derived property like `adsCount` on the server simplifies client-side logic.
**Action:** When implementing list APIs, always consider payload size and provide a way to limit the number of returned results. Use defensive parsing for query parameters like `limit`.
