import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

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

// Restrict CORS to same-origin requests and the Replit dev proxy.
// Credentials are only sent on same-origin requests from the admin SPA.
const devDomain = process.env.REPLIT_DEV_DOMAIN;
const allowedOrigins = [
  /^https?:\/\/localhost(:\d+)?$/,
  ...(devDomain ? [new RegExp(`https://${devDomain.replace(".", "\\.")}$`)] : []),
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

export default app;
