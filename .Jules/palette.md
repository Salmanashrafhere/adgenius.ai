## 2025-05-22 - [Centralized Notification Management]
**Learning:** In a dashboard app where multiple components (Header, Dashboard, Sidebar) might need to reflect the same state (like unread counts), centralizing data fetching and management in a global layout component (like the Header) prevents UI sync issues and reduces code duplication.
**Action:** Always check if a new global state should be managed by the Header or a Context provider instead of individual pages to ensure consistency.

## 2025-05-22 - [Discoverable Shortcuts]
**Learning:** Keyboard shortcuts like '/' for search are powerful for power users but invisible to others. Adding a small `<kbd>` hint inside the input provides an "active learning" moment that improves UX without cluttering the UI.
**Action:** Pair custom keyboard shortcuts with subtle visual hints (like kbd tags) and ARIA attributes for screen reader awareness.
