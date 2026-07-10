import { Router } from "express";
import type { IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, athletesTable, schedulesTable } from "@workspace/db";
import {
  CreateAthleteBody,
  CreateAthleteResponse,
  UpdateAthleteParams,
  UpdateAthleteBody,
  UpdateAthleteResponse,
  DeleteAthleteParams,
  ListScheduleAthletesParams,
  ListScheduleAthletesResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

function mapAthlete(row: typeof athletesTable.$inferSelect) {
  return {
    id: row.id,
    scheduleId: row.scheduleId,
    name: row.name,
    studentId: row.studentId,
    grade: row.grade,
    sortOrder: row.sortOrder,
  };
}

// GET /schedules/:scheduleId/athletes
router.get("/schedules/:scheduleId/athletes", async (req, res): Promise<void> => {
  const params = ListScheduleAthletesParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: "Invalid scheduleId" }); return; }

  const rows = await db
    .select()
    .from(athletesTable)
    .where(eq(athletesTable.scheduleId, params.data.scheduleId))
    .orderBy(asc(athletesTable.sortOrder), asc(athletesTable.createdAt));

  res.json(ListScheduleAthletesResponse.parse(rows.map(mapAthlete)));
});

// POST /schedules/:scheduleId/athletes
router.post("/schedules/:scheduleId/athletes", requireAdmin, async (req, res): Promise<void> => {
  const params = ListScheduleAthletesParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: "Invalid scheduleId" }); return; }

  const parsed = CreateAthleteBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [schedule] = await db.select({ id: schedulesTable.id }).from(schedulesTable).where(eq(schedulesTable.id, params.data.scheduleId));
  if (!schedule) { res.status(404).json({ error: "Schedule not found" }); return; }

  const [row] = await db.insert(athletesTable).values({
    scheduleId: params.data.scheduleId,
    name: parsed.data.name,
    studentId: parsed.data.studentId ?? "",
    grade: parsed.data.grade ?? "",
    sortOrder: parsed.data.sortOrder ?? 0,
  }).returning();

  res.status(201).json(CreateAthleteResponse.parse(mapAthlete(row)));
});

// PUT /athletes/:id
router.put("/athletes/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateAthleteParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }

  const parsed = UpdateAthleteBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [row] = await db
    .update(athletesTable)
    .set(parsed.data)
    .where(eq(athletesTable.id, params.data.id))
    .returning();

  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(UpdateAthleteResponse.parse(mapAthlete(row)));
});

// DELETE /athletes/:id
router.delete("/athletes/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteAthleteParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }

  const [row] = await db
    .delete(athletesTable)
    .where(eq(athletesTable.id, params.data.id))
    .returning();

  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
