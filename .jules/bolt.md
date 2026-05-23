## 2025-05-14 - API Payload Optimization & Backward Compatibility

**Learning:** When optimizing API routes by reducing the amount of data fetched (e.g., using specific column selection or minimizing related records), it's crucial to maintain backward compatibility for frontend consumers. Removing columns or changing the shape of the data (like replacing an array with a count) can break existing UI components.

**Action:** Prefer "minimized" arrays (e.g., returning only IDs) and adding derived fields (like `adsCount`) while preserving the original structure where possible to ensure performance gains don't come at the cost of stability. Always verify all consumers of an API before pruning its response.
