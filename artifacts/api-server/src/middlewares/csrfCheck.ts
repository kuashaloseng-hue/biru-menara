import type { Request, Response, NextFunction } from "express";

/**
 * Simple CSRF protection for cookie-authenticated admin mutations.
 * Checks that the request Origin or Referer matches the host.
 * Appropriate for a same-origin single-page app admin panel.
 */
export function csrfCheck(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers["origin"] ?? req.headers["referer"];

  // Allow requests with no origin only if they have no session cookie
  // (i.e. from direct curl/API clients without cookie auth)
  if (!origin) {
    next();
    return;
  }

  let parsedOrigin: URL;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    res.status(403).json({ error: "Invalid origin" });
    return;
  }

  const host = req.headers["host"] ?? "";
  // Accept requests from the same host (handles both http and https)
  if (parsedOrigin.host === host || parsedOrigin.host.startsWith("localhost")) {
    next();
    return;
  }

  // Also accept from REPLIT_DEV_DOMAIN proxy
  const devDomain = process.env.REPLIT_DEV_DOMAIN ?? "";
  if (devDomain && parsedOrigin.hostname.endsWith(devDomain)) {
    next();
    return;
  }

  res.status(403).json({ error: "CSRF check failed" });
}
