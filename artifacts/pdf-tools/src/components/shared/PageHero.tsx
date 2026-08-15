import { type ChangeEvent } from "react";
import { BrandMark } from "@/components/brand/BrandMark";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type PageHeroProps = {
  title: string;
  description: string;
  searchId: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export function PageHero({
  title,
  description,
  searchId,
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
}: PageHeroProps) {
  return (
    <div className="relative overflow-hidden bg-card border-b border-border py-10 md:py-12 mb-16">
      <div className="pointer-events-none absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.08),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_20%)]" />
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <div className="mx-auto max-w-3xl text-center">
            <BrandMark className="mx-auto mb-6 justify-center" logoClassName="h-16 w-16" wordmarkClassName="text-xl" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">{title}</h1>
            <p className="mx-auto text-xl text-muted-foreground leading-relaxed max-w-2xl">{description}</p>
          </div>
          <div className="w-full max-w-md md:max-w-xs md:ml-auto">
            <label htmlFor={searchId} className="sr-only">
              {searchLabel}
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={searchId}
                type="text"
                placeholder={searchPlaceholder}
                className="h-11 w-full rounded-full border border-input bg-background px-11 text-sm"
                value={searchValue}
                onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
