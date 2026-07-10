---
name: BIRU MENARA admin system
description: Auth, DB schema, API patterns, and key decisions for the BIRU MENARA project
---

## Auth
- Session auth via `express-session` + `SESSION_SECRET` env secret
- CSRF check on mutations via `requireAdmin` middleware
- Admin password: DB `site_settings.admin_password` takes priority over `ADMIN_PASSWORD` env var (fallback chain in `getEffectivePassword()` in `routes/admin.ts`)
- Change-password endpoint: `POST /api/admin/change-password` (requireAdmin)

## DB schema (Drizzle + PostgreSQL)
Tables: `announcements`, `news`, `schedules`, `team_members`, `downloads`, `site_settings`, `gallery`

Key fields:
- `announcements`: has `imageUrl`, `urgent`, `published`
- `news`: has `imageUrl`, `published`
- `team_members`: uses `memberType` (values: `main`/`sub`), has `published`
- `site_settings`: has `adminPassword` (nullable, overrides env var), `navItems` (JSON string), `heroImageUrl`, `logoUrl`
- `gallery`: `imageUrl`, `caption`, `sortOrder`, `published`

## mapRow pattern
All Drizzle `Date` fields must be converted to ISO strings before Zod parse. Use `mapRow(row)` / `mapRows(rows)` from `artifacts/api-server/src/lib/mapRow.ts`.

## Public page nav (Navbar.tsx)
Reads `settings.navItems` (JSON string) to show/hide pages. Format: `{"news":true,"schedule":false,...}`. Home always shown. Defaults to all visible if null.

## TeamMember type contract
Admin creates members as `memberType: "main"` (leaders) or `"sub"` (staff). Public Team.tsx filters: `m.memberType === "main"` → leaders section.

## Gallery drag-reorder
Uses @dnd-kit/core + @dnd-kit/sortable. On drag-end: `Promise.all` for all changed sortOrders → single invalidate after all complete. Falls back to empty (no AI images) when DB gallery is empty.

## Object Storage
- Bucket provisioned via `setupObjectStorage()` in CodeExecution sandbox
- Server files: `artifacts/api-server/src/lib/objectStorage.ts`, `objectAcl.ts`, `routes/storage.ts`
- Client: `lib/object-storage-web` (Uppy v5, `useUpload` hook) — pnpm override `react: 19.1.0` required
- `lib/object-storage-web/tsconfig.json` must have `"composite": true`
- Upload URL auth: `req.session?.isAdmin` (not Replit Auth)
- `GET /storage/objects/*` is intentionally public — all uploads are public-facing images
- Serving URL pattern: `/api/storage${objectPath}` (objectPath = `/objects/uploads/uuid`)
- Shared upload component: `artifacts/biru-menara/src/components/admin/AdminImageUploader.tsx`

## Drag-to-reorder (sortOrder)
- Gallery, News, Announcements all have `sortOrder` field and drag-to-reorder
- Pattern: `Promise.all(mutateAsync...)` wrapped in `try/catch` + `finally { invalidate() }`
- News and Announcements API routes order by `asc(sortOrder), desc(createdAt)`

## Settings fields
- `teamRosterImageUrl` — configurable roster image shown on Team page (replaces hardcoded import)
- All image fields in AdminSettings use `AdminImageUploader` component

## Codegen
- `pnpm --filter @workspace/api-spec run codegen` regenerates both `lib/api-zod` and `lib/api-client-react`
- `lib/api-zod/src/index.ts` must not have duplicate export lines (orval + old handwritten)
- `lib/api-client-react/src/index.ts` same — deduplicate if it gains duplicate lines
- OpenAPI `format: uri` causes orval to emit `zod.url()` (Zod v4 syntax) — avoid `format: uri` with Zod v3

## Cache
- API server: `Cache-Control: no-store` on all `/api/*` (in `app.ts`)
- React Query: `staleTime: 0` + `refetchOnWindowFocus: true` in App.tsx QueryClient
