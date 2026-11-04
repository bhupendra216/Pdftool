import { describe, expect, it } from 'vitest';
import { blogPosts, tools } from '../../../api-server/src/lib/content';
import {
  EDIT_PDF_META_DESCRIPTION,
  EDIT_PDF_SEO_TITLE,
  TOOL_SEO_CONTENT,
} from '../data/toolSeoContent';

describe('Edit PDF SEO content', () => {
  const content = TOOL_SEO_CONTENT['edit-pdf'];

  it('keeps the requested title and description within limits and unique', () => {
    expect(EDIT_PDF_SEO_TITLE).toBe('Edit PDF Online Free: Hindi, Nepali & English Text | PDFKira');
    expect(EDIT_PDF_SEO_TITLE.length).toBe(60);
    expect(EDIT_PDF_META_DESCRIPTION).toBe(
      'Edit text in PDF files online, including Hindi and Nepali (Devanagari). Runs in your browser, so your file never leaves your device.',
    );
    expect(EDIT_PDF_META_DESCRIPTION.length).toBeLessThan(155);

    expect(
      tools.filter((tool) => tool.slug !== 'edit-pdf').some((tool) =>
        tool.seoTitle === EDIT_PDF_SEO_TITLE || tool.seoDescription === EDIT_PDF_META_DESCRIPTION,
      ),
    ).toBe(false);
    expect(blogPosts.some((post) =>
      post.title === EDIT_PDF_SEO_TITLE || post.excerpt === EDIT_PDF_META_DESCRIPTION,
    )).toBe(false);
  });

  it('uses the verified Devanagari content, limits, and registered OCR route', () => {
    expect(content.pageSubheading).toBe('Works with English, Hindi and Nepali (Devanagari) text.');
    expect(content.languageSection?.heading).toBe('Hindi and Nepali PDF editing');
    expect(content.languageSection?.hindiLine).toBe('हिंदी और नेपाली PDF में टेक्स्ट एडिट करें');
    expect(content.languageSection?.nepaliLine).toBe('नेपाली र हिन्दी PDF मा पाठ सम्पादन गर्नुहोस्');
    expect(content.languageSection?.fonts).toEqual([
      'Noto Sans Devanagari',
      'Noto Serif Devanagari',
      'Mukta',
    ]);
    expect(content.languageSection?.typing).toContain('namaste');
    expect(content.languageSection?.typing).toContain('nepal');
    expect(content.languageSection?.limits).toContain('Scanned PDFs need OCR first');
    expect(content.languageSection?.limits).toContain('Preeti or Kantipur');
    expect(content.languageSection?.limits).toContain('damaged text that must be retyped');
    expect(content.relatedTools?.map((tool) => tool.slug)).toEqual(['ocr-pdf']);
    expect(tools.some((tool) => tool.slug === 'ocr-pdf' && tool.status === 'available')).toBe(true);
    expect(content.howItWorks.slice(-2).map((step) => step.title)).toEqual([
      'Choose a Devanagari font',
      'Turn on phonetic typing',
    ]);
  });

  it('has nine FAQs using the Edit PDF display name and no slug', () => {
    expect(content.faq).toHaveLength(9);
    const faqText = content.faq.map((faq) => `${faq.question} ${faq.answer}`).join(' ');
    for (const faq of content.faq) {
      expect(`${faq.question} ${faq.answer}`).toContain('Edit PDF');
      expect(`${faq.question} ${faq.answer}`).not.toContain('edit-pdf');
    }
    expect(content.faq.map((faq) => faq.question)).toEqual([
      'Is Edit PDF free?',
      'Does Edit PDF upload my file to a server?',
      'What edits does Edit PDF support?',
      'Can Edit PDF edit Hindi and Nepali text?',
      'Which fonts can I use in Edit PDF for Hindi and Nepali text?',
      'How can I type Hindi or Nepali text in Edit PDF?',
      'Can Edit PDF edit scanned Hindi or Nepali PDFs?',
      'Can Edit PDF read Preeti or Kantipur fonts?',
      'Can Edit PDF securely redact text?',
    ]);
    expect(content.faq[0]?.answer).toBe('Yes. Edit PDF is free to use and does not require signup.');
    expect(content.faq[1]?.answer).toBe('No. Edit PDF works in your browser, and your file is not uploaded.');
    expect(content.faq[2]?.answer).toContain(
      'Select and replace or delete text, add text, and download a new PDF.',
    );
    expect(content.faq[2]?.answer).toContain(
      'deleting text flattens the pages so the old text is not extractable, but this is not a secure redaction tool.',
    );
    expect(faqText).toMatch(/\bfree\b|no signup/i);
  });
});
