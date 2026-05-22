## 2025-05-14 - [Search Shortcut & A11y]
**Learning:** Adding a keyboard shortcut (`/`) for search significantly improves power-user efficiency. Combined with a visual `<kbd>` hint, it remains discoverable for all users. Consistent `Escape` key handling across dropdowns/modals is a standard UX expectation that reduces interaction friction.
**Action:** Always include a visual hint for keyboard shortcuts and ensure `keydown` listeners for `Escape` are implemented for all toggled UI elements.
