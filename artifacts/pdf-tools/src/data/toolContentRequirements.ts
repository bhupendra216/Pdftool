import { getAvailableToolPath, type ToolRecord } from '../../../api-server/src/lib/content';
import { getSuppliedToolFaqs } from './toolFaqs';
import toolContent from './toolContent.js';

export interface ToolContentRequirements {
  uniqueIntro: string;
  useCases: Array<{ title: string; description: string; example?: string }>;
  howToSteps: Array<{ step: number; title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
  limitations: string[];
  technicalSpecs: {
    inputFormats: string[];
    outputFormats: string[];
    maxFileSize: string;
    processingTime: string;
  };
  privacyModel: {
    type: 'browser-only' | 'server-processed' | 'hybrid';
    description: string;
  };
  relatedTools: Array<{ toolSlug: string; reason?: string }>;
  proTips?: string[];
  commonMistakes?: string[];
}

const customDeletePages: ToolContentRequirements = {
  uniqueIntro:
    'Delete unwanted pages from a PDF without installing desktop software. PDFKira is useful for removing blank scans, duplicate pages, confidential appendices, or sections that should not be shared. Select pages visually, review the remaining document, and download a separate PDF while keeping your original file unchanged.',
  useCases: [
    { title: 'Clean scanned documents', description: 'Remove blank scans, test pages, and duplicate captures from a scanned document.', example: 'Delete three blank pages from a scanned contract before sending it to a client.' },
    { title: 'Share only the relevant section', description: 'Keep the chapters, exhibits, or pages needed for a specific reader instead of sending a full report.', example: 'Remove unrelated chapters from a 200-page manual before sharing the troubleshooting section.' },
    { title: 'Remove confidential appendices', description: 'Create a shareable copy without salary pages, internal notes, or private attachments.', example: 'Delete an internal pricing appendix from a proposal before emailing the customer version.' },
    { title: 'Prepare a presentation handout', description: 'Shorten a document for meetings by removing draft pages, notes, and outdated material.', example: 'Remove speaker notes and old agenda pages from a presentation handout.' },
  ],
  howToSteps: [
    { step: 1, title: 'Upload your PDF', description: 'Drag a PDF into the upload area or choose it from your device. The original file is not overwritten.' },
    { step: 2, title: 'Select pages to remove', description: 'Use the page thumbnails to identify unwanted pages and select one or several pages.' },
    { step: 3, title: 'Review the selection', description: 'Check the selected page numbers and confirm that the pages you want to keep remain in the preview.' },
    { step: 4, title: 'Delete the selected pages', description: 'Start processing once the selection is correct. The output is created as a separate PDF.' },
    { step: 5, title: 'Download and check the result', description: 'Open the downloaded file and verify its page order before sharing or archiving it.' },
  ],
  faqs: [
    { question: 'Is my PDF uploaded to a server?', answer: 'This tool processes the PDF in your browser. The document is not sent to a remote conversion service during the page deletion workflow.' },
    { question: 'What is the maximum file size?', answer: 'Files up to 50MB are supported. Very large or image-heavy PDFs can require more memory and may take longer on older devices.' },
    { question: 'Can I undo a deleted page?', answer: 'Deletion applies to the downloaded copy and cannot be undone inside that output. Keep the original PDF so you can create another version if needed.' },
    { question: 'Can I edit a password-protected PDF?', answer: 'Encrypted PDFs may need to be unlocked first. Use the Unlock PDF workflow only when you have permission to remove the document restriction.' },
    { question: 'Will deleting pages reduce the file size?', answer: 'Usually yes, especially when removed pages contain large scans or images. Use Compress PDF afterward if the remaining file is still too large.' },
    { question: 'Can I delete pages from several PDFs at once?', answer: 'The workflow handles one PDF at a time. For multiple source files, process each one separately or merge them first when that matches your intended result.' },
  ],
  limitations: [
    'Encrypted or permission-restricted files may need to be unlocked before pages can be removed.',
    'Large scanned documents can use substantial browser memory during preview and export.',
    'Interactive form fields, embedded media, or unusual PDF features should be checked in the downloaded result.',
    'Page deletion is permanent in the output file, so retain the source document as a backup.',
  ],
  technicalSpecs: { inputFormats: ['PDF'], outputFormats: ['PDF'], maxFileSize: '50MB', processingTime: 'A few seconds for typical documents' },
  privacyModel: { type: 'browser-only', description: 'The page selection and PDF export run locally in your browser; the selected document is not uploaded for processing.' },
  relatedTools: [
    { toolSlug: 'merge-pdf', reason: 'Combine the cleaned document with another PDF.' },
    { toolSlug: 'split-pdf', reason: 'Extract a page range when you want a separate section.' },
    { toolSlug: 'compress-pdf', reason: 'Reduce the size of the remaining pages for email or sharing.' },
    { toolSlug: 'organize-pdf', reason: 'Reorder pages after removing unwanted content.' },
  ],
  proTips: ['Keep the original file until you have checked the output.', 'Use thumbnails and page numbers together when similar pages appear next to each other.'],
  commonMistakes: ['Selecting a page by appearance without checking its page number', 'Deleting the source file before reviewing the downloaded copy'],
};

const resumeBuilderContent: ToolContentRequirements = {
  uniqueIntro:
    'Create and edit a resume in your browser with sections for your summary, education, experience, skills, and more. Your resume is saved in this browser and is not uploaded; use the browser print dialog to print or save it as a PDF.',
  useCases: [
    { title: 'Create a job resume', description: 'Add contact details and organize experience, skills, and education for a job application.' },
    { title: 'Prepare a higher-study CV', description: 'Arrange education, projects, publications, awards, and community work for an academic application.' },
    { title: 'Export a shareable copy', description: 'Review the live preview, then use the browser print dialog to print or save the resume as PDF.' },
  ],
  howToSteps: [
    { step: 1, title: 'Edit your details', description: 'Replace the fictional sample contact information and update the summary, education, skills, and other sections.' },
    { step: 2, title: 'Organize the resume', description: 'Choose Job or Higher study mode, reorder sections, and add or hide sections as needed.' },
    { step: 3, title: 'Review the preview', description: 'Check the resume content and choose A4 or Letter page size and optional compact spacing.' },
    { step: 4, title: 'Print or save as PDF', description: 'Open the browser print dialog and select a printer or its Save as PDF option.' },
  ],
  faqs: [
    { question: 'Is my resume uploaded?', answer: 'No. Resume content is kept in this browser using local storage. The builder does not upload resume content.' },
    { question: 'How do I create a PDF?', answer: 'Select Print or save as PDF and use the browser print dialog. The builder does not create or upload a PDF through a server.' },
    { question: 'Can I export or import my resume?', answer: 'Yes. You can export a JSON copy or import a supported resume JSON file up to 2 MB.' },
    { question: 'What page sizes are available?', answer: 'The print page size can be set to A4 or Letter before opening the print dialog.' },
  ],
  limitations: [
    'Resume data is saved in the current browser; clearing browser storage or using another device does not transfer it.',
    'PDF output is produced by the browser print dialog, so final pagination and printer settings depend on the browser.',
    'JSON import is limited to files up to 2 MB and to the fields supported by the builder.',
  ],
  technicalSpecs: {
    inputFormats: ['No resume file required', 'Optional JSON import (up to 2 MB)'],
    outputFormats: ['Browser print dialog / Save as PDF', 'JSON export'],
    maxFileSize: '2 MB for optional JSON import; no document upload',
    processingTime: 'Edits and preview update in the browser',
  },
  privacyModel: {
    type: 'browser-only',
    description: 'Resume data is stored in this browser and is not uploaded by the builder. Printing or saving a PDF uses the browser print dialog.',
  },
  relatedTools: [],
  proTips: ['Replace or clear every sample item before sharing your resume.', 'Keep a JSON export if you want a portable backup.'],
};

function titleCase(slug: string) {
  return slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function getToolContentRequirements(tool: ToolRecord): ToolContentRequirements {
  const suppliedFaqs = getSuppliedToolFaqs(tool.slug);
  if (tool.slug === 'delete-pages') return suppliedFaqs ? { ...customDeletePages, faqs: suppliedFaqs } : customDeletePages;
  if (tool.slug === 'resume-builder') return resumeBuilderContent;

  const name = tool.name || titleCase(tool.slug);
  const authoredContent = Object.entries(toolContent).find(([slug]) => slug === tool.slug)?.[1];
  const relatedTools = authoredContent?.relatedTools
    .filter((slug) => slug !== tool.slug)
    .slice(0, 4)
    .flatMap((toolSlug) => {
      const toolPath = getAvailableToolPath(toolSlug);
      return toolPath ? [{ toolSlug }] : [];
    }) ?? [];
  const useCases = authoredContent?.useCases.map(({ title, description }) => ({ title, description })) ?? [];
  const subject = tool.shortDescription.replace(/[.]+$/, '');

  return {
    uniqueIntro: `${name} helps you ${subject.toLowerCase()}. It is designed for a focused browser workflow: choose a document, review the available options, and download a separate result without changing your original file. It can be useful for students, office teams, freelancers, and anyone who needs a quick document operation without installing a full desktop suite.`,
    useCases,
    howToSteps: [
      { step: 1, title: 'Choose your file', description: `Open ${name} and select a source file from your device. Confirm that you have permission to process its contents.` },
      { step: 2, title: 'Review the document', description: 'Check the preview and visible options before starting so the selected input and intended output are clear.' },
      { step: 3, title: 'Apply the operation', description: `Use the ${name} controls to make the requested change, then wait for processing to finish.` },
      { step: 4, title: 'Inspect the result', description: 'Open or preview the generated file and check text, page order, images, and formatting that matter for your use case.' },
      { step: 5, title: 'Download a separate copy', description: 'Save the result with a descriptive name. Keep the original until you are satisfied with the output.' },
    ],
    faqs: suppliedFaqs ?? [
      { question: `What does ${name} do?`, answer: `${tool.shortDescription} The tool is intended for a focused document workflow rather than a replacement for a full desktop publishing application.` },
      { question: `Do I need to install software for ${name}?`, answer: 'No. You can use the tool in a current browser. A stable connection may still be needed to load the site and its application assets.' },
      { question: `Is ${name} free to use?`, answer: 'PDFKira provides this core workflow free to use without requiring an account. Review the result before relying on it for an important submission.' },
      { question: `Will ${name} preserve my formatting?`, answer: 'Results depend on the source file and its embedded fonts, images, forms, and structure. Always inspect the downloaded PDF, especially when the document has complex layouts.' },
      { question: `What files can I use with ${name}?`, answer: 'The primary input is PDF unless the page states otherwise. The upload controls show the supported file type and any current size or page limits.' },
      { question: `How should I check the output from ${name}?`, answer: 'Open the result and verify the pages, text, images, and metadata relevant to your task before sharing it or deleting the source file.' },
    ],
    limitations: [
      'Complex layouts, embedded fonts, forms, annotations, and unusual PDF features may not reproduce perfectly.',
      'Very large or image-heavy files can take longer and may require more memory in the browser.',
      'Password-protected or permission-restricted files may require authorization before processing.',
      'Always review the downloaded result; automated document processing should not replace a final human check.',
    ],
    technicalSpecs: { inputFormats: ['PDF'], outputFormats: ['PDF'], maxFileSize: '50MB unless the page states a lower limit', processingTime: 'Usually a few seconds for typical documents' },
    privacyModel: { type: 'hybrid', description: 'PDFKira tools use browser processing where supported; workflows that require server processing transfer files over HTTPS and remove temporary files according to the site policy.' },
    relatedTools,
    proTips: ['Use a descriptive output filename.', 'Keep the source file until the result has passed a visual check.', 'For sensitive documents, review the privacy notice and use browser-only workflows when available.'],
    commonMistakes: ['Skipping the output review', 'Using a restricted PDF without the required authorization', 'Overwriting the original before confirming the result'],
  };
}
