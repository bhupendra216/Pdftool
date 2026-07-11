import { Router, type IRouter } from "express";
import { ListBlogPostsResponse, GetBlogPostResponse } from "@workspace/api-zod";
import { blogPosts, findBlogPost } from "../lib/content";

const router: IRouter = Router();

router.get("/blog", (_req, res): void => {
  const data = blogPosts.map(
    ({ slug, title, excerpt, category, publishedAt, readingMinutes }) => ({
      slug,
      title,
      excerpt,
      category,
      publishedAt,
      readingMinutes,
    }),
  );
  res.json(ListBlogPostsResponse.parse(data));
});

router.get("/blog/:slug", (req, res): void => {
  const raw = Array.isArray(req.params.slug)
    ? req.params.slug[0]
    : req.params.slug;

  const post = findBlogPost(raw);

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.json(GetBlogPostResponse.parse(post));
});

export default router;
