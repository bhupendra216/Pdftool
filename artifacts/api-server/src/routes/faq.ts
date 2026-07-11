import { Router, type IRouter } from "express";
import { ListFaqsResponse } from "@workspace/api-zod";
import { homepageFaqs } from "../lib/content";

const router: IRouter = Router();

router.get("/faq", (_req, res): void => {
  res.json(ListFaqsResponse.parse(homepageFaqs));
});

export default router;
