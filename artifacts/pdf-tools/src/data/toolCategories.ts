export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  slugs: string[];
}

export const toolCategories: ToolCategory[] = [
  {
    id: 'pdf-editing',
    name: 'PDF Editing Tools',
    description: 'Edit, organize, rotate, and manage PDF pages online.',
    slugs: ['edit-pdf', 'delete-pages', 'organize-pdf', 'rotate-pdf'],
  },
  {
    id: 'pdf-conversion',
    name: 'PDF Conversion Tools',
    description: 'Convert PDFs and office documents between practical formats.',
    slugs: ['pdf-to-word', 'pdf-to-excel', 'pdf-to-markdown', 'word-to-pdf'],
  },
  {
    id: 'pdf-merging',
    name: 'Merge and Split PDF Tools',
    description: 'Combine PDFs or divide documents into useful page ranges.',
    slugs: ['merge-pdf', 'split-pdf', 'extract-pages'],
  },
  {
    id: 'pdf-security',
    name: 'PDF Security Tools',
    description: 'Protect, unlock, sign, and watermark PDF documents.',
    slugs: ['protect-pdf', 'unlock-pdf', 'sign-pdf', 'watermark-pdf'],
  },
  {
    id: 'image-tools',
    name: 'Image and PDF Image Tools',
    description: 'Convert, resize, compress, and improve images and PDF pages.',
    slugs: ['jpg-to-pdf', 'pdf-to-jpg', 'image-converter', 'image-upscale'],
  },
  {
    id: 'ocr-text',
    name: 'OCR and Text Extraction',
    description: 'Extract searchable text from scanned PDFs and images.',
    slugs: ['ocr-pdf', 'ocr-image-to-text', 'pdf-to-text'],
  },
  {
    id: 'optimization',
    name: 'PDF Optimization Tools',
    description: 'Compress PDFs and prepare documents for sharing.',
    slugs: ['compress-pdf', 'add-page-numbers', 'pdf-info'],
  },
];

