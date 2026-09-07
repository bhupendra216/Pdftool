export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolRecord {
  id?: string;
  slug: string;
  name: string;
  shortDescription?: string;
  category?: string;
  icon?: string;
  popular?: boolean;
  status?: string;
  seoTitle?: string;
  seoDescription?: string;
  steps?: string[];
  faqs?: FaqItem[];
}

export const tools: ToolRecord[] = [
  {
    id: 'transform-pdf',
    slug: 'transform-pdf',
    name: 'PDF Transformer',
    shortDescription: 'Apply handwritten-looking distress and paper texture to PDFs.',
    category: 'Edit & Sign',
    icon: 'Droplet',
    popular: false,
    status: 'available',
    seoTitle: 'PDF Transformer — Transform Any PDF to Look Completely Different',
    seoDescription:
      'Change the appearance of any PDF — paper color, damage, scanning artifacts, and more. 100% free, no uploads, fully client-side.',
    steps: [
      'Upload your PDF',
      'Adjust the transformation settings',
      'Download your transformed PDF',
    ],
    faqs: [
      {
        question: 'What does PDF Transformer do?',
        answer:
          'PDF Transformer changes the visual appearance of a PDF so it looks like a completely different copy while keeping the content intact.',
      },
      {
        question: 'Is my data safe?',
        answer: 'Yes. All processing happens in your browser. Your file never leaves your device.',
      },
      {
        question: 'Can I transform handwritten PDFs?',
        answer:
          'Yes. PDF Transformer works with any PDF, including scanned handwritten documents.',
      },
      {
        question: 'Is this tool free?',
        answer: 'Yes, PDF Transformer is completely free to use with no watermarks or file limits.',
      },
    ],
  },
];

export default tools;
