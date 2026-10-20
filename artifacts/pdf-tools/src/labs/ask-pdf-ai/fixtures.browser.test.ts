import { PDFDocument, StandardFonts } from "pdf-lib";
import { expect, it } from "vitest";

async function createFixture(pages: string[]) {
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);
  for (const [index, text] of pages.entries()) {
    const page = document.addPage([612, 792]);
    page.drawText(text, { x: 48, y: 720, size: 12, font, maxWidth: 516, lineHeight: 18 });
    page.drawText(`Invented fixture page ${index + 1}`, { x: 48, y: 24, size: 8, font });
  }
  return document.save();
}

it("generates three small, invented PDF evaluation fixtures", async () => {
  const policy = await createFixture([
    "Northwind Grove policy: annual leave is 15 days. Emergency leave is 3 days. Unused leave may carry over up to 5 days.",
    "Requests should be sent to the team lead at least 7 days before planned leave. Emergency requests may be sent on the same day.",
  ]);
  const report = await createFixture([
    "Willow Research quarterly report. The field team recorded three sites in spring.",
    "Site table: Cedar, 12 samples, 4 clear results. Lake, 18 samples, 9 clear results. Ridge, 10 samples, 6 clear results.",
    "In autumn the Cedar site added 8 samples. The report recommends a follow-up at Lake next spring.",
  ]);
  const missingAnswer = await createFixture([
    "Orchard Relay is an invented community project. Its public note records a meeting on 14 May.",
    "The project tracks seedling survival by garden bed and publishes a short monthly note.",
  ]);

  expect(policy).toBeInstanceOf(Uint8Array);
  expect(report).toBeInstanceOf(Uint8Array);
  expect(missingAnswer).toBeInstanceOf(Uint8Array);
  expect(policy.byteLength).toBeLessThan(20_000);
  expect(report.byteLength).toBeLessThan(20_000);
  expect(missingAnswer.byteLength).toBeLessThan(20_000);
});
