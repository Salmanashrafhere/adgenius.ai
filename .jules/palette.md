## 2025-05-15 - [Keyboard Navigation and ARIA Roles]
**Learning:** Global keyboard shortcuts (like Cmd/Ctrl+K) significantly improve the "pro" feel of a SaaS app, but must be accompanied by visual hints. When using `role="menuitem"`, it is critical to also include `role="menu"` on the parent container to satisfy accessibility requirements.
**Action:** Always pair accessibility roles correctly (menu/menuitem) and provide platform-aware keyboard hints using `navigator.platform` in a client-side `useEffect`.
