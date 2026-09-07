export interface ToolSeoContent {
  heading: string;
  subheading?: string;
  howItWorks?: string[];
  whyUse?: string[];
  features?: string[];
  faqs?: { question: string; answer: string }[];
}

export const TOOL_SEO_CONTENT: Record<string, ToolSeoContent> = {
  'transform-pdf': {
    heading: 'Transform PDF — Make Any Document Look Completely Different',
    subheading:
      'Change the paper tone, add physical damage, and simulate scanning artifacts to create a version that looks like it came from a different source.',
    howItWorks: [
      'Upload your PDF',
      'Adjust the transformation settings or use the default preset',
      'Download your transformed PDF',
    ],
    whyUse: [
      'Create a different "copy" that looks like it came from a different person or device',
      'Test how documents age or degrade over time',
      'Change the appearance for privacy or anonymity purposes',
    ],
    features: [
      'Paper tone and texture changes',
      'Physical damage simulation (creases, torn edges, dog ear)',
      'Scanning artifacts (vignette, glare, rotation)',
      'Subtle marks (smudge, water stain, tape residue)',
      '100% client-side processing — no uploads',
    ],
    faqs: [
      {
        question: 'Will my text still be readable?',
        answer: 'Yes. PDF Transformer changes the visual appearance but preserves all content readability.',
      },
      {
        question: 'Can I use this for handwritten documents?',
        answer: 'Yes. PDF Transformer works with scanned handwritten documents and typed documents.',
      },
      {
        question: 'How is this different from PDF editing?',
        answer: 'PDF editing changes content. PDF Transformer changes appearance while keeping content exactly the same.',
      },
      {
        question: 'Do I need to create an account?',
        answer: 'No. PDF Transformer is completely free with no registration required.',
      },
    ],
  },
};

export default TOOL_SEO_CONTENT;
