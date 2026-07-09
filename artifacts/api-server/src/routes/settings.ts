import { Router } from "express";
import type { IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, settingsTable } from "@workspace/db";
import {
  GetSettingsResponse,
  UpdateSettingsBody,
  UpdateSettingsResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";
import { mapRow } from "../lib/mapRow";

const router: IRouter = Router();

async function ensureSettings() {
  const [existing] = await db.select().from(settingsTable).limit(1);
  if (!existing) {
    const [row] = await db.insert(settingsTable).values({}).returning();
    return row;
  }
  return existing;
}

router.get("/settings", async (_req, res): Promise<void> => {
  const row = await ensureSettings();
  res.json(GetSettingsResponse.parse(mapRow(row)));
});

router.put("/settings", requireAdmin, async (req, res): Promise<void> => {
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const existing = await ensureSettings();
  const [row] = await db.update(settingsTable).set(parsed.data).where(eq(settingsTable.id, existing.id)).returning();
  if (!row) { res.status(500).json({ error: "Failed to update settings" }); return; }
  res.json(UpdateSettingsResponse.parse(mapRow(row)));
});

export default router;
