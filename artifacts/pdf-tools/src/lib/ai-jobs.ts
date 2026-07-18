export type { Category, Company, Job, JobType, Location, WorkMode } from "@/lib/ai-jobs-data";

import { categories, companies, jobs, locations } from "@/lib/ai-jobs-data";

export { categories, companies, jobs, locations };

const AI_JOBS_CACHE_KEY = "pdf-tools-ai-jobs-cache";
const AI_JOBS_REFRESH_INTERVAL_MS = 2 * 60 * 60 * 1000;

export interface AiJobsSnapshot {
  refreshedAt: number;
  categories: Category[];
  locations: Location[];
  companies: Company[];
  jobs: Job[];
}

export async function fetchAiJobsSnapshot(): Promise<AiJobsSnapshot> {
  if (typeof window === "undefined") {
    return {
      refreshedAt: Date.now(),
      categories,
      locations,
      companies,
      jobs,
    };
  }

  try {
    const cached = window.localStorage.getItem(AI_JOBS_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as AiJobsSnapshot;
      if (Date.now() - parsed.refreshedAt < AI_JOBS_REFRESH_INTERVAL_MS) {
        return parsed;
      }
    }
  } catch {
    // Ignore malformed cache values and continue to fetch fresh data.
  }

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:3000" : "");
    const response = await fetch(`${apiBaseUrl}/api/ai-jobs`, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error(`AI jobs request failed: ${response.status}`);
    }

    const payload = await response.json() as Partial<AiJobsSnapshot>;
    const snapshot: AiJobsSnapshot = {
      refreshedAt: Date.now(),
      categories: payload.categories ?? categories,
      locations: payload.locations ?? locations,
      companies: payload.companies ?? companies,
      jobs: payload.jobs ?? jobs,
    };

    try {
      window.localStorage.setItem(AI_JOBS_CACHE_KEY, JSON.stringify(snapshot));
    } catch {
      // Ignore storage write errors in private browsing or restricted environments.
    }

    return snapshot;
  } catch {
    const fallback: AiJobsSnapshot = {
      refreshedAt: Date.now(),
      categories,
      locations,
      companies,
      jobs,
    };

    try {
      window.localStorage.setItem(AI_JOBS_CACHE_KEY, JSON.stringify(fallback));
    } catch {
      // Ignore storage write errors in private browsing or restricted environments.
    }

    return fallback;
  }
}

export async function getAiJobsSnapshot(): Promise<AiJobsSnapshot> {
  return fetchAiJobsSnapshot();
}

export function getCompanyCards(snapshot?: AiJobsSnapshot) {
  const companyPool = snapshot?.companies ?? companies;
  const jobPool = snapshot?.jobs ?? jobs;

  return companyPool.map((company) => {
    const companyJobs = jobPool.filter((job) => job.companyId === company.id);
    const latestJob = companyJobs[0];

    return {
      ...company,
      jobs: companyJobs,
      availableJobsCount: companyJobs.length,
      latestUpdated: latestJob?.lastUpdated ?? company.updatedAt,
      remoteAvailability: companyJobs.some((job) => job.remote === "Remote")
        ? "Remote"
        : companyJobs.some((job) => job.remote === "Hybrid")
          ? "Hybrid"
          : "Onsite",
    };
  });
}
