## 2025-05-14 - Keyboard Shortcut Accessibility & Focus Management
**Learning:** Pairing keyboard shortcuts (like `/` for search) with discoverable visual cues (like `<kbd>`) significantly improves power-user efficiency without cluttering the UI for casual users. Additionally, ensuring global shortcuts don't interfere with standard form elements (INPUT, TEXTAREA, SELECT) is critical for preventing frustrating UX regressions.
**Action:** Always verify that global keyboard listeners exclude all interactive form elements and provide a visual hint for desktop users.
