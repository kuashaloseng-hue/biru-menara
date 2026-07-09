import { Router } from "express";
import type { IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, teamMembersTable } from "@workspace/db";
import {
  CreateTeamMemberBody,
  CreateTeamMemberResponse,
  GetTeamMemberParams,
  GetTeamMemberResponse,
  UpdateTeamMemberParams,
  UpdateTeamMemberBody,
  UpdateTeamMemberResponse,
  DeleteTeamMemberParams,
  ListTeamMembersResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAdmin";
import { mapRow, mapRows } from "../lib/mapRow";

const router: IRouter = Router();

router.get("/team-members", async (_req, res): Promise<void> => {
  const rows = await db.select().from(teamMembersTable).orderBy(asc(teamMembersTable.sortOrder), asc(teamMembersTable.createdAt));
  res.json(ListTeamMembersResponse.parse(mapRows(rows)));
});

router.post("/team-members", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateTeamMemberBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const data = { ...parsed.data, memberType: parsed.data.memberType ?? "sub", sortOrder: parsed.data.sortOrder ?? 0 };
  const [row] = await db.insert(teamMembersTable).values(data).returning();
  res.status(201).json(CreateTeamMemberResponse.parse(mapRow(row)));
});

router.get("/team-members/:id", async (req, res): Promise<void> => {
  const params = GetTeamMemberParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.select().from(teamMembersTable).where(eq(teamMembersTable.id, params.data.id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(GetTeamMemberResponse.parse(mapRow(row)));
});

router.put("/team-members/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateTeamMemberParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const parsed = UpdateTeamMemberBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.update(teamMembersTable).set(parsed.data).where(eq(teamMembersTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(UpdateTeamMemberResponse.parse(mapRow(row)));
});

router.delete("/team-members/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteTeamMemberParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [row] = await db.delete(teamMembersTable).where(eq(teamMembersTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
