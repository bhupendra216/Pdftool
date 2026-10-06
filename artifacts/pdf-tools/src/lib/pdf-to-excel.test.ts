import assert from "node:assert/strict";
import { test } from "node:test";
import * as XLSX from "xlsx";
import { clusterTextRows, createExcelWorkbook, detectTableRows, type TextPart } from "./pdf-to-excel";

test("converts coordinate-clustered table content into valid spreadsheet columns", () => {
  const parts: TextPart[] = [
    { text: "Name", x: 50, y: 720, width: 29, height: 12 },
    { text: "Department", x: 260, y: 720, width: 61, height: 12 },
    { text: "Amount", x: 490, y: 720, width: 42, height: 12 },
    { text: "Ada", x: 50, y: 680, width: 19, height: 12 },
    { text: "Engineering", x: 260, y: 680, width: 65, height: 12 },
    { text: "1250", x: 490, y: 680, width: 27, height: 12 },
    { text: "Linus", x: 50, y: 640, width: 27, height: 12 },
    { text: "Research", x: 260, y: 640, width: 48, height: 12 },
    { text: "980", x: 490, y: 640, width: 20, height: 12 },
  ];
  const detected = detectTableRows(clusterTextRows(parts));
  assert.equal(detected.hasTable, true);
  assert.deepEqual(detected.rows, [
    ["Name", "Department", "Amount"],
    ["Ada", "Engineering", "1250"],
    ["Linus", "Research", "980"],
  ]);

  const bytes = createExcelWorkbook([detected], "pages");
  const workbook = XLSX.read(bytes, { type: "array" });
  assert.deepEqual(workbook.SheetNames, ["Page 1"]);
  assert.deepEqual(XLSX.utils.sheet_to_json(workbook.Sheets["Page 1"], { header: 1 }), detected.rows);

  const appended = XLSX.read(createExcelWorkbook([detected, detected], "single"), { type: "array" });
  assert.deepEqual(appended.SheetNames, ["PDF data"]);
  assert.equal(XLSX.utils.sheet_to_json(appended.Sheets["PDF data"], { header: 1 }).length, 6);
});

test("exports raw text lines when no table structure is detected", () => {
  const plainText = detectTableRows(clusterTextRows([
    { text: "A plain text report without any table structure.", x: 50, y: 700, width: 277, height: 14 },
  ]));
  const detected = plainText;
  assert.equal(detected.hasTable, false);
  const workbook = XLSX.read(createExcelWorkbook([detected], "pages"), { type: "array" });
  assert.deepEqual(workbook.SheetNames, ["Page 1"]);
  assert.equal(XLSX.utils.sheet_to_json(workbook.Sheets["Page 1"], { header: 1 })[0][0], "A plain text report without any table structure.");
});
