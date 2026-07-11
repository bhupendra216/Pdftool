import { Router, type IRouter } from "express";
import { ListToolsResponse, GetToolResponse } from "@workspace/api-zod";
import { tools, findTool } from "../lib/content";

const router: IRouter = Router();

router.get("/tools", (_req, res): void => {
  const data = tools.map(
    ({ slug, name, shortDescription, category, icon, popular, status }) => ({
      slug,
      name,
      shortDescription,
      category,
      icon,
      popular,
      status,
    }),
  );
  res.json(ListToolsResponse.parse(data));
});

router.get("/tools/:slug", (req, res): void => {
  const raw = Array.isArray(req.params.slug)
    ? req.params.slug[0]
    : req.params.slug;

  const tool = findTool(raw);

  if (!tool) {
    res.status(404).json({ error: "Tool not found" });
    return;
  }

  res.json(GetToolResponse.parse(tool));
});

export default router;
