## 2025-05-15 - API Optimization with Aggregate Statistics
**Learning:** When optimizing list APIs with `limit` and field selection, it's easy to break UI components that rely on the full list length for statistics (e.g., "Total Items" count).
**Action:** Always return explicit aggregate statistics (like `totalCount`) from the server when implementing pagination or limiting, so the client can display accurate summary data without fetching the entire dataset.
