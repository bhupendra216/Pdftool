import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { gigCategorySections, gigPlatforms, type GigCategory } from "../../../../data/gig-platforms";

const platformAnchor = (name: string) => `gig-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

export function GigPlatformsDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<GigCategory | "all">("all");

  const visibleSections = gigCategorySections.filter(
    (category) => selectedCategory === "all" || category.id === selectedCategory,
  );

  return (
    <section className="container mx-auto max-w-6xl px-4 py-12 md:px-6" aria-labelledby="gig-platforms-title">
      <div className="mb-8 max-w-3xl">
        <h2 id="gig-platforms-title" className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Non-Technical AI Gig Platforms
        </h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
          Explore remote AI tasks and data collection projects across translation, video recording, photo collection,
          handwriting, and response review. Some projects are suitable for beginners, though screening, task
          availability, and qualifications vary by platform.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2" aria-label="Filter platforms by task category">
        <button
          type="button"
          aria-pressed={selectedCategory === "all"}
          onClick={() => setSelectedCategory("all")}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-muted"}`}
        >
          All
        </button>
        {gigCategorySections.map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === category.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-muted"}`}
          >
            {category.title.replace(/^[^ ]+ /, "")}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {visibleSections.map((category) => {
          const matchingPlatforms = gigPlatforms.filter((platform) => platform.categories.includes(category.id));
          if (matchingPlatforms.length === 0) return null;

          return (
            <section key={category.id} aria-labelledby={`category-${category.id}`}>
              <h2 id={`category-${category.id}`} className="mb-5 text-2xl font-semibold tracking-tight text-foreground">
                {category.title}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {matchingPlatforms.map((platform) => {
                  const primaryCategory = platform.categories[0];
                  const visitUrl = platform.referralUrl || platform.signupUrl;

                  return (
                    <article
                      id={primaryCategory === category.id ? platformAnchor(platform.name) : undefined}
                      key={platform.name}
                      className="flex h-full min-w-0 flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-foreground">
                        <a href={platform.signupUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline-offset-4 hover:underline">
                          {platform.name}
                        </a>
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{platform.description}</p>
                      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-5 text-foreground">
                        {platform.taskExamples.map((example) => <li key={example}>{example}</li>)}
                      </ul>
                      <div className="mt-4 flex min-w-0 flex-wrap gap-2">
                        <Badge variant="secondary" className="max-w-full whitespace-normal break-words text-left leading-4">
                          {platform.payRange}
                        </Badge>
                        {platform.beginnerFriendly && <Badge variant="outline">Beginner friendly</Badge>}
                        {platform.ratingNote && <span className="w-full text-xs text-muted-foreground">{platform.ratingNote}</span>}
                      </div>
                      <div className="mt-5 flex items-center gap-2">
                        <a
                          href={visitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          Visit site →
                        </a>
                        {platform.referralUrl && <span className="text-xs text-muted-foreground">(referral)</span>}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
