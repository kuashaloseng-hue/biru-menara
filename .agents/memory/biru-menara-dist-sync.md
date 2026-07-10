---
name: BIRU MENARA dist sync rule
description: api-server uses TypeScript project references — must keep dist .d.ts files in sync with src changes for lib/db and lib/api-zod
---

## The rule

When changing schema in `lib/db/src/schema/` or Zod schemas in `lib/api-zod/src/generated/api.ts`, you MUST also update the corresponding `dist/` declaration files:

- `lib/db/dist/schema/<table>.d.ts` — update column `notNull` flags, add new columns, update `insertSchema` type
- `lib/db/dist/schema/index.d.ts` — add new table exports
- `lib/api-zod/dist/generated/api.d.ts` — update Zod schema declarations and inferred output types
- `lib/api-client-react/dist/generated/api.schemas.d.ts` — update TypeScript interface types used by the frontend
- `lib/api-client-react/dist/index.d.ts` — add new exports

**Why:** `artifacts/api-server/tsconfig.json` has `"references"` to `../../lib/db` and `../../lib/api-zod`. TypeScript project references read compiled output from `dist/` directories, NOT source files, even when the package's `exports` field points to `./src/index.ts`. The frontend (`artifacts/biru-menara`) reads source directly since it doesn't use project references.

**How to apply:** After modifying DB schema or API Zod schemas, run `cd artifacts/api-server && npx tsc --noEmit` to catch dist drift errors. Fix by updating the relevant dist .d.ts files to match the new source types.

**Athletes feature (2026-07-10):** Added `athletesTable` to DB, added athlete Zod schemas to api-zod, made schedules `venue/date/time/notes` nullable. Manually updated all dist .d.ts files. Pre-existing error in `api-server/src/index.ts` (await-in-non-module) is unrelated and pre-existing.
