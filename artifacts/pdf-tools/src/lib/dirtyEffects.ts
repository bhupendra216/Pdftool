type RandomSource = () => number;
type DogEarPosition = 'none' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type PaperTone = 'white' | 'cream' | 'yellowed' | 'blueish' | 'gray' | 'pinkish';

export function applyPaperToneToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tone: PaperTone,
  amount: number,
) {
  if (tone === 'white' || amount <= 0) return;
  const colors: Record<Exclude<PaperTone, 'white'>, string> = {
    cream: '255,248,220',
    yellowed: '255,244,179',
    blueish: '230,240,255',
    gray: '240,240,245',
    pinkish: '255,235,240',
  };
  ctx.save();
  ctx.fillStyle = `rgba(${colors[tone]},${Math.min(0.6, (amount / 100) * 0.45)})`;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

export function drawFoldCreaseOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number,
  horizontal: boolean,
  random: RandomSource,
) {
  if (amount <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, (amount / 100) * 0.9);
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = Math.max(0.5, (amount / 100) * 4);
  const x = horizontal ? 0 : width * (0.05 + random() * 0.2);
  const y = horizontal ? height * (0.2 + random() * 0.6) : 0;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(horizontal ? width : x, horizontal ? y : height);
  ctx.stroke();
  ctx.restore();
}

export function drawTornEdgesOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number,
  random: RandomSource,
) {
  if (amount <= 0) return;
  const jaggedness = Math.floor(6 + (amount / 100) * 30);
  const margin = Math.max(6, (amount / 100) * 30);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(margin, margin);
  for (let index = 0; index <= jaggedness; index++) {
    const x = margin + (index / jaggedness) * (width - margin * 2);
    ctx.lineTo(x, margin + random() * margin * 0.6);
  }
  ctx.lineTo(width - margin, height - margin);
  for (let index = jaggedness; index >= 0; index--) {
    const x = margin + (index / jaggedness) * (width - margin * 2);
    ctx.lineTo(x, height - margin - random() * margin * 0.6);
  }
  ctx.closePath();
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.restore();
}

export function drawDogEarOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  position: DogEarPosition,
  amount: number,
) {
  if (position === 'none' || amount <= 0) return;
  const size = Math.min(width, height) * 0.12 * (amount / 100);
  const x = position.includes('right') ? width - size : 0;
  const y = position.includes('bottom') ? height - size : 0;
  const right = position.includes('right');
  const bottom = position.includes('bottom');
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + (right ? size : -size), y);
  ctx.lineTo(x + (right ? size : -size), y + (bottom ? size : -size));
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fill();
  ctx.restore();
}

export function drawStapleHolesOnCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, enabled: boolean) {
  if (!enabled) return;
  const x = Math.min(60, width * 0.08);
  const y = Math.min(60, height * 0.06);
  for (let index = 0; index < 2; index++) {
    const holeY = y + index * 10;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(40,30,20,0.9)';
    ctx.arc(x, holeY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.arc(x - 1, holeY - 1, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawPaperclipMarkOnCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, enabled: boolean) {
  if (!enabled) return;
  const x = Math.min(80, width * 0.12);
  const y = Math.min(50, height * 0.06);
  ctx.save();
  ctx.fillStyle = 'rgba(120,60,20,0.18)';
  ctx.fillRect(x, y, Math.min(40, width * 0.08), Math.min(12, height * 0.03));
  ctx.restore();
}

export function drawTapeResidueOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number,
  random: RandomSource,
) {
  if (amount <= 0) return;
  const count = Math.max(1, Math.floor(amount / 30));
  for (let index = 0; index < count; index++) {
    const x = random() * (width * 0.5);
    const y = random() * (height * 0.15);
    const rectWidth = Math.min(width * 0.6, 60 + random() * 120);
    const rectHeight = Math.min(height * 0.08, 12 + random() * 20);
    ctx.save();
    ctx.fillStyle = `rgba(220,200,150,${0.08 + random() * 0.12})`;
    roundedRect(ctx, x, y, rectWidth, rectHeight, 4);
    ctx.fill();
    ctx.restore();
  }
}

export function drawSmudgeOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  random: RandomSource,
) {
  if (intensity <= 0) return;
  const count = Math.max(1, Math.floor(intensity / 20));
  for (let index = 0; index < count; index++) {
    const rectWidth = Math.max(20, Math.min(width * 0.4, 20 + random() * intensity * 3));
    const rectHeight = Math.max(6, Math.min(height * 0.12, 6 + random() * intensity * 1.5));
    const x = random() * Math.max(0, width - rectWidth);
    const y = random() * Math.max(0, height - rectHeight);
    ctx.save();
    ctx.translate(x + rectWidth / 2, y + rectHeight / 2);
    ctx.rotate((random() - 0.5) * 0.6);
    const gradient = ctx.createLinearGradient(x, y, x + rectWidth, y + rectHeight);
    gradient.addColorStop(0, `rgba(80,60,40,${0.02 + random() * 0.12})`);
    gradient.addColorStop(1, `rgba(80,60,40,${0.01 + random() * 0.08})`);
    ctx.fillStyle = gradient;
    roundedRect(ctx, -rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight, Math.min(8, rectWidth * 0.08));
    ctx.fill();
    ctx.restore();
  }
}

export function drawWaterStainOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  random: RandomSource,
) {
  if (intensity <= 0) return;
  const count = Math.max(1, Math.floor(intensity / 25));
  for (let index = 0; index < count; index++) {
    const stainWidth = Math.max(30, Math.min(width * 0.6, 40 + random() * intensity * 4));
    const stainHeight = Math.max(10, Math.min(height * 0.2, 10 + random() * intensity * 1.5));
    const x = random() * Math.max(0, width - stainWidth);
    const y = random() * Math.max(0, height - stainHeight);
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    const gradient = ctx.createRadialGradient(
      x + stainWidth / 2,
      y + stainHeight / 2,
      Math.min(stainWidth, stainHeight) * 0.2,
      x + stainWidth / 2,
      y + stainHeight / 2,
      Math.max(stainWidth, stainHeight) * 0.8,
    );
    gradient.addColorStop(0, 'rgba(255,255,255,0.02)');
    gradient.addColorStop(0.5, `rgba(200,210,220,${0.02 + (intensity / 100) * 0.18})`);
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(x + stainWidth / 2, y + stainHeight / 2, stainWidth / 2, stainHeight / 2, random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export function drawLinedPaper(ctx: CanvasRenderingContext2D, width: number, height: number, random: RandomSource) {
  ctx.save();
  ctx.strokeStyle = 'rgba(100,130,180,0.18)';
  ctx.lineWidth = 1;
  for (let y = 24; y < height; y += 24) {
    ctx.beginPath();
    ctx.moveTo(0, y + (random() - 0.5) * 1.5);
    ctx.lineTo(width, y + (random() - 0.5) * 1.5);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawGridPaper(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.strokeStyle = 'rgba(100,130,180,0.12)';
  ctx.lineWidth = 1;
  for (let y = 20; y < height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for (let x = 20; x < width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  ctx.restore();
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}
