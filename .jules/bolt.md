## 2026-05-30 - [Hygiene] Avoiding Junk Files in Performance PRs
**Learning:** Performance optimizations often involve environment setup (like `pnpm install`) which can generate large lockfiles or logs (`pnpm-lock.yaml`, `dev_server.log`). These should be excluded from the final PR to maintain repository hygiene and focus on the optimization.
**Action:** Always verify the file list before submitting and remove any non-source artifacts or environment-specific files.
