import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  logoClassName?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
};

export function BrandMark({
  className,
  logoClassName,
  wordmarkClassName,
  showWordmark = false,
}: BrandMarkProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <span className={cn("inline-flex items-center justify-center overflow-hidden rounded-xl bg-background dark:bg-white", logoClassName)}>
          <img
            src="/favicon.jpeg"
            alt="PDFKira"
            className="block h-full w-full object-cover object-center"
          />
      </span>
      {showWordmark ? (
        <span className={cn("font-bold leading-none tracking-tight text-foreground", wordmarkClassName)}>
          PDFKira
        </span>
      ) : null}
    </div>
  );
}