## 2025-05-15 - [API Payload & Dashboard Memoization]
**Learning:** API routes performing large joins should favor server-side aggregation (e.g., `adsCount`) and minimize returned child arrays to essential fields (e.g., `id`) to reduce payload size. When implementing memoization in the frontend, ensure all necessary hooks (like `useMemo`) are explicitly imported to avoid ReferenceErrors during the build.
**Action:** Always verify API response size and structure for backward compatibility. Double-check imports when adding React hooks to a component.
