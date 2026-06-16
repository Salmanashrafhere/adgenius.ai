## 2026-06-16 - Keyboard Shortcuts with Visual Cues
**Learning:** Pairing keyboard shortcuts (like `/` for search) with discoverable visual cues (like a `<kbd>` hint) significantly improves power-user efficiency without increasing the learning curve for new users.
**Action:** Always include a subtle visual indicator when implementing global keyboard shortcuts to make them discoverable.

## 2026-06-16 - Consistent Session Termination
**Learning:** Relying solely on client-side navigation for logout can leave stale user data in `localStorage`, leading to inconsistent UI states (e.g., Header showing user data after redirect).
**Action:** Ensure all logout triggers explicitly clear session-related keys from local storage before redirecting.
