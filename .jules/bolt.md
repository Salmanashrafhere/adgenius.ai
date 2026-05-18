## 2025-05-14 - [API Payload Optimization]
**Learning:** Selecting only necessary columns and using limited related data (e.g., just IDs) significantly reduces payload size, improving LCP and TBT. However, always maintain backward compatibility by keeping expected keys, even if their values are minimized, to avoid breaking changes.
**Action:** Use explicit column selection in Supabase queries and map results to include helper properties like counts without removing the original related data arrays if they are part of the public API contract.
