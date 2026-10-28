import type { ToolSeoContent } from '@/components/Content/ToolSeoSection';
import { resumeBuilderSeo } from '../../../api-server/src/lib/content';

export const TOOL_SEO_CONTENT: Record<string, ToolSeoContent> = {
  'resume-builder': {
    slug: 'resume-builder',
    howToHeading: 'How to build a resume online',
    layouts: {
      title: 'Resume layouts and formats',
      description: 'Choose Job mode to lead with relevant experience, or Higher study mode to emphasize education and research. Europass CV adds its own fields and section options; it follows the Europass structure but is not an official template.',
    },
    howItWorks: [
      { title: 'Choose your format', description: 'Pick Job for a standard resume, or Higher study for grad school and academic applications. Tick Europass CV if you are applying in Europe.' },
      { title: 'Replace the sample data', description: 'The page opens with an example resume. Overwrite it with your own details, or press Start blank. The banner shows how many sample items remain.' },
      { title: 'Add, hide and reorder sections', description: 'Turn sections on or off, and move them up or down. Summary, Experience, Education, Skills, Projects, Certifications and more are available. Europass CV adds Languages, Digital skills, Driving licence, Memberships, Conferences and Grants.' },
      { title: 'Check the live preview', description: 'The preview shows page breaks and the page count as you type. Use Compact spacing or the Text and fonts settings if you spill onto another page.' },
      { title: 'Print or save as PDF', description: 'The PDF uses real, selectable text. Use Export JSON to save your resume and Import JSON to keep editing later.' },
    ],
    whyUse: [
      { title: 'Private by design', description: 'Your resume stays in this browser. Nothing is uploaded, and there is no account to create.' },
      { title: 'Text that parsers can read', description: 'The PDF is real, selectable text, not an image, so applicant tracking systems and recruiters can copy and search it. Its simple, single-column layout is ATS-friendly, but compatibility depends on each system.' },
      { title: 'Two formats plus Europass CV', description: 'Job and Higher study start from different section orders. Europass CV works on top of either one and adds nationality, date of birth, address, an optional photo, and language levels on the CEFR scale (A1 to C2).' },
      { title: 'Preview that matches the PDF', description: 'Page breaks in the preview follow the same layout as the export, so what you see is what you download.' },
      { title: 'Sample data you can edit', description: 'You start with a complete example instead of an empty form, and one click clears it.' },
      { title: 'Your data stays portable', description: 'Export your resume as JSON, back it up, or move it to another device.' },
    ],
    notice: 'The Europass CV mode is inspired by the Europass structure. It is not an official Europass template.',
    featuredGuide: {
      slug: '2026-10-27-job-resume-vs-europass-cv-what-to-include-and-how-to-format-each',
      title: 'Job Resume vs Europass CV: What to Include and How to Format Each',
      description: 'A practical comparison of a standard job resume and a Europass-style CV: which sections to include, what to leave out, how long each should be, and how to keep the PDF readable by parsers.',
    },
    relatedTools: [
      { slug: 'pdf-to-markdown', name: 'PDF to Markdown', reason: 'convert a PDF into clean Markdown.' },
      { slug: 'add-page-numbers', name: 'Add Page Numbers', reason: 'number the pages of a longer CV or application pack.' },
      { slug: 'pdf-to-word', name: 'PDF to Word', reason: 'turn an old resume PDF into an editable document.' },
      { slug: 'ocr-pdf', name: 'OCR PDF', reason: 'make a scanned resume or certificate searchable.' },
    ],
    faq: [
      { question: 'Is the resume builder free?', answer: 'Yes, the resume builder is free with no account, no watermark, and no limit on saving as PDF. Optional JSON import accepts files up to 2 MB.' },
      { question: 'Are my details uploaded anywhere?', answer: 'No. Your resume is edited and exported in your browser. It is not sent to a server. Your work is kept in your browser’s storage on this device, so clearing site data or switching browsers will remove it. Use Export JSON to keep a backup.' },
      { question: 'Is the resume ATS-friendly?', answer: 'The PDF uses selectable text and a simple single-column layout that is ATS-friendly. Applicant tracking systems vary, so no format can guarantee compatibility; check that you can select and copy the text in your exported PDF.' },
      { question: 'What is the difference between Job and Higher study?', answer: 'Job puts experience first and focuses on results at work. Higher study puts education, research, publications and awards earlier, which suits graduate school, scholarships and academic positions.' },
      { question: 'What does the Europass CV option change?', answer: 'It adds nationality, date of birth and address fields, places the Summary first, and turns on Languages and Digital skills. It also lets you add Driving licence, Memberships, Conferences and Grants, and an optional profile photo. It follows the Europass structure but is not an official template.' },
      { question: 'Should I include a photo or date of birth?', answer: 'It depends on the country. Photos and dates of birth are common on CVs in parts of Europe, but in the US, UK and Canada employers generally prefer you leave them out. The photo only appears in Europass CV mode and you can remove it at any time.' },
      { question: 'How many pages should my resume be?', answer: 'One page is the usual target for early-career job resumes. Europass-style CVs and academic CVs often run to two pages. The preview shows your page count, and Compact spacing can help you fit.' },
      { question: 'Can I save my resume and edit it later?', answer: 'Yes. Use Export JSON to save it, then Import JSON to continue. Your work is also kept in this browser between visits, but the JSON file is the safe backup.' },
      { question: 'Can I use my own photo, and where does it go?', answer: 'You can upload a PNG, JPEG or WebP. It stays in your browser, is resized before it is stored, and is only drawn in the PDF when Europass CV is on.' },
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
