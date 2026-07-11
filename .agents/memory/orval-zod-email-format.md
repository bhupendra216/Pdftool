---
name: Orval email format breaks zod v3 typecheck
description: Using `format: email` on a string schema in lib/api-spec/openapi.yaml causes a post-codegen typecheck failure.
---

Orval's zod client emits `zod.email()` (a top-level zod v4 function) for any string schema with `format: email`. This workspace pins `zod: ^3.25.76` in the pnpm-workspace catalog, which has no top-level `zod.email()` — only `zod.string().email()` in v3. The mismatch surfaces as a `tsc --build` error inside the codegen script's chained `typecheck:libs` step (`Property 'email' does not exist on type ...`), which looks like a codegen failure but is really this version mismatch.

**Why:** Orval's OpenAPI-3.1-to-zod mapping assumes zod v4 conventions; this workspace has not upgraded to zod v4.

**How to apply:** Avoid `format: email` on string schemas in `lib/api-spec/openapi.yaml`. Use a plain `type: string` (with `minLength: 1` if required) and validate email shape at the application layer if needed, until the workspace upgrades its zod catalog pin.
