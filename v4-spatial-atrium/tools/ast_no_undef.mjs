// AST no-undef gate (ĐIỀU 1/3): flags any referenced identifier with no binding and not a known global.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';
import traverseMod from '@babel/traverse';

const traverse = traverseMod.default || traverseMod;
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(ROOT, 'src');

const GLOBALS = new Set([
  'window', 'document', 'navigator', 'console', 'performance', 'requestAnimationFrame',
  'cancelAnimationFrame', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval',
  'Math', 'Number', 'String', 'Boolean', 'Object', 'Array', 'JSON', 'Date', 'Intl', 'Promise',
  'Float32Array', 'Uint8Array', 'Map', 'Set', 'Error', 'undefined', 'NaN', 'Infinity',
  'AudioContext', 'webkitAudioContext', 'localStorage', 'parseInt', 'parseFloat', 'isNaN',
  'globalThis', 'import', 'URL', 'Symbol', 'WeakMap',
]);

const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(jsx?|mjs)$/.test(f)) files.push(p);
  }
})(SRC);

const problems = [];
for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  const ast = parse(code, { sourceType: 'module', plugins: ['jsx'] });
  traverse(ast, {
    ReferencedIdentifier(p) {
      const name = p.node.name;
      if (p.parentPath.isJSXMemberExpression() || p.isJSXIdentifier()) {
        if (p.isJSXIdentifier() && /^[a-z]/.test(name)) return; // intrinsic tags & r3f elements
      }
      if (p.scope.hasBinding(name) || GLOBALS.has(name)) return;
      problems.push(`${path.relative(ROOT, file)}:${p.node.loc.start.line} '${name}' is not defined`);
    },
  });
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(JSON.stringify({ status: 'PASS', files: files.length, no_undef: 0 }));
