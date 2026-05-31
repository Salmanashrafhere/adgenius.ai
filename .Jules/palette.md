# Palette's Journal - AdGenius SaaS

## 2025-05-22 - [Unified Notifications & Keyboard Accessibility]
**Learning:** Redundant notification UI across different levels of the component hierarchy (Header vs. Dashboard) leads to user confusion and "double bell" syndrome. Centralizing notification state in the Header via `localStorage` ensures consistency and reduces code duplication. Additionally, keyboard shortcuts like `/` for search significantly improve power-user experience but require careful focus-management to avoid accidental triggers.
**Action:** Always check for existing UI patterns in the layout/header before adding similar features to pages. Use `localStorage` and `storage` events for simple cross-component/tab synchronization. Implement global shortcuts with focus-awareness (exclude inputs/textareas).

## 2025-05-22 - [Surgical Focus and Regression Prevention]
**Learning:** Large architectural changes (like unifying notification state) can easily lead to regressions in unrelated logic if not handled with extreme care. The mission of Palette is micro-UX, and keeping changes under 50 lines is a critical constraint to ensure focus and prevent side effects.
**Action:** Stick to ONE micro-UX improvement at a time. Do not attempt to refactor state management across multiple files if a smaller UI polish can achieve a similar delight/accessibility win.
