import {
  PDFDict,
  PDFName,
  PDFNumber,
  PDFOperator,
  PDFOperatorNames,
  type PDFDocument,
  type PDFFont,
  type PDFPage,
} from 'pdf-lib';
import { getGraphemeSegments } from './fonts/text-shaping';
import { sanitizeTextForRendering } from './pdf-text-sanitize';

let fontNameSequence = 0;

function utf16Hex(text: string) {
  const units = [...text].flatMap((character) => {
    const codePoint = character.codePointAt(0) ?? 0;
    if (codePoint <= 0xffff) return [codePoint];
    const adjusted = codePoint - 0x10000;
    return [0xd800 + (adjusted >> 10), 0xdc00 + (adjusted & 0x3ff)];
  });
  return units.map((unit) => unit.toString(16).padStart(4, '0')).join('').toUpperCase();
}

function createToUnicodeCMap(text: string) {
  return [
    '/CIDInit /ProcSet findresource begin',
    '12 dict begin',
    'begincmap',
    '/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def',
    '/CMapName /EditPdfActualText def',
    '/CMapType 2 def',
    '1 begincodespacerange',
    '<0000> <FFFF>',
    'endcodespacerange',
    `1 beginbfchar\n<0001> <${utf16Hex(text)}>\nendbfchar`,
    'endcmap',
    'CMapName currentdict /CMap defineresource pop',
    'end',
    'end',
  ].join('\n');
}

export async function drawPdfTextForExtraction(
  document: PDFDocument,
  page: PDFPage,
  sourceFont: PDFFont,
  text: string,
  x: number,
  y: number,
) {
  text = sanitizeTextForRendering(text);
  const graphemes = getGraphemeSegments(text);
  if (graphemes.length > 0xffff) throw new Error('Edited text is too long to map for exact PDF text extraction.');
  if (!graphemes.length) return;

  await sourceFont.embed();
  const fontObject = document.context.lookup(sourceFont.ref, PDFDict).clone(document.context);
  const cmapRef = document.context.register(document.context.flateStream(createToUnicodeCMap(text)));
  fontObject.set(PDFName.of('ToUnicode'), cmapRef);
  const fontRef = document.context.register(fontObject);
  const fontName = `EditPdfActualText${fontNameSequence++}`;
  const resources = page.node.Resources()?.clone(document.context) ?? PDFDict.withContext(document.context);
  const fonts = resources.lookupMaybe(PDFName.of('Font'), PDFDict)?.clone(document.context) ??
    PDFDict.withContext(document.context);
  fonts.set(PDFName.of(fontName), fontRef);
  resources.set(PDFName.of('Font'), fonts);
  page.node.set(PDFName.of('Resources'), resources);

  page.pushOperators(
    PDFOperator.of(PDFOperatorNames.BeginText),
    PDFOperator.of(PDFOperatorNames.SetFontAndSize, [`/${fontName}`, PDFNumber.of(1)]),
    PDFOperator.of(PDFOperatorNames.SetTextRenderingMode, [PDFNumber.of(3)]),
    PDFOperator.of(PDFOperatorNames.SetTextHorizontalScaling, [PDFNumber.of(100)]),
    PDFOperator.of(PDFOperatorNames.SetTextMatrix, [
      PDFNumber.of(1), PDFNumber.of(0), PDFNumber.of(0), PDFNumber.of(1), PDFNumber.of(x), PDFNumber.of(y),
    ]),
    PDFOperator.of(PDFOperatorNames.ShowText, ['<0001>']),
    PDFOperator.of(PDFOperatorNames.SetTextHorizontalScaling, [PDFNumber.of(100)]),
    PDFOperator.of(PDFOperatorNames.SetTextRenderingMode, [PDFNumber.of(0)]),
    PDFOperator.of(PDFOperatorNames.EndText),
  );
}
