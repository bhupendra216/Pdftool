import { expect, it } from "vitest";
import fixtureUrl from "../../test-fixtures/three-page-text.pdf?url";
import { extractPdfText } from "./pdf-extract";

it("extracts text from every page of the three-page fixture", async () => {
  const response = await fetch(fixtureUrl);
  expect(response.ok).toBe(true);

  const fixture = new File(
    [await response.arrayBuffer()],
    "three-page-text.pdf",
    { type: "application/pdf" },
  );
  const progress: string[] = [];
  const result = await extractPdfText(fixture, (message) =>
    progress.push(message),
  );

  expect(result.pages).toHaveLength(3);
  expect(result.pages.map((page) => page.text)).toEqual([
    "Fixture page 1: text extraction must show this sentence.",
    "Fixture page 2: text extraction must show this sentence.",
    "Fixture page 3: text extraction must show this sentence.",
  ]);
  expect(progress).toEqual([
    "Reading page 1/3",
    "Reading page 2/3",
    "Reading page 3/3",
  ]);
});
