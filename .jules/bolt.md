## 2025-05-15 - API Payload Optimization via Selective Selection

**Learning:** Large JSON payloads containing unused nested data (like full `ad_creatives` arrays in list views) significantly impact perceived performance and network transfer. Implementing a `full=false` mode in the API that uses server-side derived counts (`adsCount`) instead of sending raw child objects reduces payload size by ~80% while maintaining UI functionality.

**Action:** Always provide a lightweight selection mode for list APIs and use `select('id, name, ...child(id)')` to get counts efficiently without transferring full nested records.

## 2025-05-15 - Redundant State and Logic in Shared Components

**Learning:** Duplicating global UI logic (like notifications) across multiple page components and a shared header leads to inconsistent state, higher memory usage, and redundant event listeners (e.g., `mousedown` for closing dropdowns).

**Action:** Centralize global UI state and logic in the most appropriate shared component (like `Header.js`) and utilize `localStorage` for simple persistence to ensure a single source of truth across navigation.
