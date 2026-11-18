// Run with: node tests/deutsch.test.js
// 1) Jede Zitat-Angabe muss stimmen: Wortlaut steht im Text, Zeilenangabe passt.
// 2) Viele ArguQuest-Aufgaben erzeugen und auf Stimmigkeit prüfen.
global.window = globalThis;
require('../js/visuals.js');
require('../deutsch/data.js');
require('../deutsch/topics.js');
const { TEXTS, STREIT, SENTENCES } = globalThis.DeData;
const T = globalThis.DeTopics;
let fails = 0;
const bad = (m) => { fails++; if (fails < 30) console.error('✗ ' + m); };

// Zeilen, über die sich eine Textstelle erstreckt
function linesOf(text, phrase) {
  let pos = 0; const starts = text.lines.map((l) => { const s = pos; pos += l.length + 1; return s; });
  const joined = text.lines.join(' ');
  const i = joined.indexOf(phrase);
  if (i < 0) return null;
  const lineAt = (c) => starts.filter((s) => s <= c).length;
  const a = lineAt(i), b = lineAt(i + phrase.length - 1);
  return Array.from({ length: b - a + 1 }, (_, k) => a + k);
}
const findIn = (phrase) => { for (const t of TEXTS) { const l = linesOf(t, phrase); if (l) return l; } return null; };
// Prüft „Zitat“ (Z. …) – auch mit ‚…‘ und […] / [Ergänzung]
function checkCite(str, label) {
  const re = /„([^“]+)“\s*\((Z\. [^)]+)\)/g; let m, n = 0;
  while ((m = re.exec(str))) {
    n++;
    let quote = m[1].replace(/‚([^‘]+)‘/g, '„$1“');
    const pieces = quote.replace(/ ?\[[^\]]*\] ?/g, '\u0000').split('\u0000').map((x) => x.trim()).filter(Boolean);
    const ls = pieces.map(findIn);
    if (ls.some((x) => !x)) { bad(`${label}: Wortlaut nicht im Text: „${m[1]}“`); continue; }
    const all = [...new Set(ls.flat())].sort((a, b) => a - b);
    const z = T.zeile(all.length > 2 ? [all[0], all[all.length - 1]].concat(all.slice(1, -1)).sort((a, b) => a - b) : all);
    const expect = all.length === 1 ? `Z. ${all[0]}` : all.length === 2 ? `Z. ${all[0]} f.` : `Z. ${all[0]}–${all[all.length - 1]}`;
    if (m[2] !== expect) bad(`${label}: Zeilenangabe (${m[2]}) statt (${expect}) für „${m[1]}“`);
    void z;
  }
  return n;
}

// 1) Material
for (const t of TEXTS) for (const [q, ls, alt] of t.quotes) {
  const got = linesOf(t, q);
  if (!got) bad(`Text ${t.id}: Zitat fehlt im Text: ${q}`);
  else if (got.join() !== ls.join()) bad(`Text ${t.id}: Zeilen ${ls} statt ${got} für „${q}“`);
  if (alt === q || t.lines.join(' ').includes(alt)) bad(`Text ${t.id}: veränderte Fassung ist nicht verändert: ${alt}`);
}
const C = T._check;
C.AUSL.forEach(([orig, cut, z]) => { if (!orig.includes(cut)) bad('Auslassung nicht im Original: ' + cut); checkCite(`„${orig}“ (${z})`, 'Auslassung-Original'); });
C.ERG.forEach(([, right]) => checkCite(right, 'Ergänzung'));
C.ZIZ.forEach(([src, z]) => checkCite(`„${src.replace(/„([^“]+)“/, '‚$1‘')}“ (${z})`, 'Zitat im Zitat'));
C.EINBAU.forEach(([ok]) => { if (!checkCite(ok, 'Einbau')) bad('Einbau ohne Zitat: ' + ok); });
C.ORDER_CITE.forEach((it) => checkCite(it.join(' '), 'Satzbau'));
C.SUPPORT.forEach(([th, ti, ok, ls, ...wr]) => { checkCite(T.cite(ok, ls), 'Beleg-Zitat'); wr.forEach(([w, l]) => checkCite(T.cite(w, l), 'Beleg-Zitat (falsch)')); });
STREIT.forEach((s) => { ['P', 'C'].forEach((k) => { if (s[k].length !== 3 || s[k].some((a) => a.length !== 3 || a.some((x) => !x))) bad('Streitfrage unvollständig: ' + s.q); }); if (!s.q.endsWith('?') || !s.pro.endsWith('.') || !s.contra.endsWith('.')) bad('Satzzeichen: ' + s.q); });
if (new Set(SENTENCES.map((s) => s[0])).size !== SENTENCES.length) bad('doppelte Sätze in SENTENCES');

// 2) Aufgaben erzeugen
const strip = (h) => String(h).replace(/<[^>]+>/g, ' ');
let total = 0;
for (const t of T.list) {
  if (!t.goal || !t.learn.length) bad(`Thema ${t.id}: Ziel/Lernkarten fehlen`);
  t.gens.forEach((gen, gi) => {
    for (let i = 0; i < 300; i++) {
      total++;
      const q = gen();
      const tag = `Thema ${t.id} gen ${gi}`;
      const txt = strip([q.prompt, q.visual, q.explain, (q.options || []).join(' '), (q.items || []).join(' '), (q.models || []).join(' ')].join(' '));
      if (/undefined|NaN|\[object|null/.test(txt)) bad(`${tag}: undefined/null im Text: ${txt.slice(0, 120)}`);
      if (q.type === 'mc') {
        if (q.options.length < 2 || q.options.length > 4) bad(`${tag}: ${q.options.length} Optionen`);
        if (new Set(q.options).size !== q.options.length) bad(`${tag}: doppelte Optionen: ${q.options.join(' | ')}`);
        if (!(q.correct >= 0 && q.correct < q.options.length)) bad(`${tag}: falscher Index`);
        // Richtige Antwort mit Zitat muss korrekt zitiert sein
        if (/Zitat|zitier|belegen/.test(q.prompt) && /„[^“]+“ \(Z\./.test(q.options[q.correct])) checkCite(q.options[q.correct], tag);
      } else if (q.type === 'multi') {
        if (!q.correct.length || q.correct.length === q.options.length) bad(`${tag}: Mehrfachauswahl ohne echte Wahl`);
        if (new Set(q.options).size !== q.options.length) bad(`${tag}: doppelte Optionen`);
        q.correct.forEach((ci) => { if (/„[^“]+“ \(Z\./.test(q.options[ci])) checkCite(q.options[ci], tag); });
      } else if (q.type === 'order') {
        if (q.items.length < 3 || new Set(q.items).size !== q.items.length) bad(`${tag}: Reihenfolge ungültig`);
      } else if (q.type === 'hotspot') {
        if (!q.svg.includes(`data-part="${q.answer}"`)) bad(`${tag}: Lösung fehlt im Text: ${q.answer}`);
        if ((q.svg.match(new RegExp(`data-part="${q.answer}"`, 'g')) || []).length !== 1) bad(`${tag}: Lösung nicht eindeutig`);
      } else if (q.type === 'write') {
        if (!q.criteria || q.criteria.length < 3 || !q.models || !q.models.length) bad(`${tag}: Schreibaufgabe unvollständig`);
        q.models.forEach((m) => { if (/„[^“]+“ \(Z\./.test(m)) checkCite(m, tag + ' Musterlösung'); });
      } else bad(`${tag}: unbekannter Typ ${q.type}`);
    }
  });
}
for (const t of T.list) { const f = T.FAQ[t.id]; if (!f || !f.length || f.some(([a, b]) => !a || !b)) bad('FAQ Thema ' + t.id); }
console.log(`${fails ? '✗' : '✓'} ${total} ArguQuest-Aufgaben erzeugt, Zitate geprüft – ${fails} Fehler`);
process.exit(fails ? 1 : 0);
