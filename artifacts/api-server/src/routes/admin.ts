import { Router } from "express";
import type { IRouter } from "express";
import { AdminLoginBody, AdminLoginResponse, AdminMeResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(500).json({ error: "Server misconfiguration: ADMIN_PASSWORD not set" });
    return;
  }
  if (parsed.data.password !== adminPassword) {
    res.status(401).json({ error: "รหัสผ่านไม่ถูกต้อง" });
    return;
  }

  const s = req.session as unknown as Record<string, unknown>;
  s["isAdmin"] = true;

  res.json(AdminLoginResponse.parse({ isAdmin: true }));
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
