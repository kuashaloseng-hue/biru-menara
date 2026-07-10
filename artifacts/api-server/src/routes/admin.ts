import { Router } from "express";
import type { IRouter } from "express";
import { AdminLoginBody, AdminLoginResponse, AdminMeResponse, AdminChangePasswordBody, AdminChangePasswordResponse } from "@workspace/api-zod";
import { db, settingsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/requireAdmin";

const router: IRouter = Router();

async function getEffectivePassword(): Promise<string | null> {
  // DB-stored password takes priority; fall back to env var
  try {
    const [row] = await db.select().from(settingsTable).limit(1);
    if (row?.adminPassword) return row.adminPassword;
  } catch { /* ignore DB errors, fall back to env */ }
  return process.env.ADMIN_PASSWORD ?? null;
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const effectivePassword = await getEffectivePassword();
  if (!effectivePassword) {
    res.status(500).json({ error: "Server misconfiguration: ADMIN_PASSWORD not set" });
    return;
  }
  if (parsed.data.password !== effectivePassword) {
    res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
    return;
  }

  const s = req.session as unknown as Record<string, unknown>;
  s["isAdmin"] = true;

  // Explicitly save the session before responding so the cookie is committed to
  // the store before the client makes the next request. Without this, async
  // handlers can respond before express-session's automatic end-of-response
  // save completes, causing the immediately-following /admin/me check to find
  // no session.
  await new Promise<void>((resolve, reject) => {
    req.session.save((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  res.json(AdminLoginResponse.parse({ isAdmin: true }));
});

router.post("/admin/change-password", requireAdmin, async (req, res): Promise<void> => {
  const parsed = AdminChangePasswordBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const effective = await getEffectivePassword();
  if (!effective || parsed.data.currentPassword !== effective) {
    res.status(401).json({ error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
    return;
  }
  if (parsed.data.newPassword.length < 6) {
    res.status(400).json({ error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร" });
    return;
  }

  // Ensure settings row exists
  let [row] = await db.select().from(settingsTable).limit(1);
  if (!row) {
    [row] = await db.insert(settingsTable).values({}).returning();
  }
  const { eq } = await import("drizzle-orm");
  await db.update(settingsTable).set({ adminPassword: parsed.data.newPassword }).where(eq(settingsTable.id, row.id));

  res.json(AdminChangePasswordResponse.parse({ ok: true }));
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  req.session.destroy(() => {
    res.sendStatus(204);
  });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const s = req.session as unknown as Record<string, unknown>;
  if (!s["isAdmin"]) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(AdminMeResponse.parse({ isAdmin: true }));
});

export default router;
