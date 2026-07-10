// Capture any uncaught exception that happens during module load or startup
// and write it to stderr so Replit deployment logs capture the cause.
process.on("uncaughtException", (err) => {
  process.stderr.write(`[FATAL] Uncaught exception at startup:\n${err?.stack ?? err}\n`);
  process.exit(1);
});

import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
