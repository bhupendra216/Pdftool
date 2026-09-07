import { PDFPage, rgb, degrees } from 'pdf-lib';

export const rand = (min: number, max: number) => Math.random() * (max - min) + min;
export const randInt = (min: number, max: number) => Math.floor(rand(min, max));
export const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Global cap for mark sizes (in PDF units). If set, many effect radii will be clamped
let globalMarkSizeLimit: number | null = null;
export function setGlobalMarkSizeLimit(limit: number | null) {
  globalMarkSizeLimit = limit;
}

export async function addInkSplatter(page: PDFPage, intensity: number = 0.5) {
  const { width, height } = page.getSize();
  const x = rand(20, width - 20);
  const y = rand(20, height - 20);

  const maxR = 20 + intensity * 30; // 20-50
  let radius = rand(5, Math.max(10, maxR));
  if (globalMarkSizeLimit) radius = Math.min(radius, globalMarkSizeLimit);
  const color = rgb(0.05, 0.02, 0.01);
  const opacity = rand(0.3, 0.9);

  page.drawEllipse({ x, y, xScale: radius, yScale: radius, color, opacity });

  const satellites = randInt(2, 7);
  for (let i = 0; i < satellites; i++) {
    const angle = rand(0, Math.PI * 2);
    const dist = rand(radius * 0.8, radius * 2.5);
    const sx = x + Math.cos(angle) * dist + rand(-6, 6);
    const sy = y + Math.sin(angle) * dist + rand(-6, 6);
    let sr = rand(1, Math.max(1, radius * 0.5));
    if (globalMarkSizeLimit) sr = Math.min(sr, globalMarkSizeLimit * 0.25);
    page.drawEllipse({ x: sx, y: sy, xScale: sr, yScale: sr, color, opacity: Math.max(0.05, opacity - rand(0, 0.5)) });
  }
}

export async function addScribble(page: PDFPage, intensity: number = 0.5) {
  const { width, height } = page.getSize();
  const segments = randInt(4, Math.floor(4 + intensity * 16));
  const thickness = rand(0.5, 0.5 + intensity * 3.5);
  const color = rgb(0.1, 0.05, 0.02);
  const opacity = rand(0.3, 0.9);

  let x = rand(20, width - 20);
  let y = rand(20, height - 20);

  for (let i = 0; i < segments; i++) {
    const step = 10 + intensity * 120;
    const nx = Math.max(1, Math.min(width - 1, x + rand(-step, step)));
    const ny = Math.max(1, Math.min(height - 1, y + rand(-step, step)));
    page.drawLine({ start: { x, y }, end: { x: nx, y: ny }, thickness, color, opacity });
    x = nx;
    y = ny;
  }
}

export async function addCoffeeRing(page: PDFPage, intensity: number = 0.5) {
  const { width, height } = page.getSize();
  const x = rand(60, width - 60);
  const y = rand(60, height - 60);

  const outerMax = 40 + intensity * 110; // 40-150
  const outerR = rand(40, Math.max(60, outerMax));
  const outerRfinal = globalMarkSizeLimit ? Math.min(outerR, globalMarkSizeLimit) : outerR;
  const borderWidth = rand(4, 4 + intensity * 10); // 4-14
  const color = rgb(0.4, 0.25, 0.1);
  const opacity = rand(0.05, 0.2);

  page.drawEllipse({ x, y, xScale: outerRfinal, yScale: outerRfinal, borderColor: color, borderWidth, opacity });

  // faint inner circle
  const innerR = Math.max(outerR * rand(0.35, 0.7), 4);
  const innerRfinal = globalMarkSizeLimit ? Math.min(innerR, globalMarkSizeLimit * 0.6) : innerR;
  page.drawEllipse({ x, y, xScale: innerRfinal, yScale: innerRfinal, color, opacity: Math.max(0.01, opacity - 0.03) });
}

export async function addDirtSpots(page: PDFPage, intensity: number = 0.5) {
  const { width, height } = page.getSize();
  const count = randInt(5, Math.min(25, 5 + Math.floor(intensity * 20)));
  const color = rgb(0.2, 0.15, 0.08);

  for (let i = 0; i < count; i++) {
    const r = rand(1, 1 + intensity * 7);
    const rFinal = globalMarkSizeLimit ? Math.min(r, Math.max(1, globalMarkSizeLimit * 0.1)) : r;
    const x = rand(10, width - 10);
    const y = rand(10, height - 10);
    const opacity = rand(0.1, 0.6);
    page.drawEllipse({ x, y, xScale: rFinal, yScale: rFinal, color, opacity });
  }
}

export async function addSmudge(page: PDFPage, intensity: number = 0.5) {
  const { width, height } = page.getSize();
  let w = rand(30, 30 + intensity * 120); // 30-150
  let h = rand(10, 10 + intensity * 40); // 10-50
  if (globalMarkSizeLimit) {
    w = Math.min(w, globalMarkSizeLimit * 2);
    h = Math.min(h, globalMarkSizeLimit * 1);
  }
  const x = rand(10, Math.max(10, width - w - 10));
  const y = rand(10, Math.max(10, height - h - 10));
  const angle = rand(0, 180);
  const color = rgb(0.25, 0.2, 0.15);
  const opacity = rand(0.05, 0.25);

  page.drawRectangle({ x, y, width: w, height: h, color, opacity, rotate: degrees(angle) });
}

export async function addFoldLine(page: PDFPage, intensity: number = 0.5) {
  const { width, height } = page.getSize();
  const horizontal = Math.random() > 0.5;
  const thickness = rand(0.5, 0.5 + intensity * 2.5);
  const color = rgb(0.4, 0.4, 0.4);
  const opacity = rand(0.05, 0.2);

  if (horizontal) {
    const y = rand(20, height - 20);
    page.drawLine({ start: { x: 10, y }, end: { x: width - 10, y }, thickness, color, opacity });
  } else {
    const x = rand(20, width - 20);
    page.drawLine({ start: { x, y: 10 }, end: { x, y: height - 10 }, thickness, color, opacity });
  }
}

export async function addWaterStain(page: PDFPage, intensity: number = 0.5) {
  const { width, height } = page.getSize();
  const areaPercent = rand(0.05, 0.05 + intensity * 0.2); // up to ~25%
  const targetArea = width * height * areaPercent;

  const w = rand(Math.max(20, width * 0.1), Math.max(40, width * 0.5 * (0.3 + intensity * 0.7)));
  const h = Math.max(10, targetArea / w);
  const x = rand(10, Math.max(10, width - w - 10));
  const y = rand(10, Math.max(10, height - h - 10));
  const color = rgb(0.6, 0.7, 0.8);
  const opacity = rand(0.03, 0.03 + intensity * 0.12);

  page.drawRectangle({ x, y, width: w, height: h, color, opacity, rotate: degrees(rand(-10, 10)) });
}

export async function addScratch(page: PDFPage, intensity: number = 0.5) {
  const { width, height } = page.getSize();
  const points = randInt(3, Math.min(8, 3 + Math.floor(intensity * 5)));
  const color = rgb(0.3, 0.3, 0.3);
  const thickness = rand(0.3, 0.3 + intensity * 1.7);
  const opacity = rand(0.1, 0.4);

  let x = rand(20, width - 20);
  let y = rand(20, height - 20);
  for (let i = 0; i < points; i++) {
    const nx = Math.max(1, Math.min(width - 1, x + rand(-80, 80)));
    const ny = Math.max(1, Math.min(height - 1, y + rand(-80, 80)));
    page.drawLine({ start: { x, y }, end: { x: nx, y: ny }, thickness, color, opacity });
    x = nx;
    y = ny;
  }
}

const EFFECTS: Array<(page: PDFPage, intensity?: number) => Promise<void>> = [
  addScribble,
  addSmudge,
  addFoldLine,
  addScratch,
];

export function applyDirtyEffect(page: PDFPage, intensity: number = 0.5): void {
  const i = Math.min(1, Math.max(0, intensity));
  const effectCount = Math.floor(4 + i * 25);

  for (let k = 0; k < effectCount; k++) {
    const ef = pick(EFFECTS);
    // fire-and-forget - effects are async but operate on the given page synchronously
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ef(page, i).catch(() => {});
  }
}

export default applyDirtyEffect;

// Canvas-based overlay helpers (for use when rendering to a canvas)
export function applyPaperToneToCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, tone: 'white'|'cream'|'yellowed'|'blueish'|'gray'|'pinkish', amount: number) {
  if (tone === 'white' || amount <= 0) return;
  const colorMap: Record<string, string> = {
    cream: 'rgba(255, 248, 220, ',
    yellowed: 'rgba(255, 244, 179, ',
    blueish: 'rgba(230, 240, 255, ',
    gray: 'rgba(240,240,245, ',
    pinkish: 'rgba(255, 235, 240, ',
  };
  const base = colorMap[tone] ?? 'rgba(255,248,220,';
  ctx.save();
  ctx.fillStyle = `${base}${Math.min(0.6, amount / 100 * 0.45)})`;
  ctx.fillRect(0,0,width,height);
  ctx.restore();
}

export function drawAgeSpotsOnCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) {
  const count = Math.floor((amount / 100) * 60);
  for (let i = 0; i < count; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    const r = Math.random() * (6 + (amount / 100) * 30);
    const o = Math.random() * 0.4 + 0.03;
    ctx.beginPath();
    ctx.fillStyle = `rgba(120,70,30,${o})`;
    ctx.ellipse(rx, ry, r, r * (0.6 + Math.random() * 0.8), Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawFoldCreaseOnCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, amount: number, horizontal = false) {
  if (amount <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, amount / 100 * 0.9);
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = Math.max(0.5, (amount / 100) * 4);
  if (horizontal) {
    const y = height * (0.2 + Math.random() * 0.6);
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(width,y); ctx.stroke();
  } else {
    const x = width * (0.05 + Math.random() * 0.2);
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,height); ctx.stroke();
  }
  ctx.restore();
}

export function drawTornEdgesOnCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) {
  if (amount <= 0) return;
  const jag = Math.floor(6 + (amount / 100) * 30);
  const margin = Math.max(6, (amount / 100) * 30);
  const path = new Path2D();
  path.moveTo(margin, margin);
  for (let i = 0; i < jag; i++) {
    const x = margin + (i / jag) * (width - margin * 2);
    const y = margin + Math.random() * margin * 0.6;
    path.lineTo(x, y);
  }
  path.lineTo(width - margin, margin);
  path.lineTo(width - margin, height - margin);
  for (let i = jag; i >= 0; i--) {
    const x = margin + (i / jag) * (width - margin * 2);
    const y = height - margin - Math.random() * margin * 0.6;
    path.lineTo(x, y);
  }
  path.closePath();
  ctx.save();
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = 'black';
  ctx.fill(path);
  ctx.restore();
}

export function drawDogEarOnCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, position: 'none'|'top-left'|'top-right'|'bottom-left'|'bottom-right', amount: number) {
  if (position === 'none' || amount <= 0) return;
  const size = Math.min(width, height) * 0.12 * (amount / 100 || 1);
  ctx.save();
  let x = 0, y = 0;
  if (position.includes('right')) x = width - size;
  if (position.includes('bottom')) y = height - size;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + (position.includes('right') ? size : -size), y);
  ctx.lineTo(x + (position.includes('right') ? size : -size), y + (position.includes('bottom') ? size : -size));
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fill();
  ctx.restore();
}

export function drawStapleHolesOnCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, enabled: boolean) {
  if (!enabled) return;
  const x = Math.min(60, width * 0.08);
  const y = Math.min(60, height * 0.06);
  for (let i = 0; i < 2; i++) {
    const ry = y + i * 10;
    ctx.beginPath(); ctx.fillStyle = 'rgba(40,30,20,0.9)'; ctx.arc(x, ry, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.arc(x - 1, ry - 1, 1, 0, Math.PI * 2); ctx.fill();
  }
}

export function drawPaperclipMarkOnCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, enabled: boolean) {
  if (!enabled) return;
  ctx.save();
  const x = Math.min(80, width * 0.12);
  const y = Math.min(50, height * 0.06);
  ctx.fillStyle = 'rgba(120,60,20,0.18)';
  ctx.fillRect(x, y, Math.min(40, width * 0.08), Math.min(12, height * 0.03));
  ctx.restore();
}

export function drawTapeResidueOnCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) {
  if (amount <= 0) return;
  const count = Math.max(1, Math.floor(amount / 30));
  for (let i = 0; i < count; i++) {
    const x = Math.random() * (width * 0.5);
    const y = Math.random() * (height * 0.15);
    const rw = Math.min(width * 0.6, 60 + Math.random() * 120);
    const rh = Math.min(height * 0.08, 12 + Math.random() * 20);
    ctx.save(); ctx.fillStyle = `rgba(220,200,150,${0.08 + Math.random() * 0.12})`; roundRect(ctx, x, y, rw, rh, 4); ctx.fill(); ctx.restore();
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

// Canvas helpers: smudge and water stain, lined/grid paper, improved dog-ear
export function drawSmudgeOnCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  if (!intensity || intensity <= 0) return;
  const count = Math.max(1, Math.floor(intensity / 20));
  for (let i = 0; i < count; i++) {
    const w = Math.max(20, Math.min(width * 0.4, 20 + Math.random() * intensity * 3));
    const h = Math.max(6, Math.min(height * 0.12, 6 + Math.random() * intensity * 1.5));
    const x = Math.random() * (width - w);
    const y = Math.random() * (height - h);
    const angle = (Math.random() - 0.5) * 0.6;
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(angle);
    ctx.translate(-(x + w / 2), -(y + h / 2));
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, `rgba(80,60,40,${0.02 + Math.random() * 0.12})`);
    g.addColorStop(1, `rgba(80,60,40,${0.01 + Math.random() * 0.08})`);
    ctx.fillStyle = g as any;
    roundRect(ctx, x, y, w, h, Math.min(8, w * 0.08));
    ctx.fill();
    ctx.restore();
  }
}

export function drawWaterStainOnCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
  if (!intensity || intensity <= 0) return;
  const count = Math.max(1, Math.floor(intensity / 25));
  for (let i = 0; i < count; i++) {
    const w = Math.max(30, Math.min(width * 0.6, 40 + Math.random() * intensity * 4));
    const h = Math.max(10, Math.min(height * 0.2, 10 + Math.random() * intensity * 1.5));
    const x = Math.random() * (width - w);
    const y = Math.random() * (height - h);
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    const g = ctx.createRadialGradient(x + w / 2, y + h / 2, Math.min(w, h) * 0.2, x + w / 2, y + h / 2, Math.max(w, h) * 0.8);
    g.addColorStop(0, `rgba(255,255,255,${0.02})`);
    g.addColorStop(0.5, `rgba(200,210,220,${0.02 + (intensity / 100) * 0.18})`);
    g.addColorStop(1, `rgba(255,255,255,0)`);
    ctx.fillStyle = g as any;
    ctx.beginPath(); ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, Math.random() * Math.PI, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

export function drawLinedPaper(ctx: CanvasRenderingContext2D, width: number, height: number, color = 'rgba(100,130,180,0.18)') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  const spacing = 24; // px spacing
  for (let y = spacing; y < height; y += spacing) {
    ctx.beginPath(); ctx.moveTo(0, y + (Math.random() - 0.5) * 1.5); ctx.lineTo(width, y + (Math.random() - 0.5) * 1.5); ctx.stroke();
  }
  ctx.restore();
}

export function drawGridPaper(ctx: CanvasRenderingContext2D, width: number, height: number, color = 'rgba(100,130,180,0.12)') {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1;
  const spacing = 20;
  for (let y = spacing; y < height; y += spacing) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }
  for (let x = spacing; x < width; x += spacing) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
  ctx.restore();
}

export function drawDogEarOnCanvasImproved(ctx: CanvasRenderingContext2D, width: number, height: number, position: 'none'|'top-left'|'top-right'|'bottom-left'|'bottom-right', amount: number) {
  if (position === 'none' || amount <= 0) return;
  const size = Math.min(width, height) * 0.12 * (amount / 100 || 1);
  let x = 0, y = 0;
  if (position.includes('right')) x = width - size;
  if (position.includes('bottom')) y = height - size;
  // shadow
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath(); ctx.moveTo(x + (position.includes('right') ? size : -size) * 0.08, y + (position.includes('bottom') ? size : -size) * 0.08);
  ctx.lineTo(x + (position.includes('right') ? size : -size), y);
  ctx.lineTo(x, y + (position.includes('bottom') ? size : -size)); ctx.closePath(); ctx.fill();
  // folded white triangle
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (position.includes('right') ? size : -size), y); ctx.lineTo(x, y + (position.includes('bottom') ? size : -size)); ctx.closePath();
  ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fill();
  // crease line
  ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + (position.includes('right') ? size * 0.6 : -size * 0.6), y); ctx.lineTo(x, y + (position.includes('bottom') ? size * 0.6 : -size * 0.6)); ctx.stroke();
  ctx.restore();
}

