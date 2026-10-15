# Ask PDF Extraction Diagnosis

Date: 2026-10-13

## Browser Reproduction

Ran Vite on `http://127.0.0.1:4174/tools/ai-chat-pdf` and uploaded `test-fixtures/three-page-text.pdf`.

The page displayed these extracted strings:

- `Fixture page 1: text extraction must show this sentence.`
- `Fixture page 2: text extraction must show this sentence.`
- `Fixture page 3: text extraction must show this sentence.`

Extraction progress messages: `Reading page 1/3`, `Reading page 2/3`, `Reading page 3/3`.

Console errors: none (`console.error` and uncaught page errors were empty).

Network errors during PDF upload: none. One unrelated analytics request failed on navigation. Exact browser error:

```text
POST https://www.google-analytics.com/g/collect?v=2&tid=G-K58M67QSPV&gtm=45je6ac0v9263887445za208zd9263887445xf1&_p=1791913589039&gcd=13l3l3l3l1l1&npa=0&dma=0&_eu=AAAAAAQ&are=1&cid=1155071261.1791912206&frm=0&ngs=1&pscdl=noapi&rcb=1&sr=1920x1080&uaa=x86&uab=64&uafvl=Not%253BA%253DBrand%3B8.0.0.0%7CChromium%3B150.0.7871.250&uam=&uamb=0&uap=Linux&uapv=&uaw=0&ul=en-us&_s=1&tag_exp=115938465~115938468~118897920~118897930~120213116~120385423~120469145~120469153~121046263~121046271~121246026~121246034&sid=1791912205&sct=1&seg=1&dl=http%3A%2F%2F127.0.0.1%2Ftools%2Fai-chat-pdf&dt=PDFKira%20%E2%80%94%20Fast%2C%20Private%20Online%20PDF%20Tools&en=page_view&_ee=1&tfd=127 failed: "net::ERR_ABORTED"
```

## Findings And Fixes

- The existing extraction routine already returned text for the fixture, but the UI relied on its result shape and did not have a fixture-backed regression test.
- The worker now uses Vite's `pdf.worker.min.mjs?url` asset reference. `pdfjs-dist` is pinned to `6.1.200` in both workspace packages and the lockfile.
- Extraction obtains one page at a time, calls `getTextContent()`, calls `page.cleanup()`, and destroys the PDF.js loading task when complete.
- Ask PDF renders each extracted page's text and shows the live `Reading page N/M` progress callback.
- Browser Vitest test: `src/lib/pdf-extract.browser.test.ts` verifies the fixture text and progress sequence.
- A later browser run logged `Warning: Setting up fake worker.` Inspection found `src/components/PDFPreview.tsx` side-effect-imported `pdf.worker.mjs` into the main thread, publishing `globalThis.pdfjsWorker`; PDF.js then deliberately selected its fake-worker path. Replacing that import with the shared `client-pdf` worker configuration fixed the warning.

Final production-preview upload after the worker fix: all three page strings appeared; no PDF-related console errors, failed PDF requests, or worker warnings occurred. Browser navigation still generated an unrelated Google Analytics `net::ERR_ABORTED` request (see the exact error above).