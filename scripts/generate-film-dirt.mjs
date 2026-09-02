import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FRAME = 512;
const FRAMES = 8;
const WIDTH = FRAME;
const HEIGHT = FRAME * FRAMES;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const payload = Buffer.concat([t, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(payload));
  return Buffer.concat([len, payload, crc]);
}

function encodePNG(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const rows = [];
  for (let y = 0; y < height; y++) {
    const start = y * width * 4;
    rows.push(Buffer.from([0]));
    rows.push(Buffer.from(rgba.subarray(start, start + width * 4)));
  }
  const idat = deflateSync(Buffer.concat(rows), { level: 9 });
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function stamp(rgba, x, y, r, g, b, a) {
  const ix = x | 0;
  const iy = y | 0;
  if (ix < 0 || iy < 0 || ix >= WIDTH || iy >= HEIGHT) return;
  const i = (iy * WIDTH + ix) * 4;
  const srcA = a / 255;
  const dstA = rgba[i + 3] / 255;
  const outA = srcA + dstA * (1 - srcA);
  if (outA <= 0) return;
  rgba[i] = Math.round((r * srcA + rgba[i] * dstA * (1 - srcA)) / outA);
  rgba[i + 1] = Math.round((g * srcA + rgba[i + 1] * dstA * (1 - srcA)) / outA);
  rgba[i + 2] = Math.round((b * srcA + rgba[i + 2] * dstA * (1 - srcA)) / outA);
  rgba[i + 3] = Math.round(outA * 255);
}

function speck(rgba, x, y, light, alpha, size) {
  const r = light ? 255 : 0;
  const g = light ? 252 : 0;
  const b = light ? 240 : 0;
  for (let dy = 0; dy < size; dy++) {
    for (let dx = 0; dx < size; dx++) {
      const fall =
        1 -
        Math.hypot(dx - (size - 1) / 2, dy - (size - 1) / 2) / (size * 0.9);
      if (fall <= 0) continue;
      stamp(rgba, x + dx, y + dy, r, g, b, alpha * Math.min(1, fall + 0.2));
    }
  }
}

function scratch(rgba, y0, y, xStart, length, light, rand) {
  const r = light ? 255 : 0;
  const g = light ? 252 : 0;
  const b = light ? 240 : 0;
  let py = y;
  for (let i = 0; i < length; i++) {
    if (rand() < 0.04) continue;
    py += (rand() - 0.5) * 0.18;
    const a = 48 + rand() * 32;
    stamp(rgba, xStart + i, y0 + py, r, g, b, a);
    if (rand() < 0.12) stamp(rgba, xStart + i, y0 + py + 1, r, g, b, a * 0.35);
  }
}

function hair(rgba, y0, x0, yStart, light, rand) {
  const r = light ? 250 : 0;
  const g = light ? 248 : 0;
  const b = light ? 236 : 0;
  const x1 = x0 + 40 + rand() * 80;
  const x2 = x0 + 80 + rand() * 120;
  const y1 = yStart + (rand() - 0.5) * 18;
  const y2 = yStart + (rand() - 0.5) * 28;
  const steps = 50 + ((rand() * 40) | 0);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    const x = u * u * x0 + 2 * u * t * x1 + t * t * x2;
    const y = y0 + u * u * yStart + 2 * u * t * y1 + t * t * y2;
    const a = 32 + rand() * 38;
    stamp(rgba, x, y, r, g, b, a);
  }
}

const rgba = new Uint8Array(WIDTH * HEIGHT * 4);
const persist = [];
const persistRand = mulberry32(1930);
for (let i = 0; i < 2; i++) {
  persist.push({
    y: 40 + persistRand() * (FRAME - 80),
    x: persistRand() * (FRAME * 0.35),
    length: 110 + persistRand() * 180,
    light: persistRand() > 0.42,
    from: (persistRand() * FRAMES) | 0,
    life: 1,
  });
}

for (let f = 0; f < FRAMES; f++) {
  const rand = mulberry32(1930 + f * 97);
  const y0 = f * FRAME;

  for (const s of persist) {
    const last = (s.from + s.life) % FRAMES;
    const active =
      s.from <= last ? f >= s.from && f <= last : f >= s.from || f <= last;
    if (!active) continue;
    scratch(
      rgba,
      y0,
      s.y + (rand() - 0.5) * 0.8,
      s.x,
      s.length,
      s.light,
      rand,
    );
  }

  if (rand() > 0.62) {
    scratch(
      rgba,
      y0,
      24 + rand() * (FRAME - 48),
      rand() * (FRAME * 0.4),
      90 + rand() * 160,
      rand() > 0.4,
      rand,
    );
  }

  if (rand() > 0.78) {
    hair(
      rgba,
      y0,
      20 + rand() * (FRAME - 160),
      30 + rand() * (FRAME - 60),
      rand() > 0.5,
      rand,
    );
  }

  const specks = 28 + ((rand() * 10) | 0);
  for (let i = 0; i < specks; i++) {
    speck(
      rgba,
      rand() * FRAME,
      y0 + rand() * FRAME,
      rand() > 0.42,
      70 + rand() * 70,
      rand() > 0.7 ? 2 : 1,
    );
  }

  if (rand() > 0.45) {
    const cx = rand() * FRAME;
    const cy = y0 + rand() * FRAME;
    const n = 2 + ((rand() * 3) | 0);
    const light = rand() > 0.5;
    for (let k = 0; k < n; k++) {
      speck(
        rgba,
        cx + (rand() - 0.5) * 6,
        cy + (rand() - 0.5) * 6,
        light,
        60 + rand() * 60,
        1,
      );
    }
  }
}

const png = encodePNG(WIDTH, HEIGHT, rgba);
const out = join(dirname(fileURLToPath(import.meta.url)), '../public/assets/film-dirt.png');
writeFileSync(out, png);
console.log(`wrote ${out} (${png.length} bytes)`);
