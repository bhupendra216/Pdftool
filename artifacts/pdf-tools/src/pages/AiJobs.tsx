import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BriefcaseBusiness, Building2, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSEOAdvanced } from "@/hooks/use-seo";
import { SITE_URL } from "@/lib/site-config";
import { categories, companies, getAiJobsSnapshot, getCompanyCards, jobs, locations, type AiJobsSnapshot } from "@/lib/ai-jobs";
import type { Job } from "@/lib/ai-jobs-data";

function formatDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function AiJobs() {
  useSEOAdvanced({
    title: "AI Jobs",
    description: "Discover curated remote and hybrid AI jobs from leading companies hiring worldwide.",
    canonical: `${SITE_URL}/ai-jobs`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "AI Jobs",
      url: `${SITE_URL}/ai-jobs`,
    },
  });

  const [snapshot, setSnapshot] = useState<AiJobsSnapshot>(() => ({
    refreshedAt: Date.now(),
    categories,
    locations,
    companies,
    jobs,
  }));
  const companyCards = useMemo(() => getCompanyCards(snapshot), [snapshot]);
  const [query, setQuery] = useState("");
  const [company, setCompany] = useState("All Companies");
  const [category, setCategory] = useState("All Categories");
  const [mode, setMode] = useState("All Modes");
  const [country, setCountry] = useState("All Countries");
  const [jobType, setJobType] = useState("All Types");

  useEffect(() => {
    let cancelled = false;

    const loadSnapshot = async () => {
      const nextSnapshot = await getAiJobsSnapshot();
      if (!cancelled) {
        setSnapshot(nextSnapshot);
      }
    };

    void loadSnapshot();

    const intervalId = window.setInterval(() => {
      void loadSnapshot();
    }, 1000 * 60 * 60 * 2);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return companyCards.filter((card) => {
      const matchesQuery =
        !normalizedQuery ||
        card.name.toLowerCase().includes(normalizedQuery) ||
        card.description.toLowerCase().includes(normalizedQuery) ||
        card.jobs.some((job: Job) => job.title.toLowerCase().includes(normalizedQuery));

      const matchesCompany = company === "All Companies" || card.name === company;
      const matchesCategory =
        category === "All Categories" ||
        card.jobs.some((job: Job) => {
          const matchCategory = categories.find((entry) => entry.id === job.categoryId);
          return matchCategory?.name === category;
        });
      const matchesMode = mode === "All Modes" || card.jobs.some((job: Job) => job.remote === mode);
      const matchesCountry = country === "All Countries" || card.jobs.some((job: Job) => {
        const location = snapshot.locations.find((entry) => entry.id === job.locationId);
        return location?.country === country || location?.city === country || location?.region === country;
      });
      const matchesType = jobType === "All Types" || card.jobs.some((job: Job) => job.jobType === jobType);

      return matchesQuery && matchesCompany && matchesCategory && matchesMode && matchesCountry && matchesType;
    });
  }, [company, companyCards, country, category, jobType, mode, query]);

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border/70 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-20 md:px-6 md:py-28">
          <div className="mx-auto flex max-w-5xl flex-col gap-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Curated AI hiring opportunities
            </div>
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div className="space-y-5">
                <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  Find the Best Remote AI Jobs
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  Discover verified opportunities from leading AI companies hiring worldwide across training, evaluation, engineering, and research.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    25+ curated companies
                  </Badge>
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    Remote-ready roles
                  </Badge>
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    Verified weekly updates
                  </Badge>
                </div>
              </div>
              <div className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <BriefcaseBusiness className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Snapshot</p>
                    <p className="text-2xl font-semibold text-foreground">{companyCards.length}+ active partners</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-background/60 p-4">
                    <p className="text-sm text-muted-foreground">Open roles</p>
                    <p className="mt-1 text-xl font-semibold text-foreground">{companyCards.reduce((total, card) => total + card.availableJobsCount, 0)}</p>
                  </div>
                  <div className="rounded-2xl bg-background/60 p-4">
                    <p className="text-sm text-muted-foreground">Auto-refresh</p>
                    <p className="mt-1 text-xl font-semibold text-foreground">Every 2 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 md:px-6 md:py-14">
        <div className="rounded-3xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur md:p-6">
          <div className="grid gap-4 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Search</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search roles, companies, skills"
                  className="h-11 rounded-2xl pl-9"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Company</label>
              <select
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm"
              >
                <option>All Companies</option>
                {companies.map((entry) => (
                  <option key={entry.id} value={entry.name}>{entry.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Category</label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm"
              >
                <option>All Categories</option>
                {categories.map((entry) => (
                  <option key={entry.id} value={entry.name}>{entry.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Mode</label>
              <select
                value={mode}
                onChange={(event) => setMode(event.target.value)}
                className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm"
              >
                <option>All Modes</option>
                <option>Remote</option>
                <option>Hybrid</option>
                <option>Onsite</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-muted-foreground">Job Type</label>
              <select
                value={jobType}
                onChange={(event) => setJobType(event.target.value)}
                className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm"
              >
                <option>All Types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Freelance</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20 md:px-6 md:pb-28">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Featured companies</h2>
            <p className="text-sm text-muted-foreground">Browse high-signal opportunities from organizations building the next wave of AI products. The feed refreshes automatically every two hours.</p>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1">{filteredCompanies.length} matches</Badge>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {filteredCompanies.map((card) => (
            <article
              key={card.id}
              className="group rounded-[28px] border border-border/70 bg-card/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_-30px_rgba(15,23,42,0.35)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                    {card.logo}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{card.name}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full">
                  {card.availableJobsCount} jobs
                </Badge>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {card.jobs.slice(0, 3).map((job: Job) => (
                  <Badge key={job.id} variant="outline" className="rounded-full px-3 py-1 text-xs">
                    {job.title}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Remote</p>
                  <p className="mt-1 font-medium text-foreground">{card.remoteAvailability}</p>
                </div>
                <div className="rounded-2xl bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Updated</p>
                  <p className="mt-1 font-medium text-foreground">{formatDate(card.latestUpdated)}</p>
                </div>
                <div className="rounded-2xl bg-background/70 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Source</p>
                  <p className="mt-1 font-medium text-foreground">{card.source}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  {card.jobs[0]?.jobType ?? "Open roles"}
                </div>
                <Button asChild variant="outline" className="rounded-full">
                  <a href={card.website} target="_blank" rel="noreferrer">
                    Visit Careers
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
