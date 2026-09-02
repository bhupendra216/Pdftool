export type PdfTextGeometryValidation = {
  ok: boolean;
  status: 'ok' | 'suspect';
  reason: string;
  checks: string[];
};

export type PdfTextGeometryMetrics = {
  width: number;
  height: number;
  fontSize: number;
  status: 'ok' | 'suspect';
  reason: string;
  ok: boolean;
};

const asFiniteNumber = (value: unknown, fallback = 0) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const estimateTextWidthFromHeight = (text: string, height: number) => {
  const sanitizedText = String(text ?? '').replace(/\s+/g, '');
  const visibleLength = sanitizedText.length || String(text ?? '').length || 1;
  return Math.max(height * 0.65, visibleLength * Math.max(0.52, height * 0.58));
};

export const validateTextItemGeometry = (
  item: any,
  styles: Record<string, any> = {},
): PdfTextGeometryValidation => {
  const checks: string[] = [];

  if (!item) {
    return {
      ok: false,
      status: 'suspect',
      reason: 'missing_text_item',
      checks: ['missing_text_item'],
    };
  }

  const transform = Array.isArray(item.transform) ? item.transform.slice(0, 6) : [1, 0, 0, 1, 0, 0];
  const normalizedTransform = transform.map((value: number) => Number(value));
  const transformIsFinite = normalizedTransform.every((value: number) => Number.isFinite(value));

  if (!transformIsFinite) {
    return {
      ok: false,
      status: 'suspect',
      reason: 'transform_not_finite',
      checks: ['transform_not_finite'],
    };
  }

  const [a, b, c, d, e, f] = normalizedTransform;
  const skewOrRotation = Math.abs(b) + Math.abs(c);
  if (skewOrRotation > 0.15) {
    checks.push('transform_skew_or_rotation');
  }

  const xScale = Math.abs(a) || 1;
  const yScale = Math.abs(d) || 1;
  const scaleDelta = Math.abs(xScale - yScale);
  if (scaleDelta > Math.max(0.3, 0.25 * Math.max(xScale, yScale, 1))) {
    checks.push('non_uniform_scale');
  }

  const width = Number(item.width);
  const height = Number(item.height);
  const textLength = String(item.str ?? '').length || 1;
  const contentLength = String(item.str ?? '').replace(/\s+/g, '').length || textLength;

  if (!Number.isFinite(width) || width <= 0) {
    checks.push('invalid_width');
  }
  if (!Number.isFinite(height) || height <= 0) {
    checks.push('invalid_height');
  }

  if (Number.isFinite(width) && Number.isFinite(height) && height > 0) {
    const expectedMinimumWidth = Math.max(height * 0.2, contentLength * 0.35 * Math.max(height, 1));
    const expectedMaximumWidth = Math.max(height * 25, contentLength * 2.2 * Math.max(height, 1));
    if (width < expectedMinimumWidth || width > expectedMaximumWidth) {
      checks.push('implausible_width');
    }
  }

  const fontName = String(item.fontName ?? '');
  if (fontName && styles && !Object.prototype.hasOwnProperty.call(styles, fontName)) {
    checks.push('font_missing_from_styles_map');
  }

  if (!checks.length) {
    return {
      ok: true,
      status: 'ok',
      reason: 'valid_geometry',
      checks,
    };
  }

  const reason = checks.join('; ');
  console.warn('[edit-pdf] suspect text item geometry', {
    str: item?.str ?? '',
    transform: normalizedTransform,
    fontName,
    width,
    height,
    reason,
    stylesKeys: Object.keys(styles || {}).slice(0, 10),
  });

  return {
    ok: false,
    status: 'suspect',
    reason,
    checks,
  };
};

export const getSafeTextGeometry = (
  item: any,
  styles: Record<string, any> = {},
  viewportScale = 1,
): PdfTextGeometryMetrics => {
  const validation = validateTextItemGeometry(item, styles);

  const resolvedHeight = Math.max(asFiniteNumber(item?.height, 12), 6);
  const resolvedWidth = Math.max(asFiniteNumber(item?.width, 0), 0);
  const textContent = String(item?.str ?? '');
  const estimatedWidth = estimateTextWidthFromHeight(textContent, resolvedHeight);

  const safeHeight = resolvedHeight > 0 ? resolvedHeight : 12;
  const safeWidth = resolvedWidth > 0 ? resolvedWidth : estimatedWidth;
  const fallbackFontSize = Math.max(6, safeHeight);

  const fontSize = validation.ok
    ? Math.max(Number(item?.fontSize) || 0, Math.min(safeHeight * 1.5, fallbackFontSize))
    : fallbackFontSize;

  const width = validation.ok ? Math.max(resolvedWidth, safeWidth) : safeWidth;
  const height = validation.ok ? Math.max(resolvedHeight, safeHeight) : safeHeight;

  return {
    width: width * viewportScale,
    height: height * viewportScale,
    fontSize,
    status: validation.status,
    reason: validation.reason,
    ok: validation.ok,
  };
};
