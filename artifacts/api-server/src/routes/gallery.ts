import { Router } from "express";
import type { IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, galleryTable } from "@workspace/db";
import {
  ListGalleryResponse,
  CreateGalleryImageBody,
  CreateGalleryImageResponse,
  GetGalleryImageParams,
  GetGalleryImageResponse,
  UpdateGalleryImageParams,
  UpdateGalleryImageBody,
  UpdateGalleryImageResponse,
  DeleteGalleryImageParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";
import { mapRow, mapRows } from "../lib/mapRow";

const router: IRouter = Router();

router.get("/gallery", async (_req, res): Promise<void> => {
  const rows = await db.select().from(galleryTable).orderBy(asc(galleryTable.sortOrder), asc(galleryTable.createdAt));
  res.json(ListGalleryResponse.parse(mapRows(rows)));
});

router.post("/gallery", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateGalleryImageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const data = {
    imageUrl: parsed.data.imageUrl,
    caption: parsed.data.caption ?? "",
    sortOrder: parsed.data.sortOrder ?? 0,
    published: parsed.data.published ?? true,
  };
  const [row] = await db.insert(galleryTable).values(data).returning();
  res.status(201).json(CreateGalleryImageResponse.parse(mapRow(row)));
});

router.get("/gallery/:id", async (req, res): Promise<void> => {
  const params = GetGalleryImageParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.select().from(galleryTable).where(eq(galleryTable.id, params.data.id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(GetGalleryImageResponse.parse(mapRow(row)));
});

router.put("/gallery/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateGalleryImageParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateGalleryImageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.update(galleryTable).set(parsed.data).where(eq(galleryTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(UpdateGalleryImageResponse.parse(mapRow(row)));
});

router.delete("/gallery/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteGalleryImageParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.delete(galleryTable).where(eq(galleryTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
