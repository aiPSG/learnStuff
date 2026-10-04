/*
 * MathTerm – kleiner Term-Parser für die Lern-App.
 * Versteht Eingaben wie "3a² - 2(b + 4)", "x^2", "2,5x", "12 : 3".
 * Wandelt Terme in eine Normalform (Polynom) um, damit gleichwertige
 * Antworten erkannt werden ("4b+3a" == "3a+4b").
 */
(function (root) {
  'use strict';

  const SUP_IN = { '²': 2, '³': 3 };
  const SUP_OUT = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const EPS = 1e-9;

  function MathError(message) {
    this.message = message;
    this.mathError = true;
  }

  function normalize(s) {
    return String(s)
      .replace(/[−–—]/g, '-')
      .replace(/[·×∙⋅]/g, '*')
      .replace(/[÷:]/g, '/')
      .replace(/\[/g, '(')
      .replace(/\]/g, ')');
  }

  function tokenize(input) {
    const s = normalize(input);
    const toks = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9]/.test(c) || ((c === ',' || c === '.') && /[0-9]/.test(s[i + 1] || ''))) {
        let j = i;
        while (j < s.length && /[0-9.,]/.test(s[j])) j++;
        const raw = s.slice(i, j).replace(/,/g, '.');
        if ((raw.match(/\./g) || []).length > 1) {
          throw new MathError('Die Zahl „' + s.slice(i, j) + '“ hat zu viele Kommas.');
        }
        toks.push({ t: 'num', v: parseFloat(raw) });
        i = j;
        continue;
      }
      if (/[a-zA-Z]/.test(c)) { toks.push({ t: 'var', v: c.toLowerCase() }); i++; continue; }
      if ('+-*/^()'.includes(c)) { toks.push({ t: 'op', v: c }); i++; continue; }
      if (c in SUP_IN) { toks.push({ t: 'sup', v: SUP_IN[c] }); i++; continue; }
      throw new MathError('Das Zeichen „' + c + '“ kenne ich nicht.');
    }
    return toks;
  }

  function parse(input) {
    const toks = tokenize(input);
    if (!toks.length) throw new MathError('Bitte gib zuerst etwas ein.');
    let p = 0;
    const peek = () => toks[p];
    const isOp = (v) => peek() && peek().t === 'op' && peek().v === v;

    function expr() {
      let node = term();
      while (isOp('+') || isOp('-')) {
        const op = toks[p++].v;
        if (!peek()) throw new MathError('Nach „' + (op === '-' ? '−' : '+') + '“ fehlt noch etwas.');
        node = { t: op, a: node, b: term() };
      }
      return node;
    }

    function term() {
      let node = unary();
      for (;;) {
        if (isOp('*') || isOp('/')) {
          const op = toks[p++].v;
          if (!peek()) throw new MathError('Nach dem Rechenzeichen fehlt noch etwas.');
          node = { t: op, a: node, b: unary() };
        } else if (peek() && (peek().t === 'var' || isOp('('))) {
          node = { t: '*', a: node, b: power(), implicit: true };
        } else if (peek() && peek().t === 'num') {
          throw new MathError('Eine Zahl steht direkt hinter einer Variablen oder Klammer. Schreibe Zahlen nach vorne (2x statt x2) und Hochzahlen mit ^ oder ².');
        } else {
          break;
        }
      }
      return node;
    }

    function unary() {
      if (isOp('-')) { p++; return { t: 'neg', a: unary() }; }
      if (isOp('+')) { p++; return unary(); }
      return power();
    }

    function power() {
      let base = atom();
      for (;;) {
        if (peek() && peek().t === 'sup') {
          base = { t: '^', a: base, n: toks[p++].v };
        } else if (isOp('^')) {
          p++;
          const e = peek();
          if (!e || e.t !== 'num' || !Number.isInteger(e.v)) {
            throw new MathError('Nach ^ muss eine ganze Zahl stehen (z. B. x^2).');
          }
          if (e.v > 12) throw new MathError('So große Hochzahlen brauchen wir hier nicht.');
          p++;
          base = { t: '^', a: base, n: e.v };
        } else {
          break;
        }
      }
      return base;
    }

    function atom() {
      const tk = peek();
      if (!tk) throw new MathError('Da fehlt am Ende noch etwas.');
      if (tk.t === 'num') { p++; return { t: 'num', v: tk.v }; }
      if (tk.t === 'var') { p++; return { t: 'var', v: tk.v }; }
      if (isOp('(')) {
        p++;
        if (isOp(')')) throw new MathError('In der Klammer steht nichts.');
        const inner = expr();
        if (!isOp(')')) throw new MathError('Eine Klammer wurde nicht geschlossen.');
        p++;
        inner.paren = true;
        return inner;
      }
      if (isOp(')')) throw new MathError('Da ist eine schließende Klammer zu viel.');
      if (tk.t === 'sup') throw new MathError('Die Hochzahl steht an einer falschen Stelle.');
      throw new MathError('Das Zeichen „' + tk.v + '“ steht an einer komischen Stelle.');
    }

    const result = expr();
    if (p < toks.length) {
      if (isOp(')')) throw new MathError('Da ist eine schließende Klammer zu viel.');
      throw new MathError('Ich verstehe deine Eingabe ab „' + toks[p].v + '“ nicht.');
    }
    return result;
  }

  // ---------- Polynome: Map monomKey -> {c, m} ----------
  function mkey(m) {
    return Object.keys(m).sort().map((v) => (m[v] === 1 ? v : v + '^' + m[v])).join('*');
  }
  function addTerm(P, c, m) {
    const k = mkey(m);
    const e = P.get(k);
    const nc = (e ? e.c : 0) + c;
    if (Math.abs(nc) < EPS) P.delete(k);
    else P.set(k, { c: nc, m: Object.assign({}, m) });
  }
  function padd(A, B, sign) {
    const R = new Map();
    A.forEach((t) => addTerm(R, t.c, t.m));
    B.forEach((t) => addTerm(R, sign * t.c, t.m));
    return R;
  }
  function pscale(A, k) {
    const R = new Map();
    A.forEach((t) => addTerm(R, t.c * k, t.m));
    return R;
  }
  function pmul(A, B) {
    const R = new Map();
    A.forEach((s) => B.forEach((t) => {
      const m = Object.assign({}, s.m);
      Object.keys(t.m).forEach((v) => { m[v] = (m[v] || 0) + t.m[v]; });
      addTerm(R, s.c * t.c, m);
    }));
    return R;
  }
  function constOf(P) {
    if (P.size === 0) return 0;
    if (P.size === 1 && P.has('')) return P.get('').c;
    return null;
  }

  function toPoly(n) {
    switch (n.t) {
      case 'num': { const R = new Map(); addTerm(R, n.v, {}); return R; }
      case 'var': { const R = new Map(); addTerm(R, 1, { [n.v]: 1 }); return R; }
      case '+': return padd(toPoly(n.a), toPoly(n.b), 1);
      case '-': return padd(toPoly(n.a), toPoly(n.b), -1);
      case 'neg': return pscale(toPoly(n.a), -1);
      case '*': return pmul(toPoly(n.a), toPoly(n.b));
      case '/': {
        const d = constOf(toPoly(n.b));
        if (d === null) throw new MathError('Durch Variablen teilen wir hier nicht.');
        if (Math.abs(d) < EPS) throw new MathError('Durch 0 darf man nicht teilen!');
        return pscale(toPoly(n.a), 1 / d);
      }
      case '^': {
        let R = new Map([['', { c: 1, m: {} }]]);
        const b = toPoly(n.a);
        for (let i = 0; i < n.n; i++) R = pmul(R, b);
        return R;
      }
    }
    throw new MathError('Unbekannter Ausdruck.');
  }

  function polyEqual(A, B) {
    const D = padd(A, B, -1);
    let ok = true;
    D.forEach((t) => { if (Math.abs(t.c) > 1e-7) ok = false; });
    return ok;
  }

  function evaluate(n, vals) {
    switch (n.t) {
      case 'num': return n.v;
      case 'var':
        if (!(n.v in vals)) throw new MathError('Für ' + n.v + ' fehlt ein Wert.');
        return vals[n.v];
      case '+': return evaluate(n.a, vals) + evaluate(n.b, vals);
      case '-': return evaluate(n.a, vals) - evaluate(n.b, vals);
      case 'neg': return -evaluate(n.a, vals);
      case '*': return evaluate(n.a, vals) * evaluate(n.b, vals);
      case '/': return evaluate(n.a, vals) / evaluate(n.b, vals);
      case '^': return Math.pow(evaluate(n.a, vals), n.n);
    }
    return NaN;
  }

  // ---------- Ausgabe ----------
  function fmtNum(x) {
    const r = Math.round(x * 1e6) / 1e6;
    return String(r).replace('.', ',');
  }
  function sup(n) {
    return String(n).split('').map((d) => SUP_OUT[+d]).join('');
  }
  function fmtMonomial(m) {
    return Object.keys(m).sort().map((v) => v + (m[v] === 1 ? '' : sup(m[v]))).join('');
  }
  function degree(m) {
    return Object.keys(m).reduce((s, v) => s + m[v], 0);
  }
  function sortedTerms(P) {
    const arr = [];
    P.forEach((t, k) => arr.push(Object.assign({ k }, t)));
    arr.sort((x, y) => {
      if (x.k === '') return 1;
      if (y.k === '') return -1;
      // Variablen alphabetisch zuerst (a vor b), dann höhere Potenz zuerst
      const vx = Object.keys(x.m).sort().join('');
      const vy = Object.keys(y.m).sort().join('');
      if (vx !== vy) {
        const dx = degree(x.m), dy = degree(y.m);
        if (dx !== dy) return dy - dx;
        return vx < vy ? -1 : 1;
      }
      return degree(y.m) - degree(x.m);
    });
    return arr;
  }
  function formatPoly(P) {
    const arr = sortedTerms(P);
    if (!arr.length) return '0';
    return arr.map((t, i) => {
      const neg = t.c < 0;
      const a = Math.abs(t.c);
      const mon = fmtMonomial(t.m);
      let body;
      if (mon === '') body = fmtNum(a);
      else if (Math.abs(a - 1) < EPS) body = mon;
      else body = fmtNum(a) + mon;
      if (i === 0) return (neg ? '−' : '') + body;
      return (neg ? ' − ' : ' + ') + body;
    }).join('');
  }

  // ---------- Prüft, ob ein Term fertig vereinfacht ist ----------
  function collectSummands(n, out) {
    if (!n.paren && (n.t === '+' || n.t === '-')) {
      collectSummands(n.a, out);
      collectSummands(n.b, out);
    } else if (!n.paren && n.t === 'neg') {
      collectSummands(n.a, out);
    } else {
      out.push(n);
    }
    return out;
  }
  function collectFactors(n, out) {
    if (!n.paren && n.t === '*') { collectFactors(n.a, out); collectFactors(n.b, out); }
    else if (!n.paren && n.t === 'neg') collectFactors(n.a, out);
    else out.push(n);
    return out;
  }
  function simplifiedCheck(ast, P) {
    const sums = collectSummands(ast, []);
    for (const s of sums) {
      const fs = collectFactors(s, []);
      let nums = 0;
      const seen = {};
      for (const f of fs) {
        if (f.paren) return { ok: false, reason: 'Da steht noch eine Klammer. Löse sie auf!' };
        if (f.t === '/') return { ok: false, reason: 'Rechne die Division noch aus.' };
        if (f.t === 'num') { nums++; continue; }
        let base = f;
        if (f.t === '^') {
          base = f.a;
          if (base.paren) return { ok: false, reason: 'Da steht noch eine Klammer. Löse sie auf!' };
          if (base.t === 'num') return { ok: false, reason: 'Rechne die Potenz der Zahl noch aus.' };
        }
        if (base.t === 'var') {
          if (seen[base.v]) return { ok: false, reason: 'Fasse gleiche Variablen zu einer Potenz zusammen (a · a = a²).' };
          seen[base.v] = true;
        }
      }
      if (nums > 1) return { ok: false, reason: 'Multipliziere die Zahlen noch miteinander.' };
    }
    const nTerms = P.size;
    if (nTerms === 0) {
      if (sums.length === 1 && sums[0].t === 'num' && sums[0].v === 0) return { ok: true };
      return { ok: false, reason: 'Fasse noch weiter zusammen – es bleibt weniger übrig, als du denkst.' };
    }
    if (sums.length > nTerms) return { ok: false, reason: 'Du kannst noch gleichartige Terme zusammenfassen.' };
    return { ok: true };
  }

  /**
   * Prüft eine Schüler-Eingabe gegen einen erwarteten Term.
   * status: 'ok' | 'almost' (gleichwertig, aber nicht vereinfacht) | 'wrong' | 'error' (nicht lesbar)
   */
  function checkTerm(input, expected, opts) {
    opts = opts || {};
    let ast, P;
    try {
      ast = parse(input);
      P = toPoly(ast);
    } catch (e) {
      if (e && e.mathError) return { status: 'error', msg: e.message };
      throw e;
    }
    const Q = toPoly(parse(expected));
    if (!polyEqual(P, Q)) return { status: 'wrong' };
    if (opts.simplified) {
      const s = simplifiedCheck(ast, P);
      if (!s.ok) return { status: 'almost', msg: s.reason };
    }
    return { status: 'ok' };
  }

  function simplify(str) {
    return formatPoly(toPoly(parse(str)));
  }

  function evalStr(str, vals) {
    return evaluate(parse(str), vals || {});
  }

  /** Macht Eingaben hübsch: * → ·, - → −, ^2 → ² */
  function pretty(str) {
    return String(str)
      .replace(/\*/g, '·')
      .replace(/-/g, '−')
      .replace(/\^(\d+)/g, (_, d) => sup(d))
      .replace(/\//g, ':');
  }

  const api = {
    parse, toPoly, polyEqual, evaluate, evalStr, formatPoly, simplify,
    checkTerm, simplifiedCheck, pretty, fmtNum, sup, MathError,
  };
  root.MathTerm = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
