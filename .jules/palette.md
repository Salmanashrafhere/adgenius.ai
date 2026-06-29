## 2025-05-14 - Search Bar Accessibility & Keyboard Navigation
**Learning:** In Next.js, rendering platform-specific strings (like ⌘ vs Ctrl) based on `navigator.userAgent` causes hydration mismatches if done during initial render. Always use a `mounted` state to gate client-side only UI elements.
**Action:** Use a `useState(false)` and `useEffect(() => setMounted(true), [])` pattern to ensure browser-dependent strings only render after hydration.

## 2025-05-14 - Global Keyboard Listeners
**Learning:** Users expect `Escape` to close all open floating menus (notifications, user profiles) and `Cmd/Ctrl+K` for quick search access in SaaS dashboards.
**Action:** Implement centralized keyboard listeners in `Header.js` to manage global UI states like search focus and menu closures.
