## 2025-05-14 - Platform-Aware Keyboard Shortcuts
**Learning:** Users expect global shortcuts (like Cmd/Ctrl + K) for common actions, but visual hints must be platform-aware (⌘ on Mac, Ctrl on others) to avoid confusion. Additionally, custom dropdowns must implement 'Escape' to close to meet accessibility standards.
**Action:** Always detect platform in a `useEffect` and provide corresponding visual hints, and ensure keyboard listeners for modal/dropdown closures are globally registered.
