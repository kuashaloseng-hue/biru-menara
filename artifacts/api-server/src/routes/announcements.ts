import { Router } from "express";
import type { IRouter } from "express";
import { eq, desc, asc } from "drizzle-orm";
import { db, announcementsTable } from "@workspace/db";
import {
  CreateAnnouncementBody,
  CreateAnnouncementResponse,
  GetAnnouncementParams,
  GetAnnouncementResponse,
  UpdateAnnouncementParams,
  UpdateAnnouncementBody,
  UpdateAnnouncementResponse,
  DeleteAnnouncementParams,
  ListAnnouncementsResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";
import { mapRow, mapRows } from "../lib/mapRow";

const router: IRouter = Router();

router.get("/announcements", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(announcementsTable)
    .orderBy(asc(announcementsTable.sortOrder), desc(announcementsTable.createdAt));
  res.json(ListAnnouncementsResponse.parse(mapRows(rows)));
});

router.post("/announcements", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateAnnouncementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const data = {
    ...parsed.data,
    urgent: parsed.data.urgent ?? false,
    sortOrder: parsed.data.sortOrder ?? 0,
    published: parsed.data.published ?? true,
  };
  const [row] = await db.insert(announcementsTable).values(data).returning();
  res.status(201).json(CreateAnnouncementResponse.parse(mapRow(row)));
});

router.get("/announcements/:id", async (req, res): Promise<void> => {
  const params = GetAnnouncementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [row] = await db.select().from(announcementsTable).where(eq(announcementsTable.id, params.data.id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(GetAnnouncementResponse.parse(mapRow(row)));
});

router.put("/announcements/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateAnnouncementParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateAnnouncementBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.update(announcementsTable).set(parsed.data).where(eq(announcementsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(UpdateAnnouncementResponse.parse(mapRow(row)));
});

router.delete("/announcements/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteAnnouncementParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.delete(announcementsTable).where(eq(announcementsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
