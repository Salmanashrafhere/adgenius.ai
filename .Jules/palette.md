## 2025-05-14 - [New Campaign Start UX]
**Learning:** For single-input initial steps, wrapping the UI in a `<form>` significantly improves the "flow" by allowing keyboard submission, while adding a small simulated delay with a loading state makes the AI analysis feel more substantive and less like a static transition.
**Action:** Always wrap input-based actions in `<form>` and provide immediate visual feedback (loading spinners) for "analysis" or "generation" steps.
