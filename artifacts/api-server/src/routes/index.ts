import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toolsRouter from "./tools";
import blogRouter from "./blog";
import faqRouter from "./faq";
import contactRouter from "./contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(toolsRouter);
router.use(blogRouter);
router.use(faqRouter);
router.use(contactRouter);

export default router;
