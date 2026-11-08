import { Router, type IRouter } from "express";
import { ListToolsResponse, GetToolResponse } from "@workspace/api-zod";
import { tools, findTool } from "../lib/content";
import { getLibreOfficeAvailability, initializeLibreOfficeAvailability } from "../lib/word-to-pdf";

const router: IRouter = Router();

router.get("/tools", async (_req, res): Promise<void> => {
  await initializeLibreOfficeAvailability();
  const wordToPdfAvailable = getLibreOfficeAvailability() === "available";
  const data = tools.map(({ slug, name, shortDescription, category, icon, popular, status }) => ({
    slug,
    name,
    shortDescription:
      slug === "word-to-pdf" && !wordToPdfAvailable
        ? "Temporarily unavailable. Word to PDF conversion is not available right now."
        : shortDescription,
    category,
    icon,
    popular,
    status: slug === "word-to-pdf" && !wordToPdfAvailable ? "comingSoon" : status,
  }));
  const response = ListToolsResponse.parse(data);
  res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  res.json(response);
});

router.get("/tools/:slug", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.slug)
    ? req.params.slug[0]
    : req.params.slug;

  const tool = findTool(raw);

  if (!tool) {
    res.status(404).json({ error: "Tool not found" });
    return;
  }

  if (tool.slug === "word-to-pdf") {
    await initializeLibreOfficeAvailability();
    if (getLibreOfficeAvailability() !== "available") {
      res.json(
        GetToolResponse.parse({
          ...tool,
          shortDescription: "Temporarily unavailable. Word to PDF conversion is not available right now.",
          status: "comingSoon",
        }),
      );
      return;
    }
  }

  res.json(GetToolResponse.parse(tool));
});

export default router;
