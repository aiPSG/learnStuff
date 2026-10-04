// Run with: node tests/generators.test.js
// Generates many questions per topic and checks they are well-formed and self-consistent.
global.window = globalThis;
require('../js/mathterm.js');
require('../js/visuals.js');
require('../js/topics.js');
const M = globalThis.MathTerm;
const TOPICS = globalThis.Topics.list;
const strip = (h) => String(h).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
let fails = 0, total = 0;
function fail(t, gi, msg, q) { fails++; if (fails < 25) console.error(`✗ Thema ${t.id} gen ${gi}: ${msg}\n   ${JSON.stringify({ p: strip(q.prompt), v: strip(q.visual || '').slice(0, 120), e: q.expected, o: q.options && q.options.map(strip) })}`); }
for (const t of TOPICS) {
  t.gens.forEach((gen, gi) => {
    for (let i = 0; i < 400; i++) {
      total++;
      const q = gen();
      if (!q.prompt) fail(t, gi, 'no prompt', q);
      if (q.type === 'mc') {
        const plain = q.options.map(strip);
        if (q.options.length < 2 || q.options.length > 4) fail(t, gi, 'option count ' + q.options.length, q);
        if (new Set(q.options).size !== q.options.length) fail(t, gi, 'duplicate options', q);
        if (!(q.correct >= 0 && q.correct < q.options.length)) fail(t, gi, 'bad correct index', q);
        if (plain.some((o) => /undefined|NaN/.test(o))) fail(t, gi, 'undefined in option', q);
      } else if (q.type === 'num') {
        if (!Number.isFinite(q.answer)) fail(t, gi, 'non-finite answer', q);
      } else if (q.type === 'term') {
        const sol = q.simplified ? M.simplify(q.expected) : q.expected;
        const r = M.checkTerm(sol, q.expected, { simplified: q.simplified });
        if (r.status !== 'ok') fail(t, gi, 'solution not accepted: ' + sol + ' → ' + r.status + ' ' + (r.msg || ''), q);
        // The pretty, typed-by-hand ASCII form must also work
        const ascii = sol.replace(/−/g, '-').replace(/²/g, '^2').replace(/³/g, '^3');
        if (M.checkTerm(ascii, q.expected, { simplified: q.simplified }).status !== 'ok') fail(t, gi, 'ascii solution not accepted: ' + ascii, q);
        // The unsimplified question itself must NOT count as simplified when simplification is required
        if (q.simplified && !q.prefix && q.visual) {
          const raw = strip(q.visual).trim();
          if (M.checkTerm(raw, q.expected, { simplified: true }).status === 'ok' && raw !== sol) fail(t, gi, 'question already counts as simplified: ' + raw, q);
        }
      } else fail(t, gi, 'unknown type', q);
      const all = strip(q.prompt + (q.visual || '') + (q.explain || ''));
      if (/undefined|NaN|\[object/.test(all)) fail(t, gi, 'undefined/NaN in text: ' + all.slice(0, 200), q);
    }
  });
}
console.log(`${total - fails}/${total} generated questions OK`);
process.exit(fails ? 1 : 0);
