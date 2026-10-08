/* eslint-disable @typescript-eslint/no-explicit-any */
// Canvas pixel and overlay utilities for Transform PDF
export type FiltersOptions = {
  brightness?: number; // 0..100 (50 = no change)
  contrast?: number; // 0..100 (50 = no change)
  sepia?: number; // 0..100
  gamma?: number; // 0.5..2.5
  saturation?: number; // -100..100
  hue?: number; // -180..180
  temperature?: number; // -100..100
  vignetteSize?: number; // 0..100
  vignetteDarkness?: number; // 0..100
  glare?: number; // 0..100
  grain?: number; // 0..100
  jpegArtifacts?: number; // 0..100
  dpiReduction?: number; // 0..100
};

export function applyPixelFilters(imageData: ImageData, opts: FiltersOptions) {
  const data = imageData.data;
  const brightness = opts.brightness ?? 50;
  const contrast = opts.contrast ?? 50;
  const sepia = opts.sepia ?? 0;
  const gamma = opts.gamma ?? 1;
  const saturation = opts.saturation ?? 0;
  const hue = opts.hue ?? 0;
  const temperature = opts.temperature ?? 0;

  const bFactor = (brightness - 50) / 50; // -1..1
  const bAdd = Math.floor(bFactor * 255);
  const cFactor = contrast / 50; // 0..2
  const sFactor = sepia / 100;
  const satFactor = saturation / 100;
  const hueShift = (hue / 360) * 2 * Math.PI; // radians

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // brightness
    r = clamp(r + bAdd, 0, 255);
    g = clamp(g + bAdd, 0, 255);
    b = clamp(b + bAdd, 0, 255);

    // contrast
    r = clamp(((r / 255 - 0.5) * cFactor + 0.5) * 255, 0, 255);
    g = clamp(((g / 255 - 0.5) * cFactor + 0.5) * 255, 0, 255);
    b = clamp(((b / 255 - 0.5) * cFactor + 0.5) * 255, 0, 255);

    // gamma correction
    if (gamma && Math.abs(gamma - 1) > 0.001) {
      r = clamp(255 * Math.pow(r / 255, 1 / gamma), 0, 255);
      g = clamp(255 * Math.pow(g / 255, 1 / gamma), 0, 255);
      b = clamp(255 * Math.pow(b / 255, 1 / gamma), 0, 255);
    }

    // saturation & hue via HSL
    if (Math.abs(satFactor) > 0.001 || Math.abs(hue) > 0.001) {
      const [h, s, l] = rgbToHsl(r, g, b);
      const ns = clamp01(s + satFactor * s);
      const nh = (h + hue / 360) % 1;
      const [nr, ng, nb] = hslToRgb(nh < 0 ? nh + 1 : nh, ns, l);
      r = nr;
      g = ng;
      b = nb;
    }

    // sepia
    if (sFactor > 0) {
      const tr = r;
      const tg = g;
      const tb = b;
      r = clamp(tr * (1 - sFactor) + (0.393 * tr + 0.769 * tg + 0.189 * tb) * sFactor, 0, 255);
      g = clamp(tg * (1 - sFactor) + (0.349 * tr + 0.686 * tg + 0.168 * tb) * sFactor, 0, 255);
      b = clamp(tb * (1 - sFactor) + (0.272 * tr + 0.534 * tg + 0.131 * tb) * sFactor, 0, 255);
    }

    // temperature (simple)
    if (temperature) {
      const t = temperature / 100;
      r = clamp(r + t * 30, 0, 255);
      b = clamp(b - t * 20, 0, 255);
    }

    data[i] = Math.round(r);
    data[i + 1] = Math.round(g);
    data[i + 2] = Math.round(b);
  }
}

export function applyVignetteToCtx(ctx: CanvasRenderingContext2D, w: number, h: number, sizePct: number, darknessPct: number) {
  const strength = clamp01(darknessPct / 100);
  const size = clamp01(sizePct / 100);
  const grd = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * (0.1 + (1 - size) * 0.4), w / 2, h / 2, Math.max(w, h) * 0.9);
  grd.addColorStop(0, `rgba(0,0,0,0)`);
  grd.addColorStop(0.6, `rgba(0,0,0,${0.2 * strength})`);
  grd.addColorStop(1, `rgba(0,0,0,${0.6 * strength})`);
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = grd as any;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

export function applyGlareToCtx(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  if (amount <= 0) return;
  const strength = clamp01(amount / 100);
  const g = ctx.createLinearGradient(-w * 0.5, -h * 0.5, w * 1.5, h * 1.5);
  g.addColorStop(0, `rgba(255,255,255,0)`);
  g.addColorStop(0.4, `rgba(255,255,255,${0.04 * strength})`);
  g.addColorStop(0.5, `rgba(255,255,255,${0.12 * strength})`);
  g.addColorStop(0.6, `rgba(255,255,255,${0.04 * strength})`);
  g.addColorStop(1, `rgba(255,255,255,0)`);
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = g as any;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

export function applyGrainToImageData(imageData: ImageData, amount: number, random: () => number) {
  if (amount <= 0) return;
  const data = imageData.data;
  const strength = amount / 100;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (random() * 2 - 1) * 255 * 0.3 * strength;
    data[i] = clamp(data[i] + noise, 0, 255);
    data[i + 1] = clamp(data[i + 1] + noise, 0, 255);
    data[i + 2] = clamp(data[i + 2] + noise, 0, 255);
  }
}

// Unsharp mask (simple): blur the image with a small box filter, then add the scaled
// difference between original and blurred image to sharpen.
export function applySharpenToImageData(imageData: ImageData, amount: number) {
  if (!amount || amount <= 0) return;
  const strength = clamp01(amount / 100) * 1.5; // scale factor
  const w = imageData.width;
  const h = imageData.height;
  const src = imageData.data;
  const tmp = new Uint8ClampedArray(src.length);

  // simple separable box blur radius = 1 (3x3)
  // horizontal pass
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let rr = 0, rg = 0, rb = 0, ra = 0, cnt = 0;
      for (let kx = -1; kx <= 1; kx++) {
        const nx = x + kx;
        if (nx < 0 || nx >= w) continue;
        const idx = (y * w + nx) * 4;
        rr += src[idx]; rg += src[idx + 1]; rb += src[idx + 2]; ra += src[idx + 3]; cnt++;
      }
      const oidx = (y * w + x) * 4;
      tmp[oidx] = Math.round(rr / cnt);
      tmp[oidx + 1] = Math.round(rg / cnt);
      tmp[oidx + 2] = Math.round(rb / cnt);
      tmp[oidx + 3] = Math.round(ra / cnt);
    }
  }

  // vertical pass into blurred buffer
  const blurred = new Uint8ClampedArray(src.length);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let rr = 0, rg = 0, rb = 0, ra = 0, cnt = 0;
      for (let ky = -1; ky <= 1; ky++) {
        const ny = y + ky;
        if (ny < 0 || ny >= h) continue;
        const idx = (ny * w + x) * 4;
        rr += tmp[idx]; rg += tmp[idx + 1]; rb += tmp[idx + 2]; ra += tmp[idx + 3]; cnt++;
      }
      const oidx = (y * w + x) * 4;
      blurred[oidx] = Math.round(rr / cnt);
      blurred[oidx + 1] = Math.round(rg / cnt);
      blurred[oidx + 2] = Math.round(rb / cnt);
      blurred[oidx + 3] = Math.round(ra / cnt);
    }
  }

  // apply unsharp: out = src + strength * (src - blurred)
  for (let i = 0; i < src.length; i += 4) {
    const r = src[i], g = src[i + 1], b = src[i + 2];
    const br = blurred[i], bg = blurred[i + 1], bb = blurred[i + 2];
    imageData.data[i] = clamp(Math.round(r + strength * (r - br)), 0, 255);
    imageData.data[i + 1] = clamp(Math.round(g + strength * (g - bg)), 0, 255);
    imageData.data[i + 2] = clamp(Math.round(b + strength * (b - bb)), 0, 255);
    // alpha unchanged
  }
}

// Attempt to remove ruled (lined) paper horizontal lines by detecting dark thin rows
export function removeRuledLinesFromImageData(imageData: ImageData, sensitivity = 0.7) {
  const { data, width, height } = imageData;
  // Compute luminance per pixel
  const lum = new Float32Array(width * height);
  let globalSum = 0;
  for (let y = 0; y < height; y++) {
    let rowSum = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const l = 0.299 * r + 0.587 * g + 0.114 * b;
      lum[y * width + x] = l;
      rowSum += l;
    }
    globalSum += rowSum / Math.max(1, width);
  }
  const globalMean = globalSum / Math.max(1, height);

  // For each row compute fraction of pixels that have a strong vertical edge (diff with next row)
  const edgeFrac = new Float32Array(height);
  const edgeThresh = 18; // pixel luminance difference to count as edge
  for (let y = 0; y < height - 1; y++) {
    let cnt = 0;
    for (let x = 0; x < width; x++) {
      const d = Math.abs(lum[y * width + x] - lum[(y + 1) * width + x]);
      if (d > edgeThresh) cnt++;
    }
    edgeFrac[y] = cnt / width;
  }
  edgeFrac[height - 1] = edgeFrac[height - 2] || 0;

  // Candidate rows are those with a high fraction of vertical edges
  const candidates = new Uint8Array(height);
  const edgeFracThresh = 0.30; // require at least 30% of pixels show vertical edge
  for (let y = 0; y < height; y++) {
    if (edgeFrac[y] >= edgeFracThresh) {
      // avoid marking rows that are globally very dark (handwriting covers many pixels)
      // compute row mean luminance
      let rowSum = 0;
      for (let x = 0; x < width; x++) rowSum += lum[y * width + x];
      const rowMean = rowSum / width;
      if (rowMean > globalMean - 30) {
        candidates[y] = 1;
      }
    }
  }

  // group consecutive candidate rows; only treat short thin runs as lines
  const isLine = new Uint8Array(height);
  let y = 0;
  while (y < height) {
    if (!candidates[y]) { y++; continue; }
    let start = y;
    while (y < height && candidates[y]) y++;
    const end = y - 1;
    const runLen = end - start + 1;
    // Only consider runs that are thin (<= 3 rows) as ruled lines
    if (runLen <= 3) {
      for (let yy = start; yy <= end; yy++) isLine[yy] = 1;
    }
    // else ignore longer runs (likely folds, stains, or heavy text) to avoid wiping content
  }

  // Inpaint marked rows by averaging nearest non-line rows vertically
  for (let yy = 0; yy < height; yy++) {
    if (!isLine[yy]) continue;
    let above = yy - 1; while (above >= 0 && isLine[above]) above--;
    let below = yy + 1; while (below < height && isLine[below]) below++;
    if (above < 0 && below >= height) continue;
    for (let x = 0; x < width; x++) {
      const idx = (yy * width + x) * 4;
      if (above >= 0 && below < height) {
        const ia = (above * width + x) * 4;
        const ib = (below * width + x) * 4;
        data[idx] = Math.round((data[ia] + data[ib]) / 2);
        data[idx + 1] = Math.round((data[ia + 1] + data[ib + 1]) / 2);
        data[idx + 2] = Math.round((data[ia + 2] + data[ib + 2]) / 2);
      } else if (above >= 0) {
        const ia = (above * width + x) * 4;
        data[idx] = data[ia]; data[idx + 1] = data[ia + 1]; data[idx + 2] = data[ia + 2];
      } else if (below < height) {
        const ib = (below * width + x) * 4;
        data[idx] = data[ib]; data[idx + 1] = data[ib + 1]; data[idx + 2] = data[ib + 2];
      }
    }
  }
}

export function applyJpegArtifactsToImageData(imageData: ImageData, amount: number, random: () => number) {
  if (amount <= 0) return;
  const data = imageData.data;
  const strength = clamp01(amount / 100);
  const w = imageData.width;
  const h = imageData.height;
  const block = 8;
  for (let by = 0; by < h; by += block) {
    for (let bx = 0; bx < w; bx += block) {
      if (random() > strength) continue;
      // compute average color in block and then fill block with it
      let r = 0,
        g = 0,
        b = 0,
        cnt = 0;
      for (let yy = 0; yy < block; yy++) {
        for (let xx = 0; xx < block; xx++) {
          const x = bx + xx;
          const y = by + yy;
          if (x >= w || y >= h) continue;
          const idx = (y * w + x) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          cnt++;
        }
      }
      if (cnt === 0) continue;
      r = r / cnt;
      g = g / cnt;
      b = b / cnt;
      // fill block
      for (let yy = 0; yy < block; yy++) {
        for (let xx = 0; xx < block; xx++) {
          const x = bx + xx;
          const y = by + yy;
          if (x >= w || y >= h) continue;
          const idx = (y * w + x) * 4;
          data[idx] = r + (random() - 0.5) * 20 * strength;
          data[idx + 1] = g + (random() - 0.5) * 20 * strength;
          data[idx + 2] = b + (random() - 0.5) * 20 * strength;
        }
      }
    }
  }
}

export interface InkTransformOptions {
  color: 'black' | 'blue' | 'brown' | 'gray' | 'green' | 'red';
  fading: number; // 0-100
  bleeding: number; // 0-100
}

export function applyInkTransformations(imageData: ImageData, options: InkTransformOptions) {
  const data = imageData.data;
  const w = imageData.width;
  const h = imageData.height;
  const { color = 'black', fading = 0, bleeding = 0 } = options;

  // Pre-copy original colors for neighbor averaging used by bleeding
  const orig = new Uint8ClampedArray(data);

  // threshold for ink detection (0-255) — pixels darker than this are considered ink
  // increase sensitivity so faint inks are detected
  const threshold = 200;

  // create mask of ink strength per pixel (0..1)
  const mask = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      // normalize so darker pixels get stronger mask; add small bias
      const s = clamp01((threshold - lum) / threshold);
      mask[y * w + x] = s;
    }
  }

  // color targets
  const targets: Record<string, [number, number, number]> = {
    black: [0, 0, 0],
    blue: [0, 0, 200],
    brown: [139, 69, 19],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    red: [200, 0, 0],
  };
  const target = targets[color] || targets.black;

  const fadeFactor = clamp01(fading / 100);
  const bleedFactor = clamp01(bleeding / 100);

  // Step 1 & 2: Color shift + fading applied per-pixel
  for (let i = 0; i < w * h; i++) {
    const idx = i * 4;
    const s = mask[i];
    if (s <= 0) continue;
    // how strongly to apply color shift based on darkness
    const strength = Math.pow(s, 0.9); // slightly emphasize darker pixels

    // linear interpolation helper
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // color shift towards target scaled by pixel darkness (darker => stronger)
    const tr = target[0], tg = target[1], tb = target[2];
    const r0 = data[idx], g0 = data[idx + 1], b0 = data[idx + 2];
    const lum = 0.299 * r0 + 0.587 * g0 + 0.114 * b0;
    const darkness = clamp01(1 - lum / 255);
    const colorStrength = strength * darkness;

    let r1 = r0, g1 = g0, b1 = b0;
    if (color !== 'black') {
      r1 = lerp(r0, tr, colorStrength);
      g1 = lerp(g0, tg, colorStrength);
      b1 = lerp(b0, tb, colorStrength);
    }

    // apply fading: blend towards white but scaled by mask strength so faint inks fade less
    if (fadeFactor > 0) {
      r1 = lerp(r1, 255, fadeFactor * strength * 0.9);
      g1 = lerp(g1, 255, fadeFactor * strength * 0.9);
      b1 = lerp(b1, 255, fadeFactor * strength * 0.9);
    }

    data[idx] = clamp(Math.round(r1), 0, 255);
    data[idx + 1] = clamp(Math.round(g1), 0, 255);
    data[idx + 2] = clamp(Math.round(b1), 0, 255);
  }

  // Step 3: Bleeding — simple separable box blur on mask then blend towards neighbor average
  if (bleedFactor > 0) {
    const radius = Math.min(6, Math.max(1, Math.round(bleedFactor * 6)));
    // horizontal blur
    const tmp = new Float32Array(w * h);
    const kernelSize = radius * 2 + 1;
    for (let y = 0; y < h; y++) {
      let sum = 0;
      for (let x = 0; x < w; x++) {
        const idx = y * w + x;
        sum += mask[idx];
        if (x >= kernelSize) sum -= mask[y * w + x - kernelSize];
        const left = Math.max(0, x - radius);
        const right = Math.min(w - 1, x + radius);
        const denom = right - left + 1;
        tmp[idx] = sum / denom;
      }
    }
    // vertical blur into blurredMask
    const blurred = new Float32Array(w * h);
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let y = 0; y < h; y++) {
        const idx = y * w + x;
        sum += tmp[idx];
        if (y >= kernelSize) sum -= tmp[(y - kernelSize) * w + x];
        const top = Math.max(0, y - radius);
        const bottom = Math.min(h - 1, y + radius);
        const denom = bottom - top + 1;
        blurred[idx] = sum / denom;
      }
    }

    // For each pixel compute 3x3 neighbor average from original and blend towards it
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const alpha = clamp01(blurred[i]) * bleedFactor;
        if (alpha <= 0) continue;
        let rr = 0, rg = 0, rb = 0, cnt = 0;
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const nx = x + ox;
            const ny = y + oy;
            if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
            const nidx = (ny * w + nx) * 4;
            rr += orig[nidx]; rg += orig[nidx + 1]; rb += orig[nidx + 2]; cnt++;
          }
        }
        if (cnt === 0) continue;
        rr = rr / cnt; rg = rg / cnt; rb = rb / cnt;
        const idx = i * 4;
        data[idx] = clamp(Math.round(data[idx] * (1 - alpha) + rr * alpha), 0, 255);
        data[idx + 1] = clamp(Math.round(data[idx + 1] * (1 - alpha) + rg * alpha), 0, 255);
        data[idx + 2] = clamp(Math.round(data[idx + 2] * (1 - alpha) + rb * alpha), 0, 255);
      }
    }
  }
}

export function downscaleUpscaleCanvas(canvas: HTMLCanvasElement, amount: number) {
  if (amount <= 0) return;
  const factor = 1 - clamp01(amount / 100) * 0.7; // down to 30%
  const w = Math.max(1, Math.floor(canvas.width * factor));
  const h = Math.max(1, Math.floor(canvas.height * factor));
  const temp = document.createElement('canvas');
  temp.width = w;
  temp.height = h;
  const tctx = temp.getContext('2d')!;
  tctx.drawImage(canvas, 0, 0, w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(temp, 0, 0, canvas.width, canvas.height);
}

// Simple helpers for overlays and damage
export function applyPaperTone(ctx: CanvasRenderingContext2D, w: number, h: number, tone: string, amount: number) {
  if (!amount || tone === 'white') return;
  const colorMap: Record<string, string> = {
    cream: 'rgba(255, 248, 220, ',
    yellowed: 'rgba(255, 244, 179, ',
    blueish: 'rgba(230, 240, 255, ',
    gray: 'rgba(240,240,245, ',
    pinkish: 'rgba(255, 235, 240, ',
  };
  const base = colorMap[tone] ?? 'rgba(255,248,220,';
  ctx.save();
  ctx.fillStyle = `${base}${clamp01(amount / 100) * 0.45})`;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

export function applyAgeSpots(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number, random: () => number) {
  const count = Math.floor((amount / 100) * 60);
  for (let i = 0; i < count; i++) {
    const rx = random() * w;
    const ry = random() * h;
    const r = random() * (6 + (amount / 100) * 30);
    const o = random() * 0.4 + 0.05;
    ctx.beginPath();
    ctx.fillStyle = `rgba(120,70,30,${o})`;
    ctx.ellipse(rx, ry, r, r * (0.6 + random() * 0.8), random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function applyFoldCrease(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number, random: () => number, horizontal = false) {
  if (amount <= 0) return;
  ctx.save();
  ctx.globalAlpha = clamp01(amount / 100) * 0.9;
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = Math.max(0.5, (amount / 100) * 4);
  if (horizontal) {
    const y = h * (0.2 + random() * 0.6);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  } else {
    const x = w * (0.05 + random() * 0.2);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  ctx.restore();
}

export function applyTornEdges(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number, random: () => number) {
  if (amount <= 0) return;
  const jag = Math.floor(6 + (amount / 100) * 30);
  const margin = Math.max(6, (amount / 100) * 30);
  // create mask path
  const path = new Path2D();
  path.moveTo(margin, margin);
  // top edge
  for (let i = 0; i < jag; i++) {
    const x = margin + (i / jag) * (w - margin * 2);
    const y = margin + random() * margin * 0.6;
    path.lineTo(x, y);
  }
  path.lineTo(w - margin, margin);
  path.lineTo(w - margin, h - margin);
  // bottom jag
  for (let i = jag; i >= 0; i--) {
    const x = margin + (i / jag) * (w - margin * 2);
    const y = h - margin - random() * margin * 0.6;
    path.lineTo(x, y);
  }
  path.closePath();
  // clip to path
  ctx.save();
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = 'black';
  ctx.fill(path);
  ctx.restore();
}

export function applyDogEar(ctx: CanvasRenderingContext2D, w: number, h: number, position: string, amount: number) {
  if (position === 'none' || amount <= 0) return;
  const size = Math.min(w, h) * 0.12 * (amount / 100 || 1);
  ctx.save();
  ctx.translate(0, 0);
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  let x = 0,
    y = 0;
  if (position.includes('right')) x = w - size;
  if (position.includes('bottom')) y = h - size;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + (position.includes('right') ? size : -size), y);
  ctx.lineTo(x + (position.includes('right') ? size : -size), y + (position.includes('bottom') ? size : -size));
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function applyStapleHoles(ctx: CanvasRenderingContext2D, w: number, h: number, enabled: boolean) {
  if (!enabled) return;
  const x = Math.min(60, w * 0.08);
  const y = Math.min(60, h * 0.06);
  for (let i = 0; i < 2; i++) {
    const ry = y + i * 10;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(40,30,20,0.9)';
    ctx.arc(x, ry, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.arc(x - 1, ry - 1, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function applyPaperclipMark(ctx: CanvasRenderingContext2D, w: number, h: number, enabled: boolean) {
  if (!enabled) return;
  ctx.save();
  const x = Math.min(80, w * 0.12);
  const y = Math.min(50, h * 0.06);
  ctx.fillStyle = 'rgba(120,60,20,0.18)';
  ctx.fillRect(x, y, Math.min(40, w * 0.08), Math.min(12, h * 0.03));
  ctx.restore();
}

export function applyTapeResidue(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number, random: () => number) {
  if (amount <= 0) return;
  const count = Math.max(1, Math.floor(amount / 30));
  for (let i = 0; i < count; i++) {
    const x = random() * (w * 0.5);
    const y = random() * (h * 0.15);
    const rw = Math.min(w * 0.6, 60 + random() * 120);
    const rh = Math.min(h * 0.08, 12 + random() * 20);
    ctx.save();
    ctx.fillStyle = `rgba(220,200,150,${0.08 + random() * 0.12})`;
    roundRect(ctx, x, y, rw, rh, 4);
    ctx.fill();
    ctx.restore();
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function clamp(v: number, a = 0, b = 255) {
  return Math.max(a, Math.min(b, v));
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function clamp01c(v: number) {
  return Math.max(0, Math.min(1, v));
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l * 255;
    return [r, g, b];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  r = hue2rgb(p, q, h + 1 / 3) * 255;
  g = hue2rgb(p, q, h) * 255;
  b = hue2rgb(p, q, h - 1 / 3) * 255;
  return [r, g, b];
}
