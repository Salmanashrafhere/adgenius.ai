## 2025-05-15 - API Payload Optimization and Backward Compatibility
**Learning:** When optimizing API routes by reducing payload size (e.g., removing nested relations), it is critical to maintain the expected data structure for frontend consumers. Simply removing a field or relation can break code that expects an array (e.g., `data.items.length`).
**Action:** Always provide a fallback or pre-calculated field (like `adsCount`) and maintain the expected type (e.g., an empty array `[]` instead of `null` or missing field) to ensure the UI remains functional without immediate frontend changes.
