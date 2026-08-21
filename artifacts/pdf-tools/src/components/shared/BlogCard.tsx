import { Link } from "wouter";
import type { BlogPost } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Sparkles, ShieldCheck, Megaphone, Newspaper } from "lucide-react";

const categoryStyles: Record<
  string,
  {
    headerClass: string;
    badgeClass: string;
    iconBgClass: string;
    icon: typeof BookOpen;
  }
> = {
  guides: {
    headerClass:
      "bg-gradient-to-br from-sky-50 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
    badgeClass: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200",
    iconBgClass: "bg-white/85 text-sky-600 dark:bg-slate-900/80 dark:text-sky-300",
    icon: BookOpen,
  },
  "tips & tricks": {
    headerClass:
      "bg-gradient-to-br from-emerald-50 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
    iconBgClass: "bg-white/85 text-emerald-600 dark:bg-slate-900/80 dark:text-emerald-300",
    icon: Sparkles,
  },
  tips: {
    headerClass:
      "bg-gradient-to-br from-emerald-50 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
    iconBgClass: "bg-white/85 text-emerald-600 dark:bg-slate-900/80 dark:text-emerald-300",
    icon: Sparkles,
  },
  security: {
    headerClass:
      "bg-gradient-to-br from-violet-50 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
    badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-200",
    iconBgClass: "bg-white/85 text-violet-600 dark:bg-slate-900/80 dark:text-violet-300",
    icon: ShieldCheck,
  },
  updates: {
    headerClass:
      "bg-gradient-to-br from-orange-50 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
    badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-200",
    iconBgClass: "bg-white/85 text-orange-600 dark:bg-slate-900/80 dark:text-orange-300",
    icon: Megaphone,
  },
  default: {
    headerClass:
      "bg-gradient-to-br from-slate-50 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
    badgeClass: "bg-secondary text-secondary-foreground dark:bg-slate-900 dark:text-slate-200",
    iconBgClass: "bg-white/85 text-slate-700 dark:bg-slate-900/80 dark:text-slate-300",
    icon: Newspaper,
  },
};

export function BlogCard({ post }: { post: BlogPost }) {
  const categoryKey = post.category.toLowerCase();
  const style = categoryStyles[categoryKey] ?? categoryStyles.default;
  const Icon = style.icon;

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group h-full overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className={`relative overflow-hidden ${style.headerClass}`}>
          <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.7),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.16),transparent_45%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_45%)]" />
          <div className="relative flex items-center justify-between gap-4 px-6 py-6">
            <div className="rounded-3xl bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm dark:bg-slate-950/80 dark:text-slate-200">
              {post.category}
            </div>
            <div className={`flex h-14 w-14 items-center justify-center rounded-3xl ${style.iconBgClass} shadow-sm`}>
              <Icon className="h-7 w-7" />
            </div>
          </div>
        </div>
        <CardContent className="p-6 flex flex-col h-full">
          <h3 className="font-bold text-xl md:text-2xl mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 line-clamp-3 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center text-sm font-medium text-primary mt-auto">
            Read article
            <svg
              className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
