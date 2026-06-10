## 2025-05-14 - Optimized Campaigns API Payload
**Learning:** Selecting only the required fields from joined tables and pre-calculating counts on the server significantly reduces JSON payload size and improves response times for list views.
**Action:** Always prefer server-side aggregation and field selection for list APIs to minimize data transfer.
