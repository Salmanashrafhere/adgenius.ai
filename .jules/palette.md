## 2025-01-24 - [Keyboard Accessibility & Discoverability]
**Learning:** Global keyboard shortcuts (like Cmd/Ctrl+K for search) significantly improve navigation speed for power users. However, they must be visually discoverable via hints (like `<kbd>` tags) and account for platform differences (Cmd vs Ctrl) to be truly accessible. Additionally, the 'Escape' key is a standard expectation for closing any ephemeral UI like dropdowns or modals.
**Action:** Always include platform-aware keyboard hints when implementing shortcuts and ensure the 'Escape' key handles UI dismissal.
