import { Router } from "express";
import type { IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, newsTable } from "@workspace/db";
import {
  CreateNewsPostBody,
  CreateNewsPostResponse,
  GetNewsPostParams,
  GetNewsPostResponse,
  UpdateNewsPostParams,
  UpdateNewsPostBody,
  UpdateNewsPostResponse,
  DeleteNewsPostParams,
  ListNewsResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";
import { mapRow, mapRows } from "../lib/mapRow";

const router: IRouter = Router();

router.get("/news", async (_req, res): Promise<void> => {
  const rows = await db.select().from(newsTable).orderBy(desc(newsTable.createdAt));
  res.json(ListNewsResponse.parse(mapRows(rows)));
});

router.post("/news", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateNewsPostBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const data = { ...parsed.data, published: parsed.data.published ?? true };
  const [row] = await db.insert(newsTable).values(data).returning();
  res.status(201).json(CreateNewsPostResponse.parse(mapRow(row)));
});

router.get("/news/:id", async (req, res): Promise<void> => {
  const params = GetNewsPostParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.select().from(newsTable).where(eq(newsTable.id, params.data.id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(GetNewsPostResponse.parse(mapRow(row)));
});

router.put("/news/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateNewsPostParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateNewsPostBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.update(newsTable).set(parsed.data).where(eq(newsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(UpdateNewsPostResponse.parse(mapRow(row)));
});

router.delete("/news/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteNewsPostParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.delete(newsTable).where(eq(newsTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
