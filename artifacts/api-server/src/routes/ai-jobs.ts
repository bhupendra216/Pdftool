import { Router, type IRouter } from "express";
import { categories, companies, jobs, locations } from "../../../pdf-tools/src/lib/ai-jobs";

const router: IRouter = Router();

router.get("/ai-jobs", (_req, res) => {
  res.json({
    refreshedAt: new Date().toISOString(),
    categories,
    locations,
    companies,
    jobs,
  });
});

export default router;
