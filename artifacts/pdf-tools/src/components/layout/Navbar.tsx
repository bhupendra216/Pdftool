import { Link, useLocation } from "wouter";
import { Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { BrandMark } from "@/components/brand/BrandMark";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/tools", label: "All Tools" },
    { href: "/blog", label: "Blog" },
    { href: "/ai-jobs", label: "AI Jobs" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <BrandMark logoClassName="h-14 w-14" wordmarkClassName="text-lg" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.startsWith(link.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <ThemeToggle />
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="flex flex-col">

            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="mb-8 flex items-center gap-3"
            >
              <BrandMark logoClassName="h-14 w-14" wordmarkClassName="text-xl" />
            </Link>

            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium transition-colors hover:text-primary ${
                    location.startsWith(link.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-2 flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 px-3 py-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Theme
                </span>

                <ThemeToggle />
              </div>

            </div>

          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
}