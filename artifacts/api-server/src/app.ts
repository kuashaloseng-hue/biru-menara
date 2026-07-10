import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// Trust Replit's reverse proxy so that req.ip and req.secure reflect the
// real client values. Required for session cookies with secure: true in
// production (the proxy terminates TLS, server sees plain HTTP).
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Restrict CORS to same-origin requests plus known Replit proxy domains.
// Credentials (session cookies) are only sent on same-origin requests from the
// admin SPA. We allow:
//   • localhost (local dev)
//   • *.replit.dev  (Replit workspace preview proxy, e.g. REPLIT_DEV_DOMAIN)
//   • *.replit.app  (Replit published/deployed apps, e.g. biru-menara-site.replit.app)
const allowedOrigins = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https:\/\/[^.]+\.replit\.dev$/,
  /^https:\/\/[^.]+\.replit\.app$/,
];
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // same-origin / server-to-server
      const allowed = allowedOrigins.some((pat) => pat.test(origin));
      callback(null, allowed);
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET environment variable is required");
}

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax", // helps block cross-site request forgery
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Disable HTTP caching for all API responses so mutations are reflected immediately
app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  next();
});

app.use("/api", router);

// Health check fallbacks — the startup probe path in artifact.toml is
// /api/healthz, but Replit's pid1 health checker also probes the service base
// path (/api) before the server is ready, and some proxy configurations strip
// the prefix. All three variants return 200 so the probe succeeds regardless.
app.get("/healthz", (_req, res) => res.json({ status: "ok" }));
app.get("/api", (_req, res) => res.json({ status: "ok" }));
app.get("/api/", (_req, res) => res.json({ status: "ok" }));

export default app;
