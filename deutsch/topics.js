/*
 * ArguQuest – Deutsch: Feststellung & These, Thesen formulieren, belegen, widerlegen, Zitiertechnik.
 */
(function (root) {
  'use strict';

  const R = root.Rand, D = root.DeData, esc = root.Visuals.esc;
  const { STREIT, SIG, SENTENCES, BELEG_TYPES, BELEGE, CONNECT, TEXTS } = D;

  // ---------- Helfer ----------
  function mcFrom(prompt, correct, wrongs, explain, extra) {
    const opts = R.shuffle([correct].concat(wrongs));
    return Object.assign({ type: 'mc', prompt, options: opts, correct: opts.indexOf(correct), explain }, extra || {});
  }
  function tf(statement, truth, explain) {
    return { type: 'mc', prompt: 'Richtig oder falsch?', visual: `<div class="scenario statement">„${statement}“</div>`, options: ['✔ Richtig', '✘ Falsch'], correct: truth ? 0 : 1, explain: (truth ? '<b>Richtig.</b> ' : '<b>Falsch.</b> ') + explain, optionStyle: 'tf' };
  }
  const pickN = (arr, n) => R.shuffle(arr).slice(0, n);
  const fromPool = (pool) => () => { const x = R.pick(pool); return x.length === 3 ? tf(x[0], x[1], x[2]) : mcFrom(x[0], x[1], x[2], x[3], x[4]); };
  const scenario = (t) => `<div class="scenario">${t}</div>`;
  const streit = () => R.pick(STREIT);
  const otherStreit = (s) => R.pick(STREIT.filter((x) => x !== s));
  const qBox = (s) => scenario(`🗣️ Streitfrage: <b>${s.q}</b>`);

  // Zeilenangabe: 1 Zeile (Z. 4), 2 Zeilen (Z. 4 f.), mehr (Z. 4–6)
  const zeile = (ls) => (ls.length === 1 ? `Z. ${ls[0]}` : ls.length === 2 ? `Z. ${ls[0]} f.` : `Z. ${ls[0]}–${ls[ls.length - 1]}`);
  const cite = (txt, ls) => `„${txt}“ (${zeile(ls)})`;
  function linedText(t, opts) {
    opts = opts || {};
    return `<div class="${opts.hotspot ? 'text-hs ' : ''}lined"><div class="lined-title">${t.title}</div>${t.lines.map((l, i) =>
      `<div class="ln"${opts.hotspot ? ` data-part="z${i + 1}"` : ''}><span class="no">${i + 1}</span><span>${esc(l)}</span></div>`).join('')}</div>`;
  }

  // ---------- 1 · Feststellung oder These ----------
  const F = SENTENCES.filter((s) => s[1] === 'F'), T = SENTENCES.filter((s) => s[1] === 'T');
  const FT_TF = [
    ['Eine Feststellung kann man überprüfen.', true, 'Feststellungen sind nachprüfbar – sie sind wahr oder falsch.'],
    ['Eine These muss man nicht begründen.', false, 'Gerade eine These muss begründet werden, weil man über sie streiten kann.'],
    ['Über eine These kann man unterschiedlicher Meinung sein.', true, 'Das ist das wichtigste Kennzeichen einer These: Sie ist strittig.'],
    ['Wörter wie „sollte“ oder „müsste“ deuten oft auf eine These hin.', true, 'Modalverben drücken Forderungen aus – typisch für Thesen.'],
    ['Jeder Satz mit einer Zahl ist eine Feststellung.', false, '„Zwei Stunden Hausaufgaben sind zu viel“ enthält eine Zahl – und ist trotzdem eine These (Wertung „zu viel“).'],
    ['Eine These steht häufig am Anfang einer Argumentation.', true, 'Erst kommt der Standpunkt, dann die Begründung.'],
    ['„Ich finde“ ist ein Signal für eine Meinung.', true, 'Mit „ich finde“, „ich meine“, „meiner Meinung nach“ leitet man einen Standpunkt ein.'],
    ['Feststellungen enthalten meistens starke Wertungen.', false, 'Feststellungen sind sachlich und neutral. Starke Wertungen sind ein Kennzeichen von Thesen.'],
  ];
  const MAKE_THESIS = [
    ['Die Schule beginnt um 8 Uhr.', 'Die Schule sollte später als um 8 Uhr beginnen.'],
    ['In der Mensa gibt es jeden Tag Fleisch.', 'In der Mensa sollte es auch fleischlose Tage geben.'],
    ['Viele Jugendliche besitzen ein Smartphone.', 'Jugendliche sollten ihr Smartphone seltener benutzen.'],
    ['Die Sommerferien dauern sechs Wochen.', 'Die Sommerferien sollten länger als sechs Wochen dauern.'],
    ['An unserer Schule gibt es keine Schuluniform.', 'An unserer Schule sollte eine Schuluniform eingeführt werden.'],
    ['Im Unterricht werden Tablets eingesetzt.', 'Tablets machen den Unterricht spannender.'],
    ['Unsere Klasse fährt im Mai ins Schullandheim.', 'Klassenfahrten sind wichtig für die Klassengemeinschaft.'],
  ];
  function ftParagraph() {
    const findThesis = R.chance(0.6);
    const odd = findThesis ? R.pick(T) : R.pick(F);
    const rest = pickN(findThesis ? F : T, 3);
    const all = R.shuffle([odd].concat(rest));
    const html = `<div class="text-hs">${all.map((s, i) => `<span data-part="s${i}">${esc(s[0])}</span>`).join(' ')}</div>`;
    return { type: 'hotspot', prompt: findThesis ? 'Drei Sätze sind Feststellungen – einer ist eine <b>These</b>. Tippe auf die These!' : 'Drei Sätze sind Thesen – einer ist eine <b>Feststellung</b>. Tippe auf die Feststellung!',
      svg: html, answer: 's' + all.indexOf(odd), answerLabel: `„${odd[0]}“`, explain: odd[2] };
  }

  const topic1 = {
    id: 1, emoji: '⚖️', color: '#e11d48', title: 'Feststellung oder These?',
    goal: 'Ich kann Feststellung und These unterscheiden (Kennzeichen).',
    book: 'Kennzeichen von Feststellung und These – Heft/Mappe',
    learn: [
      { title: 'Zwei Arten von Aussagen', html: `<div class="two-col"><div class="info-box"><b>Feststellung</b><p>eine sachliche Aussage</p><ul><li>kann man <b>überprüfen</b> (wahr/falsch)</li><li>ist <b>nicht strittig</b></li><li>muss <b>nicht begründet</b> werden</li></ul><i>„Die Schule beginnt um 8 Uhr.“</i></div>
        <div class="info-box"><b>These</b><p>eine Behauptung / ein Standpunkt</p><ul><li>drückt eine <b>Meinung</b> aus</li><li>ist <b>strittig</b> – man kann widersprechen</li><li>muss <b>begründet</b> werden</li></ul><i>„Die Schule sollte später beginnen.“</i></div></div>` },
      { title: 'Kennzeichen von Thesen 🔍', html: `<table class="nice-table"><tr><th>Kennzeichen</th><th>Beispiel</th></tr>
        <tr><td>Forderung / Modalverb</td><td>Handys <b>sollten</b> verboten werden.</td></tr>
        <tr><td>Wertung</td><td>Hausaufgaben sind <b>überflüssig</b>.</td></tr>
        <tr><td>Vergleich / Superlativ</td><td>Bücher sind <b>besser als</b> Filme.</td></tr>
        <tr><td>Meinungs-Signal</td><td><b>Ich finde</b>, die Ferien sind zu kurz.</td></tr>
        <tr><td>Verallgemeinerung</td><td><b>Alle</b> Kinder lieben Haustiere.</td></tr></table>
        <p class="tip">💡 Test-Frage: <b>Könnte jemand ernsthaft widersprechen?</b> Ja → These. Nein, man kann es nachschlagen → Feststellung.</p>` },
      { title: 'Vorsicht, Fallen! ⚠️', html: `<ul class="steps"><li>„<b>Viele</b> Jugendliche besitzen ein Smartphone.“ → <b>Feststellung</b>: Das kann man mit einer Umfrage prüfen.</li>
        <li>„<b>Zwei Stunden</b> Hausaufgaben sind zu viel.“ → <b>These</b>: Trotz Zahl steckt eine Wertung („zu viel“) darin.</li>
        <li>„<b>Ich</b> habe gestern Fußball gespielt.“ → <b>Feststellung</b>: „Ich“ allein macht noch keine Meinung.</li></ul>` },
      { title: 'Sortier-Training 🎯', html: '<div class="sorter"></div>', widget: 'sorter' },
    ],
    gens: [
      () => { const s = R.pick(SENTENCES); return { type: 'mc', prompt: 'Feststellung oder These?', visual: `<div class="scenario statement">„${s[0]}“</div>`, options: ['Feststellung', 'These'], correct: s[1] === 'F' ? 0 : 1, explain: s[2], optionStyle: 'tf' }; },
      () => { const s = R.pick(SENTENCES); return { type: 'mc', prompt: 'Feststellung oder These?', visual: `<div class="scenario statement">„${s[0]}“</div>`, options: ['Feststellung', 'These'], correct: s[1] === 'F' ? 0 : 1, explain: s[2], optionStyle: 'tf' }; },
      () => {
        const nT = R.int(2, 3);
        const opts = R.shuffle(pickN(T, nT).concat(pickN(F, 6 - nT)));
        return { type: 'multi', prompt: 'Welche Sätze sind <b>Thesen</b>?', options: opts.map((s) => s[0]), correct: opts.map((s, i) => (s[1] === 'T' ? i : -1)).filter((i) => i >= 0), optionStyle: 'wide', explain: 'Thesen sind strittig und drücken einen Standpunkt aus: ' + opts.filter((s) => s[1] === 'T').map((s) => `„${s[0]}“`).join(', ') + '.' };
      },
      () => {
        const s = R.pick(T);
        const keys = Object.keys(SIG);
        return mcFrom(`Woran erkennst du, dass dieser Satz eine These ist?`, SIG[s[3]], pickN(keys.filter((k) => k !== s[3]), 3).map((k) => SIG[k]), `Signal: <b>${s[4]}</b>. ${s[2]}`, { visual: `<div class="scenario statement">„${s[0]}“</div>`, optionStyle: 'wide' });
      },
      ftParagraph,
      fromPool(FT_TF),
      () => {
        const [f, t] = R.pick(MAKE_THESIS);
        const wrongs = pickN(F.filter((x) => x[0] !== f), 3).map((x) => x[0]);
        return mcFrom(`Welcher Satz macht aus der Feststellung eine <b>These</b>?`, t, wrongs, `„${t}“ fordert oder bewertet etwas – darüber kann man streiten.`, { visual: `<div class="scenario">Feststellung: „${f}“</div>`, optionStyle: 'wide' });
      },
    ],
  };

  // ---------- 2 · Thesen formulieren ----------
  const ERR = {
    frage: 'Sie ist als Frage formuliert.',
    fest: 'Sie ist eine Feststellung und nicht strittig.',
    vage: 'Sie bezieht keinen klaren Standpunkt.',
    thema: 'Sie passt nicht zur Streitfrage.',
  };
  function badThesis(s, kind) {
    if (kind === 'frage') return s.q;
    if (kind === 'fest') return `Über ${s.topic} wird oft diskutiert.`;
    if (kind === 'vage') return `Was ${s.topic} angeht, gibt es Vor- und Nachteile.`;
    return otherStreit(s).pro;
  }
  const RULES_TF = [
    ['Eine These ist ein Aussagesatz – keine Frage.', true, 'Aus der Streitfrage „Sollten …?“ wird der Aussagesatz „… sollten …“.'],
    ['Eine gute These hält sich alle Möglichkeiten offen.', false, 'Eine These bezieht einen klaren Standpunkt: dafür oder dagegen.'],
    ['Eine These sollte kurz und genau formuliert sein.', true, 'Ein Satz, der den Standpunkt klar auf den Punkt bringt.'],
    ['Zu einer Streitfrage kann man eine Pro- und eine Contra-These formulieren.', true, 'Pro = dafür, Contra = dagegen.'],
    ['„Handys sind ein Thema.“ ist eine gute These.', false, 'Der Satz bezieht keinen Standpunkt und ist nicht strittig.'],
    ['Eine These muss zur Streitfrage passen.', true, 'Sonst redet man am Thema vorbei.'],
  ];
  const topic2 = {
    id: 2, emoji: '💡', color: '#f59e0b', title: 'Thesen formulieren',
    goal: 'Ich kann selbst Thesen formulieren.',
    book: '',
    learn: [
      { title: 'Von der Streitfrage zur These', html: `<p>Eine Streitfrage kann man mit <b>Ja</b> oder <b>Nein</b> beantworten. Deine These ist die Antwort als <b>Aussagesatz</b>:</p>
        <div class="law-box">Streitfrage: <i>Sollten Hausaufgaben abgeschafft werden?</i></div>
        <div class="two-col"><div class="info-box"><b>Pro-These</b><p>dafür</p>Hausaufgaben sollten abgeschafft werden.</div><div class="info-box"><b>Contra-These</b><p>dagegen</p>Hausaufgaben sollten nicht abgeschafft werden.</div></div>` },
      { title: 'Checkliste für eine gute These ✅', html: `<ul class="steps"><li><b>Aussagesatz</b>, kein Fragesatz</li><li><b>klarer Standpunkt</b> – dafür oder dagegen, nicht „teils, teils“</li>
        <li><b>strittig</b> – jemand könnte widersprechen</li><li><b>passt zur Streitfrage</b></li><li><b>kurz und genau</b> – ein Satz reicht</li></ul>
        <p class="tip">💡 Hilfreiche Formulierungen: „… sollte …“, „Ich bin der Meinung, dass …“, „Es ist sinnvoll, …“</p>` },
      { title: 'Typische Fehler', html: `<table class="nice-table"><tr><th>Schwache These</th><th>Problem</th></tr>
        <tr><td>Sollten Handys verboten werden?</td><td>Frage statt Aussage</td></tr><tr><td>Über Handys wird oft diskutiert.</td><td>Feststellung, nicht strittig</td></tr>
        <tr><td>Handys haben Vor- und Nachteile.</td><td>kein klarer Standpunkt</td></tr><tr><td>Zoos sollten abgeschafft werden.</td><td>passt nicht zur Streitfrage</td></tr></table>` },
    ],
    gens: [
      () => { const s = streit(); const good = R.chance(0.5) ? s.pro : s.contra; return mcFrom('Welcher Satz ist eine gute These zu dieser Streitfrage?', good, ['frage', 'fest', 'vage'].map((k) => badThesis(s, k)), `„${good}“ ist ein Aussagesatz mit klarem, strittigem Standpunkt.`, { visual: qBox(s), optionStyle: 'wide' }); },
      () => { const s = streit(); const kind = R.pick(Object.keys(ERR)); return mcFrom('Was ist an dieser These problematisch?', ERR[kind], Object.keys(ERR).filter((k) => k !== kind).map((k) => ERR[k]), `${ERR[kind]} Besser: „${s.pro}“`, { visual: qBox(s) + `<div class="scenario statement">„${badThesis(s, kind)}“</div>`, optionStyle: 'wide' }); },
      () => { const s = streit(); const isPro = R.chance(0.5); return { type: 'mc', prompt: 'Ist diese These <b>dafür</b> (Pro) oder <b>dagegen</b> (Contra)?', visual: qBox(s) + `<div class="scenario statement">„${isPro ? s.pro : s.contra}“</div>`, options: ['Pro – dafür', 'Contra – dagegen'], correct: isPro ? 0 : 1, explain: `Die Streitfrage lautet „${s.q}“ – die These beantwortet sie mit ${isPro ? 'Ja' : 'Nein'}.`, optionStyle: 'tf' }; },
      () => {
        const s = streit();
        return { type: 'write', prompt: 'Formuliere zu dieser Streitfrage eine <b>Pro-These</b> und eine <b>Contra-These</b>.', visual: qBox(s), placeholder: 'Pro: …\nContra: …', minWords: 8,
          criteria: ['Beide Thesen sind Aussagesätze (keine Fragen).', 'Jede These hat einen klaren Standpunkt.', 'Beide passen zur Streitfrage.', 'Man könnte jeweils widersprechen (strittig).'],
          models: [`Pro: ${s.pro}`, `Contra: ${s.contra}`], explain: 'Tipp: Aus „Sollten …?“ wird „… sollten …“ bzw. „… sollten nicht …“.' };
      },
      () => {
        const s = streit();
        return { type: 'write', prompt: 'Wie ist <b>deine</b> Meinung? Formuliere deine eigene These zu der Streitfrage.', visual: qBox(s), placeholder: 'Meine These: …', minWords: 5,
          criteria: ['Aussagesatz, keine Frage', 'klarer Standpunkt (dafür oder dagegen)', 'passt zur Streitfrage', 'kurz und genau'],
          models: [s.pro, s.contra, `Meiner Meinung nach gilt: ${s.pro}`], explain: 'Eine These ist deine Antwort auf die Streitfrage als klarer Aussagesatz.' };
      },
      fromPool(RULES_TF),
      () => { const s = streit(); const o = otherStreit(s); return mcFrom('Welche These passt <b>nicht</b> zur Streitfrage?', o.pro, [s.pro, s.contra, `Meiner Meinung nach gilt: ${s.pro}`], `„${o.pro}“ gehört zu einer ganz anderen Streitfrage.`, { visual: qBox(s), optionStyle: 'wide' }); },
    ],
  };

  // ---------- 3 · Argument & Beleg ----------
  const ROLE = { these: 'These', arg: 'Argument (Begründung)', beleg: 'Beleg (Beispiel)' };
  const AB_TF = [
    ['Ein Argument begründet, warum die These stimmt.', true, 'Das Argument ist die Begründung („weil …“).'],
    ['Ein Beleg macht ein Argument anschaulich und glaubwürdig.', true, 'Beispiele, Erfahrungen, Zahlen oder Aussagen von Fachleuten stützen das Argument.'],
    ['„Weil das so ist“ ist ein gutes Argument.', false, 'Das begründet nichts – es ist ein Scheinargument.'],
    ['Die Reihenfolge ist meist: These – Argument – Beleg.', true, 'Erst der Standpunkt, dann die Begründung, dann das Beispiel.'],
    ['Ein Beleg kann eine eigene Erfahrung sein.', true, 'Zum Beispiel: „Ich habe selbst erlebt, dass …“'],
    ['Ein Argument und ein Beleg sind dasselbe.', false, 'Das Argument begründet allgemein, der Beleg zeigt es an einem konkreten Fall.'],
  ];
  const topic3 = {
    id: 3, emoji: '🧱', color: '#0ea5e9', title: 'Argument & Beleg',
    goal: 'Ich kenne die Bausteine einer Argumentation: These, Argument und Beleg.',
    book: '',
    learn: [
      { title: 'Die drei Bausteine', html: `<div class="arg-blocks"><div class="blk these"><b>These</b><span>Was meine ich?</span></div><div class="blk arg"><b>Argument</b><span>Warum? – die Begründung</span></div><div class="blk beleg"><b>Beleg</b><span>Woran sieht man das? – Beispiel, Erfahrung, Zahl …</span></div></div>
        <div class="law-box"><b>These:</b> Handys sollten an Schulen verboten werden.<br><b>Argument:</b> Handys lenken im Unterricht ab, weil ständig Nachrichten ankommen.<br><b>Beleg:</b> Wenn während einer Mathestunde ein Handy vibriert, verlieren viele sofort den Faden.</div>` },
      { title: 'Arten von Belegen', html: `<table class="nice-table"><tr><th>Art</th><th>Beispiel</th></tr><tr><td>Beispiel</td><td>„Zum Beispiel vibrierte gestern fünfmal ein Handy.“</td></tr>
        <tr><td>eigene Erfahrung</td><td>„Ich habe selbst erlebt, dass …“</td></tr><tr><td>Aussage einer Fachperson</td><td>„Die Kinderärztin erklärt, dass …“</td></tr>
        <tr><td>Umfrage / Zahl</td><td>„20 von 28 Schülern wünschen sich …“</td></tr><tr><td>Tatsache</td><td>„Im Winter ist es um halb acht noch dunkel.“</td></tr><tr><td>Vergleich</td><td>„Wie ein Sportler trainiert, so …“</td></tr></table>` },
      { title: 'Verknüpfungswörter', html: `<table class="nice-table"><tr><td>begründen</td><td><b>weil, denn, da</b></td></tr><tr><td>Beispiel anführen</td><td><b>zum Beispiel, etwa, so</b></td></tr>
        <tr><td>weiteres Argument</td><td><b>außerdem, zudem, ein weiterer Grund ist</b></td></tr><tr><td>Schlussfolgerung</td><td><b>deshalb, daher, folglich</b></td></tr><tr><td>Einwand</td><td><b>zwar … aber, doch, trotzdem</b></td></tr></table>` },
      { title: 'Argument-Baukasten 🧰', html: '<div class="baukasten"></div>', widget: 'baukasten' },
    ],
    gens: [
      () => {
        const s = streit(); const side = R.chance(0.5) ? 'P' : 'C'; const a = R.pick(s[side]);
        const role = R.pick(['arg', 'beleg', 'these']);
        const text = role === 'these' ? (side === 'P' ? s.pro : s.contra) : role === 'arg' ? a[0] : a[1];
        return { type: 'mc', prompt: 'Welche Rolle hat dieser Satz in der Argumentation?', visual: qBox(s) + `<div class="scenario statement">„${text}“</div>`, options: Object.values(ROLE), correct: Object.keys(ROLE).indexOf(role), explain: role === 'these' ? 'Der Satz bezieht Stellung zur Streitfrage – die These.' : role === 'arg' ? 'Der Satz begründet die These allgemein – ein Argument.' : 'Der Satz zeigt das Argument an einem konkreten Fall – ein Beleg.' };
      },
      () => {
        const s = streit(); const side = R.chance(0.5) ? 'P' : 'C'; const opp = side === 'P' ? 'C' : 'P';
        const a = R.pick(s[side]);
        return mcFrom('Welches Argument stützt diese These?', a[0], pickN(s[opp], 2).map((x) => x[0]).concat([R.pick(otherStreit(s).P)[0]]), `„${a[0]}“ begründet die These. Die anderen sprechen dagegen oder gehören zu einem anderen Thema.`, { visual: `<div class="scenario statement">These: „${side === 'P' ? s.pro : s.contra}“</div>`, optionStyle: 'wide' });
      },
      () => {
        const s = streit(); const side = R.chance(0.5) ? 'P' : 'C';
        const [a, ...others] = R.shuffle(s[side]);
        return mcFrom('Welcher Beleg passt am besten zu diesem Argument?', a[1], others.map((x) => x[1]).concat([R.pick(otherStreit(s).C)[1]]), `Der Beleg zeigt genau das, was das Argument behauptet.`, { visual: `<div class="scenario statement">Argument: „${a[0]}“</div>`, optionStyle: 'wide' });
      },
      () => {
        const [b, type] = R.pick(BELEGE);
        const avoid = { Beispiel: 'eigene Erfahrung', 'eigene Erfahrung': 'Beispiel' }[type];
        return mcFrom('Um welche Art von Beleg handelt es sich?', type, pickN(BELEG_TYPES.filter((t) => t !== type && t !== avoid), 3), `Das ist ${type === 'eigene Erfahrung' ? 'eine eigene Erfahrung' : type === 'Beispiel' ? 'ein Beispiel' : type === 'Vergleich' ? 'ein Vergleich' : type === 'Tatsache' ? 'eine Tatsache' : type === 'Umfrage / Zahl' ? 'eine Umfrage bzw. Zahl' : 'die Aussage einer Fachperson'}.`, { visual: `<div class="scenario statement">„${b}“</div>` });
      },
      () => { const [sent, ok, wrong, why] = R.pick(CONNECT); return mcFrom('Welches Wort passt in die Lücke?', ok, wrong, why, { visual: `<div class="scenario statement">${sent.replace('___', '<span class="gap">___</span>')}</div>` }); },
      () => {
        const s = streit(); const side = R.chance(0.5) ? 'P' : 'C'; const a = R.pick(s[side]);
        return { type: 'order', prompt: 'Bringe die Bausteine in die übliche Reihenfolge.', items: [side === 'P' ? s.pro : s.contra, a[0], a[1]], explain: 'These – Argument – Beleg: Erst der Standpunkt, dann die Begründung, dann das Beispiel.' };
      },
      fromPool(AB_TF),
    ],
  };

  // ---------- 4 · Thesen belegen ----------
  const WEAK = ['Das ist einfach so.', 'Das finden doch alle.', 'Das war schon immer so.', 'Mein Freund sagt das auch.', 'Das weiß doch jeder.'];
  function paragraph(s, side) {
    const these = side === 'P' ? s.pro : s.contra;
    const [a1, a2] = pickN(s[side], 2);
    const parts = [['these', these], ['a1', a1[0]], ['b1', a1[1]], ['a2', 'Außerdem gilt: ' + a2[0]], ['b2', a2[1]], ['schluss', 'Deshalb bin ich überzeugt: ' + these]];
    return { parts, html: `<div class="text-hs">${parts.map(([k, t]) => `<span data-part="${k}">${esc(t)}</span>`).join(' ')}</div>`, a1, a2, these };
  }
  const ASK = { these: ['die These', 'Der erste Satz bezieht Stellung.'], b1: ['den Beleg zum ersten Argument', 'Das Beispiel direkt nach dem ersten Argument.'], a2: ['das zweite Argument', 'Es wird mit „Außerdem“ eingeleitet.'], schluss: ['die Schlussfolgerung', 'Am Ende wird die These mit „Deshalb …“ bekräftigt.'], b2: ['den Beleg zum zweiten Argument', 'Das Beispiel nach dem zweiten Argument.'] };
  const topic4 = {
    id: 4, emoji: '🏗️', color: '#10b981', title: 'Thesen belegen',
    goal: 'Ich kann Thesen belegen.',
    book: '',
    learn: [
      { title: 'Eine These stützen', html: `<p>Eine These allein überzeugt niemanden. Du <b>stützt</b> sie mit Argumenten und Belegen:</p>
        <ol class="steps"><li><b>These</b> nennen</li><li><b>Argument</b>: Begründung mit „weil …“ / „denn …“</li><li><b>Beleg</b>: Beispiel, Erfahrung, Zahl … („Zum Beispiel …“)</li><li>bei Bedarf <b>weiteres Argument</b> („Außerdem …“)</li><li><b>Schlussfolgerung</b>: These bekräftigen („Deshalb …“)</li></ol>` },
      { title: 'Starke und schwache Begründungen', html: `<div class="two-col"><div class="info-box"><b>stark ✅</b><p>begründet sachlich und mit Beleg</p>„Handys lenken ab, weil ständig Nachrichten ankommen. Wenn in der Mathestunde ein Handy vibriert, verlieren viele den Faden.“</div>
        <div class="info-box bad"><b>Scheinargumente ❌</b><p>begründen nichts</p>„Das ist einfach so.“ · „Das finden doch alle.“ · „Das war schon immer so.“ · „Mein Freund sagt das auch.“</div></div>` },
      { title: 'Ein ganzer Absatz', html: '<div class="baukasten" data-mode="absatz"></div>', widget: 'baukasten' },
    ],
    gens: [
      () => { const s = streit(); const p = paragraph(s, R.chance(0.5) ? 'P' : 'C'); const k = R.pick(Object.keys(ASK)); return { type: 'hotspot', prompt: `Tippe auf <b>${ASK[k][0]}</b>.`, svg: p.html, answer: k, answerLabel: ASK[k][0], explain: ASK[k][1] }; },
      () => { const s = streit(); const side = R.chance(0.5) ? 'P' : 'C'; const a = R.pick(s[side]); return mcFrom('Welche Begründung stützt die These am besten?', `${a[0]} ${a[1]}`, pickN(WEAK, 3), 'Nur diese Antwort begründet sachlich und nennt einen Beleg. Die anderen sind Scheinargumente.', { visual: `<div class="scenario statement">These: „${side === 'P' ? s.pro : s.contra}“</div>`, optionStyle: 'wide' }); },
      () => {
        const s = streit(); const a = R.pick(s.P); const missArg = R.chance(0.5);
        return mcFrom('Was fehlt in dieser Argumentation?', missArg ? 'das Argument (die Begründung)' : 'der Beleg (ein Beispiel)', [missArg ? 'der Beleg (ein Beispiel)' : 'das Argument (die Begründung)', 'die These', 'eine Frage an den Leser'],
          missArg ? 'Zwischen These und Beispiel fehlt die Begründung („weil …“).' : 'Das Argument wird nicht durch ein Beispiel gestützt.', { visual: scenario(missArg ? `${s.pro} ${a[1]}` : `${s.pro} ${a[0]}`) });
      },
      () => { const w = R.pick(WEAK); return mcFrom(`Warum ist „${w}“ kein gutes Argument?`, 'Es begründet nichts – es nennt keinen sachlichen Grund.', ['Es ist zu kurz.', 'Es enthält kein Fremdwort.', 'Es steht nicht im Konjunktiv.'], 'Ein Argument muss erklären, <b>warum</b> die These stimmt. Scheinargumente tun nur so.'); },
      () => {
        const s = streit(); const p = paragraph(s, 'P');
        return { type: 'order', prompt: 'Bringe den argumentativen Absatz in die richtige Reihenfolge.', items: [p.these, p.a1[0], p.a1[1], 'Deshalb bin ich überzeugt: ' + p.these], explain: 'These → Argument → Beleg → Schlussfolgerung.' };
      },
      () => {
        const s = streit(); const side = R.chance(0.5) ? 'P' : 'C'; const a = R.pick(s[side]);
        return { type: 'write', prompt: 'Belege die These mit <b>einem Argument</b> und <b>einem Beispiel</b>.', visual: `<div class="scenario statement">These: „${side === 'P' ? s.pro : s.contra}“</div>`, minWords: 15,
          criteria: ['Mein Argument begründet die These (weil / denn …).', 'Ich nenne ein konkretes Beispiel oder eine Erfahrung.', 'Argument und Beispiel passen zur These.', 'Ich verknüpfe die Sätze (zum Beispiel, außerdem, deshalb …).'],
          models: [`${a[0]} ${a[1].startsWith('Zum Beispiel') ? a[1] : 'Zum Beispiel: ' + a[1]}`], explain: 'These – Argument – Beleg: So überzeugst du.' };
      },
      () => { const s = streit(); const a = R.pick(s.P); return mcFrom('Mit welchem Wort leitest du am besten den Beleg ein?', 'Zum Beispiel', ['Obwohl', 'Trotzdem', 'Dagegen'], '„Zum Beispiel“ (oder „etwa“, „so“) leitet einen Beleg ein.', { visual: scenario(`${a[0]} <span class="gap">___</span> …`) }); },
    ],
  };

  // ---------- 5 · Thesen widerlegen ----------
  const REBUT_START = ['Zwar …, aber …', 'Dem kann man entgegenhalten, dass …', 'Das stimmt nur teilweise, denn …', 'Einige meinen …, doch …'];
  const NOT_REBUT = ['Außerdem …', 'Zum Beispiel …', 'Ein weiterer Grund ist …', 'Deshalb …', 'Erstens …'];
  const WID_TF = [
    ['Beim Widerlegen nimmt man das Gegenargument ernst und entkräftet es.', true, 'Man nennt das Gegenargument fair und zeigt dann, warum es nicht überzeugt.'],
    ['Eine gute Widerlegung beleidigt die Gegenseite.', false, 'Widerlegungen bleiben sachlich und höflich.'],
    ['„Zwar …, aber …“ ist eine typische Formulierung für eine Widerlegung.', true, 'Erst das Gegenargument einräumen, dann entkräften.'],
    ['Ein Gegenargument stützt die eigene These.', false, 'Ein Gegenargument spricht gegen die eigene These – deshalb widerlegt man es.'],
    ['Man kann ein Argument widerlegen, indem man zeigt, dass es nur teilweise stimmt.', true, 'Zum Beispiel: „Das stimmt nur teilweise, denn …“'],
    ['„Das ist Quatsch.“ ist eine gute Widerlegung.', false, 'Das ist keine Begründung – es entkräftet nichts.'],
  ];
  const topic5 = {
    id: 5, emoji: '🛡️', color: '#8b5cf6', title: 'Thesen widerlegen',
    goal: 'Ich kann Thesen und Argumente widerlegen.',
    book: '',
    learn: [
      { title: 'Was heißt widerlegen?', html: `<p>Wer überzeugen will, muss auch die <b>Gegenseite</b> kennen. Beim Widerlegen nimmst du ein <b>Gegenargument</b> auf und zeigst, warum es <b>nicht überzeugt</b>.</p>
        <ol class="steps"><li>Gegenargument <b>fair nennen</b> („Einige meinen, …“)</li><li>Gegenargument <b>entkräften</b> („Doch …“, „Das stimmt nur teilweise, denn …“)</li><li><b>eigene These</b> bekräftigen („Deshalb …“)</li></ol>` },
      { title: 'So kannst du entkräften', html: `<ul class="steps"><li><b>Es stimmt nicht</b> oder nur teilweise: „Das stimmt nur teilweise, denn …“</li><li><b>Es gibt eine Lösung</b> für das Problem: „Zwar …, aber dafür kann man …“</li><li><b>Es ist weniger wichtig</b>: „Zwar …, doch wichtiger ist …“</li></ul>
        <div class="law-box"><b>Gegenargument:</b> Im Notfall müssen Kinder ihre Eltern erreichen können.<br><b>Widerlegung:</b> Zwar müssen Kinder im Notfall erreichbar sein, aber dafür kann man jederzeit das Telefon im Sekretariat benutzen.</div>` },
      { title: 'Formulierungshilfen', html: `<div class="two-col"><div class="info-box"><b>Gegenargument nennen</b><p>Einige meinen, dass … · Man könnte einwenden, dass … · Zwar …</p></div><div class="info-box"><b>Entkräften</b><p>… aber … · Doch das überzeugt nicht, denn … · Dem kann man entgegenhalten, dass … · Das stimmt nur teilweise, denn …</p></div></div>
        <p class="tip">⚠️ Sachlich bleiben – keine Beleidigungen und keine Scheinargumente!</p>` },
    ],
    gens: [
      () => { const s = streit(); const side = R.chance(0.5) ? 'P' : 'C'; const opp = side === 'P' ? 'C' : 'P'; return mcFrom('Welches ist ein <b>Gegenargument</b> zu dieser These?', R.pick(s[opp])[0], pickN(s[side], 3).map((x) => x[0]), 'Ein Gegenargument spricht gegen die These. Die anderen Sätze stützen sie.', { visual: `<div class="scenario statement">These: „${side === 'P' ? s.pro : s.contra}“</div>`, optionStyle: 'wide' }); },
      () => mcFrom('Mit welcher Formulierung leitest du eine <b>Widerlegung</b> ein?', R.pick(REBUT_START), pickN(NOT_REBUT, 3), '„Zwar … aber“, „doch“, „Dem kann man entgegenhalten“ – damit räumst du ein und entkräftest dann.'),
      () => {
        const s = streit(); const side = R.chance(0.5) ? 'P' : 'C'; const a = R.pick(s[side]);
        return mcFrom('Welcher Satz <b>widerlegt</b> das Argument am besten?', a[2], ['Das ist doch Quatsch.', `Das stimmt. ${a[0]}`, R.pick(otherStreit(s).P)[2]], 'Eine gute Widerlegung greift das Argument auf und entkräftet es sachlich.', { visual: `<div class="scenario statement">Argument: „${a[0]}“</div>`, optionStyle: 'wide' });
      },
      () => {
        const s = streit(); const a = R.pick(s.C);
        return { type: 'order', prompt: 'Bringe die Widerlegung in eine sinnvolle Reihenfolge.', items: [`Einige meinen: ${a[0]}`, `Doch das überzeugt nicht. ${a[2]}`, `Deshalb bleibe ich dabei: ${s.pro}`], explain: 'Gegenargument nennen → entkräften → eigene These bekräftigen.' };
      },
      () => {
        const s = streit(); const side = R.chance(0.5) ? 'P' : 'C'; const a = R.pick(s[side]);
        return { type: 'write', prompt: `Du vertrittst die These „${side === 'P' ? s.contra : s.pro}“. <b>Widerlege</b> dieses Gegenargument.`, visual: `<div class="scenario statement">Gegenargument: „${a[0]}“</div>`, minWords: 12,
          criteria: ['Ich greife das Gegenargument fair auf.', 'Ich entkräfte es mit einer Begründung.', 'Ich nutze eine passende Formulierung (zwar … aber, doch …).', 'Ich bleibe sachlich und höflich.'],
          models: [a[2]], explain: 'Einräumen und entkräften – so wirkt deine Argumentation fair und überzeugend.' };
      },
      fromPool(WID_TF),
      () => { const s = streit(); const a = R.pick(s.C); return mcFrom('Wie wird das Gegenargument hier entkräftet?', a[2].startsWith('Zwar') ? 'Es wird eingeräumt und dann eingeschränkt („zwar … aber/doch“).' : a[2].startsWith('Dem kann') ? 'Ihm wird ein anderer Gesichtspunkt entgegengehalten.' : 'Es wird gezeigt, dass es nur teilweise stimmt.', ['Es wird einfach wiederholt.', 'Die Gegenseite wird beleidigt.', 'Es wird ein Beispiel für das Gegenargument gegeben.'], `„${a[2]}“`, { visual: `<div class="scenario">Gegenargument: „${a[0]}“<br>Widerlegung: „${a[2]}“</div>`, optionStyle: 'wide' }); },
    ],
  };

  // ---------- 6 · Richtig zitieren ----------
  const ALLQ = TEXTS.flatMap((t) => t.quotes.map((q) => ({ t, txt: q[0], ls: q[1], alt: q[2] })));
  const singleQ = ALLQ.filter((q) => q.ls.length === 1);
  const ZIT_TF = [
    ['Ein wörtliches Zitat steht in Anführungszeichen.', true, 'Im Deutschen: unten „ und oben “.'],
    ['Beim Zitieren darf man einzelne Wörter einfach austauschen.', false, 'Ein Zitat muss Wort für Wort stimmen. Änderungen kennzeichnet man mit eckigen Klammern.'],
    ['Hinter ein Zitat gehört eine Zeilenangabe.', true, 'Zum Beispiel (Z. 4) – so kann man die Stelle nachprüfen.'],
    ['„Z.“ steht für „Zeile“.', true, 'Z. 4 = Zeile 4.'],
    ['Erstreckt sich ein Zitat über zwei Zeilen, schreibt man „f.“ hinter die erste Zeilennummer.', true, '„f.“ heißt „folgende“: (Z. 4 f.) = Zeile 4 und 5.'],
    ['Steht das Zitat am Satzende, kommt der Punkt nach der Klammer mit der Zeilenangabe.', true, '… „wieder deutlich lauter“ (Z. 6).'],
    ['Wer etwas sinngemäß wiedergibt, setzt es in Anführungszeichen.', false, 'Anführungszeichen nur für wörtliche Zitate. Sinngemäßes kennzeichnet man mit „vgl.“: (vgl. Z. 8).'],
  ];
  const ZIT_MC = [
    ['Ein Zitat steht in den Zeilen 7 und 8. Welche Angabe ist richtig?', '(Z. 7 f.)', ['(Z. 7)', '(S. 7 f.)', '(7 Z. f.)'], '„f.“ = und die folgende Zeile.'],
    ['Ein Zitat reicht von Zeile 3 bis Zeile 6. Welche Angabe ist richtig?', '(Z. 3–6)', ['(Z. 3 f.)', '(Z. 6)', '(S. 3–6)'], 'Bei mehr als zwei Zeilen gibt man den Bereich an: (Z. 3–6).'],
    ['Wie sehen deutsche Anführungszeichen aus?', '„ unten am Anfang – oben am Ende “', ['« am Anfang – » am Ende', '“ oben am Anfang – „ unten am Ende', '\' am Anfang – \' am Ende'], 'Im Deutschen: „So sieht ein Zitat aus.“'],
    ['Was bedeutet „vgl.“ vor einer Zeilenangabe?', 'Die Stelle wird sinngemäß, nicht wörtlich wiedergegeben.', ['Die Stelle ist besonders wichtig.', 'Das Zitat ist falsch.', 'Es folgt eine Seitenzahl.'], '„vgl.“ = vergleiche. Man gibt den Inhalt mit eigenen Worten wieder.'],
    ['Wozu gibt man die Zeile eines Zitats an?', 'Damit jeder die Stelle im Text nachprüfen kann.', ['Damit das Zitat länger wird.', 'Weil man sonst Punkte abgezogen bekommt – sonst hat es keinen Sinn.', 'Damit man die Anführungszeichen weglassen kann.'], 'Zitate sind Belege – und Belege müssen überprüfbar sein.'],
  ];
  function quoteVariants(q, n) {
    const okLs = q.ls;
    const off = R.pick([-2, -1, 1, 2]);
    const wrongLine = okLs[0] + off >= 1 ? okLs.map((l) => l + off) : okLs.map((l) => l + 2);
    return [
      [`${q.txt} (${zeile(okLs)})`, 'Die Anführungszeichen fehlen.'],
      [cite(q.alt, okLs), 'Der Wortlaut wurde verändert – ein Zitat muss Wort für Wort stimmen.'],
      [cite(q.txt, wrongLine), 'Die Zeilenangabe stimmt nicht.'],
      [`„${q.txt}“`, 'Die Zeilenangabe fehlt.'],
    ].slice(0, n);
  }
  const topic6 = {
    id: 6, emoji: '❝', color: '#2563eb', title: 'Richtig zitieren',
    goal: 'Ich beherrsche die Zitiertechnik: wörtlich zitieren mit Zeilenangabe.',
    book: 'Buch S. 287 (Seitenzahl laut Hausaufgabenheft – bitte prüfen)',
    learn: [
      { title: 'Die drei Zitier-Regeln', html: `<ol class="steps"><li><b>Anführungszeichen</b>: „ am Anfang unten, “ am Ende oben.</li><li><b>Wort für Wort</b> abschreiben – nichts verändern.</li><li><b>Zeilenangabe</b> in Klammern dahinter: (Z. 6).</li></ol>
        <div class="law-box">Im Text heißt es, der Schulhof sei „wieder deutlich lauter und lebendiger“ (Z. 6).</div>` },
      { title: 'Zeilenangaben', html: `<table class="nice-table"><tr><td>eine Zeile</td><td><b>(Z. 6)</b></td></tr><tr><td>zwei Zeilen</td><td><b>(Z. 4 f.)</b> – „f.“ = und folgende</td></tr><tr><td>mehrere Zeilen</td><td><b>(Z. 3–6)</b></td></tr><tr><td>mit Seite</td><td><b>(S. 287, Z. 4)</b></td></tr><tr><td>sinngemäß</td><td><b>(vgl. Z. 8)</b> – ohne Anführungszeichen</td></tr></table>
        <p class="tip">💡 Der Satzpunkt steht <b>nach</b> der Klammer: … „lebendiger“ (Z. 6).</p>` },
      { title: 'Zitier-Werkstatt 🛠️', html: '<p>Tippe auf eine Textstelle – die App zeigt dir, wie man sie richtig zitiert.</p><div class="werkstatt"></div>', widget: 'werkstatt' },
    ],
    gens: [
      () => { const q = R.pick(ALLQ); const v = quoteVariants(q, 3); return mcFrom('Welches Zitat ist <b>korrekt</b>?', cite(q.txt, q.ls), v.map((x) => x[0]), `Richtig: ${cite(q.txt, q.ls)}. Fehler bei den anderen: ${v.map((x) => x[1]).join(' · ')}`, { visual: linedText(q.t), optionStyle: 'wide' }); },
      () => { const q = R.pick(singleQ); return { type: 'hotspot', prompt: `Aus welcher Zeile stammt das Zitat „${q.txt}“? Tippe auf die Zeile.`, svg: linedText(q.t, { hotspot: true }), answer: 'z' + q.ls[0], answerLabel: `Zeile ${q.ls[0]}`, explain: `Also: ${cite(q.txt, q.ls)}.` }; },
      () => { const q = R.pick(ALLQ); const [wrong, why] = R.pick(quoteVariants(q, 4)); return mcFrom('Was ist an diesem Zitat falsch?', why, ['Die Anführungszeichen fehlen.', 'Der Wortlaut wurde verändert – ein Zitat muss Wort für Wort stimmen.', 'Die Zeilenangabe stimmt nicht.', 'Die Zeilenangabe fehlt.'].filter((x) => x !== why), `Richtig wäre: ${cite(q.txt, q.ls)}.`, { visual: linedText(q.t) + `<div class="scenario statement">${esc(wrong)}</div>`, optionStyle: 'wide' }); },
      fromPool(ZIT_MC), fromPool(ZIT_TF),
      () => {
        const t = R.pick(TEXTS);
        const qs = R.shuffle(ALLQ.filter((x) => x.t === t)).slice(0, 4);
        const opts = qs.map((q, i) => (i < 2 ? cite(q.txt, q.ls) : R.pick(quoteVariants(q, 4))[0]));
        const sh = R.shuffle(opts.map((o, i) => [o, i < 2]));
        return { type: 'multi', prompt: `Welche Zitate aus Text ${t.id} sind <b>korrekt</b>?`, visual: linedText(t), options: sh.map((x) => x[0]), correct: sh.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), optionStyle: 'wide', explain: 'Korrekt heißt: Anführungszeichen, genauer Wortlaut und richtige Zeilenangabe.' };
      },
    ],
  };

  // ---------- 7 · Zitate kürzen, ergänzen, einbauen ----------
  const AUSL = [
    ['Viele Schülerinnen und Schüler hätten in den Pausen nur noch auf ihre Bildschirme gestarrt', 'in den Pausen ', 'Z. 4 f.', 'A'],
    ['Befürworter betonen, dass digitale Bücher den Schulranzen leichter machen und sich schnell aktualisieren lassen', 'den Schulranzen leichter machen und ', 'Z. 1–3', 'B'],
    ['Der Schülersprecher Malik kritisiert, dass die Schüler bei der Entscheidung nicht gefragt wurden', 'bei der Entscheidung ', 'Z. 7 f.', 'A'],
    ['Mit dem Tablet könne er Videos anhalten, Notizen ergänzen und Aufgaben sofort überprüfen', 'Notizen ergänzen und ', 'Z. 7 f.', 'B'],
    ['Zudem lenkten Benachrichtigungen und Spiele leicht vom eigentlichen Lernen ab', 'und Spiele ', 'Z. 5 f.', 'B'],
  ];
  function auslQ() {
    const [orig, cut, z] = R.pick(AUSL);
    const shortened = orig.replace(cut, '');
    const right = `„${orig.replace(cut, '[…] ')}“ (${z})`;
    return mcFrom('Du willst ein Stück weglassen. Welche Kürzung ist <b>richtig gekennzeichnet</b>?', right,
      [`„${orig.replace(cut, '(…) ')}“ (${z})`, `„${shortened}“ (${z})`, `„${orig.replace(cut, '… ')}“ (${z})`],
      `Auslassungen kennzeichnet man mit <b>eckigen Klammern und drei Punkten: […]</b>. Ausgelassen wurde: „${cut.trim()}“.`, { visual: scenario(`Original: „${orig}“ (${z})`), optionStyle: 'wide' });
  }
  const ERG = [
    ['„Wir hätten gerne mitgeredet“', '„Wir [die Schülerinnen und Schüler] hätten gerne mitgeredet“ (Z. 9)', 'die Schülerinnen und Schüler', 'Z. 9'],
    ['„Inzwischen sei der Schulhof wieder deutlich lauter und lebendiger“', '„Inzwischen sei der Schulhof [der Lindenschule] wieder deutlich lauter und lebendiger“ (Z. 6)', 'der Lindenschule', 'Z. 6'],
  ];
  const ZIZ = [
    ['Frau Berger erklärt, die Geräte seien „eine ständige Ablenkung“ gewesen', 'Z. 3', 'eine ständige Ablenkung'],
    ['Für ihn sei das „viel spannender als jedes dicke Buch“', 'Z. 8 f.', 'viel spannender als jedes dicke Buch'],
    ['Eine Elternvertreterin meint dagegen, die Kinder würden nun „endlich wieder richtig Pause machen“', 'Z. 11 f.', 'endlich wieder richtig Pause machen'],
  ];
  const EINBAU = [
    ['Malik kritisiert, dass die Schüler „bei der Entscheidung nicht gefragt“ (Z. 8) wurden.', ['Malik kritisiert, dass die Schüler „bei der Entscheidung nicht gefragt wurden“.', 'Malik kritisiert, dass die Schüler „bei der Entscheidung nicht befragt“ (Z. 8) wurden.', 'Malik kritisiert, dass die Schüler „bei der Entscheidung nicht gefragt“ (Z. 3) wurden.']],
    ['Laut Frau Berger ist der Schulhof inzwischen „wieder deutlich lauter und lebendiger“ (Z. 6).', ['Laut Frau Berger ist der Schulhof inzwischen „wieder deutlich lauter und lebendiger (Z. 6)“.', 'Laut Frau Berger ist der Schulhof inzwischen „wieder viel lauter und lebendiger“ (Z. 6).', 'Laut Frau Berger ist der Schulhof inzwischen wieder deutlich lauter und lebendiger (Z. 6).']],
    ['Ein Schüler meint, mit dem Tablet könne er „Notizen ergänzen und Aufgaben sofort überprüfen“ (Z. 8).', ['Ein Schüler meint, mit dem Tablet könne er „Notizen ergänzen und Aufgaben sofort überprüfen“ (S. 8).', 'Ein Schüler meint, mit dem Tablet könne er „Notizen ergänzen und Aufgaben sofort überprüfen“ (Z. 6).', 'Ein Schüler meint, mit dem Tablet könne er Notizen ergänzen und Aufgaben sofort überprüfen (Z. 8).']],
    ['Die Lehrerin berichtet, ihre Klasse lese „auf Papier aufmerksamer als am Bildschirm“ (Z. 4 f.).', ['Die Lehrerin berichtet, ihre Klasse lese „auf Papier aufmerksamer als am Bildschirm“ (Z. 2).', 'Die Lehrerin berichtet, ihre Klasse lese „auf Papier konzentrierter als am Bildschirm“ (Z. 4 f.).', 'Die Lehrerin berichtet, ihre Klasse lese auf Papier aufmerksamer als am Bildschirm (Z. 4 f.).']],
    ['Im Text heißt es: „Nicht alle sind mit der Regel zufrieden“ (Z. 7).', ['Im Text heißt es: Nicht alle sind mit der Regel zufrieden (Z. 7).', 'Im Text heißt es: „Nicht alle sind mit dem Verbot zufrieden“ (Z. 7).', 'Im Text heißt es: „Nicht alle sind mit der Regel zufrieden“ (Z. 9).']],
    ['Befürworter betonen, digitale Bücher würden „den Schulranzen leichter machen“ (Z. 2).', ['Befürworter betonen, digitale Bücher würden „den Schulranzen leichter machen“ (Z. 5).', 'Befürworter betonen, digitale Bücher würden den Schulranzen leichter machen (Z. 2).', 'Befürworter betonen, digitale Bücher würden „den Schulranzen leichter gestalten“ (Z. 2).']],
  ];
  const VGL = [
    ['Die Schulleiterin meint, die Handys hätten die Kinder zu sehr abgelenkt (vgl. Z. 2 f.).', ['Die Schulleiterin meint, „die Handys hätten die Kinder zu sehr abgelenkt“ (Z. 2 f.).', 'Die Schulleiterin meint, die Handys hätten die Kinder zu sehr abgelenkt.', 'Die Schulleiterin meint, die Handys hätten die Kinder zu sehr abgelenkt (Zitat Z. 2 f.).']],
    ['Malik ärgert sich, weil die Schüler nicht mitentscheiden durften (vgl. Z. 7 ff.).', ['Malik ärgert sich, „weil die Schüler nicht mitentscheiden durften“ (Z. 7 ff.).', 'Malik ärgert sich, weil die Schüler nicht mitentscheiden durften.', 'Malik ärgert sich, weil die Schüler nicht mitentscheiden durften (S. 7).']],
    ['Eine Lehrerin hat beobachtet, dass ihre Schüler auf Papier besser aufpassen (vgl. Z. 4 f.).', ['Eine Lehrerin hat beobachtet, „dass ihre Schüler auf Papier besser aufpassen“ (Z. 4 f.).', 'Eine Lehrerin hat beobachtet, dass ihre Schüler auf Papier besser aufpassen.', 'Eine Lehrerin hat beobachtet, dass ihre Schüler auf Papier besser aufpassen (vgl. Seite).']],
  ];
  const ORDER_CITE = [
    ['Malik kritisiert,', 'dass die Schüler', '„bei der Entscheidung nicht gefragt“', '(Z. 8)', 'wurden.'],
    ['Die Lehrerin berichtet,', 'ihre Klasse lese', '„auf Papier aufmerksamer als am Bildschirm“', '(Z. 4 f.).'],
    ['Ein Schüler meint,', 'mit dem Tablet könne er', '„Notizen ergänzen und Aufgaben sofort überprüfen“', '(Z. 8).'],
    ['Im Text heißt es,', 'der Schulhof sei', '„wieder deutlich lauter und lebendiger“', '(Z. 6).'],
  ];
  const topic7 = {
    id: 7, emoji: '✂️', color: '#0d9488', title: 'Zitate kürzen & einbauen',
    goal: 'Ich kann Zitate kürzen, ergänzen und in eigene Sätze einbauen.',
    book: 'Buch S. 287 (Seitenzahl laut Hausaufgabenheft – bitte prüfen)',
    learn: [
      { title: 'Zitate in Sätze einbauen', html: `<p>Drei Möglichkeiten:</p><ol class="steps"><li><b>Mit Doppelpunkt</b>: Malik sagt: „Wir hätten gerne mitgeredet“ (Z. 9).</li>
        <li><b>Im eigenen Satz</b>: Malik kritisiert, dass die Schüler „bei der Entscheidung nicht gefragt“ (Z. 8) wurden.</li>
        <li><b>Mit „laut“ / „so“</b>: Laut Frau Berger ist der Schulhof „wieder deutlich lauter und lebendiger“ (Z. 6).</li></ol>
        <p class="tip">💡 Dein Satz muss <b>grammatisch vollständig</b> sein – auch mit dem Zitat darin. Die Zeilenangabe steht direkt hinter dem Zitat.</p>` },
      { title: 'Kürzen und ergänzen: eckige Klammern', html: `<table class="nice-table"><tr><td>etwas <b>weglassen</b></td><td><b>[…]</b></td><td>„Viele Schülerinnen und Schüler hätten […] nur noch auf ihre Bildschirme gestarrt“ (Z. 4 f.)</td></tr>
        <tr><td>etwas <b>ergänzen</b> / erklären</td><td><b>[ ]</b></td><td>„Wir [die Schülerinnen und Schüler] hätten gerne mitgeredet“ (Z. 9)</td></tr></table>
        <p class="tip">⚠️ Runde Klammern ( ) und Punkte ohne Klammern … zählen nicht als korrekte Kennzeichnung.</p>` },
      { title: 'Zitat im Zitat & sinngemäß', html: `<p><b>Zitat im Zitat</b>: Steht im Originaltext schon ein Zitat, bekommt es <b>halbe Anführungszeichen ‚ ‘</b>:</p>
        <div class="law-box">„Frau Berger erklärt, die Geräte seien ‚eine ständige Ablenkung‘ gewesen“ (Z. 3).</div>
        <p><b>Sinngemäß</b> (mit eigenen Worten): <b>keine</b> Anführungszeichen, aber <b>(vgl. Z. …)</b>:</p><div class="law-box">Malik ärgert sich, weil die Schüler nicht mitentscheiden durften (vgl. Z. 7 ff.).</div>` },
    ],
    gens: [
      auslQ, auslQ,
      () => { const [orig, right, add, z] = R.pick(ERG); const plain = right.replace(' [' + add + ']', ' ' + add); return mcFrom(`Du möchtest im Zitat ${orig} (${z}) erklären, wer gemeint ist. Welche Lösung ist richtig?`, right, [right.replace('[', '(').replace(']', ')'), plain, right.replace('[', '{').replace(']', '}')], 'Eigene Ergänzungen im Zitat stehen in <b>eckigen Klammern [ ]</b>.', { optionStyle: 'wide' }); },
      () => { const [src, z, inner] = R.pick(ZIZ); const right = `„${src.replace(`„${inner}“`, `‚${inner}‘`)}“ (${z})`; return mcFrom('Im Original steht schon ein Zitat. Wie zitierst du die Stelle richtig?', right, [`„${src}“ (${z})`, `„${src.replace(`„${inner}“`, inner)}“ (${z})`, `„${src.replace(`„${inner}“`, `«${inner}»`)}“ (${z})`], 'Ein Zitat im Zitat bekommt halbe Anführungszeichen: ‚ … ‘.', { visual: scenario(`Original: ${src} (${z})`), optionStyle: 'wide' }); },
      () => { const [ok, wrong] = R.pick(EINBAU); return mcFrom('Welcher Satz baut das Zitat <b>korrekt</b> ein?', ok, wrong, `Richtig: ${ok} – Anführungszeichen, genauer Wortlaut und Zeilenangabe direkt hinter dem Zitat.`, { visual: linedText(/Tablet|Lehrerin|Befürworter/.test(ok) ? TEXTS[1] : TEXTS[0]), optionStyle: 'wide' }); },
      () => { const [ok, wrong] = R.pick(VGL); return mcFrom('Welche <b>sinngemäße</b> Wiedergabe ist richtig gekennzeichnet?', ok, wrong, 'Eigene Worte → keine Anführungszeichen, aber „vgl.“ mit Zeilenangabe.', { optionStyle: 'wide' }); },
      () => { const it = R.pick(ORDER_CITE); return { type: 'order', prompt: 'Baue den Satz mit Zitat richtig zusammen.', items: it, explain: `Richtig: ${it.join(' ')}` }; },
      () => {
        // nur Zitate, die ein ganzer Satz sind – dann ist „Im Text heißt es: …“ grammatisch vollständig
        const t = R.pick(TEXTS); const q = R.pick(t.quotes.filter((x) => /^[A-ZÄÖÜ]/.test(x[0])));
        return { type: 'write', prompt: `Zitiere die Stelle „${q[0]}“ und baue sie in einen <b>eigenen Satz</b> ein.`, visual: linedText(t), minWords: 8,
          criteria: ['Das Zitat steht in Anführungszeichen „…“.', 'Der Wortlaut stimmt genau.', 'Die Zeilenangabe stimmt: (' + zeile(q[1]) + ').', 'Mein Satz ist grammatisch vollständig.'],
          models: [`Im Text heißt es: ${cite(q[0], q[1])}.`, `Der Text stellt fest: ${cite(q[0], q[1])}.`], explain: 'Anführungszeichen, genauer Wortlaut, Zeilenangabe – und ein vollständiger eigener Satz.' };
      },
    ],
  };

  // ---------- 8 · Fit für die Deutscharbeit ----------
  const SUPPORT = [
    ['Das Handyverbot in den Pausen ist sinnvoll.', 0, 'wieder deutlich lauter und lebendiger', [6], ['auch sinnvoll nutzen', [10]], ['bei der Entscheidung nicht gefragt', [8]], ['Seit dem letzten Schuljahr gilt an der Lindenschule eine neue Regel', [1]]],
    ['Das Handyverbot hätte nicht ohne die Schüler beschlossen werden dürfen.', 0, 'bei der Entscheidung nicht gefragt', [8], ['wieder deutlich lauter und lebendiger', [6]], ['endlich wieder richtig Pause machen', [12]], ['In den Pausen bleiben die Handys im Schulranzen', [2]]],
    ['Tablets können das Lernen spannender machen.', 1, 'Notizen ergänzen und Aufgaben sofort überprüfen', [8], ['auf Papier aufmerksamer als am Bildschirm', [4, 5]], ['leicht vom eigentlichen Lernen ab', [6]], ['Immer mehr Schulen in Deutschland setzen auf Tablets', [1]]],
    ['Gedruckte Bücher sollten nicht ganz abgeschafft werden.', 1, 'auf Papier aufmerksamer als am Bildschirm', [4, 5], ['den Schulranzen leichter machen', [2]], ['Notizen ergänzen und Aufgaben sofort überprüfen', [8]], ['Immer mehr Schulen in Deutschland setzen auf Tablets', [1]]],
  ];
  const topic8 = {
    id: 8, emoji: '🏁', color: '#f97316', title: 'Fit für die Deutscharbeit',
    goal: 'Ich kann alles zusammen anwenden: Thesen erkennen, formulieren, belegen, widerlegen und mit Zitaten stützen.',
    book: 'Deutsch-Checkliste',
    learn: [
      { title: 'Deine Checkliste', html: `<ul class="steps"><li>✅ Feststellung und These unterscheiden (Kennzeichen)</li><li>✅ Selbst Thesen formulieren</li><li>✅ Thesen be- und widerlegen</li><li>✅ Zitiertechnik beherrschen</li></ul>
        <p class="tip">💡 Schätze dich in jedem Thema ehrlich ein – dann siehst du, was du noch üben musst.</p>` },
      { title: 'Ein Argument mit Textbeleg', html: `<p>In Klassenarbeiten sollst du oft <b>mit dem Text</b> argumentieren. Dann ist dein Beleg ein <b>Zitat</b>:</p>
        <div class="law-box"><b>These:</b> Das Handyverbot in den Pausen ist sinnvoll.<br><b>Argument:</b> Die Schülerinnen und Schüler bewegen sich und reden wieder mehr miteinander.<br><b>Beleg (Zitat):</b> Laut Text ist der Schulhof inzwischen „wieder deutlich lauter und lebendiger“ (Z. 6).</div>` },
      { title: 'So bereitest du dich vor', html: `<ol class="steps"><li>Jedes Thema dieser App einmal durcharbeiten.</li><li>Die <b>Deutscharbeit-Probe</b> auf der Startseite machen.</li><li>Schwache Themen wiederholen.</li><li>Zu einer Streitfrage einen ganzen Absatz schreiben: These – Argument – Beleg – Gegenargument – Widerlegung – Schluss.</li><li>Im Buch (S. 287) die Zitierregeln noch einmal nachlesen.</li></ol>` },
    ],
    gens: [
      () => {
        const [th, ti, ok, okLs, ...wr] = R.pick(SUPPORT);
        return mcFrom('Mit welchem Zitat kannst du diese These am besten <b>belegen</b>?', cite(ok, okLs), wr.map(([w, l]) => cite(w, l)), `${cite(ok, okLs)} stützt die These direkt. Die anderen sprechen dagegen oder sind neutral.`, { visual: linedText(TEXTS[ti]) + `<div class="scenario statement">These: „${th}“</div>`, optionStyle: 'wide' });
      },
      () => {
        const s = streit(); const a = R.pick(s.P); const g = R.pick(s.C);
        const parts = [['these', s.pro], ['arg', a[0]], ['beleg', a[1]], ['gegen', 'Einige meinen: ' + g[0]], ['wider', g[2]], ['schluss', 'Deshalb bleibe ich dabei: ' + s.pro]];
        const ask = R.pick([['gegen', 'das Gegenargument', 'Es wird mit „Einige meinen“ eingeleitet und spricht gegen die These.'], ['wider', 'die Widerlegung', 'Sie entkräftet das Gegenargument.'], ['beleg', 'den Beleg', 'Das konkrete Beispiel nach dem Argument.'], ['arg', 'das Argument', 'Die Begründung direkt nach der These.']]);
        return { type: 'hotspot', prompt: `Tippe auf <b>${ask[1]}</b>.`, svg: `<div class="text-hs">${parts.map(([k, t]) => `<span data-part="${k}">${esc(t)}</span>`).join(' ')}</div>`, answer: ask[0], answerLabel: ask[1], explain: ask[2] };
      },
      () => {
        const s = streit();
        return { type: 'write', prompt: 'Schreibe einen kurzen Absatz: <b>These – Argument – Beleg – Schlussfolgerung</b>.', visual: qBox(s), minWords: 25,
          criteria: ['Klare These am Anfang', 'Argument mit Begründung (weil/denn)', 'Konkreter Beleg (Beispiel, Erfahrung …)', 'Schlussfolgerung mit „Deshalb …“'],
          models: [`${s.pro} ${s.P[0][0]} ${s.P[0][1]} Deshalb bin ich überzeugt: ${s.pro}`, `${s.contra} ${s.C[0][0]} ${s.C[0][1]} Deshalb bin ich überzeugt: ${s.contra}`], explain: 'So ist ein argumentativer Absatz aufgebaut.' };
      },
    ],
  };
  // Thema 8 mischt außerdem Aufgaben aus allen anderen Themen
  [topic1, topic2, topic3, topic4, topic5, topic6, topic7].forEach((t) => topic8.gens.push(...t.gens.slice(0, 2)));

  const TOPICS = [topic1, topic2, topic3, topic4, topic5, topic6, topic7, topic8];

  // ---------- Interaktive Lern-Elemente ----------
  const S = () => root.Sound, FX = () => root.FX;
  const WIDGETS = {
    sorter(el) {
      const box = el.querySelector('.sorter');
      const round = () => {
        const s = R.pick(SENTENCES);
        box.innerHTML = `<div class="scenario statement">„${esc(s[0])}“</div><div class="row-btns" data-silent><button class="btn small ghost" data-a="F">Feststellung</button><button class="btn small ghost" data-a="T">These</button></div><div class="explore-info"></div>`;
        box.querySelectorAll('[data-a]').forEach((b) => b.addEventListener('click', () => {
          const ok = b.dataset.a === s[1];
          box.querySelector('.explore-info').innerHTML = `${ok ? '✅ <b>Richtig!</b>' : '❌ <b>Nicht ganz.</b>'} Das ist eine <b>${s[1] === 'F' ? 'Feststellung' : 'These'}</b>. ${s[2]}${s[3] ? ` <small>Kennzeichen: ${SIG[s[3]]}</small>` : ''}<div class="row-btns"><button class="btn small" data-n>🎲 Nächster Satz</button></div>`;
          S().play(ok ? 'correct' : 'wrong'); if (ok) FX().burstAt(b, 20); else FX().shake(b);
          box.querySelectorAll('[data-a]').forEach((x) => { x.disabled = true; });
          box.querySelector('[data-n]').addEventListener('click', () => { S().play('swoosh'); round(); });
        }));
      };
      round();
    },
    baukasten(el) {
      const box = el.querySelector('.baukasten');
      const absatz = box.dataset.mode === 'absatz';
      const show = () => {
        const s = streit(); const side = R.chance(0.5) ? 'P' : 'C'; const [a, b] = pickN(s[side], 2);
        const th = side === 'P' ? s.pro : s.contra;
        box.innerHTML = qBox(s) + `<div class="arg-chain"><div class="blk these"><small>These</small>${th}</div><div class="blk arg"><small>Argument</small>${a[0]}</div><div class="blk beleg"><small>Beleg</small>${a[1]}</div>` +
          (absatz ? `<div class="blk arg"><small>weiteres Argument</small>Außerdem gilt: ${b[0]}</div><div class="blk beleg"><small>Beleg</small>${b[1]}</div><div class="blk these"><small>Schlussfolgerung</small>Deshalb bin ich überzeugt: ${th}</div>` : '') +
          `</div><div class="row-btns" data-silent><button class="btn small" data-n>🎲 Neue Streitfrage</button></div>`;
        box.querySelector('[data-n]').addEventListener('click', () => { S().play('swoosh'); show(); });
        FX().pop(box);
      };
      show();
    },
    werkstatt(el) {
      const box = el.querySelector('.werkstatt');
      const t = TEXTS[0];
      box.innerHTML = `<div class="row-btns" data-silent>${t.quotes.slice(0, 6).map((q, i) => `<button class="btn small ghost" data-q="${i}">${esc(q[0].split(' ').slice(0, 4).join(' '))} …</button>`).join('')}</div>${linedText(t)}<div class="explore-info">👆 Wähle oben eine Textstelle.</div>`;
      box.querySelectorAll('[data-q]').forEach((b) => b.addEventListener('click', () => {
        const q = t.quotes[+b.dataset.q];
        box.querySelectorAll('.ln').forEach((ln, i) => ln.classList.toggle('hl-line', q[1].includes(i + 1)));
        box.querySelector('.explore-info').innerHTML = `<div class="cite-build"><span class="cb q">„</span><span class="cb w">${esc(q[0])}</span><span class="cb q">“</span> <span class="cb z">(${zeile(q[1])})</span></div>
          <small>① Anführungszeichen „ … “ ② Wort für Wort abgeschrieben ③ Zeilenangabe${q[1].length > 1 ? ' – zwei Zeilen: „f.“' : ''}</small>`;
        S().play('select'); FX().pop(box.querySelector('.explore-info'));
      }));
    },
  };

  // ---------- Glossar ----------
  const GLOSSAR = [
    ['Feststellung', 'Sachliche, überprüfbare Aussage, die nicht strittig ist und nicht begründet werden muss.'],
    ['These', 'Behauptung oder Standpunkt, über den man streiten kann. Muss begründet werden.'],
    ['Streitfrage', 'Frage, die man mit Ja oder Nein beantworten kann und über die man unterschiedlicher Meinung sein kann.'],
    ['Pro', 'Dafür – Argumente oder These für etwas.'], ['Contra', 'Dagegen – Argumente oder These gegen etwas.'],
    ['Argument', 'Begründung, die eine These stützt („weil …“, „denn …“).'],
    ['Beleg', 'Stützt ein Argument: Beispiel, Erfahrung, Zahl, Tatsache, Aussage einer Fachperson oder Zitat.'],
    ['Beispiel', 'Konkreter Fall, der ein Argument anschaulich macht.'],
    ['Gegenargument', 'Argument, das gegen die eigene These spricht.'],
    ['Widerlegung', 'Ein Gegenargument aufgreifen und entkräften („Zwar …, aber …“).'],
    ['Scheinargument', 'Begründung, die nur so tut, als ob: „Das ist einfach so.“, „Das machen alle.“'],
    ['Schlussfolgerung', 'Bekräftigt am Ende die These („Deshalb …“).'],
    ['Konnektor', 'Verknüpfungswort wie weil, denn, deshalb, außerdem, zwar … aber.'],
    ['Modalverb', 'sollen, müssen, dürfen, können, wollen, mögen – oft Zeichen einer Forderung.'],
    ['Wertung', 'Beurteilung mit Wörtern wie gut, schlecht, sinnvoll, überflüssig.'],
    ['Zitat', 'Wörtlich übernommene Textstelle in Anführungszeichen mit Zeilenangabe.'],
    ['Zeilenangabe', 'Gibt an, wo das Zitat steht: (Z. 4), (Z. 4 f.), (Z. 3–6).'],
    ['f. / ff.', '„folgende“: (Z. 4 f.) = Zeile 4 und 5; ff. = und mehrere folgende Zeilen.'],
    ['Auslassung […]', 'Kennzeichnet, dass im Zitat etwas weggelassen wurde.'],
    ['Ergänzung [ ]', 'Eigene Ergänzungen oder Erklärungen im Zitat stehen in eckigen Klammern.'],
    ['Zitat im Zitat', 'Ein Zitat innerhalb eines Zitats bekommt halbe Anführungszeichen: ‚…‘.'],
    ['vgl.', '„vergleiche“ – kennzeichnet eine sinngemäße (nicht wörtliche) Wiedergabe.'],
    ['Paraphrase', 'Wiedergabe einer Textstelle mit eigenen Worten (sinngemäß).'],
    ['Anführungszeichen', 'Im Deutschen „ unten am Anfang und “ oben am Ende.'],
  ];
  function glossaryPage(main) { root.Glossary.page(main, GLOSSAR, 'Alle Fachbegriffe zu Thesen, Argumenten und Zitaten.'); }

  // ---------- Fragen-Knöpfe für den Tutor ----------
  const FAQ = {
    1: [['Was ist der Unterschied zwischen Feststellung und These?', 'Eine Feststellung kann man überprüfen, sie ist nicht strittig. Eine These ist eine Behauptung, über die man streiten kann – deshalb muss man sie begründen.'],
      ['Woran erkenne ich eine These?', 'An Modalverben (sollte, müsste), Wertungen (gut, sinnvoll, überflüssig), Vergleichen (besser als), Meinungs-Signalen (ich finde) oder Verallgemeinerungen (alle, immer).'],
      ['Ist ein Satz mit einer Zahl immer eine Feststellung?', 'Nein! „Zwei Stunden Hausaufgaben sind zu viel“ enthält eine Zahl, ist aber wegen „zu viel“ eine These.']],
    2: [['Wie formuliere ich eine These?', 'Beantworte die Streitfrage mit einem Aussagesatz: „Sollten Hausaufgaben abgeschafft werden?“ → „Hausaufgaben sollten abgeschafft werden.“'],
      ['Was macht eine gute These aus?', 'Aussagesatz, klarer Standpunkt, strittig, passt zur Streitfrage, kurz und genau.'],
      ['Was ist der Unterschied zwischen Pro und Contra?', 'Pro = dafür, Contra = dagegen. Zu jeder Streitfrage kann man beides formulieren.']],
    3: [['Was ist ein Argument?', 'Die Begründung für deine These – meist mit „weil“ oder „denn“.'],
      ['Was ist ein Beleg?', 'Etwas Konkretes, das dein Argument stützt: ein Beispiel, eine Erfahrung, eine Zahl, eine Tatsache oder die Aussage einer Fachperson.'],
      ['Welche Verknüpfungswörter gibt es?', 'Begründen: weil, denn, da. Beispiel: zum Beispiel, etwa. Weiteres Argument: außerdem, zudem. Folgerung: deshalb, daher. Einwand: zwar … aber, doch.']],
    4: [['Wie belege ich eine These?', 'These nennen, Argument mit „weil“ anfügen, dann ein Beispiel geben („Zum Beispiel …“) und am Ende die These bekräftigen („Deshalb …“).'],
      ['Was ist ein Scheinargument?', 'Eine Begründung, die nichts begründet: „Das ist einfach so“, „Das machen alle“, „Das war schon immer so“.']],
    5: [['Wie widerlege ich ein Gegenargument?', 'Gegenargument fair nennen, dann entkräften: zeigen, dass es nicht oder nur teilweise stimmt, dass es eine Lösung gibt oder dass es weniger wichtig ist.'],
      ['Welche Formulierungen helfen beim Widerlegen?', '„Zwar …, aber …“, „Dem kann man entgegenhalten, dass …“, „Das stimmt nur teilweise, denn …“, „Einige meinen …, doch …“']],
    6: [['Wie zitiere ich richtig?', 'Anführungszeichen „…“, Wort für Wort abschreiben, Zeilenangabe dahinter: „…“ (Z. 6).'],
      ['Was bedeutet „Z. 4 f.“?', 'Zeile 4 und die folgende Zeile 5. Bei mehr Zeilen: (Z. 3–6).'],
      ['Wo steht der Punkt bei einem Zitat?', 'Am Satzende nach der Klammer mit der Zeilenangabe: … „lebendiger“ (Z. 6).']],
    7: [['Wie kürze ich ein Zitat?', 'Weggelassenes kennzeichnest du mit eckigen Klammern und drei Punkten: […].'],
      ['Wie baue ich ein Zitat in meinen Satz ein?', 'So, dass der Satz grammatisch vollständig ist: Malik kritisiert, dass die Schüler „bei der Entscheidung nicht gefragt“ (Z. 8) wurden.'],
      ['Was ist ein Zitat im Zitat?', 'Steht im Original schon ein Zitat, bekommt es halbe Anführungszeichen: ‚…‘.'],
      ['Was bedeutet „vgl.“?', 'Vergleiche – du gibst etwas mit eigenen Worten wieder. Dann keine Anführungszeichen, aber (vgl. Z. …).']],
    8: [['Wie baue ich einen argumentativen Absatz auf?', 'These – Argument – Beleg – (Gegenargument – Widerlegung) – Schlussfolgerung.'],
      ['Wie kann ich ein Zitat als Beleg nutzen?', 'Nenne dein Argument und stütze es mit einer passenden Textstelle: Laut Text ist der Schulhof „wieder deutlich lauter und lebendiger“ (Z. 6).'],
      ['Wie bereite ich mich auf die Deutscharbeit vor?', 'Alle Themen durcharbeiten, die Deutscharbeit-Probe machen, schwache Themen wiederholen und einen ganzen Absatz zu einer Streitfrage schreiben.']],
  };

  root.DeTopics = { list: TOPICS, widgets: WIDGETS, FAQ, glossaryPage, GLOSSAR, zeile, cite, _check: { AUSL, ERG, ZIZ, EINBAU, ORDER_CITE, SUPPORT } };
})(window);
