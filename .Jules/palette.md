
## 2025-07-06 - Centralized Notifications and Search Enhancements
**Learning:** Redundant UI components (like a second notification bell) lead to inconsistent state and user confusion. Centralizing global UI elements in a shared layout component (Header) ensures a single source of truth and a cleaner interface.
**Action:** Always check if a feature being added to a specific page belongs in a global component instead.

## 2025-07-06 - Keyboard Shortcut Discoverability
**Learning:** Adding keyboard shortcuts (like ⌘K) significantly improves power-user UX, but they must be discoverable via visual hints (kbd tags) and OS-aware to avoid frustration.
**Action:** Use `navigator.userAgent` to detect OS for shortcut hints and gate with a `mounted` state to avoid hydration mismatches.
