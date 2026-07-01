# Palette's Journal - Critical UX/Accessibility Learnings

## 2025-05-14 - Hydration-Safe Platform-Aware Keyboard Hints
**Learning:** Using browser-specific APIs like `navigator.userAgent` to render platform-specific keyboard shortcuts (e.g., ⌘K vs Ctrl K) can cause hydration mismatches in Next.js because the server-rendered HTML won't match the client-rendered one.
**Action:** Always gate the rendering of browser-dependent UI elements behind a `mounted` state that is set to `true` in a `useEffect` hook. This ensures the first render matches the server output, and the client-specific changes occur after mounting.
