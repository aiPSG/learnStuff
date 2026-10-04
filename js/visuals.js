/*
 * Visuals – Zufallshelfer, Rechenbäume und Figuren (Flächen/Quader) als SVG.
 */
(function (root) {
  'use strict';

  // ---------- Zufall ----------
  const Rand = {
    int: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
    pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
    sign: () => (Math.random() < 0.5 ? -1 : 1),
    nonZero(a, b) { let v = 0; while (v === 0) v = Rand.int(a, b); return v; },
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    chance: (p) => Math.random() < p,
  };

  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ---------- Rechenbäume ----------
  const OPS = ['+', '-', '*', '/'];
  const SYM = { '+': '+', '-': '−', '*': '·', '/': ':' };
  const PREC = { '+': 1, '-': 1, '*': 2, '/': 2 };
  const NAMES = {
    '+': ['die Summe', 'der Summe', 'Summe'],
    '-': ['die Differenz', 'der Differenz', 'Differenz'],
    '*': ['das Produkt', 'dem Produkt', 'Produkt'],
    '/': ['der Quotient', 'dem Quotienten', 'Quotient'],
  };

  const leaf = (v) => ({ leaf: String(v) });
  const node = (op, l, r) => ({ op, l, r });
  const clone = (t) => JSON.parse(JSON.stringify(t));

  function randLeaf(avoid) {
    let l;
    do { l = Rand.chance(0.35) ? 'x' : String(Rand.int(2, 9)); } while (l === avoid);
    return leaf(l);
  }
  function randSub() {
    const a = randLeaf();
    return node(Rand.pick(OPS), a, randLeaf(a.leaf));
  }
  function randTree() {
    const shape = Rand.int(0, 3);
    if (shape === 0) return node(Rand.pick(OPS), randSub(), randLeaf());
    if (shape === 1) return node(Rand.pick(OPS), randLeaf(), randSub());
    if (shape === 2) return node(Rand.pick(OPS), randSub(), randSub());
    return node(Rand.pick(OPS), node(Rand.pick(OPS), randSub(), randLeaf()), randLeaf());
  }

  function termStr(n, pop, side) {
    if (n.leaf) return n.leaf;
    let s = termStr(n.l, n.op, 'l') + ' ' + SYM[n.op] + ' ' + termStr(n.r, n.op, 'r');
    if (pop && (PREC[n.op] < PREC[pop] || (side === 'r' && PREC[n.op] === PREC[pop]))) s = '(' + s + ')';
    return s;
  }

  function words(n, cas) {
    if (n.leaf) return n.leaf;
    const i = cas === 'dat' ? 1 : 0;
    return NAMES[n.op][i] + ' aus ' + words(n.l, 'dat') + ' und ' + words(n.r, 'dat');
  }
  function wordForm(t) {
    const w = words(t, 'nom');
    return w.charAt(0).toUpperCase() + w.slice(1);
  }
  const termType = (t) => NAMES[t.op][2];

  function height(n) { return n.leaf ? 0 : 1 + Math.max(height(n.l), height(n.r)); }

  function treeSVG(t, opts) {
    opts = opts || {};
    const GX = opts.small ? 46 : 64;
    const GY = opts.small ? 52 : 70;
    const pos = new Map();
    let li = 0;
    (function lay(n) {
      if (n.leaf) { pos.set(n, { x: li++, h: 0 }); return 0; }
      const hl = lay(n.l), hr = lay(n.r);
      const h = 1 + Math.max(hl, hr);
      pos.set(n, { x: (pos.get(n.l).x + pos.get(n.r).x) / 2, h });
      return h;
    })(t);
    const H = height(t);
    const W = li * GX;
    const pad = opts.small ? 22 : 30;
    const X = (n) => pad + pos.get(n).x * GX;
    const Y = (n) => pad + pos.get(n).h * GY;
    let edges = '', nodes = '';
    (function draw(n) {
      if (!n.leaf) {
        [n.l, n.r].forEach((c) => {
          edges += `<line class="tree-edge" x1="${X(c)}" y1="${Y(c)}" x2="${X(n)}" y2="${Y(n)}"/>`;
          draw(c);
        });
        nodes += `<g class="tree-op tree-op-${'+-*/'.indexOf(n.op)}"><circle cx="${X(n)}" cy="${Y(n)}" r="${opts.small ? 14 : 18}"/>` +
          `<text x="${X(n)}" y="${Y(n)}" dy="0.36em">${SYM[n.op]}</text></g>`;
      } else {
        const w = opts.small ? 30 : 38, h = opts.small ? 26 : 32;
        nodes += `<g class="tree-leaf${n.leaf === 'x' ? ' is-var' : ''}"><rect x="${X(n) - w / 2}" y="${Y(n) - h / 2}" width="${w}" height="${h}" rx="9"/>` +
          `<text x="${X(n)}" y="${Y(n)}" dy="0.36em">${esc(n.leaf)}</text></g>`;
      }
    })(t);
    // Pfeil nach unten zum Ergebnis
    const rx = X(t), ry = Y(t);
    edges += `<line class="tree-edge" x1="${rx}" y1="${ry}" x2="${rx}" y2="${ry + GY * 0.55}"/>`;
    const vbW = pad * 2 + W - GX;
    const vbH = H * GY + pad * 2 + GY * 0.55;
    return `<svg class="tree-svg${opts.small ? ' small' : ''}" viewBox="0 0 ${vbW} ${vbH}" role="img" aria-label="Rechenbaum">${edges}${nodes}</svg>`;
  }

  function allOpNodes(t, out) {
    out = out || [];
    if (!t.leaf) { out.push(t); allOpNodes(t.l, out); allOpNodes(t.r, out); }
    return out;
  }
  function mutations(t) {
    const res = [];
    if (!t.l.leaf) { const L = t.l; res.push(node(L.op, clone(L.l), node(t.op, clone(L.r), clone(t.r)))); }
    if (!t.r.leaf) { const R = t.r; res.push(node(R.op, node(t.op, clone(t.l), clone(R.l)), clone(R.r))); }
    const opChanges = [];
    for (let k = 0; k < 6; k++) {
      const c = clone(t);
      const n = Rand.pick(allOpNodes(c));
      n.op = Rand.pick(OPS.filter((o) => o !== n.op));
      opChanges.push(c);
    }
    return res.concat(Rand.shuffle(opChanges));
  }
  function distractorTrees(t, count) {
    const seen = new Set([termStr(t)]);
    const out = [];
    for (const m of mutations(t)) {
      const s = termStr(m);
      if (!seen.has(s)) { seen.add(s); out.push(m); }
      if (out.length >= count) return out;
    }
    while (out.length < count) {
      const r = randTree();
      const s = termStr(r);
      if (!seen.has(s)) { seen.add(s); out.push(r); }
    }
    return out;
  }

  // ---------- Figuren ----------
  const VAR = 92, UNIT = 22;
  const len = (l) => (typeof l === 'number' ? l * UNIT : VAR);
  const lbl = (x, y, t, cls) => `<text class="fig-label ${cls || ''}" x="${x}" y="${y}" dy="0.36em">${esc(t)}</text>`;
  const svgWrap = (w, h, body, aria) => `<svg class="fig-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(aria)}">${body}</svg>`;
  const disp = (v) => (typeof v === 'number' ? String(v) : v);

  /** Rechteck, das in zwei Teile geteilt ist: Breite (v + p), Höhe h */
  function rectSplit(o) {
    const pad = 40;
    const W1 = len(o.v), W2 = len(o.p), H = typeof o.h === 'number' ? o.h * UNIT : VAR * 0.8;
    let b = `<rect class="fig-a" x="${pad}" y="${pad}" width="${W1}" height="${H}"/>` +
      `<rect class="fig-b" x="${pad + W1}" y="${pad}" width="${W2}" height="${H}"/>`;
    b += lbl(pad + W1 / 2, pad + H + 18, disp(o.v)) + lbl(pad + W1 + W2 / 2, pad + H + 18, disp(o.p)) + lbl(pad - 16, pad + H / 2, disp(o.h));
    if (o.showParts) {
      b += lbl(pad + W1 / 2, pad + H / 2, o.parts[0], 'inner') + lbl(pad + W1 + W2 / 2, pad + H / 2, o.parts[1], 'inner');
    }
    return svgWrap(pad * 2 + W1 + W2, pad * 2 + H, b, 'Rechteck aus zwei Teilen');
  }

  /** L-Form: oben Rechteck (v × r), unten Rechteck ((v + p) × q) */
  function lShape(o) {
    const pad = 40;
    const A = VAR, P = o.p * UNIT, R = o.r * UNIT, Q = o.q * UNIT;
    let b = `<rect class="fig-a" x="${pad}" y="${pad}" width="${A}" height="${R}"/>` +
      `<rect class="fig-b" x="${pad}" y="${pad + R}" width="${A + P}" height="${Q}"/>`;
    b += `<line class="fig-dash" x1="${pad + A}" y1="${pad + R}" x2="${pad + A}" y2="${pad + R + Q}"/>`;
    b += lbl(pad + A / 2, pad - 14, o.v) + lbl(pad - 16, pad + R / 2, o.r) + lbl(pad - 16, pad + R + Q / 2, o.q) +
      lbl(pad + A / 2, pad + R + Q + 18, o.v) + lbl(pad + A + P / 2, pad + R + Q + 18, o.p);
    return svgWrap(pad * 2 + A + P, pad * 2 + R + Q, b, 'L-förmige Figur');
  }

  /** Rechteck mit 4 Feldern: Breite (v1 + p), Höhe (v2 + q) */
  function grid4(o) {
    const pad = 40;
    const W1 = VAR, W2 = o.p * UNIT, H1 = o.v2 === o.v1 ? VAR : VAR * 0.75, H2 = o.q * UNIT;
    let b = `<rect class="fig-a" x="${pad}" y="${pad}" width="${W1}" height="${H1}"/>` +
      `<rect class="fig-b" x="${pad + W1}" y="${pad}" width="${W2}" height="${H1}"/>` +
      `<rect class="fig-c" x="${pad}" y="${pad + H1}" width="${W1}" height="${H2}"/>` +
      `<rect class="fig-d" x="${pad + W1}" y="${pad + H1}" width="${W2}" height="${H2}"/>`;
    b += lbl(pad + W1 / 2, pad - 14, o.v1) + lbl(pad + W1 + W2 / 2, pad - 14, o.p) +
      lbl(pad - 16, pad + H1 / 2, o.v2) + lbl(pad - 16, pad + H1 + H2 / 2, o.q);
    if (o.showParts) {
      b += lbl(pad + W1 / 2, pad + H1 / 2, o.parts[0], 'inner') + lbl(pad + W1 + W2 / 2, pad + H1 / 2, o.parts[1], 'inner small') +
        lbl(pad + W1 / 2, pad + H1 + H2 / 2, o.parts[2], 'inner small') + lbl(pad + W1 + W2 / 2, pad + H1 + H2 / 2, o.parts[3], 'inner small');
    }
    return svgWrap(pad * 2 + W1 + W2, pad * 2 + H1 + H2, b, 'Rechteck aus vier Feldern');
  }

  /** Quader in Schrägbild: Länge l, Breite (Tiefe) w, Höhe h. Werte: Zahl oder Text wie "2x" */
  function cuboid(o) {
    const pad = 40;
    const sz = (v) => (typeof v === 'number' ? Math.min(v * 20, 120) : /^\d/.test(v) ? 120 : 70);
    const L = sz(o.l), Hh = sz(o.h), D = sz(o.w) * 0.5;
    const x0 = pad, y0 = pad + D;
    const front = `${x0},${y0} ${x0 + L},${y0} ${x0 + L},${y0 + Hh} ${x0},${y0 + Hh}`;
    const top = `${x0},${y0} ${x0 + D},${y0 - D} ${x0 + L + D},${y0 - D} ${x0 + L},${y0}`;
    const side = `${x0 + L},${y0} ${x0 + L + D},${y0 - D} ${x0 + L + D},${y0 - D + Hh} ${x0 + L},${y0 + Hh}`;
    let b = `<polygon class="fig-b" points="${top}"/><polygon class="fig-c" points="${side}"/><polygon class="fig-a" points="${front}"/>`;
    b += lbl(x0 + L / 2, y0 + Hh + 18, disp(o.l)) +
      lbl(x0 + L + D + 20, y0 - D + Hh / 2 + D / 2, disp(o.h)) +
      lbl(x0 + L + D / 2 + 14, y0 + Hh - D / 2 + 6, disp(o.w));
    return svgWrap(pad * 2 + L + D + 20, pad * 2 + Hh + D, b, 'Quader');
  }

  root.Rand = Rand;
  root.Visuals = {
    esc, SYM, NAMES,
    tree: { randTree, termStr: (t) => termStr(t), wordForm, termType, treeSVG, distractorTrees, leaf, node },
    fig: { rectSplit, lShape, grid4, cuboid },
  };
})(window);
