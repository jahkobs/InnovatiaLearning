#!/usr/bin/env python3
"""Generate build/icon.ico for the Windows installer.

Draws the Innovatia Learning mark (a graduation cap on an indigo tile)
directly as RGBA pixels and packs it as a multi-size PNG-in-ICO file.
Pure standard library, so it runs anywhere Python 3 does.
"""
import os
import struct
import zlib


def png_bytes(size, pixels):
    """Encode an RGBA pixel buffer (list of rows of (r,g,b,a)) as PNG."""
    def chunk(tag, data):
        c = struct.pack('>I', len(data)) + tag + data
        return c + struct.pack('>I', zlib.crc32(tag + data) & 0xFFFFFFFF)

    raw = b''
    for row in pixels:
        raw += b'\x00' + b''.join(struct.pack('BBBB', *px) for px in row)
    ihdr = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    return (b'\x89PNG\r\n\x1a\n'
            + chunk(b'IHDR', ihdr)
            + chunk(b'IDAT', zlib.compress(raw, 9))
            + chunk(b'IEND', b''))


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def render(size):
    """Render one icon frame at the given pixel size."""
    s = size
    top = (70, 85, 212)      # indigo
    bottom = (112, 72, 201)  # purple
    white = (255, 255, 255)
    gold = (244, 183, 26)

    cx = s / 2
    board_cy = s * 0.40      # centre of the mortarboard diamond
    board_w = s * 0.40       # half-width of diamond
    board_h = s * 0.16       # half-height of diamond
    base_cy = s * 0.56       # cap base (small trapezoid under the board)
    base_w = s * 0.16
    base_h = s * 0.10
    corner = s * 0.22        # tile corner radius

    rows = []
    for y in range(s):
        row = []
        for x in range(s):
            # rounded-square tile mask
            dx = max(corner - x, x - (s - 1 - corner), 0)
            dy = max(corner - y, y - (s - 1 - corner), 0)
            if dx * dx + dy * dy > corner * corner:
                row.append((0, 0, 0, 0))
                continue
            r, g, b = lerp(top, bottom, y / s)

            # mortarboard diamond
            if abs(x - cx) / board_w + abs(y - board_cy) / board_h <= 1.0:
                r, g, b = white
            # cap base
            elif abs(x - cx) <= base_w and board_cy <= y <= base_cy + base_h:
                shade = 0.88 if y > base_cy else 1.0
                r, g, b = tuple(int(c * shade) for c in white)
            # tassel: cord down the right side of the board + a bead
            tx = cx + board_w * 0.82
            if abs(x - tx) <= max(s * 0.012, 1) and board_cy <= y <= s * 0.62:
                r, g, b = gold
            bead_cy = s * 0.65
            if (x - tx) ** 2 + (y - bead_cy) ** 2 <= (s * 0.045) ** 2:
                r, g, b = gold

            row.append((r, g, b, 255))
        rows.append(row)
    return rows


def main():
    out_dir = os.path.join(os.path.dirname(__file__), '..', 'build')
    os.makedirs(out_dir, exist_ok=True)
    sizes = [256, 128, 64, 48, 32, 16]
    images = [(sz, png_bytes(sz, render(sz))) for sz in sizes]

    # ICO header + directory entries + PNG payloads
    ico = struct.pack('<HHH', 0, 1, len(images))
    offset = 6 + 16 * len(images)
    entries = b''
    payload = b''
    for sz, data in images:
        entries += struct.pack('<BBBBHHII',
                               sz % 256, sz % 256, 0, 0, 1, 32, len(data), offset)
        payload += data
        offset += len(data)

    path = os.path.join(out_dir, 'icon.ico')
    with open(path, 'wb') as f:
        f.write(ico + entries + payload)
    print(f'wrote {path} ({os.path.getsize(path)} bytes, sizes: {sizes})')

    # electron-builder also likes a plain 256px PNG for Linux/dev use
    png_path = os.path.join(out_dir, 'icon.png')
    with open(png_path, 'wb') as f:
        f.write(images[0][1])
    print(f'wrote {png_path}')


if __name__ == '__main__':
    main()
