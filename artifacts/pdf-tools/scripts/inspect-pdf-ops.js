import fs from 'fs';
import path from 'path';
// Minimal polyfills to allow pdfjs-dist build to run in Node for inspection
if (typeof global.DOMMatrix === 'undefined') {
  global.DOMMatrix = class DOMMatrix {
    constructor() {}
  };
}

// dynamically resolve pdfjs build path
let getDocument;

// use pdfjs-dist in Node
// Run with: node scripts/inspect-pdf-ops.js ../CNN_RNN_LSTM_Presentation.pdf

async function main() {
  // dynamically resolve and import pdfjs build
  // prefer the legacy build for Node
  try {
    const modulePath = require.resolve('pdfjs-dist/legacy/build/pdf.js');
    const pdfjs = require(modulePath);
    getDocument = pdfjs.getDocument || pdfjs.default?.getDocument;
  } catch (e) {
    try {
      const modulePath = require.resolve('pdfjs-dist/build/pdf.mjs');
      const pdfjs = await import(modulePath);
      getDocument = pdfjs.getDocument;
    } catch (e2) {
      const pdfjs = await import('pdfjs-dist');
      getDocument = pdfjs.getDocument || pdfjs.default?.getDocument;
    }
  }
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node inspect-pdf-ops.js <pdf-path>');
    process.exit(2);
  }
  const pdfPath = path.resolve(args[0]);
  if (!fs.existsSync(pdfPath)) {
    console.error('File not found:', pdfPath);
    process.exit(2);
  }
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = getDocument({ data });
  const pdf = await loadingTask.promise;
  console.log('numPages=', pdf.numPages);
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    console.log(`\n-- page ${i} --`);
    try {
      const opList = await page.getOperatorList();
      const fnArray = opList.fnArray || [];
      const argsArray = opList.argsArray || [];
      console.log('opList length=', fnArray.length);
      let imgOps = 0;
      for (let j = 0; j < fnArray.length; j++) {
        const fn = fnArray[j];
        // numeric codes 86 and 87 correspond to paintImageXObject / paintInlineImageXObject in some pdfjs versions
        if (fn === 86 || fn === 87) {
          imgOps++;
          console.log('  img op at index', j, 'args', argsArray[j] && argsArray[j].slice ? argsArray[j].slice(0,3) : argsArray[j]);
        }
      }
      console.log('found image ops:', imgOps);
    } catch (e) {
      console.error('getOperatorList failed:', e && e.message);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
