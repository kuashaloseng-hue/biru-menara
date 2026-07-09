import type { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const s = req.session as unknown as Record<string, unknown>;
  if (!s["isAdmin"]) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
