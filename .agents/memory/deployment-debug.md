---
name: BIRU MENARA deployment debugging
description: Root causes and fixes for the autoscale deployment health check failures
---

## Root Causes Found

1. **`@google-cloud/storage` Storage constructor at module level** — `new Storage({projectId:''})` executed on import can trigger GCP metadata server auto-detection in Cloud Run, delaying server startup past the health check timeout. Fixed by making it a lazy singleton (`getObjectStorageClient()` function, initialized on first use).

2. **Health check path coverage** — Replit's pid1 health checker probes the service BASE PATH (`/api`) before the server is up. After the server starts, `artifact.toml`'s configured path (`/api/healthz`) is used. Added fallback routes: `GET /api`, `GET /api/`, `GET /healthz` all return 200.

3. **Error handler ordering in ESM** — Static `import` statements are hoisted in ESM, so handlers registered before them don't catch module-init errors. Fixed with dynamic `await import()` in `index.ts` so `uncaughtException`/`unhandledRejection` handlers are active before any module code runs.

4. **Explicit `0.0.0.0` binding** — `app.listen(port, "0.0.0.0", ...)` ensures Cloud Run probe can reach the server regardless of network config.

## What Did NOT Work
- `pnpm store prune` is NOT the issue (node_modules is in Repl layer)
- `dist/` not in git is NOT the issue (Repl layer is from filesystem post-build, not git tree)
- `fetchDeploymentLogs()` returns nothing for failed deployments (only works for running production)

## Deployment Log Interpretation
- `healthcheck failed error=healthcheck /api returned status 500` = pre-startup probe failures (expected, server not yet up)
- `request completed url=/api/healthz statusCode=200` = successful final probe after server is ready
