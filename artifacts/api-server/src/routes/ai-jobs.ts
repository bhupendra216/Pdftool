import { Router, type IRouter } from "express";
import { companies } from "../lib/ai-jobs-seed";

const router: IRouter = Router();

router.get("/ai-jobs", (_req, res) => {
  res.json({ companies });
});

export default router;
