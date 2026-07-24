import type { FaqItem } from "@workspace/api-client-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection({ faqs, title = "Frequently Asked Questions" }: { faqs: FaqItem[], title?: string }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="w-full border-t border-border/70 bg-card/60 py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Quick answers to common questions before you upload or download.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="rounded-2xl border border-border/70 bg-background/90 px-6 shadow-sm">
              <AccordionTrigger className="py-5 text-left text-lg font-medium text-foreground transition-colors hover:no-underline hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
