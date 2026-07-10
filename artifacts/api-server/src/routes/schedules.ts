import { Router } from "express";
import type { IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, schedulesTable } from "@workspace/db";
import {
  CreateScheduleBody,
  CreateScheduleResponse,
  GetScheduleParams,
  GetScheduleResponse,
  UpdateScheduleParams,
  UpdateScheduleBody,
  UpdateScheduleResponse,
  DeleteScheduleParams,
  ListSchedulesResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";
import { mapRow, mapRows } from "../lib/mapRow";

const router: IRouter = Router();

router.get("/schedules", async (_req, res): Promise<void> => {
  const rows = await db.select().from(schedulesTable).orderBy(asc(schedulesTable.sortOrder), asc(schedulesTable.createdAt));
  res.json(ListSchedulesResponse.parse(mapRows(rows)));
});

router.post("/schedules", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateScheduleBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const data = {
    ...parsed.data,
    sortOrder: parsed.data.sortOrder ?? 0,
    status: parsed.data.status ?? "รอแข่งขัน",
    venue: parsed.data.venue ?? null,
    date: parsed.data.date ?? null,
    time: parsed.data.time ?? null,
    notes: parsed.data.notes ?? null,
  };
  const [row] = await db.insert(schedulesTable).values(data).returning();
  res.status(201).json(CreateScheduleResponse.parse(mapRow(row)));
});

router.get("/schedules/:id", async (req, res): Promise<void> => {
  const params = GetScheduleParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.select().from(schedulesTable).where(eq(schedulesTable.id, params.data.id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(GetScheduleResponse.parse(mapRow(row)));
});

router.put("/schedules/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateScheduleParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateScheduleBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.update(schedulesTable).set(parsed.data).where(eq(schedulesTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(UpdateScheduleResponse.parse(mapRow(row)));
});

router.delete("/schedules/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteScheduleParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.delete(schedulesTable).where(eq(schedulesTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
