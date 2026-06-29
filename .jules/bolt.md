## 2025-05-15 - Supabase Query Chaining Pattern
**Learning:** In the Supabase JS client, filters like `.eq()`, `.order()`, and `.limit()` cannot be called directly on the object returned by `.from('table')`. They must be called on the builder returned by `.select()`.
**Action:** Always ensure `.select()` is called immediately after `.from()` before applying any filters or modifiers to avoid runtime errors.
