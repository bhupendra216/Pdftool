import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, "../../artifacts/pdf-tools/public/og");
const tools = [
  { slug: "merge-pdf", name: "Merge PDF" },
  { slug: "split-pdf", name: "Split PDF" },
  { slug: "compress-pdf", name: "Compress PDF" },
  { slug: "pdf-to-word", name: "PDF to Word" },
  { slug: "word-to-pdf", name: "Word to PDF" },
  { slug: "pdf-to-excel", name: "PDF to Excel" },
  { slug: "excel-to-pdf", name: "Excel to PDF" },
  { slug: "pdf-to-powerpoint", name: "PDF to PowerPoint" },
  { slug: "powerpoint-to-pdf", name: "PowerPoint to PDF" },
  { slug: "pdf-to-images", name: "PDF to Images" },
  { slug: "images-to-pdf", name: "Images to PDF" },
  { slug: "pdf-to-text", name: "PDF to Text" },
  { slug: "latex-to-text", name: "LaTeX to Text" },
  { slug: "ocr-pdf", name: "OCR PDF" },
  { slug: "rotate-pdf", name: "Rotate PDF" },
  { slug: "reorder-pages", name: "Reorder PDF Pages" },
  { slug: "add-watermark", name: "Add Watermark to PDF" },
  { slug: "protect-pdf", name: "Protect PDF" },
  { slug: "unlock-pdf", name: "Unlock PDF" },
  { slug: "sign-pdf", name: "Sign PDF" },
  { slug: "flatten-pdf", name: "Flatten PDF" },
  { slug: "pdf-to-pdfa", name: "PDF to PDF/A" },
  { slug: "compress-images", name: "Compress Images" },
];

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

fs.mkdirSync(outputDir, { recursive: true });

for (const tool of tools) {
  const name = escapeXml(tool.name);
  const image = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f8fafc"/>
  <rect x="64" y="64" width="1072" height="502" rx="36" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <circle cx="102" cy="108" r="10" fill="#2563eb"/>
  <text x="130" y="117" fill="#475569" font-family="Arial, sans-serif" font-size="24" font-weight="600">PDFKira</text>
  <text x="100" y="330" fill="#0f172a" font-family="Arial, sans-serif" font-size="72" font-weight="700">${name}</text>
  <text x="100" y="390" fill="#64748b" font-family="Arial, sans-serif" font-size="28">Free online PDF tools</text>
</svg>
`;

  fs.writeFileSync(path.join(outputDir, `${tool.slug}.svg`), image);
}
