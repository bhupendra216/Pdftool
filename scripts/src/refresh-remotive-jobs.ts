import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cachePath = path.resolve(
  __dirname,
  "../../artifacts/api-server/src/lib/ai-jobs-cache.json",
);
const remotiveUrl = "https://remotive.com/api/remote-jobs";
const aiKeywords = [
  "machine learning",
  "deep learning",
  "AI engineer",
  "LLM",
  "generative AI",
  "data scientist",
  "MLOps",
  "NLP",
  "computer vision",
  "prompt engineer",
  "AI researcher",
];

interface RemotiveJob {
  id: number | string;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string;
  category?: string;
  job_type?: string;
  publication_date: string;
  candidate_required_location?: string;
  salary?: string;
  description: string;
}

export interface CachedRemotiveJob {
  id: string;
  url: string;
  title: string;
  companyName: string;
  companyLogo: string | null;
  location: string;
  salary: string | null;
  jobType: string;
  publicationDate: string;
}

export function filterRemotiveAiJobs(jobs: RemotiveJob[]): CachedRemotiveJob[] {
  const keywords = aiKeywords.map((keyword) => keyword.toLowerCase());

  return jobs
    .filter((job) => {
      if (
        typeof job.title !== "string" ||
        typeof job.description !== "string" ||
        typeof job.company_name !== "string" ||
        typeof job.publication_date !== "string" ||
        !Number.isFinite(Date.parse(job.publication_date))
      ) {
        return false;
      }
      const searchableText = `${job.title} ${job.description}`.toLowerCase();
      return keywords.some((keyword) => searchableText.includes(keyword));
    })
    .filter((job) => {
      try {
        const url = new URL(job.url);
        return url.protocol === "https:" && url.hostname === "remotive.com";
      } catch {
        return false;
      }
    })
    .map((job) => ({
      id: String(job.id),
      url: job.url,
      title: job.title,
      companyName: job.company_name,
      companyLogo: job.company_logo && isRemotiveLogo(job.company_logo) ? job.company_logo : null,
      location: job.candidate_required_location || "Remote",
      salary: job.salary?.trim() || null,
      jobType: job.job_type
        ? job.job_type
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "Not specified",
      publicationDate: job.publication_date,
    }))
    .sort(
      (left, right) =>
        Date.parse(right.publicationDate) - Date.parse(left.publicationDate),
    );
}

function isRemotiveLogo(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "remotive.com";
  } catch {
    return false;
  }
}

export async function refreshRemotiveJobs(fetcher: typeof fetch = fetch) {
  const response = await fetcher(remotiveUrl, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) {
    throw new Error(`Remotive API returned HTTP ${response.status}`);
  }

  const payload = (await response.json()) as { jobs?: RemotiveJob[] };
  if (!Array.isArray(payload.jobs)) {
    throw new Error("Remotive API response did not contain a jobs array");
  }

  const jobs = filterRemotiveAiJobs(payload.jobs);
  if (jobs.length === 0) {
    console.warn("Remotive returned no matching AI jobs; keeping the existing cache.");
    return;
  }

  const cache = {
    source: "Remotive",
    fetchedAt: new Date().toISOString(),
    jobs,
  };
  const temporaryPath = `${cachePath}.tmp`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(cache, null, 2)}\n`);
  fs.renameSync(temporaryPath, cachePath);
  console.log(`Cached ${jobs.length} Remotive AI jobs.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  refreshRemotiveJobs().catch((error: unknown) => {
    console.error("Remotive refresh failed; keeping the previous cache.", error);
    process.exitCode = 1;
  });
}
