import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toolsRouter from "./tools";
import blogRouter from "./blog";
import faqRouter from "./faq";
import contactRouter from "./contact";
import mergeRouter from "./merge";
import splitRouter from "./split";

const router: IRouter = Router();

router.use(healthRouter);
router.use(toolsRouter);
router.use(blogRouter);
router.use(faqRouter);
router.use(contactRouter);
router.use(mergeRouter);
router.use(splitRouter);

export default router;
