// Browser-Test für eine Lern-App (TermQuest unter /, ZellQuest unter /bio/).
// Aufruf: python3 -m http.server 8765 &   dann
//   NODE_PATH=$(npm root -g) node tests/e2e.js http://localhost:8765/ [screenshot-ordner] [runden]
// Beantwortet jedes Thema richtig (alle Fragetypen), eine Runde falsch, den großen Test,
// kauft im Shop ein und prüft den Chat mit einem Test-Client (ohne echte KI-Anfragen).
const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:8765/';
const SHOTS = process.argv[3] || '';
const ROUNDS = +(process.argv[4] || 2);

(async () => {
  const browser = await chromium.launch();
  const errors = [], problems = [];
  const ok = (c, m) => { if (!c) problems.push(m); };

  async function newPage(vp) {
    const ctx = await browser.newContext({ viewport: vp });
    await ctx.addInitScript(() => {
      window.__calls = [];
      window.__TQ_TEST_CLIENT = { beta: { messages: { stream(params) {
        window.__calls.push(params);
        const reply = 'Tipp: Schau dir das **genau** an.';
        return {
          async *[Symbol.asyncIterator]() { yield { type: 'content_block_delta', delta: { type: 'text_delta', text: reply } }; },
          async finalMessage() { return { stop_reason: 'end_turn' }; },
        };
      } } } };
    });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_/.test(m.text())) errors.push('console: ' + m.text()); });
    return page;
  }
  const shot = async (page, name) => { if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true }); };

  // Klickt auf eine sichtbare, wirklich erreichbare Stelle eines Diagramm-Teils
  async function clickPart(page, part) {
    const pt = await page.evaluate((part) => {
      const groups = [...document.querySelectorAll(`.hotspot [data-part="${part}"]`)];
      // Zuerst die Mitte jeder sichtbaren Form probieren (so tippt ein Kind), dann ein Raster
      for (const el of groups.flatMap((gr) => [...gr.querySelectorAll('circle, ellipse, rect, path')])) {
        const r = el.getBoundingClientRect();
        const x = r.left + r.width / 2, y = r.top + r.height / 2;
        const hit = document.elementFromPoint(x, y);
        const p = hit && hit.closest('[data-part]');
        if (p && p.dataset.part === part) return { x, y };
      }
      for (const el of groups) {
        const r = el.getBoundingClientRect();
        for (let fy = 0.5; fy < 1; fy += 0.1) for (const sy of [1, -1]) for (let fx = 0.5; fx < 1; fx += 0.1) for (const sx of [1, -1]) {
          const x = r.left + r.width * (0.5 + sx * (fx - 0.5)), y = r.top + r.height * (0.5 + sy * (fy - 0.5));
          const hit = document.elementFromPoint(x, y);
          const p = hit && hit.closest('[data-part]');
          if (p && p.dataset.part === part) return { x, y };
        }
      }
      return null;
    }, part);
    if (!pt) { problems.push('Diagramm-Teil nicht antippbar: ' + part); return false; }
    await page.mouse.click(pt.x, pt.y);
    return true;
  }

  async function answer(page, correct, tag) {
    const q = await page.evaluate(() => {
      const q = window.LearnApp.currentQuestion();
      return { type: q.type, correct: q.correct, answer: q.answer, expected: q.expected, simplified: q.simplified, n: (q.options || q.items || []).length,
        sol: q.type === 'term' ? (q.simplified ? MathTerm.simplify(q.expected) : q.expected) : null,
        parts: q.type === 'hotspot' ? [...new Set([...document.querySelectorAll('.hotspot [data-part]')].map((e) => e.dataset.part))] : null };
    });
    if (q.type === 'mc') {
      await page.click(`.opt >> nth=${correct ? q.correct : (q.correct + 1) % q.n}`);
    } else if (q.type === 'num' || q.type === 'term') {
      const val = !correct ? '999' : q.type === 'num' ? String(q.answer).replace('.', ',')
        : q.sol.replace(/−/g, '-').replace(/²/g, '^2').replace(/³/g, '^3').replace(/·/g, '*');
      await page.fill('#q-input', val);
      await page.keyboard.press('Enter');
      if (!correct) { await page.fill('#q-input', '998'); await page.click('#q-check'); }
    } else if (q.type === 'hotspot') {
      if (correct) await clickPart(page, q.answer);
      else {
        const wrong = q.parts.filter((p) => p !== q.answer);
        await clickPart(page, wrong[0]); await page.waitForTimeout(100);
        await clickPart(page, wrong[1] || wrong[0]);
      }
    } else if (q.type === 'multi') {
      const pick = correct ? q.correct : [...Array(q.n).keys()].filter((i) => !q.correct.includes(i)).slice(0, 1);
      for (const i of (pick.length ? pick : [0])) await page.click(`.options.multi .opt[data-i="${i}"]`);
      await page.click('#q-check');
      if (!correct) await page.click('#q-check');
    } else if (q.type === 'order') {
      const seq = [...Array(q.n).keys()];
      if (!correct) seq.reverse();
      for (const i of seq) await page.click(`.order-pool .order-item[data-i="${i}"]`);
      await page.click('#q-check');
      if (!correct) await page.click('#q-check');
    } else problems.push(tag + ': unbekannter Typ ' + q.type);
    await page.waitForTimeout(120);
    if (!(await page.isVisible('#q-next'))) await page.click('#q-skip');
    const fb = await page.getAttribute('.feedback', 'class');
    if (correct && !/good/.test(fb)) problems.push(`${tag}: erwartet richtig (${q.type}), Feedback: ` + (await page.textContent('.feedback')).slice(0, 160));
    if (!correct && !/bad/.test(fb)) problems.push(`${tag}: erwartet falsch (${q.type}), Feedback-Klasse ${fb}`);
    return q.type;
  }

  async function runQuiz(page, hash, correct, tag) {
    await page.goto(BASE + hash);
    await page.waitForSelector('.q-card');
    const types = {};
    for (let i = 0; ; i++) {
      await page.waitForSelector('.q-card');
      if (await page.isVisible('#q-next')) problems.push(`${tag} q${i}: Weiter sichtbar vor der Antwort`);
      if (i < 2) await shot(page, `${tag}-q${i}`);
      const t = await answer(page, correct, `${tag} q${i}`);
      types[t] = (types[t] || 0) + 1;
      if (i < 2) await shot(page, `${tag}-q${i}-fb`);
      const last = /Ergebnis/.test(await page.textContent('#q-next'));
      await page.click('#q-next');
      if (last) break;
    }
    await page.waitForSelector('.results');
    await page.waitForTimeout(1500);
    await shot(page, `${tag}-results`);
    return types;
  }

  const page = await newPage({ width: 1200, height: 900 });
  await page.goto(BASE);
  await page.waitForTimeout(500);
  await shot(page, 'home');
  const n = await page.locator('.topic-card').count();
  const allTypes = {};
  for (let r = 0; r < ROUNDS; r++) for (let t = 1; t <= n; t++) {
    const ty = await runQuiz(page, `#/t/${t}/quiz`, true, `t${t}-r${r}`);
    Object.entries(ty).forEach(([k, v]) => { allTypes[k] = (allTypes[k] || 0) + v; });
  }
  for (let t = 1; t <= n; t++) await runQuiz(page, `#/t/${t}/quiz`, false, `t${t}-wrong`);
  await runQuiz(page, '#/test', true, 'test');

  // Lernkarten aller Themen durchklicken (inkl. interaktiver Elemente)
  for (let t = 1; t <= n; t++) {
    await page.goto(BASE + `#/t/${t}`);
    await page.waitForSelector('.learn-card');
    for (let k = 0; ; k++) {
      for (const b of await page.$$('.learn-card [data-act]')) { await b.click(); await page.waitForTimeout(60); }
      for (const p of (await page.$$('.learn-card .explore [data-part]')).slice(0, 2)) { await p.click({ force: true }); }
      if (t <= 3 || k === 0) await shot(page, `learn-t${t}-c${k}`);
      if (/üben/.test(await page.textContent('#lc-next'))) break;
      await page.click('#lc-next');
    }
  }

  // Glossar (falls das Fach eins hat)
  await page.goto(BASE);
  if (await page.locator('a[href="#/p/glossar"]').count()) {
    await page.click('a[href="#/p/glossar"]');
    await page.waitForSelector('.gloss-card');
    const before = await page.locator('.gloss-card').count();
    await page.fill('#gloss-q', 'kern');
    const after = await page.locator('.gloss-card').count();
    ok(before > 20 && after > 0 && after < before, `Glossar-Suche: ${before} → ${after}`);
    await page.click('.gloss-card >> nth=0');
    ok(await page.locator('.gloss-card.flipped').count() === 1, 'Glossar-Karte dreht sich nicht um');
    await page.fill('#gloss-q', '');
    await shot(page, 'glossar');
  }

  // Shop: Credits müssen da sein, Kauf muss klappen
  const credits = await page.evaluate(() => JSON.parse(localStorage.getItem('learnstuff-wallet')).credits);
  ok(credits > 25, 'zu wenig Credits verdient: ' + credits);
  await page.goto(BASE + '#/shop');
  await page.click('.slot-tab[data-slot="hat"]');
  await page.click('.item[data-id="partyhut"] .item-btn');
  await page.waitForTimeout(200);
  const w = await page.evaluate(() => JSON.parse(localStorage.getItem('learnstuff-wallet')));
  ok(w.avatar.owned.includes('partyhut') && w.credits === credits - 25, 'Kauf fehlgeschlagen');
  await shot(page, 'shop');

  // Chat mit Test-Client
  await page.evaluate(() => localStorage.setItem('tq-anthropic-key', 'sk-ant-test'));
  await page.goto(BASE + '#/t/1/quiz');
  await page.reload();
  await page.waitForSelector('.tutor');
  await page.click('.faq-chip >> nth=1');
  ok(await page.locator('.bubble.faq').count() === 1, 'FAQ-Antwort fehlt');
  await page.fill('.chat-input', 'abcd Frage');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.bubble.bot:not(.faq) b');
  const call = await page.evaluate(() => window.__calls[0]);
  ok(call && /NOCH NICHT beantwortet/.test(call.system), 'Systemprompt ohne Spoiler-Regel');
  ok(await page.evaluate(() => document.querySelector('.feedback').hidden), 'Tippen im Chat hat die Frage beantwortet');
  await shot(page, 'chat');

  // Handy: kein seitliches Scrollen
  const mob = await newPage({ width: 390, height: 844 });
  for (const h of ['', '#/t/1', '#/t/4/quiz', '#/shop']) {
    await mob.goto(BASE + h);
    await mob.waitForTimeout(400);
    const sw = await mob.evaluate(() => document.documentElement.scrollWidth);
    ok(sw <= 390, `Handy ${h || 'Start'}: seitlicher Überlauf ${sw}px`);
    await shot(mob, 'mobile-' + (h.replace(/[#/]/g, '') || 'home'));
  }

  console.log('Fragetypen:', JSON.stringify(allTypes));
  console.log('ERRORS:', errors.length ? errors.slice(0, 15).join('\n') : 'none');
  console.log('PROBLEMS:', problems.length ? problems.slice(0, 30).join('\n') : 'none', problems.length);
  await browser.close();
  process.exit(errors.length || problems.length ? 1 : 0);
})();
