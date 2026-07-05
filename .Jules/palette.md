## 2025-05-14 - Keyboard Shortcut Visibility & OS Detection
**Learning:** Keyboard shortcut hints (e.g., in the Header search bar) should ideally account for platform differences (Cmd vs Ctrl), as using only the Mac '⌘' symbol can be less clear for Windows/Linux users even if the underlying logic supports both.
**Action:** Use browser detection within a `useEffect` and gate the rendering with a `mounted` state to provide appropriate visual cues (⌘K vs Ctrl K) without causing Next.js hydration mismatches.
