// Register fatal error handlers FIRST — before any dynamic imports — so they
// are active when transitive module initialization code runs (e.g. SESSION_SECRET
// check in app.ts, @google-cloud/storage constructor in objectStorage.ts).
// NOTE: static `import` statements are hoisted in ESM and evaluated before the
// module body, so handlers placed before static imports would still miss those
// errors. We use dynamic `import()` below so the handlers are guaranteed to be
// registered first.
process.on("uncaughtException", (err) => {
  process.stderr.write(
    `[FATAL uncaughtException] ${err?.stack ?? String(err)}\n`,
  );
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  const msg =
    reason instanceof Error ? reason.stack ?? String(reason) : String(reason);
  process.stderr.write(`[FATAL unhandledRejection] ${msg}\n`);
  process.exit(1);
});

// Dynamic imports so the handlers above are registered before any module-level
// code in these files (or their transitive dependencies) can throw.
const { default: app } = await import("./app.js");
const { logger } = await import("./lib/logger.js");

const port = Number(process.env.PORT || 3000);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env.PORT}"`); 
}

// Bind explicitly to 0.0.0.0 so the Cloud Run startup probe can reach the
// server regardless of how the container's network interfaces are configured.
app.listen(port, "0.0.0.0", () => {
  logger.info({ port }, "Server listening");
});
