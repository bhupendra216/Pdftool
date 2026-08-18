const fs = require('fs');
const path = process.argv[2] || '/tmp/ia.json';
const raw = fs.readFileSync(path, 'utf8');
const j = JSON.parse(raw);
const docs = (j.response && j.response.docs) || [];

const normalizeTitleForMatch = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').split(/[:;\-\|]/)[0].trim();
const q = 'rich dad poor dad';
const qNorm = normalizeTitleForMatch(q);

const mediaPatterns = ['mp3','mpeg','audio','video','mp4','webm','m4v','ogg','h264','mkv'];

let passed = [];
for (const d of docs) {
  const formats = d.format || [];
  const hasPdf = Array.isArray(formats) ? formats.some(f => String(f).toLowerCase().includes('pdf')) : String(formats).toLowerCase().includes('pdf');
  const title = d.title || d.identifier || '';
  const creator = Array.isArray(d.creator) ? d.creator.join(', ') : d.creator || '';
  const tNorm = normalizeTitleForMatch(title);
  const titleMatch = !!(tNorm && qNorm && (
    tNorm.includes(qNorm) || qNorm.includes(tNorm) ||
    qNorm.split(' ').some(word => word && tNorm.includes(word)) ||
    tNorm.split(' ').some(word => word && qNorm.includes(word))
  ));
  const formatsStr = Array.isArray(formats) ? formats.join(' ').toLowerCase() : String(formats).toLowerCase();
  const looksMediaOnly = mediaPatterns.some(p => formatsStr.includes(p));
  if (titleMatch && (!looksMediaOnly || hasPdf)) {
    passed.push({ id: d.identifier, title, hasPdf, formats });
  }
}

console.log('docs total', docs.length, 'passed', passed.length);
if (passed.length < 200) console.log(JSON.stringify(passed, null, 2));
