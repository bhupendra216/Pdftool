import type { ToolSeoContent } from '@/components/Content/ToolSeoSection';

export const TOOL_SEO_CONTENT: Record<string, ToolSeoContent> = {
  'resume-builder': {
    slug: 'resume-builder',
    howItWorks: [
      { title: 'Edit your resume', description: 'Update your contact details and resume sections in the browser.' },
      { title: 'Review and arrange', description: 'Use the live preview, section controls, and resume modes to organize your content.' },
      { title: 'Print or save as PDF', description: 'Use the browser print dialog to print or save the resume as a PDF.' },
    ],
    whyUse: [
      { title: 'Build a resume in the browser', description: 'Edit summaries, education, experience, skills, and other sections without installing a separate application.' },
      { title: 'Choose a job or study layout', description: 'Use the Job or Higher study mode to reorder sections for the application you are preparing.' },
      { title: 'Keep resume content on your device', description: 'The builder stores resume data in browser local storage and does not upload it.' },
    ],
    faq: [
      { question: 'Is my resume uploaded?', answer: 'No. Resume content stays in browser storage and is not uploaded by the builder.' },
      { question: 'How do I save my resume as a PDF?', answer: 'Use Print or save as PDF, then choose Save as PDF in the browser print dialog.' },
      { question: 'Can I keep a backup?', answer: 'Yes. Export the resume as JSON and keep that file somewhere safe.' },
    ],
  },
  'transform-pdf': {
    slug: 'transform-pdf',
    howItWorks: [
      { title: 'Choose a PDF', description: 'Upload a PDF of up to 50 MB and 30 pages. The file is processed locally in your browser.' },
      { title: 'Tune the paper effects', description: 'Adjust paper tone, texture, color, rotation, creases, smudges, and image quality. The preview and export share the same seeded processing.' },
      { title: 'Download the aged PDF', description: 'Choose 100, 150, or 200 DPI and download a flattened image PDF. Text in the output is not selectable or searchable.' },
    ],
    whyUse: [
      { title: 'Create an aged or scanned-paper look', description: 'Combine vintage paper tones, grain, folds, smudges, and image artifacts with adjustable controls.' },
      { title: 'Preview matches the exported result', description: 'Both the preview and output use the same processing pipeline and repeatable per-document random seed.' },
      { title: 'Process locally', description: 'Your PDF is processed entirely in your browser and is not sent to a processing server.' },
    ],
    faq: [
      { question: 'Does output text stay selectable?', answer: 'No. The output is a flattened image PDF, so text is not selectable or searchable.' },
      { question: 'Why does my download look different from preview?', answer: 'It doesn’t: preview and export run identical processing with the same settings, quality, and random seed. Use Shuffle effects to choose a different repeatable layout.' },
      { question: 'What are the file limits?', answer: 'The tool accepts PDFs up to 50 MB and 30 pages. Choose a lower DPI or fewer pages if your device runs short on memory.' },
      { question: 'Can I undo the effects?', answer: 'The source file is not changed. Re-upload it and adjust the settings; Shuffle effects generates a different deterministic layout for randomized effects.' },
      { question: 'Is this tool private?', answer: 'Yes. The PDF is rendered and processed entirely in your browser; it is not uploaded to a PDF processing server.' },
    ],
  },
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
