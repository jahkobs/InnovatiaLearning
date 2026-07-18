#!/usr/bin/env node
/*
 * Generates the Innovatia app icon (build/icon.png + build/icon.ico) with no
 * external dependencies (uses Node's built-in zlib). Run automatically before
 * packaging so the binary icons don't need to be committed to the repository.
 */
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const SIZE = 256;
const OUT = path.resolve(__dirname, '..', 'build');

const lerp = (a, b, t) => a + (b - a) * t;

// Point-in-5-point-star test.
function inStar(px, py, cx, cy, rOut, rIn, rot = -Math.PI / 2) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? rOut : rIn;
    const a = rot + (i * Math.PI) / 5;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function makePixels(size) {
  const cx = size / 2;
  const cy = size / 2;
  const corner = size * 0.22; // rounded-corner radius
  const px = Buffer.alloc(size * size * 4);
  let o = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = Math.max(corner - x, x - (size - corner), 0);
      const dy = Math.max(corner - y, y - (size - corner), 0);
      if (dx * dx + dy * dy > corner * corner) {
        o += 4; // transparent
        continue;
      }
      const t = y / size; // brand gradient #1f4e78 -> #5b9bd5
      let r = Math.round(lerp(0x1f, 0x5b, t));
      let g = Math.round(lerp(0x4e, 0x9b, t));
      let b = Math.round(lerp(0x78, 0xd5, t));
      if (inStar(x, y, cx, cy, size * 0.34, size * 0.15)) {
        r = g = b = 255; // white star
      }
      px[o++] = r; px[o++] = g; px[o++] = b; px[o++] = 255;
    }
  }
  return px;
}

function pngBytes(size, pixels) {
  const chunk = (tag, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const tagBuf = Buffer.from(tag, 'ascii');
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([tagBuf, data])) >>> 0);
    return Buffer.concat([len, tagBuf, data, crc]);
  };
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter type 0
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

function downscale(pixels, src, dst) {
  const out = Buffer.alloc(dst * dst * 4);
  const scale = src / dst;
  let o = 0;
  for (let y = 0; y < dst; y++) {
    const sy = Math.floor(y * scale);
    for (let x = 0; x < dst; x++) {
      const sx = Math.floor(x * scale);
      const i = (sy * src + sx) * 4;
      pixels.copy(out, o, i, i + 4);
      o += 4;
    }
  }
  return out;
}

function icoBytes(images) {
  const n = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(n, 4);
  const entries = [];
  const blobs = [];
  let offset = 6 + 16 * n;
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e[0] = size >= 256 ? 0 : size;
    e[1] = size >= 256 ? 0 : size;
    e.writeUInt16LE(1, 4); // color planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    blobs.push(data);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...blobs]);
}

// CRC-32 (PNG polynomial).
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const base = makePixels(SIZE);
  fs.writeFileSync(path.join(OUT, 'icon.png'), pngBytes(SIZE, base));
  const sizes = [256, 128, 64, 48, 32, 16];
  const images = sizes.map((s) => ({
    size: s,
    data: pngBytes(s, s === SIZE ? base : downscale(base, SIZE, s))
  }));
  fs.writeFileSync(path.join(OUT, 'icon.ico'), icoBytes(images));
  console.log('Generated build/icon.png and build/icon.ico (' + sizes.join(', ') + ')');
}

main();
