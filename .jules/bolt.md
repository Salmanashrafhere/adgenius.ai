## 2024-06-09 - Structural Backward Compatibility in API Optimizations
**Learning:** When optimizing API routes to reduce payload size (e.g., by flattening joins or pre-calculating counts), it is critical to ensure that the response structure remains backward compatible with existing frontend logic that expects specific fields (like `adsCount`).
**Action:** Always verify that mapped response objects include all fields used by the frontend and avoid accidentally breaking data contracts during mapping.
