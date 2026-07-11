# PDF Tools

A free, premium-feeling PDF utility website (merge, split, compress, convert, and edit PDFs) inspired by iLovePDF but faster and cleaner. Currently in MVP/site-shell phase — real PDF file processing is being added tool by tool.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port from workflow)
- `pnpm --filter @workspace/pdf-tools run dev` — run the web frontend (port from workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `DATABASE_URL` — Postgres connection string (provisioned; not yet used by this app)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind, shadcn/ui, wouter router, react-markdown for blog content
- API: Express 5 (`artifacts/api-server`)
- DB: PostgreSQL + Drizzle ORM (provisioned but unused so far — tool/blog/FAQ content is static data, no user accounts yet)
- Validation: Zod (`zod/v4` on the server via generated schemas), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for `/tools`, `/blog`, `/faq`, `/contact` contracts
- `artifacts/api-server/src/lib/content.ts` — static catalog of PDF tools and blog posts (editorial content, not user data)
- `artifacts/api-server/src/routes/{tools,blog,faq,contact}.ts` — route handlers for the above
- `artifacts/pdf-tools/src/pages` — Home, Tools directory, Tool detail template, Blog index/detail, About/Privacy/Terms/Contact, 404
- `artifacts/pdf-tools/src/components/shared` — reusable Navbar, Footer, ToolCard, BlogCard, UploadArea, FaqSection, etc.

## Architecture decisions

- The original request specified Next.js/Prisma/SQLite; this workspace's template already provides an equivalent contract-first stack (React+Vite frontend, Express API, OpenAPI-driven codegen, Postgres), so the app was built on that instead of introducing a second framework.
- Tool/blog/FAQ content is static data in `content.ts`, not the database — it's editorial content with no user writes yet. Moving it to the DB later (e.g. for an admin UI) won't require changing the API contracts.
- First build is the site shell only: every tool page renders the full upload → preview → options → processing → success → download flow with simulated state transitions. Actual PDF processing (pdf-lib, etc.) is added incrementally, tool by tool, per the user's own request to build "one by one."
- Tools carry a `status: "available" | "comingSoon"` flag so the frontend can honestly indicate which tools are wired up for real processing as that work lands.

## Product

- Homepage with hero, popular tools, categories, features, FAQ, latest blog posts
- `/tools` searchable/filterable directory of all 15 planned PDF tools
- `/tools/:slug` reusable tool page template with the full upload/process/download workflow UI
- `/blog` and `/blog/:slug` — SEO-oriented guide posts linked from relevant tools
- `/about`, `/privacy`, `/terms`, `/contact` (working contact form), and a custom 404

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Orval emits `zod.email()` for `format: email` string schemas, which doesn't exist in this workspace's pinned zod v3 — avoid `format: email` in the OpenAPI spec (use a plain string field instead) or codegen's `typecheck:libs` step fails.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
