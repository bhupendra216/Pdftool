import type { ToolSeoContent } from '@/components/Content/ToolSeoSection';

export const TOOL_SEO_CONTENT: Record<string, ToolSeoContent> = {
  'pdf-to-word': {
    slug: 'pdf-to-word',
    howItWorks: [
      { title: 'Upload your PDF', description: 'Select the PDF file you want to convert — drag-and-drop or use the file picker. Files are processed securely in the browser or on our servers, depending on the operation.' },
      { title: 'Convert to editable Word', description: 'The tool extracts text, images, and layout cues and generates a DOCX file that you can open in Microsoft Word or Google Docs.' },
      { title: 'Edit and download', description: 'Review the DOCX, make edits locally, and download the file. No installation required — ready for immediate use.' },
    ],
    whyUse: [
      { title: 'Convert PDF to editable Word document', description: 'Quickly turn locked or read-only PDFs into DOCX files so you can update content, correct typos, and reuse text without retyping. Ideal for contracts, reports, and editable templates.' },
      { title: 'Free PDF to DOCX converter online', description: 'Use our web-based converter for one-off edits or light workflows without paying for software. The process is designed for speed and ease while keeping layout fidelity where possible.' },
      { title: 'No software installation required', description: 'Work directly in your browser — upload, convert, and download without installing desktop apps. The workflow supports mobile and desktop browsers for flexible use.' },
    ],
    faq: [
      { question: 'Is it safe to convert PDF to Word online?', answer: 'Yes. Files are handled using secure transfer and processing; temporary copies are removed after processing. Avoid uploading sensitive files if you require additional enterprise-level guarantees.' },
      { question: 'Will my formatting stay the same?', answer: 'We preserve common layout and formatting where possible, but complex designs or custom fonts may require manual adjustments after conversion.' },
      { question: 'Is there a file size or page limit?', answer: 'Typical uploads support files up to 50MB and around 20 pages for best results; large or scanned documents may take longer or require OCR.' },
      { question: 'Do I need to install anything?', answer: 'No. The converter runs from your browser — select a file, convert, and download the DOCX without extra software.' },
      { question: 'Is this really free?', answer: 'Yes — basic conversions are free. We may offer paid tiers for larger files, faster processing, or priority handling.' },
    ],
  },
  
};

export default TOOL_SEO_CONTENT;
