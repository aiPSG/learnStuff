/*
 * Topics – Inhalte (Erklärkarten) und Aufgaben-Generatoren für alle 10 Themen
 * des Selbstdiagnosebogens „Terme II“.
 *
 * Aufgabenformate:
 *   { type:'mc',   prompt, visual?, options:[html], correct, explain, optionStyle? }
 *   { type:'num',  prompt, visual?, answer, explain }
 *   { type:'term', prompt, visual?, expected, simplified, prefix?, suffix?, explain }
 */
(function (root) {
  'use strict';

  const R = root.Rand, M = root.MathTerm, V = root.Visuals, T = V.tree, F = V.fig;

  // ---------- Hilfsfunktionen ----------
  const m = (s) => `<span class="m">${s}</span>`;
  const fmtN = (n) => String(n).replace('.', ',');
  function mono(c, v) {
    const a = Math.abs(c);
    const body = v === '' ? fmtN(a) : (a === 1 ? '' : fmtN(a)) + v;
    return { neg: c < 0, body };
  }
  function sumStr(list) {
    const l = list.filter(([c]) => c !== 0);
    if (!l.length) return '0';
    return l.map(([c, v], i) => {
      const t = mono(c, v);
      return i === 0 ? (t.neg ? '−' : '') + t.body : (t.neg ? ' − ' : ' + ') + t.body;
    }).join('');
  }
  const monoStr = (c, v) => sumStr([[c, v]]);
  const factorStr = (c, v, first) => { const s = monoStr(c, v); return !first && c < 0 ? '(' + s + ')' : s; };
  const signed = (c, v) => { const t = mono(c, v); return (t.neg ? ' − ' : ' + ') + t.body; };
  /** Fügt fertige Summanden-Strings zusammen: ["3x", "−2", "x²"] → "3x − 2 + x²" */
  function joinTerms(strs) {
    return strs.map((s, i) => {
      const neg = s.startsWith('−');
      const body = neg ? s.slice(1) : s;
      if (i === 0) return s;
      return (neg ? ' − ' : ' + ') + body;
    }).join('');
  }
  const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
  const simp = (s) => M.simplify(s);
  function mcFrom(prompt, correctHtml, wrongHtml, explain, extra) {
    const opts = R.shuffle([correctHtml].concat(wrongHtml));
    return Object.assign({ type: 'mc', prompt, options: opts, correct: opts.indexOf(correctHtml), explain }, extra || {});
  }

  /** Setzt Werte für Variablen ein und zeigt das sauber an: 3x² mit x=−2 → 3·(−2)² */
  function substitute(expr, vals) {
    let out = '';
    let prev = '';
    for (const ch of expr) {
      if (vals[ch] !== undefined) {
        const v = vals[ch];
        const t = v < 0 ? '(−' + fmtN(-v) + ')' : fmtN(v);
        if (/[0-9a-z)²³]/.test(prev)) out += '·';
        out += t;
      } else {
        out += ch;
      }
      if (ch !== ' ') prev = ch;
    }
    return out;
  }

  // =====================================================================
  // 1. Variable, Term, Gleichung, Gleichungskette
  // =====================================================================
  const CATS = ['Variable', 'Term', 'Gleichung', 'Gleichungskette'];
  const CAT_EXPLAIN = {
    Variable: 'Ein einzelner Buchstabe ist ein Platzhalter für eine Zahl – also eine <b>Variable</b>.',
    Term: 'Hier steht kein Gleichheitszeichen, aber ein Rechenausdruck – also ein <b>Term</b>.',
    Gleichung: 'Genau ein „=“ verbindet zwei Terme – also eine <b>Gleichung</b>.',
    Gleichungskette: 'Hier stehen mehrere „=“ hintereinander – also eine <b>Gleichungskette</b>.',
  };
  function catItem(cat) {
    const a = R.int(2, 9), b = R.int(1, 9), c = R.int(2, 5);
    switch (cat) {
      case 'Variable': return R.pick(['x', 'y', 'a', 'b', 'n', 'z']);
      case 'Term': return R.pick([`${a}x + ${b}`, `${a} · (y − ${b})`, `${a}a² − b`, `${a * b + 10}`, `(${a} + ${b}) : ${c}`, `x · x − ${b}`, `${a}n`]);
      case 'Gleichung': return R.pick([`${a}x + ${b} = ${a * c + b}`, `${a} + ${b} = ${a + b}`, 'a · b = b · a', `${c}(x + ${b}) = ${c}x + ${c * b}`, `y − ${b} = ${a}`]);
      default: return R.pick([`${a} · ${c} + ${b} = ${a * c} + ${b} = ${a * c + b}`, 'x + x + x = 2x + x = 3x', `${c}(y + ${b}) = ${c}y + ${c * b} = ${c * b} + ${c}y`, `(${a} + ${b}) · ${c} = ${a + b} · ${c} = ${(a + b) * c}`]);
    }
  }

  const topic1 = {
    id: 1, emoji: '🔤', color: '#8b5cf6',
    title: 'Variable, Term, Gleichung',
    goal: 'Ich kann unterscheiden, ob es sich um eine Variable, einen Term, eine Gleichung oder eine Gleichungskette handelt und sie richtig benennen.',
    book: 'AB aus dem Unterricht',
    learn: [
      {
        title: 'Die vier Begriffe',
        html: `<div class="defs">
          <div class="def c1"><b>Variable</b><p>Ein Platzhalter für eine Zahl – meist ein Buchstabe.</p>${m('x &nbsp; a &nbsp; n')}</div>
          <div class="def c2"><b>Term</b><p>Ein Rechenausdruck aus Zahlen, Variablen, Rechenzeichen und Klammern – <u>ohne</u> „=“.</p>${m('3x + 5 &nbsp;&nbsp; 2·(a − 4) &nbsp;&nbsp; 17')}</div>
          <div class="def c3"><b>Gleichung</b><p>Zwei Terme, die mit <u>einem</u> „=“ verbunden sind.</p>${m('2x + 1 = 9')}</div>
          <div class="def c4"><b>Gleichungskette</b><p><u>Mehrere</u> „=“ hintereinander – z. B. beim Ausrechnen.</p>${m('3·4 + 2 = 12 + 2 = 14')}</div>
        </div>`,
      },
      {
        title: 'Der Gleichheitszeichen-Trick 🕵️',
        html: `<p>Zähle einfach die Gleichheitszeichen:</p>
        <table class="nice-table">
          <tr><th>Anzahl „=“</th><th>Das ist …</th></tr>
          <tr><td>0</td><td>ein <b>Term</b> (oder nur eine <b>Variable</b>, wenn es ein einzelner Buchstabe ist)</td></tr>
          <tr><td>1</td><td>eine <b>Gleichung</b></td></tr>
          <tr><td>2 oder mehr</td><td>eine <b>Gleichungskette</b></td></tr>
        </table>
        <p class="tip">💡 Auch eine einzelne Zahl wie ${m('17')} ist ein Term. Und eine Variable ist eigentlich auch ein (ganz kurzer) Term – hier nennen wir einen einzelnen Buchstaben aber immer <b>Variable</b>.</p>`,
      },
      {
        title: 'Wo kommt was vor?',
        html: `<p>In einer Gleichung stecken Terme, und in Termen stecken Variablen:</p>
        <div class="anatomy">${m('<span class="hl c2">3<span class="hl c1">x</span> + 5</span> = <span class="hl c2">11</span>')}</div>
        <ul class="legend"><li><span class="dot c1"></span>Variable: x</li><li><span class="dot c2"></span>Terme: 3x + 5 und 11</li><li><span class="dot c3"></span>Das Ganze ist eine Gleichung</li></ul>`,
      },
    ],
    gens: [
      () => {
        const cat = R.pick(CATS);
        const item = catItem(cat);
        return {
          type: 'mc', prompt: 'Was ist das?', visual: `<div class="big-math">${m(item)}</div>`,
          options: CATS.slice(), correct: CATS.indexOf(cat), explain: CAT_EXPLAIN[cat],
        };
      },
      () => {
        const cat = R.pick(CATS);
        const art = { Variable: 'eine Variable', Term: 'ein Term', Gleichung: 'eine Gleichung', Gleichungskette: 'eine Gleichungskette' }[cat];
        const items = CATS.map((c) => ({ c, s: catItem(c) }));
        const opts = R.shuffle(items);
        return {
          type: 'mc', prompt: `Welcher Ausdruck ist ${art}?`,
          options: opts.map((o) => m(o.s)), correct: opts.findIndex((o) => o.c === cat), explain: CAT_EXPLAIN[cat],
        };
      },
    ],
  };

  // =====================================================================
  // 2. Kommutativ- und Assoziativgesetz
  // =====================================================================
  const LAW_K = 'Kommutativgesetz', LAW_A = 'Assoziativgesetz', LAW_N = 'Keins – das stimmt so nicht!';
  const LAW_EXPLAIN = {
    [LAW_K]: 'Die Summanden bzw. Faktoren wurden <b>vertauscht</b> → Kommutativgesetz (Vertauschungsgesetz).',
    [LAW_A]: 'Die Reihenfolge bleibt, nur die <b>Klammern</b> werden anders gesetzt → Assoziativgesetz (Verbindungsgesetz).',
    [LAW_N]: 'Bei <b>Minus</b> und <b>Geteilt</b> gelten diese Gesetze nicht! Probiere es aus: 7 − 3 = 4, aber 3 − 7 = −4.',
  };
  const VOCAB = [
    { q: 'Wie heißt das Kommutativgesetz auf Deutsch?', c: 'Vertauschungsgesetz', w: ['Verbindungsgesetz', 'Verteilungsgesetz', 'Klammergesetz'], e: '„kommutare“ (lat.) = vertauschen.' },
    { q: 'Wie heißt das Assoziativgesetz auf Deutsch?', c: 'Verbindungsgesetz', w: ['Vertauschungsgesetz', 'Verteilungsgesetz', 'Vorzeichengesetz'], e: '„associare“ (lat.) = verbinden. Man darf beliebig verbinden (Klammern setzen).' },
    { q: 'Das Kommutativgesetz der Addition sagt: Man darf die … vertauschen.', c: 'Summanden', w: ['Faktoren', 'Klammern', 'Rechenzeichen'], e: 'Die Zahlen in einer Summe heißen Summanden: a + b = b + a.' },
    { q: 'Das Kommutativgesetz der Multiplikation sagt: Man darf die … vertauschen.', c: 'Faktoren', w: ['Summanden', 'Klammern', 'Ergebnisse'], e: 'Die Zahlen in einem Produkt heißen Faktoren: a · b = b · a.' },
    { q: 'Was erlaubt das Assoziativgesetz?', c: 'In reinen Summen (oder reinen Produkten) Klammern beliebig setzen', w: ['Plus und Minus vertauschen', 'Klammern immer weglassen – auch bei Minus', 'Durch 0 teilen'], e: '(a + b) + c = a + (b + c) und (a · b) · c = a · (b · c).' },
    { q: 'Für welche Rechenart gilt das Kommutativgesetz NICHT?', c: 'Subtraktion', w: ['Addition', 'Multiplikation'], e: '8 − 5 = 3, aber 5 − 8 = −3. Auch bei der Division gilt es nicht.' },
    { q: 'Wie heißen die Zahlen in einer Summe wie 4 + 7?', c: 'Summanden', w: ['Faktoren', 'Dividenden', 'Minuenden'], e: 'Summand + Summand = Summe.' },
    { q: 'Wie heißen die Zahlen in einem Produkt wie 4 · 7?', c: 'Faktoren', w: ['Summanden', 'Divisoren', 'Produkte'], e: 'Faktor · Faktor = Produkt.' },
    { q: 'Welches Gesetz hilft bei 25 · 7 · 4 = 25 · 4 · 7 = 700?', c: 'Kommutativgesetz', w: ['Assoziativgesetz', 'Distributivgesetz'], e: 'Die Faktoren 7 und 4 wurden vertauscht – so rechnet man geschickt 25 · 4 = 100.' },
    { q: 'Welches Gesetz hilft bei 17 + (3 + 48) = (17 + 3) + 48?', c: 'Assoziativgesetz', w: ['Kommutativgesetz', 'Distributivgesetz'], e: 'Die Reihenfolge bleibt gleich, nur die Klammern wandern. 17 + 3 = 20 rechnet sich leicht!' },
  ];

  const topic2 = {
    id: 2, emoji: '🔄', color: '#ec4899',
    title: 'Kommutativ- & Assoziativgesetz',
    goal: 'Ich kenne das Assoziativgesetz und das Kommutativgesetz und kann sie unter Verwendung von Fachbegriffen beschreiben.',
    book: '',
    learn: [
      {
        title: 'Kommutativgesetz = Vertauschungsgesetz',
        html: `<p>Bei <b>Plus</b> und <b>Mal</b> darfst du die Zahlen vertauschen. Das Ergebnis bleibt gleich!</p>
        <div class="law-box">${m('a + b = b + a')}<small>Summanden vertauschen</small></div>
        <div class="law-box">${m('a · b = b · a')}<small>Faktoren vertauschen</small></div>
        <div class="demo swap-demo" data-demo="swap">
          <div class="swap-row">${m('<span class="tile" data-a>3x</span><span class="tile op">+</span><span class="tile" data-b>5</span>')}</div>
          <button class="btn small" data-act="swap">🔄 Vertauschen!</button>
        </div>`,
        widget: 'swap',
      },
      {
        title: 'Assoziativgesetz = Verbindungsgesetz',
        html: `<p>Bei <b>reinen Summen</b> oder <b>reinen Produkten</b> darfst du die Klammern beliebig setzen. Die Reihenfolge bleibt dabei gleich.</p>
        <div class="law-box">${m('(a + b) + c = a + (b + c)')}</div>
        <div class="law-box">${m('(a · b) · c = a · (b · c)')}</div>
        <div class="demo" data-demo="assoc">
          <div class="assoc-row big-math"></div>
          <button class="btn small" data-act="assoc">🧲 Klammern verschieben!</button>
        </div>`,
        widget: 'assoc',
      },
      {
        title: 'Achtung bei Minus und Geteilt! ⚠️',
        html: `<p>Für <b>Subtraktion</b> und <b>Division</b> gelten diese Gesetze <u>nicht</u>:</p>
        <div class="law-box bad">${m('7 − 3 = 4 &nbsp;&nbsp;aber&nbsp;&nbsp; 3 − 7 = −4')}</div>
        <div class="law-box bad">${m('(12 : 6) : 2 = 1 &nbsp;&nbsp;aber&nbsp;&nbsp; 12 : (6 : 2) = 4')}</div>
        <p class="tip">💡 Fachbegriffe: <b>Summand + Summand = Summe</b>, <b>Faktor · Faktor = Produkt</b>, <b>Minuend − Subtrahend = Differenz</b>, <b>Dividend : Divisor = Quotient</b>.</p>`,
      },
      {
        title: 'Wozu das Ganze? Geschickt rechnen! 🧠',
        html: `<p>Mit beiden Gesetzen kannst du Rechnungen so umstellen, dass sie leichter werden:</p>
        <div class="law-box">${m('4 · 13 · 25 = 4 · 25 · 13 = 100 · 13 = 1300')}<small>Kommutativgesetz</small></div>
        <div class="law-box">${m('38 + (2 + 57) = (38 + 2) + 57 = 40 + 57 = 97')}<small>Assoziativgesetz</small></div>
        <div class="law-box">${m('3a · 5b = 3 · 5 · a · b = 15ab')}<small>Beide zusammen – das brauchst du bei Thema 6!</small></div>`,
      },
    ],
    gens: [
      () => {
        const [A, B, C] = R.shuffle([String(R.int(2, 9)), R.pick(['x', 'a', 'y', 'b']), `${R.int(2, 9)}${R.pick(['x', 'a', 'b'])}`, String(R.int(11, 40))]);
        const kinds = [
          [LAW_K, `${A} + ${B} = ${B} + ${A}`], [LAW_K, `${A} · ${B} = ${B} · ${A}`],
          [LAW_A, `(${A} + ${B}) + ${C} = ${A} + (${B} + ${C})`], [LAW_A, `(${A} · ${B}) · ${C} = ${A} · (${B} · ${C})`],
          [LAW_N, `${A} − ${B} = ${B} − ${A}`], [LAW_N, `${A} : ${B} = ${B} : ${A}`], [LAW_N, `(${A} − ${B}) − ${C} = ${A} − (${B} − ${C})`],
        ];
        const [law, eq] = R.pick(kinds);
        const opts = [LAW_K, LAW_A, LAW_N];
        return { type: 'mc', prompt: 'Welches Gesetz siehst du hier?', visual: `<div class="big-math">${m(eq)}</div>`, options: opts, correct: opts.indexOf(law), explain: LAW_EXPLAIN[law] };
      },
      () => {
        const v = R.pick(VOCAB);
        return mcFrom(v.q, v.c, v.w, v.e);
      },
    ],
  };

  // =====================================================================
  // 3. Rechenbaum, Wortform, Termschreibweise
  // =====================================================================
  const TYPES = ['Summe', 'Differenz', 'Produkt', 'Quotient'];
  const treeExplain = (t) => `Der Term ${m(T.termStr(t))} ist ${{ Summe: 'eine Summe', Differenz: 'eine Differenz', Produkt: 'ein Produkt', Quotient: 'ein Quotient' }[T.termType(t)]}, denn zuletzt wird <b>${V.SYM[t.op]}</b> gerechnet.<br><i>${T.wordForm(t)}.</i><div class="explain-tree">${T.treeSVG(t, { small: true })}</div>`;

  const topic3 = {
    id: 3, emoji: '🌳', color: '#10b981',
    title: 'Rechenbaum & Wortform',
    goal: 'Ich kann Terme als Rechenbaum oder in Wortform angeben und die drei Darstellungsarten ineinander umwandeln.',
    book: 'EdM S.23, A.3-6; EdM8 S.45, A.30',
    learn: [
      {
        title: 'Ein Term – drei Gesichter',
        html: `<p>Jeden Term kannst du auf drei Arten darstellen:</p>
        <div class="three-ways">
          <div><span class="badge">1 · Termschreibweise</span>${m('(3 + x) · 5')}</div>
          <div><span class="badge">2 · Wortform</span><i>Das Produkt aus der Summe aus 3 und x und 5</i></div>
          <div><span class="badge">3 · Rechenbaum</span>${T.treeSVG(T.node('*', T.node('+', T.leaf(3), T.leaf('x')), T.leaf(5)), { small: true })}</div>
        </div>`,
      },
      {
        title: 'Die Termart: Was wird zuletzt gerechnet?',
        html: `<p>Der Name eines Terms richtet sich nach der Rechenart, die <b>als letzte</b> ausgeführt wird. Denk an <b>Klammer vor Punkt vor Strich</b>!</p>
        <table class="nice-table">
          <tr><th>Zuletzt …</th><th>Termart</th><th>Beispiel</th></tr>
          <tr><td>+</td><td>Summe</td><td>${m('2 · x + 7')}</td></tr>
          <tr><td>−</td><td>Differenz</td><td>${m('(x + 4) − 9')}</td></tr>
          <tr><td>·</td><td>Produkt</td><td>${m('(x − 1) · 3')}</td></tr>
          <tr><td>:</td><td>Quotient</td><td>${m('(8 + x) : 2')}</td></tr>
        </table>`,
      },
      {
        title: 'So liest du einen Rechenbaum',
        html: `<ul class="steps">
          <li>Oben stehen die <b>Zahlen</b> und <b>Variablen</b>.</li>
          <li>Jeder Kreis ist eine <b>Rechnung</b> mit den beiden Dingen darüber.</li>
          <li>Ganz unten steht die Rechnung, die <b>zuletzt</b> ausgeführt wird – sie bestimmt die Termart.</li>
          <li>In der Wortform heißt es immer: „<i>die Summe <b>aus</b> … <b>und</b> …</i>“ – zuerst kommt der linke Teil, dann der rechte.</li>
        </ul>`,
      },
      {
        title: 'Probier es aus! 🎲',
        html: `<div class="demo" data-demo="tree"><div class="tree-example"></div><button class="btn small" data-act="tree">🎲 Neues Beispiel</button></div>`,
        widget: 'tree',
      },
    ],
    gens: [
      () => {
        const t = T.randTree();
        const ds = T.distractorTrees(t, 3);
        return mcFrom('Welcher Term passt zu diesem Rechenbaum?', m(T.termStr(t)), ds.map((d) => m(T.termStr(d))), treeExplain(t), { visual: T.treeSVG(t) });
      },
      () => {
        const t = T.randTree();
        const ds = T.distractorTrees(t, 3);
        return mcFrom('Welcher Term passt zu dieser Wortform?', m(T.termStr(t)), ds.map((d) => m(T.termStr(d))), treeExplain(t), { visual: `<div class="word-form">„${T.wordForm(t)}“</div>` });
      },
      () => {
        const t = T.randTree();
        return { type: 'mc', prompt: 'Welche Termart ist das? (Was wird zuletzt gerechnet?)', visual: `<div class="big-math">${m(T.termStr(t))}</div>`, options: TYPES.slice(), correct: TYPES.indexOf(T.termType(t)), explain: treeExplain(t) };
      },
      () => {
        const t = T.randTree();
        const ds = T.distractorTrees(t, 3);
        return mcFrom('Welche Wortform passt zu diesem Term?', T.wordForm(t), ds.map((d) => T.wordForm(d)), treeExplain(t), { visual: `<div class="big-math">${m(T.termStr(t))}</div>`, optionStyle: 'wide' });
      },
      () => {
        const t = T.randTree();
        const ds = T.distractorTrees(t, 2);
        return mcFrom('Welcher Rechenbaum gehört zu diesem Term?', T.treeSVG(t, { small: true }), ds.map((d) => T.treeSVG(d, { small: true })), treeExplain(t), { visual: `<div class="big-math">${m(T.termStr(t))}</div>`, optionStyle: 'svg' });
      },
    ],
  };

  // =====================================================================
  // 4. Wert eines Terms berechnen
  // =====================================================================
  function valueQ(expr, vals) {
    const ans = M.evalStr(expr, vals);
    const valsTxt = Object.keys(vals).map((k) => `${k} = ${fmtN(vals[k]).replace('-', '−')}`).join(' und ');
    return {
      type: 'num',
      prompt: `Berechne den Wert des Terms für ${m(valsTxt)}.`,
      visual: `<div class="big-math">${m(expr)}</div>`,
      answer: ans,
      explain: `Einsetzen: ${m(substitute(expr, vals) + ' = ' + fmtN(ans).replace('-', '−'))}`,
    };
  }
  const topic4 = {
    id: 4, emoji: '🔢', color: '#f59e0b',
    title: 'Wert eines Terms',
    goal: 'Ich kann den Wert eines Terms berechnen.',
    book: 'EdM8 S.72, A.1; EdM S.29, A.5',
    learn: [
      {
        title: 'Einsetzen und ausrechnen',
        html: `<p>Um den Wert eines Terms zu berechnen, <b>ersetzt</b> du jede Variable durch die gegebene Zahl und rechnest aus.</p>
        <ol class="steps">
          <li>Schreibe den Term ab und setze für die Variable die Zahl ein.</li>
          <li><b>Negative Zahlen kommen in Klammern!</b></li>
          <li>Rechne: Klammern → Potenzen → Punkt → Strich.</li>
        </ol>
        <div class="law-box">${m('3x² − 2x + 1 &nbsp; für x = −2')}<br>${m('= 3·(−2)² − 2·(−2) + 1')}<br>${m('= 3·4 + 4 + 1 = 17')}</div>`,
      },
      {
        title: 'Vorsicht, Falle! ⚠️',
        html: `<p>Die Klammer macht einen großen Unterschied:</p>
        <div class="law-box">${m('(−3)² = (−3)·(−3) = 9')}</div>
        <div class="law-box bad">${m('−3² = −(3·3) = −9')}</div>
        <p>Und vergiss den unsichtbaren Malpunkt nicht: ${m('4x')} bedeutet ${m('4 · x')}. Für x = 5 also ${m('4 · 5 = 20')} – nicht 45! 😉</p>`,
      },
      {
        title: 'Schieb den Regler! 🎚️',
        html: `<div class="demo" data-demo="slider">
          <div class="big-math">${m('2x² − 3x + 1')}</div>
          <label class="slider-label">x = <b class="xval">2</b></label>
          <input type="range" min="-5" max="5" value="2" step="1" class="xslider" aria-label="Wert für x">
          <div class="calc big-math"></div>
        </div>`,
        widget: 'slider',
      },
    ],
    gens: [
      () => valueQ(sumStr([[R.nonZero(-6, 6), 'x'], [R.nonZero(-9, 9), '']]), { x: R.nonZero(-6, 6) }),
      () => valueQ(sumStr([[R.sign() * R.int(1, 3), 'x²'], [R.nonZero(-5, 5), 'x'], [R.int(-9, 9), '']]), { x: R.nonZero(-4, 4) }),
      () => valueQ(sumStr([[R.nonZero(-5, 5), 'a'], [R.nonZero(-5, 5), 'b'], [R.nonZero(-3, 3), 'ab']]), { a: R.nonZero(-4, 4), b: R.nonZero(-4, 4) }),
      () => {
        const k = R.int(2, 5), mm = R.nonZero(-6, 6), n = R.nonZero(-9, 9);
        return valueQ(`${k} · (${sumStr([[1, 'x'], [mm, '']])})${signed(n, '')}`, { x: R.nonZero(-5, 5) });
      },
      () => valueQ(`(${sumStr([[1, 'x'], [R.nonZero(-5, 5), '']])})²`, { x: R.nonZero(-5, 5) }),
    ],
  };

  // =====================================================================
  // 5. Gleichartige Terme addieren / subtrahieren
  // =====================================================================
  const LIKE_PAIRS = [['x', 'y'], ['a', 'b'], ['x²', 'x'], ['ab', 'a'], ['x', ''], ['y', '']];
  function likeExpr() {
    const pair = R.pick(LIKE_PAIRS);
    const n = R.int(4, 5);
    let types = [pair[0], pair[1]];
    while (types.length < n) types.push(R.pick(pair));
    types = R.shuffle(types);
    const list = types.map((v, i) => [i === 0 ? R.int(1, 9) : R.nonZero(-9, 9), v]);
    return { list, pair };
  }
  function likeSteps(list, pair) {
    return pair.map((v) => {
      const part = list.filter((t) => t[1] === v);
      const total = part.reduce((s, t) => s + t[0], 0);
      return m(`${sumStr(part)} = ${monoStr(total, v)}`);
    }).join('<br>');
  }
  const LIKE_MC = [
    { t: 'x²', ok: 'x²', w: ['x', 'x³', 'x²y'] },
    { t: 'ab', ok: 'ba', w: ['a', 'a²b', 'abc'] },
    { t: 'ab', ok: 'ab', w: ['b', 'ab²', 'a'] },
    { t: 'y', ok: 'y', w: ['y²', 'xy', ''] },
    { t: 'a²b', ok: 'a²b', w: ['ab²', 'ab', 'a²'] },
  ];
  const topic5 = {
    id: 5, emoji: '🧺', color: '#3b82f6',
    title: 'Gleichartige Terme zusammenfassen',
    goal: 'Ich kann Terme vereinfachen, indem ich gleichartige Terme addiere oder subtrahiere.',
    book: 'EdM8 S.72, A.2; EdM S.31-33, A.16-23, 27, 33',
    learn: [
      {
        title: 'Was ist „gleichartig“?',
        html: `<p>Gleichartige Terme haben <b>genau dieselben Variablen mit denselben Hochzahlen</b>. Nur die Zahl davor (der <b>Koeffizient</b>) darf anders sein.</p>
        <table class="nice-table">
          <tr><td>${m('3x')} und ${m('−5x')}</td><td class="yes">✔ gleichartig</td></tr>
          <tr><td>${m('2a²')} und ${m('7a²')}</td><td class="yes">✔ gleichartig</td></tr>
          <tr><td>${m('ab')} und ${m('4ba')}</td><td class="yes">✔ gleichartig (ba = ab)</td></tr>
          <tr><td>${m('4x')} und ${m('4x²')}</td><td class="no">✘ andere Hochzahl</td></tr>
          <tr><td>${m('3a')} und ${m('3b')}</td><td class="no">✘ andere Variable</td></tr>
        </table>`,
      },
      {
        title: 'Zusammenfassen = Koeffizienten verrechnen',
        html: `<p>Stell dir die Variable wie eine Sache vor: <b>3 Äpfel + 5 Äpfel = 8 Äpfel</b>. 🍎</p>
        <div class="law-box">${m('3x + 5x = 8x')}</div>
        <div class="law-box">${m('7a − a = 6a')}<small>a heißt 1a!</small></div>
        <div class="law-box">${m('4x + 2y − x + 3y = 3x + 5y')}</div>
        <p class="tip">⚠️ Äpfel und Birnen kann man nicht zusammenfassen: ${m('3x + 2y')} bleibt so stehen!<br>Das Vorzeichen <b>vor</b> einem Term gehört zu ihm.</p>`,
      },
      {
        title: 'Farbtrick 🎨',
        html: `<p>Markiere gleichartige Terme in derselben Farbe – dann siehst du sofort, was zusammengehört.</p>
          <div class="demo" data-demo="like"><div class="like-example"></div><button class="btn small" data-act="like">🎲 Neues Beispiel</button></div>`,
        widget: 'like',
      },
    ],
    gens: [
      () => {
        const { list, pair } = likeExpr();
        const expr = sumStr(list);
        return { type: 'term', prompt: 'Fasse so weit wie möglich zusammen.', visual: `<div class="big-math">${m(expr)}</div>`, expected: expr, simplified: true, explain: likeSteps(list, pair) + `<br>Ergebnis: ${m(simp(expr))}` };
      },
      () => {
        const { list, pair } = likeExpr();
        const expr = sumStr(list);
        return { type: 'term', prompt: 'Vereinfache den Term.', visual: `<div class="big-math">${m(expr)}</div>`, expected: expr, simplified: true, explain: likeSteps(list, pair) + `<br>Ergebnis: ${m(simp(expr))}` };
      },
      () => {
        const s = R.pick(LIKE_MC);
        const withC = (v) => (v === '' ? String(R.int(2, 9)) : monoStr(R.nonZero(-9, 9), v));
        const target = withC(s.t);
        return mcFrom(`Welcher Term ist gleichartig zu ${m(target)}?`, m(withC(s.ok)), s.w.map((w) => m(withC(w))),
          'Gleichartig heißt: genau dieselben Variablen mit denselben Hochzahlen. Die Zahl davor ist egal.');
      },
    ],
  };

  // =====================================================================
  // 6. Produkte von Termen vereinfachen
  // =====================================================================
  function productQ(factors) {
    const expr = factors.map(([c, v], i) => factorStr(c, v, i === 0)).join(' · ');
    const nums = factors.map(([c], i) => (c < 0 && i > 0 ? `(${fmtN(c).replace('-', '−')})` : fmtN(c).replace('-', '−')));
    const vars = factors.map(([, v]) => v.split('')).flat().filter((v) => v).sort();
    const coef = factors.reduce((p, [c]) => p * c, 1);
    const steps = `${nums.join(' · ')} · ${vars.join(' · ')} = ${simp(expr)}`;
    return {
      type: 'term', prompt: 'Vereinfache das Produkt.', visual: `<div class="big-math">${m(expr)}</div>`,
      expected: expr, simplified: true,
      explain: `Zahlen zu Zahlen, Variablen zu Variablen sortieren:<br>${m(steps)}<br><small>Zahlen: ${m(nums.join(' · ') + ' = ' + fmtN(coef).replace('-', '−'))}</small>`,
    };
  }
  const topic6 = {
    id: 6, emoji: '✖️', color: '#ef4444',
    title: 'Produkte vereinfachen',
    goal: 'Ich kann Produkte von Termen vereinfachen.',
    book: 'EdM8 S.72, A.2; EdM8 S. 36-38, A.2-6, 9, 12, 14, 16, 20',
    learn: [
      {
        title: 'Sortieren erlaubt!',
        html: `<p>Bei reinen Produkten darfst du alles umsortieren (Kommutativ- und Assoziativgesetz!). Also: <b>Zahlen zu Zahlen, Buchstaben zu Buchstaben</b>.</p>
        <div class="law-box">${m('3a · 4b = 3 · 4 · a · b = 12ab')}</div>
        <p class="tip">💡 Den Malpunkt zwischen Zahl und Variable lässt man weg: ${m('12 · a · b = 12ab')}. Variablen schreibt man alphabetisch.</p>`,
      },
      {
        title: 'Gleiche Variablen → Potenz',
        html: `<p>Kommt dieselbe Variable mehrmals vor, schreibst du eine <b>Potenz</b>:</p>
        <div class="law-box">${m('x · x = x²')}</div>
        <div class="law-box">${m('2a · 5a = 2 · 5 · a · a = 10a²')}</div>
        <div class="law-box">${m('x² · x = x · x · x = x³')}</div>`,
      },
      {
        title: 'Vorzeichenregeln',
        html: `<table class="nice-table">
          <tr><td>plus · plus</td><td>= plus</td></tr>
          <tr><td>minus · minus</td><td>= plus</td></tr>
          <tr><td>plus · minus</td><td>= minus</td></tr>
        </table>
        <div class="law-box">${m('(−2x) · (−3y) = 6xy')}</div>
        <div class="law-box">${m('4ab · (−3a) = −12a²b')}</div>
        <p class="tip">💡 Zähle die Minuszeichen: <b>gerade</b> Anzahl → plus, <b>ungerade</b> Anzahl → minus.</p>`,
      },
    ],
    gens: [
      () => { const [v1, v2] = R.shuffle(['a', 'b', 'x', 'y']); return productQ([[R.int(2, 9), v1], [R.sign() * R.int(2, 9), v2]]); },
      () => { const v = R.pick(['a', 'x', 'y']); return productQ([[R.nonZero(-6, 6), v], [R.nonZero(-6, 6), v]]); },
      () => productQ([[R.int(2, 6), R.pick(['ab', 'xy'])], [R.sign() * R.int(2, 6), R.pick(['a', 'b', 'x', 'y'])]]),
      () => productQ([[R.sign() * R.int(2, 4), 'a'], [R.sign() * R.int(2, 4), 'b'], [R.sign() * R.int(1, 4), R.pick(['a', 'c'])]]),
      () => productQ([[0.5, R.pick(['x', 'a'])], [2 * R.int(2, 6), R.pick(['x', 'y', 'a'])]]),
    ],
  };

  // =====================================================================
  // 7. Minusklammern auflösen
  // =====================================================================
  function bracketParts() {
    const pair = R.pick([['a', 'b'], ['x', 'y'], ['x', '']]);
    const inner = R.shuffle([[R.nonZero(-9, 9), pair[0]], [R.nonZero(-9, 9), pair[1]]].concat(pair[1] !== '' && R.chance(0.4) ? [[R.nonZero(-9, 9), '']] : []));
    return { pair, inner };
  }
  function minusQ() {
    const { pair, inner } = bracketParts();
    const head = [R.int(2, 9), pair[0]];
    const tail = R.chance(0.5) ? [R.nonZero(-9, 9), pair[1]] : null;
    const kind = R.pick(['minus', 'minus', 'minus', 'lead', 'plus']);
    let expr, opened;
    const flipped = inner.map(([c, v]) => [-c, v]);
    if (kind === 'lead') {
      expr = `−(${sumStr(inner)})${signed(head[0], head[1])}`;
      opened = sumStr(flipped.concat([head]));
    } else if (kind === 'plus') {
      expr = `${monoStr(...head)} + (${sumStr(inner)})${tail ? signed(...tail) : ''}`;
      opened = sumStr([head].concat(inner, tail ? [tail] : []));
    } else {
      expr = `${monoStr(...head)} − (${sumStr(inner)})${tail ? signed(...tail) : ''}`;
      opened = sumStr([head].concat(flipped, tail ? [tail] : []));
    }
    const rule = kind === 'plus' ? 'Plusklammer: Klammer einfach weglassen.' : 'Minusklammer: Klammer weglassen und <b>alle</b> Vorzeichen in der Klammer umdrehen.';
    return {
      type: 'term', prompt: 'Löse die Klammer auf und fasse zusammen.', visual: `<div class="big-math">${m(expr)}</div>`,
      expected: expr, simplified: true,
      explain: `${rule}<br>${m(expr)}<br>${m('= ' + opened)}<br>${m('= ' + simp(expr))}`,
    };
  }
  const topic7 = {
    id: 7, emoji: '➖', color: '#0ea5e9',
    title: 'Minusklammern auflösen',
    goal: 'Ich kann Minusklammern auflösen.',
    book: 'EdM8 S.72, A.4; EdM8 S.48, A.2, 3, 6, 8, 11, 9',
    learn: [
      {
        title: 'Plusklammer: einfach weg damit',
        html: `<p>Steht ein <b>Plus</b> vor der Klammer, darfst du die Klammer einfach weglassen:</p>
        <div class="law-box">${m('5 + (2x − 3) = 5 + 2x − 3')}</div>`,
      },
      {
        title: 'Minusklammer: alles umdrehen! 🔁',
        html: `<p>Steht ein <b>Minus</b> vor der Klammer, lässt du Minus und Klammer weg und drehst <b>jedes</b> Vorzeichen in der Klammer um:</p>
        <div class="law-box">${m('5 − (2x − 3) = 5 <span class="flip">− 2x</span> <span class="flip">+ 3</span>')}</div>
        <p class="tip">⚠️ Das erste Glied in der Klammer hat ein unsichtbares <b>+</b>. Das wird auch zu <b>−</b>!<br>Merksatz: <i>„Minus vor der Klammer dreht alle Zeichen um.“</i></p>`,
      },
      {
        title: 'Schritt für Schritt 👣',
        html: `<div class="demo" data-demo="minus"><div class="minus-steps"></div>
          <div class="row-btns"><button class="btn small" data-act="minus-step">▶ Nächster Schritt</button><button class="btn small ghost" data-act="minus-new">🎲 Neues Beispiel</button></div></div>`,
        widget: 'minus',
      },
    ],
    gens: [minusQ, minusQ],
  };

  // =====================================================================
  // 8. Distributivgesetz: Ausmultiplizieren und Ausklammern
  // =====================================================================
  function expandQ() {
    const f = R.pick([[R.nonZero(-6, 6), ''], [R.int(2, 4), 'x'], [-R.int(1, 3), 'a']]);
    if (f[1] === '' && Math.abs(f[0]) === 1) f[0] = f[0] * R.int(2, 5);
    const inner = f[1] === 'x' ? [[R.int(1, 5), 'x'], [R.nonZero(-9, 9), '']] : R.pick([[[R.int(1, 5), 'x'], [R.nonZero(-9, 9), '']], [[R.int(1, 5), 'a'], [R.nonZero(-6, 6), 'b']]]);
    const back = f[1] === '' && R.chance(0.3);
    const fs = monoStr(...f);
    const expr = back ? `(${sumStr(inner)}) · ${factorStr(f[0], f[1], false)}` : `${fs}(${sumStr(inner)})`;
    const parts = inner.map(([c, v]) => `${factorStr(f[0], f[1], false)} · ${factorStr(c, v, false)}`);
    return {
      type: 'term', prompt: 'Multipliziere aus.', visual: `<div class="big-math">${m(expr)}</div>`,
      expected: expr, simplified: true,
      explain: `Jeder Summand in der Klammer wird mit ${m(fs)} multipliziert:<br>${m(parts.join(' + '))}<br>${m('= ' + simp(expr))}`,
    };
  }
  function factorParts() {
    const gNum = R.int(2, 6);
    const gVar = R.pick(['', '', 'a', 'x']);
    let c1, c2;
    do { c1 = R.int(1, 5); c2 = R.nonZero(-7, 7); } while (gcd(c1, Math.abs(c2)) !== 1);
    let vars;
    if (gVar === '') vars = R.pick([['x', ''], ['a', 'b'], ['y', '']]);
    else if (gVar === 'x') vars = R.pick([['x', ''], ['y', '']]);
    else vars = R.pick([['b', ''], ['a', '']]);
    const inner = [[c1, vars[0]], [c2, vars[1]]];
    const g = monoStr(gNum, gVar);
    const original = simp(`${g} · (${sumStr(inner)})`);
    return { gNum, gVar, g, inner, original, c1, c2 };
  }
  const topic8 = {
    id: 8, emoji: '🎯', color: '#a855f7',
    title: 'Distributivgesetz',
    goal: 'Ich kann das Distributivgesetz in beide Richtungen anwenden. (Ausmultiplizieren und Ausklammern)',
    book: 'EdM8 S.72, A.3-4, 7; EdM8 S.42-43, A.5-8, 10, 13-17; EdM S.49-51, A.3-6, 8-10, 14-16',
    learn: [
      {
        title: 'Ausmultiplizieren ➡️',
        html: `<p>Ein Faktor vor der Klammer wird mit <b>jedem</b> Summanden in der Klammer multipliziert:</p>
        <div class="law-box">${m('a · (b + c) = a · b + a · c')}</div>
        <div class="law-box">${m('3 · (x + 4) = 3x + 12')}</div>
        <p>Als Bild: Die Fläche des ganzen Rechtecks ist gleich der Summe der beiden Teilflächen.</p>
        ${F.rectSplit({ v: 'x', p: 4, h: 3, showParts: true, parts: ['3x', '12'] })}`,
      },
      {
        title: 'Vorzeichen beachten',
        html: `<div class="law-box">${m('−2 · (x − 5) = −2x + 10')}<small>(−2) · (−5) = +10</small></div>
        <div class="law-box">${m('2x · (3x + 1) = 6x² + 2x')}</div>
        <div class="law-box">${m('(a − 5) · 4 = 4a − 20')}<small>Faktor hinten? Geht genauso!</small></div>`,
      },
      {
        title: 'Ausklammern ⬅️ (rückwärts)',
        html: `<p>Ausklammern ist das Gegenteil: Du suchst einen <b>gemeinsamen Faktor</b> aller Summanden und ziehst ihn vor die Klammer.</p>
        <ol class="steps">
          <li>Größten gemeinsamen Faktor finden (Zahl <b>und</b> Variablen!).</li>
          <li>Jeden Summanden durch diesen Faktor teilen → das kommt in die Klammer.</li>
          <li>Probe: wieder ausmultiplizieren!</li>
        </ol>
        <div class="law-box">${m('6x + 9 = 3 · (2x + 3)')}</div>
        <div class="law-box">${m('4ab + 6a = 2a · (2b + 3)')}</div>`,
      },
    ],
    gens: [
      expandQ,
      expandQ,
      () => {
        const p = factorParts();
        return {
          type: 'term', prompt: `Klammere ${m(p.g)} aus. Was gehört in die Klammer?`,
          prefix: `${p.original} = ${p.g} · (`, suffix: ')',
          expected: sumStr(p.inner), simplified: true,
          explain: `Teile jeden Summanden durch ${m(p.g)}:<br>${m(`${p.original} = ${p.g} · (${sumStr(p.inner)})`)}<br>Probe: ${m(`${p.g} · (${sumStr(p.inner)}) = ${p.original}`)} ✔`,
        };
      },
      () => {
        const p = factorParts();
        const cands = [];
        const add = (s) => { if (s !== p.g && !cands.includes(s)) cands.push(s); };
        if (p.gVar) { add(String(p.gNum)); add(p.gVar); add(monoStr(p.gNum * 2, p.gVar)); }
        for (let d = p.gNum - 1; d >= 2; d--) if (p.gNum % d === 0) add(monoStr(d, p.gVar));
        add(String(p.gNum * p.c1));
        add(monoStr(p.gNum * 2, p.gVar));
        add(monoStr(p.gNum * p.gNum, p.gVar));
        add(monoStr(p.gNum, p.gVar === 'x' ? 'a' : 'x'));
        add('1');
        return mcFrom(`Welchen Faktor kannst du bei ${m(p.original)} ausklammern, sodass er so groß wie möglich ist?`, m(p.g), cands.slice(0, 3).map(m),
          `Größter gemeinsamer Faktor: ${m(p.g)}.<br>${m(`${p.original} = ${p.g} · (${sumStr(p.inner)})`)}`);
      },
    ],
  };

  // =====================================================================
  // 9. Produkte von Summen
  // =====================================================================
  function binomQ(A, B) {
    const expr = `(${sumStr(A)})(${sumStr(B)})`;
    const prods = [];
    A.forEach(([c1, v1]) => B.forEach(([c2, v2]) => prods.push(simp(`${factorStr(c1, v1, true)} · ${factorStr(c2, v2, false)}`))));
    return {
      type: 'term', prompt: 'Multipliziere aus und fasse zusammen.', visual: `<div class="big-math">${m(expr)}</div>`,
      expected: expr, simplified: true,
      explain: `Jeder Summand der ersten Klammer mal jeden der zweiten:<br>${m('= ' + joinTerms(prods))}<br>${m('= ' + simp(expr))}`,
    };
  }
  const topic9 = {
    id: 9, emoji: '🧩', color: '#14b8a6',
    title: 'Produkte von Summen',
    goal: 'Ich kann Produkte von Summen vereinfachen.',
    book: 'EdM8 S.53-54, A.3-5, A.8-12, 14-15',
    learn: [
      {
        title: 'Jeder mit jedem! 🤝',
        html: `<p>Bei zwei Klammern wird <b>jeder</b> Summand der ersten Klammer mit <b>jedem</b> Summanden der zweiten Klammer multipliziert:</p>
        <div class="law-box">${m('(a + b) · (c + d) = ac + ad + bc + bd')}</div>
        <p>Als Bild: Ein Rechteck mit den Seiten ${m('(x + 2)')} und ${m('(x + 3)')} besteht aus vier Teilen.</p>
        ${F.grid4({ v1: 'x', p: 2, v2: 'x', q: 3, showParts: true, parts: ['x²', '2x', '3x', '6'] })}`,
      },
      {
        title: 'Danach: zusammenfassen',
        html: `<div class="law-box">${m('(x + 2)(x + 3)')}<br>${m('= x² + 3x + 2x + 6')}<br>${m('= x² + 5x + 6')}</div>
        <p class="tip">💡 Bei 2 und 2 Summanden entstehen <b>2 · 2 = 4</b> Produkte. Bei 3 und 2 Summanden sind es <b>6</b>. Zähle nach, ob du keins vergessen hast!</p>`,
      },
      {
        title: 'Vorzeichen mitnehmen',
        html: `<div class="law-box">${m('(x − 4)(x + 2)')}<br>${m('= x² + 2x − 4x − 8')}<br>${m('= x² − 2x − 8')}</div>
        <div class="law-box">${m('(2a − b)(a + 3b)')}<br>${m('= 2a² + 6ab − ab − 3b²')}<br>${m('= 2a² + 5ab − 3b²')}</div>`,
      },
    ],
    gens: [
      () => binomQ([[1, 'x'], [R.nonZero(-6, 6), '']], [[1, 'x'], [R.nonZero(-6, 6), '']]),
      () => binomQ([[R.int(1, 3), 'x'], [R.nonZero(-5, 5), '']], [[R.int(2, 3), 'x'], [R.nonZero(-5, 5), '']]),
      () => binomQ([[1, 'a'], [R.sign(), 'b']], [[1, 'c'], [R.sign(), 'd']]),
      () => binomQ([[R.int(1, 3), 'a'], [R.nonZero(-3, 3), 'b']], [[R.int(1, 2), 'a'], [R.nonZero(-3, 3), 'b']]),
      () => {
        const n1 = R.int(2, 3), n2 = R.int(2, 3);
        const ok = n1 * n2;
        return mcFrom(`Wie viele Produkte entstehen beim Ausmultiplizieren, bevor du zusammenfasst? Eine Klammer hat ${n1}, die andere ${n2} Summanden.`,
          String(ok), [String(n1 + n2), String(ok + 2), String(Math.max(n1, n2))].filter((x) => x !== String(ok)).filter((x, i, a) => a.indexOf(x) === i).slice(0, 3),
          `Jeder mit jedem: ${n1} · ${n2} = ${ok} Produkte.`);
      },
    ],
  };

  // =====================================================================
  // 10. Terme mit Abbildungen (Flächen, Volumen)
  // =====================================================================
  const NOTE = '<div class="fig-note">Zeichnung nicht maßstabsgetreu</div>';
  const topic10 = {
    id: 10, emoji: '📐', color: '#f97316',
    title: 'Terme & Abbildungen',
    goal: 'Ich kann Terme mit geeigneten Abbildungen darstellen (Flächeninhalte, Rauminhalte).',
    book: 'EdM8 S.72, A.6; EdM8 S.39, A.27; S.53, A.2, 5',
    learn: [
      {
        title: 'Flächeninhalt eines Rechtecks',
        html: `<p>${m('A = Länge · Breite')}. Besteht eine Seite aus mehreren Stücken, schreibst du sie als <b>Summe in Klammern</b>:</p>
        ${F.rectSplit({ v: 'x', p: 4, h: 3 })}
        <div class="law-box">${m('A = 3 · (x + 4)')}<small>oder als Summe der Teilflächen: ${m('3x + 12')}</small></div>
        <p class="tip">💡 Beide Terme sind <b>gleichwertig</b> – das ist genau das Distributivgesetz!</p>`,
      },
      {
        title: 'Zusammengesetzte Figuren',
        html: `<p>Zerlege die Figur in Rechtecke und <b>addiere</b> die Teilflächen.</p>
        ${F.lShape({ v: 'a', p: 3, q: 2, r: 3 })}
        <div class="law-box">${m('A = a · 3 + (a + 3) · 2')}<br>${m('= 3a + 2a + 6 = 5a + 6')}</div>`,
      },
      {
        title: 'Rauminhalt (Volumen) eines Quaders',
        html: `<p>${m('V = Länge · Breite · Höhe')}</p>
        ${F.cuboid({ l: '2x', w: 3, h: 'x' })}
        <div class="law-box">${m('V = 2x · 3 · x = 6x²')}</div>`,
      },
    ],
    gens: [
      () => {
        const v = R.pick(['x', 'a']), p = R.int(2, 5);
        const h = R.chance(0.65) ? R.int(2, 5) : (v === 'x' ? 'y' : 'b');
        const expr = `${h} · (${v} + ${p})`;
        return {
          type: 'term', prompt: 'Gib einen Term für den Flächeninhalt der ganzen Figur an.', visual: F.rectSplit({ v, p, h }) + NOTE,
          expected: expr, simplified: false,
          explain: `${m('A = ' + expr)} oder als Summe der Teilflächen ${m(simp(expr))}. Beides ist richtig!`,
        };
      },
      () => {
        const v = R.pick(['a', 'x']), p = R.int(2, 4), q = R.int(2, 4), r = R.int(2, 4);
        const expr = `${v} · ${r} + (${v} + ${p}) · ${q}`;
        return {
          type: 'term', prompt: 'Gib einen Term für den Flächeninhalt der Figur an.', visual: F.lShape({ v, p, q, r }) + NOTE,
          expected: expr, simplified: false,
          explain: `Zerlegen in zwei Rechtecke: ${m('A = ' + expr)}<br>${m('= ' + simp(expr))}`,
        };
      },
      () => {
        const v1 = 'x', v2 = R.pick(['x', 'y']), p = R.int(1, 4), q = R.int(1, 4);
        const expr = `(${v1} + ${p})(${v2} + ${q})`;
        return {
          type: 'term', prompt: 'Gib einen Term für den Flächeninhalt des ganzen Rechtecks an.', visual: F.grid4({ v1, p, v2, q }) + NOTE,
          expected: expr, simplified: false,
          explain: `Länge mal Breite: ${m('A = ' + expr)}<br>oder vier Teilflächen addiert: ${m(simp(expr))}`,
        };
      },
      () => {
        const sets = [
          () => ({ l: 'x', w: R.int(2, 5), h: R.int(2, 4) }),
          () => { const k = R.int(2, 3); return { l: `${k}a`, w: 'a', h: R.int(2, 5) }; },
          () => ({ l: 'x', w: 'x', h: R.int(2, 6) }),
          () => { const k = R.int(2, 4); return { l: `${k}y`, w: R.int(2, 4), h: 'y' }; },
        ];
        const d = R.pick(sets)();
        const expr = `${d.l} · ${d.w} · ${d.h}`;
        return {
          type: 'term', prompt: 'Gib einen Term für das Volumen (den Rauminhalt) des Quaders an.', visual: F.cuboid(d) + NOTE,
          expected: expr, simplified: false,
          explain: `${m('V = Länge · Breite · Höhe = ' + expr + ' = ' + simp(expr))}`,
        };
      },
      () => {
        const v = R.pick(['x', 'a']), p = R.int(2, 5), h = R.int(2, 5);
        return mcFrom('Welcher Term beschreibt den Flächeninhalt der ganzen Figur?', m(`${h} · (${v} + ${p})`),
          [m(`${h} · ${v} + ${p}`), m(`${h} + ${v} + ${p}`), m(`(${h} + ${v}) · ${p}`)],
          `Die Breite ist ${m(v + ' + ' + p)}, die Höhe ${m(String(h))}. Also ${m(`A = ${h} · (${v} + ${p}) = ${simp(`${h}(${v}+${p})`)}`)}. Ohne Klammer würde nur ${m(v)} mit ${h} multipliziert!`,
          { visual: F.rectSplit({ v, p, h }) + NOTE });
      },
    ],
  };

  const TOPICS = [topic1, topic2, topic3, topic4, topic5, topic6, topic7, topic8, topic9, topic10];

  // ---------- Interaktive Elemente in den Lernkarten ----------
  const S = () => root.Sound;
  const FX = () => root.FX;
  const WIDGETS = {
    swap(el) {
      const btn = el.querySelector('[data-act="swap"]');
      btn.addEventListener('click', () => {
        const a = el.querySelector('[data-a]'), b = el.querySelector('[data-b]');
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        const ta = a.textContent;
        a.textContent = b.textContent; b.textContent = ta;
        if (!FX().reduced) {
          [[a, rb.left - ra.left], [b, ra.left - rb.left]].forEach(([n, dx]) => {
            n.style.transition = 'none';
            n.style.transform = `translateX(${dx}px) translateY(-14px)`;
            requestAnimationFrame(() => requestAnimationFrame(() => {
              n.style.transition = 'transform .45s cubic-bezier(.3,1.5,.5,1)';
              n.style.transform = '';
            }));
          });
        }
        S().play('swoosh');
        setTimeout(() => FX().floatText(btn, 'Ergebnis bleibt gleich ✔', 'good'), 300);
      });
    },
    assoc(el) {
      const row = el.querySelector('.assoc-row');
      const states = [
        '<span class="br">(</span>38 + 2<span class="br">)</span> + 57 = 40 + 57 = 97',
        '38 + <span class="br">(</span>2 + 57<span class="br">)</span> = 38 + 59 = 97',
      ];
      let i = 0;
      row.innerHTML = m(states[0]);
      el.querySelector('[data-act="assoc"]').addEventListener('click', () => {
        i = 1 - i;
        row.innerHTML = m(states[i]);
        FX().pop(row);
        S().play('swoosh');
      });
    },
    tree(el) {
      const box = el.querySelector('.tree-example');
      const show = () => {
        const t = T.randTree();
        box.innerHTML = `<div class="three-ways">
          <div><span class="badge">Termschreibweise</span>${m(T.termStr(t))}</div>
          <div><span class="badge">Wortform</span><i>${T.wordForm(t)}</i></div>
          <div><span class="badge">Termart</span><b>${T.termType(t)}</b></div>
          <div><span class="badge">Rechenbaum</span>${T.treeSVG(t, { small: true })}</div></div>`;
        FX().pop(box);
      };
      show();
      el.querySelector('[data-act="tree"]').addEventListener('click', () => { S().play('select'); show(); });
    },
    slider(el) {
      const input = el.querySelector('.xslider'), out = el.querySelector('.calc'), xv = el.querySelector('.xval');
      const expr = '2x² − 3x + 1';
      const update = () => {
        const x = +input.value;
        xv.textContent = fmtN(x).replace('-', '−');
        out.innerHTML = m(`${substitute(expr, { x })} = <b>${fmtN(M.evalStr(expr, { x })).replace('-', '−')}</b>`);
      };
      input.addEventListener('input', () => { update(); S().play('tick'); });
      update();
    },
    like(el) {
      const box = el.querySelector('.like-example');
      const show = () => {
        const { list, pair } = likeExpr();
        const cls = (v) => 'c' + (pair.indexOf(v) + 1);
        const parts = list.map(([c, v], i) => {
          const t = mono(c, v);
          const s = i === 0 ? (t.neg ? '−' : '') + t.body : (t.neg ? ' − ' : ' + ') + t.body;
          return `<span class="hl ${cls(v)}">${s}</span>`;
        }).join('');
        const res = pair.map((v) => {
          const total = list.filter((t) => t[1] === v).reduce((s, t) => s + t[0], 0);
          return { total, v };
        }).filter((r) => r.total !== 0).map((r, i) => {
          const t = mono(r.total, r.v);
          const s = i === 0 ? (t.neg ? '−' : '') + t.body : (t.neg ? ' − ' : ' + ') + t.body;
          return `<span class="hl ${cls(r.v)}">${s}</span>`;
        }).join('') || '0';
        box.innerHTML = `<div class="big-math">${m(parts)}</div><div class="big-math">${m('= ' + res)}</div>`;
        FX().pop(box);
      };
      show();
      el.querySelector('[data-act="like"]').addEventListener('click', () => { S().play('select'); show(); });
    },
    minus(el) {
      const box = el.querySelector('.minus-steps');
      const btn = el.querySelector('[data-act="minus-step"]');
      let step = 0, data;
      const fresh = () => {
        const { pair, inner } = bracketParts();
        const head = [R.int(2, 9), pair[0]];
        data = { head, inner };
        step = 0;
        render();
      };
      const render = () => {
        const { head, inner } = data;
        const expr = `${monoStr(...head)} − (${sumStr(inner)})`;
        let html = `<div class="big-math">${m(expr)}</div>`;
        if (step >= 1) {
          const flipped = inner.map(([c, v]) => `<span class="flip">${signed(-c, v)}</span>`).join('');
          html += `<div class="big-math step-in">${m('= ' + monoStr(...head) + flipped)}</div><div class="step-note">Minus und Klammer weg, alle Vorzeichen umgedreht!</div>`;
        }
        if (step >= 2) html += `<div class="big-math step-in">${m('= ' + simp(expr))}</div><div class="step-note">Gleichartige Terme zusammengefasst. Fertig! 🎉</div>`;
        box.innerHTML = html;
        btn.disabled = step >= 2;
      };
      btn.addEventListener('click', () => {
        if (step < 2) { step++; render(); S().play(step === 2 ? 'correct' : 'swoosh'); if (step === 2) FX().burstAt(btn, 25); }
      });
      el.querySelector('[data-act="minus-new"]').addEventListener('click', () => { S().play('select'); fresh(); });
      fresh();
    },
  };

  root.Topics = { list: TOPICS, widgets: WIDGETS, helpers: { sumStr, monoStr, substitute, joinTerms } };
})(window);
