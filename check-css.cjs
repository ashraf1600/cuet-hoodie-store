const fs = require('fs');
const css = fs.readFileSync('dist/assets/index-CQ33JUDU.css', 'utf8');
const checks = [
  'scrollbar-none',
  '.line-clamp-1',
  '.line-clamp-2',
  'backdrop-blur-xs',
  'scale-102',
  'bg-linear-to-t',
  '.h-18',
  '.rounded-xs',
  'from-ink',
  'font-serif',
  'Syne',
];
for (const c of checks) {
  console.log(c + ' = ' + css.includes(c));
}
