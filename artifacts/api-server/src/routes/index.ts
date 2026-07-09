import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import healthRouter from "./health";
import adminRouter from "./admin";
import announcementsRouter from "./announcements";
import newsRouter from "./news";
import schedulesRouter from "./schedules";
import teamMembersRouter from "./teamMembers";
import downloadsRouter from "./downloads";
import settingsRouter from "./settings";
import { csrfCheck } from "../middlewares/csrfCheck";

const router: IRouter = Router();

// Apply CSRF check to all state-changing requests
router.use((req: Request, res: Response, next: NextFunction) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    return csrfCheck(req, res, next);
  }
  next();
});

router.use(healthRouter);
router.use(adminRouter);
router.use(announcementsRouter);
router.use(newsRouter);
router.use(schedulesRouter);
router.use(teamMembersRouter);
router.use(downloadsRouter);
router.use(settingsRouter);

export default router;
