import { FaqItem } from "@workspace/api-client-react/src/generated/api.schemas";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection({ faqs, title = "Frequently Asked Questions" }: { faqs: FaqItem[], title?: string }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-card w-full">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{title}</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border bg-background px-6 rounded-2xl shadow-sm">
              <AccordionTrigger className="text-left font-medium text-lg hover:no-underline py-5 text-foreground hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
