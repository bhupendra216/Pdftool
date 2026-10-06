import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { companies } from "@/lib/ai-jobs";
import { useSEO } from "@/hooks/use-seo";

export function AiJobs() {
  useSEO({
    title: "AI Training & Annotation Company Directory | PDFKira",
    description: "A curated list of companies that hire for AI training, annotation, transcription, and related remote work.",
  });

  const [query, setQuery] = useState("");

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return companies;

    return companies.filter((company) =>
      `${company.name} ${company.description} ${company.categories.join(" ")}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [companies, query]);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/70 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            AI training and annotation companies
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
            A curated list of companies that hire for AI training, annotation, and transcription work, for people looking to find this kind of remote work.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-10 md:px-6">
        <label className="relative block max-w-xl">
          <span className="sr-only">Search companies or work categories</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search companies or work types"
            className="h-11 rounded-xl pl-9"
          />
        </label>
      </section>

      <section className="container mx-auto max-w-6xl px-4 pb-20 md:px-6">
        {filteredCompanies.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No companies match that search.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((company) => (
              <article key={company.slug} className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground">{company.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{company.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {company.categories.map((category) => (
                    <Badge key={category} variant="secondary">{category}</Badge>
                  ))}
                </div>
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex h-10 items-center justify-center self-start rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  View openings
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
