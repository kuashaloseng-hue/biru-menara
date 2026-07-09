---
name: BIRU MENARA Admin System
description: Architecture decisions and gotchas for the admin backend and frontend added to artifacts/biru-menara and artifacts/api-server.
---

# BIRU MENARA Admin System

## Date→string conversion
Drizzle returns `timestamp` columns as JS `Date` objects. Orval-generated Zod schemas expect `string`. All route handlers use `mapRow`/`mapRows` from `artifacts/api-server/src/lib/mapRow.ts` to convert dates to ISO strings before Zod `.parse()`.

**Why:** Without this, every API response throws a ZodError ("Expected string, received date").

**How to apply:** Always call `mapRow(row)` / `mapRows(rows)` before passing DB rows to generated Zod parsers.

## Admin auth
- `ADMIN_PASSWORD` secret is required at startup — the route returns 500 if unset (no fallback default).
- `SESSION_SECRET` is required at startup via `express-session`.
- Session cookies use `sameSite: "lax"` to help block cross-site forgery.
- CSRF middleware (`csrfCheck.ts`) blocks non-GET state-changing requests from unknown origins.
- CORS is restricted to localhost and `REPLIT_DEV_DOMAIN` with credentials.

## DB tables added
`announcements`, `news`, `schedules`, `team_members`, `downloads`, `site_settings` — all in `lib/db/src/schema/`.

## Session storage
Using in-memory `express-session` store (acceptable for a single-server school site). If scaling up, replace with `connect-pg-simple` or Redis store.

## Admin UI
Pages at `artifacts/biru-menara/src/pages/admin/`. Protected by `AdminGuard` component that calls `/api/admin/me`. Unauthenticated users redirected to `/admin/login`.
