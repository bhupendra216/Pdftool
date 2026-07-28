import { cn } from "@/lib/utils";
import logo from "@/assets/pdfkira-logo.png";

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
  showWordmark = true,
}: BrandMarkProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src={logo}
        alt="PDFKira"
        className={cn("block shrink-0 object-contain", logoClassName)}
      />
      {showWordmark ? (
        <span className={cn("font-bold leading-none tracking-tight text-foreground", wordmarkClassName)}>
          PDFKira
        </span>
      ) : null}
    </div>
  );
}