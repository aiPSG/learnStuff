// Run with: node tests/bio.test.js
// Erzeugt viele ZellQuest-Aufgaben und prüft, ob jede in sich stimmig ist.
global.window = globalThis;
require('../js/visuals.js');
require('../bio/cells.js');
require('../bio/topics.js');
const T = globalThis.BioTopics.list;
const strip = (h) => String(h).replace(/<[^>]+>/g, ' ');
let fails = 0, total = 0;
const fail = (t, gi, msg, q) => { fails++; if (fails < 20) console.error(`✗ Thema ${t.id} gen ${gi}: ${msg} :: ${strip(q.prompt).slice(0, 90)}`); };
for (const t of T) {
  if (!t.goal || !t.learn.length) fail(t, -1, 'Ziel oder Lernkarten fehlen', { prompt: '' });
  t.gens.forEach((gen, gi) => {
    for (let i = 0; i < 300; i++) {
      total++;
      const q = gen();
      const text = strip([q.prompt, q.visual, q.explain, (q.options || []).join(' '), (q.items || []).join(' ')].join(' '));
      if (/undefined|NaN|\[object/.test(text)) fail(t, gi, 'undefined/NaN im Text', q);
      if (q.type === 'mc') {
        if (q.options.length < 2 || q.options.length > 4) fail(t, gi, 'Anzahl Optionen ' + q.options.length, q);
        if (new Set(q.options).size !== q.options.length) fail(t, gi, 'doppelte Optionen', q);
        if (!(q.correct >= 0 && q.correct < q.options.length)) fail(t, gi, 'falscher Index', q);
      } else if (q.type === 'multi') {
        if (!q.correct.length || q.correct.length === q.options.length) fail(t, gi, 'Mehrfachauswahl ohne echte Wahl', q);
        if (new Set(q.options).size !== q.options.length) fail(t, gi, 'doppelte Optionen', q);
      } else if (q.type === 'order') {
        if (q.items.length < 3 || new Set(q.items).size !== q.items.length) fail(t, gi, 'Reihenfolge ungültig', q);
      } else if (q.type === 'hotspot') {
        if (!q.svg.includes(`data-part="${q.answer}"`)) fail(t, gi, 'Lösungsteil fehlt im Diagramm: ' + q.answer, q);
        if (!q.answerLabel) fail(t, gi, 'answerLabel fehlt', q);
      } else if (q.type === 'num') {
        if (!Number.isFinite(q.answer)) fail(t, gi, 'keine Zahl', q);
      } else fail(t, gi, 'unbekannter Typ ' + q.type, q);
    }
  });
}
// Fragen-Knöpfe: jedes Thema hat welche, keine leeren Antworten
for (const t of T) {
  const f = globalThis.BioTopics.FAQ[t.id];
  if (!f || !f.length || f.some(([q, a]) => !q || !a || /undefined/.test(q + a))) { fails++; console.error('✗ FAQ Thema ' + t.id); }
}
console.log(`${total - fails}/${total} generierte Bio-Aufgaben OK`);
process.exit(fails ? 1 : 0);
