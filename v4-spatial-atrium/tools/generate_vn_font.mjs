import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TTFLoader } from '../node_modules/three/examples/jsm/loaders/TTFLoader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../public/fonts');
fs.mkdirSync(outDir, { recursive: true });

// V5.0 Lean Uppercase Subset: Supports 100% Uppercase Vietnamese Diacritics + English A-Z + Architectural Numerals/Symbols
// Eliminates unused lowercase a-z / à-ỹ & rare ASCII bloat (-62% JSON payload, 0 visual loss since 3D headlines use .toUpperCase())
const UPPER_VN_EN_CHARS =
  ' &\'()+,-./0123456789:%ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐĨŨƠƯ' +
  'ẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆ' +
  'ỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰ' +
  'ỲỴỶỸ·•—–×°';

const fontCandidates = [
  'C:/Windows/Fonts/segoeuib.ttf',
  'C:/Windows/Fonts/arialbd.ttf',
];
const fontPath = fontCandidates.find((p) => fs.existsSync(p));
if (!fontPath) {
  throw new Error('No Vietnamese Bold TTF found in C:/Windows/Fonts');
}

function compactOutline(outlineStr) {
  if (!outlineStr) return '';
  return outlineStr
    .trim()
    .split(/\s+/)
    .map((tok) => {
      if (/^-?\d+\.\d+$/.test(tok)) {
        return String(Math.round(Number(tok)));
      }
      return tok;
    })
    .join(' ');
}

const buf = fs.readFileSync(fontPath);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const fullJson = new TTFLoader().parse(ab);

const subsetGlyphs = {};
let kept = 0;
for (const ch of new Set(UPPER_VN_EN_CHARS)) {
  const g = fullJson.glyphs[ch];
  if (g) {
    subsetGlyphs[ch] = {
      ha: Math.round(g.ha),
      x_min: g.x_min !== null && g.x_min !== undefined ? Math.round(g.x_min) : 0,
      x_max: g.x_max !== null && g.x_max !== undefined ? Math.round(g.x_max) : 0,
      o: compactOutline(g.o),
    };
    kept += 1;
  }
}

const subsetJson = {
  glyphs: subsetGlyphs,
  familyName: 'HiepD5 Arch Bold',
  ascender: Math.round(fullJson.ascender),
  descender: Math.round(fullJson.descender),
  underlinePosition: Math.round(fullJson.underlinePosition || -100),
  underlineThickness: Math.round(fullJson.underlineThickness || 50),
  boundingBox: fullJson.boundingBox,
  resolution: fullJson.resolution,
};

const outPath = path.join(outDir, 'vn_arch_bold.json');
fs.writeFileSync(outPath, JSON.stringify(subsetJson), 'utf-8');
const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
console.log(`[OK] V5.0 Lean 3D Font: ${outPath} (${kb} KB, ${kept} uppercase VI+EN glyphs)`);
