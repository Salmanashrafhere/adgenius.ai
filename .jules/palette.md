## 2025-05-14 - OS-Aware Shortcut Hints
**Learning:** To prevent Next.js hydration mismatches when rendering platform-specific UI strings (e.g., Mac vs Windows keyboard shortcuts), use a `mounted` boolean state set to `true` inside a `useEffect` hook to gate the rendering of browser-dependent content.
**Action:** Always use `mounted` state pattern when rendering content that depends on `navigator.userAgent` or other client-side only APIs.

## 2025-05-14 - Centralized Global UI Elements
**Learning:** To avoid UI duplication and inconsistent state, global UI elements like the notifications bell are centralized in the shared `Header.js` component rather than being re-implemented in individual page views (e.g., `app/dashboard/page.js`).
**Action:** Audit page-specific implementations of global features and migrate them to common layout components like `Header` or `Sidebar` to ensure consistency.
