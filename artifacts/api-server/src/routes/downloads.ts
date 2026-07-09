import { Router } from "express";
import type { IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, downloadsTable } from "@workspace/db";
import {
  CreateDownloadBody,
  CreateDownloadResponse,
  GetDownloadParams,
  GetDownloadResponse,
  UpdateDownloadParams,
  UpdateDownloadBody,
  UpdateDownloadResponse,
  DeleteDownloadParams,
  ListDownloadsResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";
import { mapRow, mapRows } from "../lib/mapRow";

const router: IRouter = Router();

router.get("/downloads", async (_req, res): Promise<void> => {
  const rows = await db.select().from(downloadsTable).orderBy(asc(downloadsTable.sortOrder), asc(downloadsTable.createdAt));
  res.json(ListDownloadsResponse.parse(mapRows(rows)));
});

router.post("/downloads", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateDownloadBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const data = { ...parsed.data, sortOrder: parsed.data.sortOrder ?? 0 };
  const [row] = await db.insert(downloadsTable).values(data).returning();
  res.status(201).json(CreateDownloadResponse.parse(mapRow(row)));
});

router.get("/downloads/:id", async (req, res): Promise<void> => {
  const params = GetDownloadParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.select().from(downloadsTable).where(eq(downloadsTable.id, params.data.id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(GetDownloadResponse.parse(mapRow(row)));
});

router.put("/downloads/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateDownloadParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateDownloadBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.update(downloadsTable).set(parsed.data).where(eq(downloadsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(UpdateDownloadResponse.parse(mapRow(row)));
});

router.delete("/downloads/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteDownloadParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.delete(downloadsTable).where(eq(downloadsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
