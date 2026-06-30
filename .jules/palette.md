## 2025-05-14 - Multi-platform Keyboard Shortcuts
**Learning:** Detecting Mac-based systems using `navigator.userAgent` and managing a `mounted` state in Next.js is essential to prevent hydration mismatches while providing platform-accurate keyboard hints (⌘ vs Ctrl).
**Action:** Use a `mounted` boolean state in a `useEffect` hook to gate browser-specific UI like keyboard hints.

## 2025-05-14 - Global Keyboard Navigation
**Learning:** Standard shortcuts like `Cmd/Ctrl+K` for search and `Escape` for closing menus are highly expected by power users and significantly improve the "feel" of a SaaS application.
**Action:** Implement these globally in a layout component (like Header) to ensure consistent behavior across the app.
