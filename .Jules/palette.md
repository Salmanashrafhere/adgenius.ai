## 2025-05-14 - [Keyboard Accessibility for Menus]
**Learning:** Dropdown menus and notifications popovers should always be closable via the `Escape` key to provide a better experience for keyboard users.
**Action:** Implement a `keydown` listener for the `Escape` key in any component that manages a togglable UI element like a menu or modal.
