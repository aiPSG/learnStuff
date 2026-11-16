/*
 * ZellQuest – Inhalte und Aufgaben zur „Checkliste Klassenarbeit Bio 8a“ (Zellen, Mikroskop).
 */
(function (root) {
  'use strict';

  const R = root.Rand, C = root.Cells, P = C.PARTS, MP = C.MPARTS, esc = root.Visuals.esc;

  const ART = {
    zellwand: 'Die', zellmembran: 'Die', zellplasma: 'Das', zellkern: 'Der', mitochondrium: 'Die', chloroplast: 'Die', vakuole: 'Die',
    ribosomen: 'Die', bakterien_dna: 'Das', plasmid: 'Die', geissel: 'Die', pili: 'Die', kapsel: 'Die',
    okular: 'Das', tubus: 'Der', revolver: 'Der', objektiv: 'Das', objekttisch: 'Der', klemmen: 'Die', blende: 'Die', lampe: 'Die',
    grobtrieb: 'Der', feintrieb: 'Der', stativ: 'Das', fuss: 'Der',
  };
  const sentence = (key, src) => `${ART[key]} ${src[key].name} ${src[key].fn}.`;

  function mcFrom(prompt, correct, wrongs, explain, extra) {
    const opts = R.shuffle([correct].concat(wrongs));
    return Object.assign({ type: 'mc', prompt, options: opts, correct: opts.indexOf(correct), explain }, extra || {});
  }
  function tf(statement, truth, explain) {
    return { type: 'mc', prompt: 'Richtig oder falsch?', visual: `<div class="scenario statement">„${statement}“</div>`, options: ['✔ Richtig', '✘ Falsch'], correct: truth ? 0 : 1, explain: (truth ? '<b>Richtig.</b> ' : '<b>Falsch.</b> ') + explain, optionStyle: 'tf' };
  }
  const pickN = (arr, n) => R.shuffle(arr).slice(0, n);
  const fromPool = (pool) => () => { const x = R.pick(pool); return x.length === 3 ? tf(x[0], x[1], x[2]) : mcFrom(x[0], x[1], x[2], x[3]); };
  const scenario = (t) => `<div class="scenario">${t}</div>`;

  // ---------- Bausteine für mehrere Themen ----------
  const cellTypeOf = () => R.pick(C.ALL);
  const typeName = (t) => C.TYPES[t].name;

  function hotspotCell() {
    const type = cellTypeOf();
    const part = R.pick(C.partsOf(type));
    return { type: 'hotspot', prompt: `Tippe in der <b>${typeName(type)}</b> auf: <b>${P[part].name}</b>`, svg: C.draw(type), answer: part, answerLabel: P[part].name, explain: sentence(part, P) + ' ' + P[part].more };
  }
  function markedCell() {
    const type = cellTypeOf();
    const parts = C.partsOf(type);
    const part = R.pick(parts);
    const wrong = pickN(parts.filter((p) => p !== part), 3).map((p) => P[p].name);
    return mcFrom(`Wie heißt der markierte Bestandteil ${C.TYPES[type].dat}?`, P[part].name, wrong, sentence(part, P), { visual: C.draw(type, { mark: part }) });
  }
  function hotspotMicro() {
    const part = R.pick(Object.keys(MP));
    return { type: 'hotspot', prompt: `Tippe auf: <b>${MP[part].name}</b>`, svg: C.draw('mikroskop'), answer: part, answerLabel: MP[part].name, explain: sentence(part, MP) };
  }
  function markedMicro() {
    const keys = Object.keys(MP);
    const part = R.pick(keys);
    return mcFrom('Wie heißt das markierte Teil des Mikroskops?', MP[part].name, pickN(keys.filter((k) => k !== part), 3).map((k) => MP[k].name), sentence(part, MP), { visual: C.draw('mikroskop', { mark: part }) });
  }
  function fnToPart(src, label) {
    return () => {
      const keys = Object.keys(src);
      const part = R.pick(keys);
      const art = ART[part];
      return mcFrom(`Welcher ${label} ist gemeint?`, src[part].name, pickN(keys.filter((k) => k !== part), 3).map((k) => src[k].name),
        sentence(part, src), { visual: scenario(`„${art} ___ ${src[part].fn}.“`) });
    };
  }
  function partToFn(src) {
    return () => {
      const keys = Object.keys(src);
      const part = R.pick(keys);
      const cap = (s) => '… ' + s;
      return mcFrom(`Welche Aufgabe passt zu: <b>${src[part].name}</b>?`,
        cap(src[part].fn), pickN(keys.filter((k) => k !== part), 3).map((k) => cap(src[k].fn)), sentence(part, src), { optionStyle: 'wide' });
    };
  }

  // ---------- Detektiv: Zelltyp erkennen ----------
  const REASONS = {
    pflanze: 'Sie hat eine <b>Zellwand</b>, eine große <b>Vakuole</b> und (in grünen Teilen) <b>Chloroplasten</b> – das gibt es nur bei Pflanzenzellen. Einen Zellkern hat sie auch.',
    tier: 'Sie hat einen <b>Zellkern</b>, aber <b>keine Zellwand</b>, keine Chloroplasten und keine große Vakuole. Die Form ist rundlich-unregelmäßig.',
    bakterie: 'Sie hat <b>keinen Zellkern</b> – die ringförmige DNA liegt frei im Zellplasma. Dazu kommen typische Teile wie Geißel und Plasmide. Bakterien sind viel kleiner.',
  };
  function diagramType() {
    const type = cellTypeOf();
    const omit = type === 'pflanze' && R.chance(0.4) ? ['chloroplast'] : type === 'bakterie' && R.chance(0.3) ? ['geissel', 'kapsel', 'pili'] : [];
    const note = omit.includes('chloroplast') ? ' <i>Achtung: Auch ohne Chloroplasten (z. B. Zwiebelhaut oder Wurzel) ist es eine Pflanzenzelle!</i>' : '';
    const opts = C.ALL.map(typeName);
    return { type: 'mc', prompt: 'Um welchen Zelltyp handelt es sich?', visual: C.draw(type, { omit, title: 'Unbekannte Zelle' }), options: opts, correct: C.ALL.indexOf(type), explain: `Es ist eine <b>${typeName(type)}</b>. ` + REASONS[type] + note };
  }
  const SCENARIOS = [
    ['Zellen aus einem <b>Moosblättchen</b>: eckige Zellen mit fester Wand, vielen grünen Körnchen und je einem Zellkern.', 'pflanze', 'Feste Wand und grüne Körnchen (Chloroplasten) → Pflanzenzelle.'],
    ['Zellen der <b>Mundschleimhaut</b>: rundlich-unregelmäßige Zellen mit Zellkern, ohne Zellwand und ohne grüne Körnchen.', 'tier', 'Zellkern, aber keine Zellwand und keine Chloroplasten → Tierzelle (der Mensch gehört biologisch zu den Tieren).'],
    ['Zellen aus <b>Joghurt</b>: winzige Stäbchen, viel kleiner als andere Zellen, kein Zellkern zu erkennen.', 'bakterie', 'Sehr klein und ohne Zellkern → Bakterien (Milchsäurebakterien).'],
    ['Zellen der <b>Zwiebelhaut</b>: lang gestreckte, eckige Zellen mit dicker Wand, großer Vakuole und Zellkern – aber ohne Chloroplasten.', 'pflanze', 'Zellwand und große Vakuole → Pflanzenzelle. Chloroplasten fehlen nur, weil die Zwiebel unter der Erde kein Licht bekommt.'],
    ['Zellen der <b>Wasserpest</b> (Wasserpflanze): rechteckige Zellen mit Zellwand und vielen grünen Körnchen, die sich langsam im Plasma bewegen.', 'pflanze', 'Zellwand und Chloroplasten → Pflanzenzelle.'],
    ['Eine einzelne, sehr kleine Zelle aus einem Tümpel mit <b>Geißel</b> und ringförmiger DNA, aber <b>ohne Zellkern</b>.', 'bakterie', 'Kein Zellkern, ringförmige DNA → Bakterium.'],
    ['Zellen aus einem <b>Muskel</b>: keine Zellwand, keine Chloroplasten, Zellkerne und sehr viele Mitochondrien.', 'tier', 'Keine Zellwand, keine Chloroplasten, aber Zellkerne → Tierzelle. Viele Mitochondrien, weil Muskeln viel Energie brauchen.'],
  ];
  const WHY = [
    ['Woran erkennst du <b>sicher</b>, dass es eine Pflanzenzelle und keine Tierzelle ist?', 'An der Zellwand (und an Chloroplasten oder der großen Vakuole)', ['Am Zellkern', 'An der Zellmembran', 'Am Zellplasma'], 'Zellkern, Zellmembran und Zellplasma haben beide Zelltypen. Nur Pflanzenzellen haben Zellwand, große Vakuole und Chloroplasten.'],
    ['Woran erkennst du, dass es eine Bakterienzelle und keine Tierzelle ist?', 'Sie hat keinen Zellkern – die DNA liegt frei im Zellplasma', ['Sie hat eine Zellmembran', 'Sie hat Ribosomen', 'Sie enthält Zellplasma'], 'Membran, Ribosomen und Plasma haben alle Zellen. Der fehlende Zellkern ist das Erkennungszeichen der Bakterien.'],
    ['Woran erkennst du, dass es eine Tierzelle und keine Pflanzenzelle ist?', 'Sie hat keine Zellwand, keine Chloroplasten und keine große Vakuole', ['Sie hat einen Zellkern', 'Sie hat Mitochondrien', 'Sie hat eine Zellmembran'], 'Zellkern, Mitochondrien und Zellmembran haben Tier- und Pflanzenzellen. Es kommt darauf an, was der Tierzelle fehlt.'],
    ['Eine Zelle hat einen Zellkern, aber keine Chloroplasten. Was kannst du sicher sagen?', 'Es ist kein Bakterium – ob Tier- oder Pflanzenzelle, musst du an der Zellwand prüfen', ['Es ist sicher eine Tierzelle', 'Es ist sicher eine Pflanzenzelle', 'Es ist sicher ein Bakterium'], 'Zellkern → kein Bakterium. Fehlende Chloroplasten beweisen nichts (Zwiebelhaut!). Entscheidend ist die Zellwand.'],
  ];

  // ---------- Mikroskopieren ----------
  const MICRO_STEPS = [
    'Mikroskop am Stativ tragen, auf den Tisch stellen und Licht einschalten',
    'Mit dem Revolver das kleinste Objektiv einstellen',
    'Präparat auf den Objekttisch legen und mit den Klemmen festmachen',
    'Von der Seite schauen und mit dem Grobtrieb Objektiv und Präparat nah zusammenbringen',
    'Durchs Okular schauen und den Abstand langsam vergrößern, bis das Bild scharf ist',
    'Mit dem Feintrieb nachschärfen und die Blende einstellen',
    'Für mehr Vergrößerung das nächste Objektiv eindrehen und nur noch den Feintrieb benutzen',
  ];
  const WET_STEPS = [
    'Einen Tropfen Wasser in die Mitte eines sauberen Objektträgers geben',
    'Ein dünnes Stück (z. B. Zwiebelhäutchen) mit der Pinzette abziehen und in den Tropfen legen',
    'Das Deckglas schräg am Tropfenrand ansetzen und langsam absenken',
    'Überschüssiges Wasser am Rand mit Filterpapier absaugen',
    'Präparat unter dem Mikroskop betrachten – mit dem kleinsten Objektiv beginnen',
  ];
  function orderQ(prompt, steps, n, explain) {
    let start = 0, items = steps;
    if (steps.length > n) { start = R.int(0, steps.length - n); items = steps.slice(start, start + n); }
    return { type: 'order', prompt, items, explain };
  }
  const MICRO_RULES = [
    ['Warum schaut man von der Seite, während man Objektiv und Präparat mit dem Grobtrieb annähert?', 'Damit das Objektiv das Deckglas nicht berührt und zerdrückt', ['Damit mehr Licht ins Auge fällt', 'Damit das Bild bunter wird', 'Weil das Okular noch zu heiß ist'], 'Durch das Okular sieht man den Abstand nicht. Stößt das Objektiv an, können Deckglas und Linse kaputtgehen.'],
    ['Mit welchem Objektiv beginnt man immer?', 'Mit dem Objektiv mit der kleinsten Vergrößerung', ['Mit dem Objektiv mit der größten Vergrößerung', 'Mit dem mittleren Objektiv', 'Das ist egal'], 'Mit kleiner Vergrößerung sieht man einen großen Ausschnitt und findet das Objekt leichter.'],
    ['Was darf man bei der größten Vergrößerung NICHT mehr benutzen?', 'Den Grobtrieb', ['Den Feintrieb', 'Die Blende', 'Die Lichtquelle'], 'Bei großer Vergrößerung ist das Objektiv sehr nah am Präparat. Mit dem Grobtrieb würde man es schnell zerdrücken.'],
    ['Warum setzt man das Deckglas schräg auf?', 'Damit keine Luftblasen entstehen', ['Damit es schneller trocknet', 'Damit das Präparat bunter wird', 'Damit es nicht wegrutscht'], 'Senkt man das Deckglas langsam von einer Seite ab, wird die Luft herausgedrückt.'],
    ['Wie trägt man ein Mikroskop richtig?', 'Mit einer Hand am Stativ und der anderen unter dem Fuß', ['Am Tubus festhalten', 'Am Okular hochheben', 'Am Objekttisch anfassen'], 'So kann es nicht herunterfallen, und man berührt keine empfindlichen Teile.'],
    ['Das Bild ist zu dunkel. Was hilft?', 'Die Blende weiter öffnen oder die Lampe heller stellen', ['Den Grobtrieb schnell drehen', 'Ein größeres Objektiv eindrehen', 'Das Deckglas entfernen'], 'Die Blende regelt, wie viel Licht durch das Präparat fällt.'],
    ['Wozu färbt man ein Präparat, z. B. mit Methylenblau?', 'Damit Zellbestandteile wie der Zellkern besser sichtbar werden', ['Damit die Zellen wachsen', 'Damit das Präparat nicht austrocknet', 'Damit Bakterien abgetötet werden'], 'Viele Zellbestandteile sind fast durchsichtig. Farbstoffe machen sie sichtbar.'],
    ['Du hast bei 100-facher Vergrößerung scharf gestellt und drehst auf das 40er-Objektiv. Womit stellst du jetzt scharf?', 'Nur mit dem Feintrieb', ['Mit dem Grobtrieb', 'Mit der Blende', 'Mit dem Revolver'], 'Bei großer Vergrößerung nur noch den Feintrieb benutzen!'],
  ];

  // ---------- Was ist eine Zelle? ----------
  const CELL_TF = [
    ['Alle Lebewesen bestehen aus einer oder mehreren Zellen.', true, 'Die Zelle ist der Grundbaustein aller Lebewesen.'],
    ['Pflanzen bestehen nicht aus Zellen.', false, 'Auch Pflanzen bestehen aus Zellen – sogar aus besonders gut sichtbaren.'],
    ['Ein Bakterium ist ein Einzeller.', true, 'Ein Bakterium besteht aus nur einer Zelle.'],
    ['Der Mensch ist ein Einzeller.', false, 'Der Mensch ist ein Vielzeller mit vielen Billionen Zellen.'],
    ['Neue Zellen entstehen durch Teilung aus Zellen, die es schon gibt.', true, 'Zellen entstehen nur aus Zellen – durch Zellteilung.'],
    ['Die meisten Zellen kann man mit bloßem Auge gut erkennen.', false, 'Die meisten Zellen sind nur wenige Mikrometer groß. Man braucht ein Mikroskop.'],
    ['Auch eine einzelne Zelle hat einen Stoffwechsel.', true, 'Jede Zelle nimmt Stoffe auf, wandelt sie um und gibt Stoffe ab – sie zeigt die Kennzeichen des Lebens.'],
    ['Robert Hooke gab den Zellen ihren Namen, als er Kork unter dem Mikroskop betrachtete.', true, 'Hooke sah 1665 kleine Kammern im Kork und nannte sie „cells“ (Kämmerchen).'],
  ];
  const UNI = ['Bakterium', 'Pantoffeltierchen', 'Amöbe', 'Hefepilz'];
  const MULTI = ['Regenwurm', 'Löwenzahn', 'Mensch', 'Ameise', 'Moos', 'Fliegenpilz'];

  // ---------- Bakterien ----------
  const BACT_TF = [
    ['Bakterien haben einen Zellkern.', false, 'Bakterien haben keinen Zellkern. Ihre DNA liegt frei im Zellplasma.'],
    ['Die Erbinformation der Bakterien liegt frei im Zellplasma.', true, 'Das ringförmige Bakterienchromosom ist nicht von einer Kernhülle umgeben.'],
    ['Bakterien besitzen Mitochondrien.', false, 'Bakterien haben keine Mitochondrien und keine Chloroplasten.'],
    ['Bakterien und Pflanzenzellen haben beide eine Zellwand.', true, 'Ja – aber aus unterschiedlichen Stoffen (Murein bzw. Cellulose).'],
    ['Pflanzen-, Tier- und Bakterienzellen haben alle eine Zellmembran.', true, 'Zellmembran, Zellplasma, Ribosomen und DNA haben alle Zellen.'],
    ['Bakterienzellen sind meist viel größer als Tierzellen.', false, 'Bakterien sind meist nur 1–5 µm groß, Tierzellen etwa 10–30 µm – also rund zehnmal größer.'],
    ['Alle Zellen besitzen Ribosomen.', true, 'Ribosomen stellen Eiweiße her – das braucht jede Zelle.'],
    ['Bakterien gehören zu den Eukaryoten.', false, 'Bakterien sind Prokaryoten (ohne Zellkern). Tiere und Pflanzen sind Eukaryoten (mit Zellkern).'],
    ['Plasmide sind kleine DNA-Ringe, die bei Bakterien vorkommen.', true, 'Sie tragen zusätzliche Erbinformation, z. B. für Antibiotika-Resistenz.'],
  ];
  const BACT_MC = [
    ['Was bedeutet „Prokaryot“?', 'Lebewesen, dessen Zellen keinen Zellkern haben', ['Lebewesen mit besonders großem Zellkern', 'Lebewesen, das Fotosynthese betreibt', 'Lebewesen aus vielen Zellen'], '„pro“ = vor, „karyon“ = Kern: Die Zellen haben (noch) keinen echten Zellkern. Bakterien sind Prokaryoten.'],
    ['Zu welcher Gruppe gehören Pflanzen und Tiere?', 'Eukaryoten', ['Prokaryoten', 'Bakterien', 'Einzeller'], '„eu“ = echt: Ihre Zellen haben einen echten Zellkern.'],
    ['Welchen Zellbestandteil gibt es von den drei Zelltypen nur bei Bakterien?', 'Plasmide', ['Zellmembran', 'Ribosomen', 'Zellkern'], 'Membran und Ribosomen haben alle Zellen, den Zellkern nur Tier- und Pflanzenzellen.'],
    ['Wo liegt die Erbinformation einer Bakterienzelle?', 'Frei im Zellplasma als ringförmiges Bakterienchromosom', ['Im Zellkern', 'In den Mitochondrien', 'In der Vakuole'], 'Bakterien haben keinen Zellkern.'],
  ];

  // ---------- Anwenden & Rechnen ----------
  const APPLY = [
    ['Warum haben Zellen aus der Wurzel keine Chloroplasten?', 'In der Erde ist es dunkel – ohne Licht keine Fotosynthese', ['Wurzelzellen sind Tierzellen', 'Chloroplasten würden die Wurzel verstopfen', 'Wurzeln bestehen nicht aus Zellen'], 'Chloroplasten braucht man nur dort, wo Licht ankommt – in Blättern und grünen Stängeln.'],
    ['Muskelzellen enthalten besonders viele Mitochondrien. Warum?', 'Muskeln brauchen viel Energie', ['Muskeln brauchen viel Licht', 'Muskeln müssen viel Erbinformation speichern', 'Mitochondrien machen Muskeln hart'], 'Mitochondrien gewinnen durch Zellatmung Energie – und Muskeln verbrauchen viel davon.'],
    ['Eine Pflanze welkt, wenn sie nicht gegossen wird. Welcher Zellbestandteil verliert dabei vor allem Wasser?', 'Die Vakuole', ['Der Zellkern', 'Die Mitochondrien', 'Die Zellwand'], 'Die Vakuole speichert Zellsaft. Ist sie prall gefüllt, sind die Zellen stabil – sonst welkt die Pflanze.'],
    ['Warum können Tierzellen ihre Form leichter verändern als Pflanzenzellen?', 'Sie haben keine feste Zellwand', ['Sie haben keinen Zellkern', 'Sie haben mehr Chloroplasten', 'Sie sind immer kleiner'], 'Die feste Zellwand hält Pflanzenzellen in Form. Tierzellen sind nur von der biegsamen Zellmembran umgeben.'],
    ['Manche Antibiotika töten Bakterien, indem sie den Aufbau der Bakterien-Zellwand stören. Warum schaden sie unseren Körperzellen dabei nicht?', 'Unsere Zellen haben keine Zellwand', ['Unsere Zellen haben keine Zellmembran', 'Unsere Zellen haben keine Ribosomen', 'Unsere Zellen sind zu groß'], 'Menschliche Zellen sind Tierzellen – ohne Zellwand. Was die Zellwand angreift, trifft nur die Bakterien.'],
    ['Warum ist die Zwiebelhaut ein gutes Präparat, um Zellen zu sehen?', 'Sie ist sehr dünn, durchsichtig und die Zellen sind groß', ['Sie enthält besonders viele Chloroplasten', 'Sie besteht aus Bakterien', 'Sie leuchtet von selbst'], 'Dünne, durchsichtige Schichten lässt das Licht gut durch – nur so sieht man im Lichtmikroskop etwas.'],
  ];
  function sizeCalc() {
    const real = R.pick([5, 10, 20, 25, 40, 50, 60, 80]);
    const V = R.pick([100, 200, 400, 1000].filter((v) => real * v / 1000 >= 1 && real * v / 1000 <= 80));
    const img = real * V / 1000;
    return {
      type: 'num', prompt: `Eine Zelle ist auf einem Mikroskop-Foto bei <b>${V}-facher</b> Vergrößerung <b>${String(img).replace('.', ',')} mm</b> groß. Wie groß ist sie in Wirklichkeit – in <b>µm</b>?`,
      visual: scenario('Tipp: wirkliche Größe = Größe im Bild : Vergrößerung. Und 1 mm = 1000 µm.'), answer: real,
      explain: `${String(img).replace('.', ',')} mm : ${V} = ${String(img / V).replace('.', ',')} mm = <b>${real} µm</b>.`,
    };
  }
  function magnification() {
    const ok = R.pick([5, 10, 15]), ob = R.pick([4, 10, 40, 100]);
    if (R.chance(0.7)) {
      return { type: 'num', prompt: `Okular: <b>${ok}×</b>, Objektiv: <b>${ob}×</b>. Wie groß ist die Gesamtvergrößerung?`, answer: ok * ob, explain: `Gesamtvergrößerung = Okular × Objektiv = ${ok} × ${ob} = <b>${ok * ob}-fach</b>.` };
    }
    return { type: 'num', prompt: `Die Gesamtvergrößerung ist <b>${ok * ob}-fach</b>, das Okular vergrößert <b>${ok}-fach</b>. Wie stark vergrößert das Objektiv?`, answer: ob, explain: `${ok * ob} : ${ok} = <b>${ob}</b>. Das Objektiv vergrößert ${ob}-fach.` };
  }

  // ---------- Themen ----------
  const topic1 = {
    id: 1, emoji: '🧫', color: '#10b981', title: 'Was ist eine Zelle?',
    goal: 'Ich kann erklären, was eine Zelle ist.',
    book: 'Bio-Heft/Mappe, Its learning > Plan „Klassenarbeit-Vorbereitung“ > „PPP – Zellen-Einführung“',
    learn: [
      { title: 'Der Grundbaustein des Lebens', html: `<p>Die <b>Zelle</b> ist die <b>kleinste lebende Einheit</b>. Alle Lebewesen bestehen aus Zellen – Pflanzen, Tiere, Pilze, Bakterien und auch du.</p>
        <div class="two-col"><div class="info-box"><b>Einzeller</b><p>bestehen aus nur einer Zelle.</p>z. B. Bakterien, Pantoffeltierchen, Amöbe, Hefepilz</div>
        <div class="info-box"><b>Vielzeller</b><p>bestehen aus vielen Zellen, die sich die Arbeit teilen.</p>z. B. Mensch (viele Billionen Zellen!), Regenwurm, Löwenzahn</div></div>` },
      { title: 'Eine Zelle lebt!', html: `<p>Schon eine einzelne Zelle zeigt alle <b>Kennzeichen des Lebens</b>:</p>
        <ul class="steps"><li><b>Stoffwechsel</b> – nimmt Stoffe auf, wandelt sie um, gibt Stoffe ab</li><li><b>Wachstum</b> – wird größer</li><li><b>Fortpflanzung</b> – teilt sich (Zellteilung)</li><li><b>Reizbarkeit</b> – reagiert auf die Umwelt</li><li><b>Bewegung</b> – z. B. mit einer Geißel oder durch Plasmaströmung</li></ul>
        <p class="tip">💡 Zellen entstehen nur aus Zellen – durch Teilung.</p>` },
      { title: 'Wie klein ist eine Zelle?', html: `<p>Zellen misst man in <b>Mikrometern (µm)</b>: <b>1 mm = 1000 µm</b>. Mit bloßem Auge erkennst du Dinge ab etwa 0,1 mm (100 µm).</p>
        <div class="size-scale">
          <div><span style="width:3%"></span>Bakterium · ca. 2 µm</div>
          <div><span style="width:20%"></span>Mundschleimhautzelle · ca. 60 µm</div>
          <div><span style="width:33%"></span>Haar (Dicke) · ca. 70–100 µm</div>
          <div><span style="width:100%"></span>Zwiebelhautzelle · ca. 300 µm lang</div>
        </div><p class="tip">Deshalb brauchen wir ein <b>Mikroskop</b>, um Zellen zu sehen.</p>` },
      { title: 'Wie die Zelle zu ihrem Namen kam', html: `<p><b>1665</b> betrachtete der Engländer <b>Robert Hooke</b> eine dünne Scheibe <b>Kork</b> unter seinem Mikroskop. Er sah viele kleine Kämmerchen und nannte sie <b>„cells“</b> (Zellen).</p>
        <p>Später fanden Forscher heraus: <b>Alle Lebewesen bestehen aus Zellen</b>, und <b>jede Zelle entsteht aus einer Zelle</b>. Das nennt man die <b>Zelltheorie</b>.</p>` },
    ],
    gens: [
      () => mcFrom('Was ist eine Zelle?', 'Die kleinste lebende Einheit, aus der alle Lebewesen bestehen', ['Ein Bestandteil, den nur Tiere haben', 'Ein winziges Organ im Körper', 'Ein Molekül der Erbinformation'], 'Die Zelle ist der Grundbaustein aller Lebewesen und selbst schon lebendig.', { optionStyle: 'wide' }),
      fromPool(CELL_TF), fromPool(CELL_TF),
      () => R.chance(0.5)
        ? mcFrom('Welches Lebewesen ist ein <b>Einzeller</b>?', R.pick(UNI), pickN(MULTI, 3), 'Einzeller bestehen aus nur einer Zelle – z. B. Bakterien, Pantoffeltierchen, Amöben und Hefepilze.')
        : mcFrom('Welches Lebewesen ist ein <b>Vielzeller</b>?', R.pick(MULTI), pickN(UNI, 3), 'Vielzeller bestehen aus vielen Zellen, die unterschiedliche Aufgaben übernehmen.'),
      () => mcFrom('Welches ist <b>kein</b> Kennzeichen des Lebens?', R.pick(['Durchsichtigkeit', 'Härte', 'Glanz']), pickN(['Stoffwechsel', 'Wachstum', 'Fortpflanzung', 'Reizbarkeit', 'Bewegung'], 3), 'Kennzeichen des Lebens: Stoffwechsel, Wachstum, Fortpflanzung, Reizbarkeit und Bewegung.'),
      () => ({ type: 'num', prompt: 'Wie viele Mikrometer (µm) sind <b>1 mm</b>?', answer: 1000, explain: '1 mm = 1000 µm. Ein Mikrometer ist der tausendste Teil eines Millimeters.' }),
      () => ({ type: 'order', prompt: 'Ordne nach der Größe – vom <b>kleinsten</b> zum <b>größten</b>.', items: ['Bakterium', 'Mundschleimhautzelle', 'Zwiebelhautzelle', 'Hühnerei-Dotter (eine einzige Zelle!)'], explain: 'Bakterium ca. 2 µm < Mundschleimhautzelle ca. 60 µm < Zwiebelhautzelle ca. 300 µm < Eidotter ca. 3 cm.' }),
    ],
  };

  const topic2 = {
    id: 2, emoji: '🔬', color: '#6366f1', title: 'Das Mikroskop',
    goal: 'Ich kann benennen, welche Bestandteile ein Mikroskop aufweist.',
    book: 'Buch S. 14, Its learning > Plan „Klassenarbeit-Vorbereitung“ > „PPP – Mikroskopieren“',
    learn: [
      { title: 'Die Teile des Mikroskops', html: '<p>Tippe auf ein Teil, um zu erfahren, wozu es da ist.</p><div class="explore" data-kinds="mikroskop"></div>', widget: 'explore' },
      { title: 'Der Weg des Lichts', html: `<p>Ein Lichtmikroskop funktioniert nur mit <b>Durchlicht</b>: Das Licht scheint <b>von unten durch</b> das Präparat. Deshalb müssen Präparate sehr <b>dünn</b> sein.</p>
        <div class="light-path">💡 Lichtquelle → ⭕ Blende → 🧫 Präparat → 🔍 Objektiv → 📏 Tubus → 👁️ Okular → Auge</div>` },
      { title: 'Vergrößerung berechnen', html: `<p>Okular und Objektiv vergrößern beide. Die <b>Gesamtvergrößerung</b> ist ihr Produkt:</p>
        <div class="law-box"><b>Gesamtvergrößerung = Okular × Objektiv</b></div>
        <table class="nice-table"><tr><th>Okular</th><th>Objektiv</th><th>Gesamt</th></tr><tr><td>10×</td><td>4×</td><td>40-fach</td></tr><tr><td>10×</td><td>10×</td><td>100-fach</td></tr><tr><td>10×</td><td>40×</td><td>400-fach</td></tr></table>` },
    ],
    gens: [hotspotMicro, hotspotMicro, markedMicro, fnToPart(MP, 'Teil des Mikroskops'), partToFn(MP), magnification],
  };

  const topic3 = {
    id: 3, emoji: '🧪', color: '#0ea5e9', title: 'Mikroskopieren – so geht’s',
    goal: 'Ich kann beschreiben, wie man beim Mikroskopieren vorgeht.',
    book: 'Buch S. 14, Bio-Heft/Mappe',
    learn: [
      { title: 'Schritt für Schritt', html: `<ol class="steps">${MICRO_STEPS.map((s) => `<li>${s}.</li>`).join('')}</ol>` },
      { title: 'Ein Nasspräparat herstellen', html: `<ol class="steps">${WET_STEPS.map((s) => `<li>${s}.</li>`).join('')}</ol>
        <p class="tip">💡 Färben: Ein Tropfen Farbstoff (z. B. Methylenblau) an den Deckglasrand geben und mit Filterpapier von der anderen Seite durchziehen. Dann sieht man den Zellkern besser.</p>` },
      { title: 'Die goldenen Regeln ⚠️', html: `<ul class="steps"><li>Immer mit dem <b>kleinsten Objektiv</b> beginnen – und am Ende wieder einstellen.</li>
        <li>Beim Annähern <b>von der Seite schauen</b>, damit das Objektiv das Deckglas nicht berührt.</li>
        <li>Bei großer Vergrößerung <b>nur den Feintrieb</b> benutzen.</li><li>Linsen <b>nicht mit den Fingern</b> anfassen.</li>
        <li>Tragen: <b>eine Hand am Stativ, eine unter dem Fuß</b>.</li></ul>` },
    ],
    gens: [
      () => orderQ('Bringe die Schritte beim <b>Mikroskopieren</b> in die richtige Reihenfolge.', MICRO_STEPS, 5, 'Merke: Erst <b>klein und grob</b> (und dabei von der Seite schauen), dann <b>fein und größer</b>.'),
      () => orderQ('Bringe die Schritte zum <b>Nasspräparat</b> in die richtige Reihenfolge.', WET_STEPS, 4, 'Merke: <b>Wasser – Objekt – Deckglas schräg – absaugen</b>.'),
      fromPool(MICRO_RULES), fromPool(MICRO_RULES), fromPool(MICRO_RULES),
    ],
  };

  const SKETCH_MC = [
    ['Was gehört <b>nicht</b> zu einer guten biologischen Skizze?', 'Beschriftungslinien, die sich kreuzen', ['Zeichnen mit spitzem Bleistift', 'Beschriftungslinien mit dem Lineal', 'Eine Überschrift mit Objekt und Vergrößerung'], 'Beschriftungslinien zieht man mit dem Lineal, waagerecht nach außen – ohne Kreuzungen.'],
    ['Womit zeichnet man eine biologische Skizze?', 'Mit einem spitzen Bleistift', ['Mit Filzstiften in vielen Farben', 'Mit dem Füller', 'Mit Wasserfarben'], 'Bleistift: Man kann radieren, und die Linien bleiben fein und klar.'],
    ['Was zeichnest du in eine Skizze?', 'Die typischen Bestandteile, die man sieht – mit klaren Umrissen', ['Möglichst viele Schatten und Muster', 'Nur die Umrisse ohne Beschriftung', 'Auch Teile, die man sich nur denkt'], 'Eine Skizze ist klar und vereinfacht. Wichtiges wird beschriftet, Schattieren lässt man weg.'],
  ];
  const topic4 = {
    id: 4, emoji: '✏️', color: '#f59e0b', title: 'Zellen skizzieren',
    goal: 'Ich kann den Aufbau von Pflanzen-, Tier- und Bakterienzellen skizzieren.',
    book: 'Buch S. 15',
    learn: [
      { title: 'So gelingt eine Skizze', html: `<ul class="steps"><li>Spitzer <b>Bleistift</b>, unliniertes Papier, <b>groß</b> zeichnen.</li>
        <li>Klare Umrisse, <b>nicht schattieren</b>, nicht ausmalen.</li><li>Nur zeichnen, was typisch ist und was man sieht.</li>
        <li><b>Beschriftungslinien mit dem Lineal</b>, waagerecht nach außen, ohne Kreuzungen.</li>
        <li><b>Überschrift</b>: Was ist es? (z. B. „Zwiebelhautzelle, 400-fach“)</li></ul>` },
      { title: 'Pflanzenzelle', html: `${C.draw('pflanze', { labels: true })}<p class="tip">Typisch: eckige Form, <b>Zellwand</b>, große <b>Vakuole</b>, <b>Chloroplasten</b>, Zellkern oft am Rand.</p>` },
      { title: 'Tierzelle', html: `${C.draw('tier', { labels: true })}<p class="tip">Typisch: rundlich-unregelmäßige Form, nur <b>Zellmembran</b> als Grenze, Zellkern meist in der Mitte.</p>` },
      { title: 'Bakterienzelle', html: `${C.draw('bakterie', { labels: true })}<p class="tip">Typisch: klein, oft stäbchenförmig, <b>kein Zellkern</b> – ringförmige DNA, Plasmide, oft eine Geißel.</p>` },
    ],
    gens: [
      () => {
        const type = cellTypeOf();
        const cand = { pflanze: ['zellwand', 'zellkern', 'vakuole', 'chloroplast', 'mitochondrium'], tier: ['zellkern', 'mitochondrium'], bakterie: ['geissel', 'bakterien_dna', 'zellwand', 'plasmid'] }[type];
        const miss = R.pick(cand);
        const others = pickN(C.partsOf(type).filter((p) => p !== miss), 3).map((p) => P[p].name);
        return mcFrom(`In dieser Skizze einer <b>${typeName(type)}</b> fehlt etwas. Was?`, P[miss].name, others, `Es fehlt: <b>${P[miss].name}</b>. ${sentence(miss, P)}`, { visual: C.draw(type, { omit: [miss], title: 'Skizze mit Lücke' }) });
      },
      () => {
        const type = cellTypeOf();
        const has = C.partsOf(type).filter((p) => p !== 'ribosomen');
        const not = Object.keys(P).filter((p) => !P[p].in.includes(type) && p !== 'ribosomen');
        const opts = R.shuffle(pickN(has, Math.min(4, has.length)).concat(pickN(not, 3)));
        return { type: 'multi', prompt: `Welche Bestandteile zeichnest du in eine Skizze einer <b>${typeName(type)}</b> ein?`, options: opts.map((p) => P[p].name), correct: opts.map((p, i) => (has.includes(p) ? i : -1)).filter((i) => i >= 0), explain: `Eine ${typeName(type)} hat: ${C.partsOf(type).map((p) => P[p].name).join(', ')}.` };
      },
      fromPool(SKETCH_MC),
      hotspotCell,
    ],
  };

  const topic5 = {
    id: 5, emoji: '🏷️', color: '#ec4899', title: 'Zellbestandteile benennen',
    goal: 'Ich kann die Bestandteile von Pflanzen-, Tier- und Bakterienzellen benennen.',
    book: 'Bio-Heft/Mappe, Buch S. 30–33',
    learn: [
      { title: 'Entdecke die drei Zelltypen', html: '<p>Wähle einen Zelltyp und tippe auf die Bestandteile.</p><div class="explore" data-kinds="pflanze,tier,bakterie"></div>', widget: 'explore' },
      { title: 'Wer hat was?', html: `<table class="nice-table compare"><tr><th>Bestandteil</th><th>🌿 Pflanze</th><th>🐾 Tier</th><th>🦠 Bakterie</th></tr>
        ${Object.keys(P).map((p) => `<tr><td>${P[p].name}</td>${C.ALL.map((t) => `<td>${P[p].in.includes(t) ? '✅' : '–'}</td>`).join('')}</tr>`).join('')}</table>` },
    ],
    gens: [hotspotCell, hotspotCell, markedCell, markedCell,
      () => {
        const only = R.pick([['pflanze', ['chloroplast', 'vakuole']], ['bakterie', ['plasmid', 'geissel', 'bakterien_dna']]]);
        const right = R.pick(only[1]);
        const wrong = pickN(['zellkern', 'mitochondrium', 'zellmembran', 'zellplasma', 'ribosomen'], 3);
        return mcFrom(`Welcher Bestandteil kommt <b>nur</b> in der <b>${typeName(only[0])}</b> vor?`, P[right].name, wrong.map((p) => P[p].name), `${P[right].name}: ${P[right].more} Die anderen Bestandteile gibt es auch in anderen Zelltypen.`);
      }],
  };

  const ANALOGY = [
    ['„Kraftwerk der Zelle“', 'mitochondrium'], ['„Steuerzentrale der Zelle“', 'zellkern'], ['„Pförtner der Zelle“', 'zellmembran'],
    ['„Zuckerfabrik mit Solarstrom“', 'chloroplast'], ['„Wassertank der Zelle“', 'vakuole'], ['„Schutzmauer“', 'zellwand'], ['„Eiweiß-Werkstätten“', 'ribosomen'],
  ];
  const FN_TF = [
    ['Chloroplasten gewinnen durch Zellatmung Energie.', false, 'Das machen die Mitochondrien. Chloroplasten betreiben Fotosynthese.'],
    ['Die Zellmembran regelt, welche Stoffe in die Zelle hinein- und hinausgelangen.', true, 'Sie ist der „Pförtner“ der Zelle.'],
    ['Im Zellkern liegt die Erbinformation.', true, 'Der Zellkern enthält die DNA und steuert die Zelle.'],
    ['Ribosomen stellen Traubenzucker her.', false, 'Ribosomen stellen Eiweiße her. Traubenzucker entsteht bei der Fotosynthese in den Chloroplasten.'],
    ['Die Vakuole betreibt Fotosynthese.', false, 'Die Vakuole speichert Zellsaft. Fotosynthese machen die Chloroplasten.'],
    ['Auch Pflanzenzellen besitzen Mitochondrien.', true, 'Pflanzen brauchen auch Energie aus Zellatmung – nicht nur Tiere.'],
    ['Die Zellwand gibt der Pflanzenzelle Festigkeit.', true, 'Sie besteht aus Cellulose und hält die Zelle in Form.'],
  ];
  const cellOnly = Object.fromEntries(['zellwand', 'zellmembran', 'zellplasma', 'zellkern', 'mitochondrium', 'chloroplast', 'vakuole', 'ribosomen'].map((k) => [k, P[k]]));
  const topic6 = {
    id: 6, emoji: '⚙️', color: '#8b5cf6', title: 'Funktionen der Zellbestandteile',
    goal: 'Ich kann die Funktionen der verschiedenen Zellbestandteile erklären.',
    book: 'Tabelle Vergleich Zelltypen',
    learn: [
      { title: 'Die Zelle als Fabrik 🏭', html: `<p>Stell dir die Zelle wie eine kleine Fabrik vor:</p><table class="nice-table">
        <tr><td>🧱 Zellwand</td><td>Schutzmauer – gibt Form und Festigkeit</td></tr><tr><td>🚪 Zellmembran</td><td>Pförtner – regelt den Stoffaustausch</td></tr>
        <tr><td>💧 Zellplasma</td><td>Fabrikhalle – hier liegt alles, hier wird gearbeitet</td></tr><tr><td>🧠 Zellkern</td><td>Chefbüro – steuert, enthält die Erbinformation</td></tr>
        <tr><td>⚡ Mitochondrien</td><td>Kraftwerk – Energie durch Zellatmung</td></tr><tr><td>☀️ Chloroplasten</td><td>Solar-Zuckerfabrik – Fotosynthese</td></tr>
        <tr><td>🛢️ Vakuole</td><td>Wassertank – speichert Zellsaft, hält die Zelle prall</td></tr><tr><td>🔧 Ribosomen</td><td>Werkbänke – stellen Eiweiße her</td></tr></table>` },
      { title: 'Ganz genau', html: `<dl class="glossary-list">${Object.keys(cellOnly).map((k) => `<dt>${P[k].name}</dt><dd>${sentence(k, P)} <small>${P[k].more}</small></dd>`).join('')}</dl>` },
      { title: 'Nur bei Bakterien', html: `<dl class="glossary-list">${['bakterien_dna', 'plasmid', 'geissel', 'pili', 'kapsel'].map((k) => `<dt>${P[k].name}</dt><dd>${sentence(k, P)} <small>${P[k].more}</small></dd>`).join('')}</dl>` },
    ],
    gens: [fnToPart(cellOnly, 'Zellbestandteil'), fnToPart(cellOnly, 'Zellbestandteil'), partToFn(P), fromPool(FN_TF),
      () => { const [a, k] = R.pick(ANALOGY); return mcFrom(`Welcher Zellbestandteil wird als ${a} bezeichnet?`, P[k].name, pickN(Object.keys(cellOnly).filter((x) => x !== k), 3).map((x) => P[x].name), sentence(k, P)); }],
  };

  const topic7 = {
    id: 7, emoji: '🔍', color: '#14b8a6', title: 'Zelltyp erkennen & begründen',
    goal: 'Ich kann erkennen und begründen, um welchen Zelltyp es sich jeweils handelt.',
    book: 'Its learning > Plan „Klassenarbeit-Vorbereitung“ > „Video – Die Zelle“',
    learn: [
      { title: 'Der Zell-Detektiv 🕵️', html: `<p>Stelle dir diese Fragen der Reihe nach:</p><div class="decision">
        <div class="q">1. Hat die Zelle einen <b>Zellkern</b>?</div><div class="a">Nein → <b>Bakterienzelle</b> 🦠</div>
        <div class="q">2. Ja – hat sie eine <b>Zellwand</b> (oft auch Chloroplasten und große Vakuole)?</div><div class="a">Ja → <b>Pflanzenzelle</b> 🌿 · Nein → <b>Tierzelle</b> 🐾</div></div>` },
      { title: 'Vorsicht, Fallen! ⚠️', html: `<ul class="steps"><li>Ein <b>Zellkern</b> beweist nur: kein Bakterium. Tier- und Pflanzenzellen haben beide einen.</li>
        <li><b>Keine Chloroplasten</b> heißt nicht „Tierzelle“! Zwiebelhaut- und Wurzelzellen sind Pflanzenzellen ohne Chloroplasten.</li>
        <li><b>Mitochondrien</b> haben Tier- <u>und</u> Pflanzenzellen.</li></ul>` },
      { title: 'Richtig begründen', html: `<p>Eine gute Begründung nennt ein <b>Merkmal</b>, das <b>nur</b> dieser Zelltyp hat:</p>
        <div class="law-box">„Es handelt sich um eine <b>Pflanzenzelle</b>, <b>weil</b> sie eine <b>Zellwand</b> und <b>Chloroplasten</b> besitzt. Tierzellen haben beides nicht.“</div>` },
      { title: 'Übe mit dem Detektiv-Spiel 🎲', html: '<div class="detective"></div>', widget: 'detective' },
    ],
    gens: [diagramType, diagramType,
      () => { const [txt, type, why] = R.pick(SCENARIOS); return { type: 'mc', prompt: 'Welcher Zelltyp ist das?', visual: scenario(txt), options: C.ALL.map(typeName), correct: C.ALL.indexOf(type), explain: why }; },
      fromPool(WHY),
      () => ({ type: 'multi', prompt: 'Welche Merkmale beweisen, dass eine Zelle eine <b>Pflanzenzelle</b> ist?', options: ['Zellwand', 'Chloroplasten', 'Große Vakuole', 'Zellkern', 'Zellmembran', 'Mitochondrien'], correct: [0, 1, 2], explain: 'Zellwand, Chloroplasten und große Vakuole gibt es nur bei Pflanzenzellen. Zellkern, Membran und Mitochondrien haben auch Tierzellen.' }),
    ],
  };

  const topic8 = {
    id: 8, emoji: '🦠', color: '#ef4444', title: 'Bakterien vs. Tier- & Pflanzenzellen',
    goal: 'Ich kann den Unterschied zwischen Bakterien und Tier- & Pflanzenzellen erklären.',
    book: 'Buch S. 304',
    learn: [
      { title: 'Prokaryoten und Eukaryoten', html: `<div class="two-col"><div class="info-box"><b>Prokaryoten</b> 🦠<p>„pro“ = vor, „karyon“ = Kern</p>Zellen <b>ohne Zellkern</b>. Die DNA liegt frei im Zellplasma.<br><i>Bakterien</i></div>
        <div class="info-box"><b>Eukaryoten</b> 🌿🐾<p>„eu“ = echt</p>Zellen <b>mit echtem Zellkern</b> und Mitochondrien.<br><i>Pflanzen, Tiere, Pilze</i></div></div>` },
      { title: 'Die Unterschiede', html: `<table class="nice-table"><tr><th></th><th>🦠 Bakterie</th><th>🌿🐾 Pflanze & Tier</th></tr>
        <tr><td>Zellkern</td><td>❌ – DNA ringförmig frei im Plasma</td><td>✅</td></tr><tr><td>Mitochondrien</td><td>❌</td><td>✅</td></tr>
        <tr><td>Chloroplasten</td><td>❌</td><td>nur Pflanze</td></tr><tr><td>Plasmide</td><td>✅</td><td>❌</td></tr>
        <tr><td>Größe</td><td>ca. 1–5 µm</td><td>ca. 10–100 µm</td></tr></table>` },
      { title: 'Was alle gemeinsam haben', html: `<p>Jede Zelle hat:</p><ul class="steps"><li><b>Zellmembran</b> – Grenze nach außen</li><li><b>Zellplasma</b></li><li><b>Ribosomen</b> – stellen Eiweiße her</li><li><b>Erbinformation (DNA)</b> – nur ihr Ort ist verschieden</li></ul>
        <p class="tip">Eine <b>Zellwand</b> haben Bakterien und Pflanzen – aber aus verschiedenen Stoffen. Tierzellen haben keine.</p>` },
    ],
    gens: [fromPool(BACT_TF), fromPool(BACT_TF), fromPool(BACT_MC),
      () => ({ type: 'multi', prompt: 'Was haben <b>Bakterien und Tierzellen</b> gemeinsam?', options: ['Zellmembran', 'Zellplasma', 'Ribosomen', 'Erbinformation (DNA)', 'Zellkern', 'Mitochondrien', 'Zellwand', 'Chloroplasten'], correct: [0, 1, 2, 3], explain: 'Membran, Plasma, Ribosomen und DNA haben alle Zellen. Zellkern und Mitochondrien fehlen den Bakterien, Zellwand und Chloroplasten den Tierzellen.' }),
      () => ({ type: 'hotspot', prompt: 'Wo liegt die Erbinformation dieser Bakterienzelle? Tippe darauf!', svg: C.draw('bakterie'), answer: 'bakterien_dna', answerLabel: P.bakterien_dna.name, explain: sentence('bakterien_dna', P) })],
  };

  const topic9 = {
    id: 9, emoji: '🧠', color: '#f97316', title: 'Aufgaben rund um Zellen',
    goal: 'Ich kann Aufgaben rund um das Thema Zellen sicher bearbeiten.',
    book: 'Buch S. 43',
    learn: [
      { title: 'So bereitest du dich sinnvoll vor', html: `<ul class="steps"><li>✅ <b>Checkliste</b> verwenden und einen <b>Plan</b> machen, wann du was (nochmal) lernst – nutze die Selbsteinschätzung in jedem Thema.</li>
        <li>📖 Ein eigenes <b>Glossar</b> mit den Fachbegriffen anlegen (wie im Buch ab S. 423) – das Glossar in dieser App hilft dir dabei.</li>
        <li>✏️ <b>Aufgaben</b> aus Unterricht, Buch und Heft bearbeiten und mit Lösungen vergleichen.</li>
        <li>👥 Mit anderen aus der Klasse <b>austauschen</b>: Ergebnisse vergleichen, sich gegenseitig abfragen.</li></ul>` },
      { title: 'Typische Aufgaben in der Klassenarbeit', html: `<ul class="steps"><li><b>Beschriften</b>: Skizze einer Zelle oder eines Mikroskops</li><li><b>Vergleichen</b>: Tabelle Pflanzen-, Tier-, Bakterienzelle</li>
        <li><b>Begründen</b>: „Um welchen Zelltyp handelt es sich? Begründe!“</li><li><b>Rechnen</b>: Vergrößerung oder wirkliche Größe</li><li><b>Anwenden</b>: „Warum haben Wurzelzellen keine Chloroplasten?“</li></ul>` },
      { title: 'Wirkliche Größe berechnen', html: `<div class="law-box"><b>wirkliche Größe = Größe im Bild : Vergrößerung</b></div>
        <p>Beispiel: Eine Zelle ist auf dem Foto bei 400-facher Vergrößerung <b>8 mm</b> groß.<br>8 mm : 400 = 0,02 mm = <b>20 µm</b> (denn 1 mm = 1000 µm).</p>` },
    ],
    gens: [sizeCalc, fromPool(APPLY), fromPool(APPLY), magnification],
  };
  // Thema 9 mischt zusätzlich Aufgaben aus allen anderen Themen
  [topic1, topic2, topic3, topic4, topic5, topic6, topic7, topic8].forEach((t) => topic9.gens.push(...t.gens.slice(0, 2)));

  const TOPICS = [topic1, topic2, topic3, topic4, topic5, topic6, topic7, topic8, topic9];

  // ---------- Interaktive Elemente ----------
  const S = () => root.Sound, FX = () => root.FX;
  function bindExplore(box, kind) {
    const info = box.querySelector('.explore-info');
    const src = kind === 'mikroskop' ? MP : P;
    box.querySelector('.diagram').addEventListener('click', (e) => {
      const el = e.target.closest('[data-part]');
      if (!el) return;
      const p = el.dataset.part;
      box.querySelectorAll('.hs-active').forEach((x) => x.classList.remove('hs-active'));
      box.querySelectorAll(`[data-part="${p}"]`).forEach((x) => x.classList.add('hs-active'));
      info.innerHTML = `<b>${src[p].name}</b><br>${sentence(p, src)}${src[p].more ? ` <small>${src[p].more}</small>` : ''}`;
      S().play('select');
      FX().pop(info);
    });
  }
  const WIDGETS = {
    explore(el) {
      const box = el.querySelector('.explore');
      const kinds = box.dataset.kinds.split(',');
      const show = (k) => {
        box.innerHTML = (kinds.length > 1 ? `<div class="slot-tabs" data-silent>${kinds.map((x) => `<button class="slot-tab${x === k ? ' on' : ''}" data-k="${x}">${typeName(x)}</button>`).join('')}</div>` : '') +
          `<div class="explore-svg">${C.draw(k, { labels: true, cls: 'clickable' })}</div><div class="explore-info">👆 Tippe auf einen Bestandteil oder eine Beschriftung!</div>`;
        bindExplore(box, k);
        box.querySelectorAll('.slot-tab').forEach((b) => b.addEventListener('click', () => { S().play('swoosh'); show(b.dataset.k); }));
      };
      show(kinds[0]);
    },
    detective(el) {
      const box = el.querySelector('.detective');
      const round = () => {
        const q = diagramType();
        box.innerHTML = `<div class="explore-svg">${q.visual}</div><div class="row-btns" data-silent>${q.options.map((o, i) => `<button class="btn small ghost" data-i="${i}">${o}</button>`).join('')}</div><div class="explore-info"></div>`;
        box.querySelectorAll('[data-i]').forEach((b) => b.addEventListener('click', () => {
          const ok = +b.dataset.i === q.correct;
          box.querySelector('.explore-info').innerHTML = (ok ? '✅ <b>Richtig!</b> ' : '❌ <b>Nicht ganz.</b> ') + q.explain + '<div class="row-btns"><button class="btn small" data-new>🎲 Nächste Zelle</button></div>';
          S().play(ok ? 'correct' : 'wrong');
          if (ok) FX().burstAt(b, 25); else FX().shake(b);
          box.querySelectorAll('[data-i]').forEach((x) => { x.disabled = true; });
          box.querySelector('[data-new]').addEventListener('click', () => { S().play('swoosh'); round(); });
        }));
      };
      round();
    },
  };

  // ---------- Glossar ----------
  const EXTRA_TERMS = [
    ['Zelle', 'Kleinste lebende Einheit; Grundbaustein aller Lebewesen.'], ['Einzeller', 'Lebewesen aus nur einer Zelle, z. B. Bakterium, Pantoffeltierchen.'],
    ['Vielzeller', 'Lebewesen aus vielen Zellen mit verteilten Aufgaben, z. B. Mensch, Pflanzen.'], ['Prokaryot', 'Lebewesen, dessen Zellen keinen Zellkern haben (Bakterien).'],
    ['Eukaryot', 'Lebewesen mit echtem Zellkern in den Zellen (Pflanzen, Tiere, Pilze).'], ['Präparat', 'Das, was man unter dem Mikroskop betrachtet – meist auf einem Objektträger.'],
    ['Objektträger', 'Glasplättchen, auf das man das Präparat legt.'], ['Deckglas', 'Sehr dünnes Glasplättchen, das man auf das Präparat legt.'],
    ['Nasspräparat', 'Präparat, das in einem Wassertropfen unter einem Deckglas liegt.'], ['Gesamtvergrößerung', 'Okularvergrößerung × Objektivvergrößerung.'],
    ['Mikrometer (µm)', 'Tausendstel Millimeter: 1 mm = 1000 µm.'], ['Fotosynthese', 'Herstellung von Traubenzucker aus Wasser und Kohlenstoffdioxid mit Lichtenergie – in den Chloroplasten.'],
    ['Zellatmung', 'Gewinnung von Energie aus Nährstoffen mithilfe von Sauerstoff – in den Mitochondrien.'], ['Chlorophyll', 'Grüner Farbstoff in den Chloroplasten.'],
    ['DNA', 'Träger der Erbinformation.'], ['Cellulose', 'Stoff, aus dem die Zellwand der Pflanzen besteht.'], ['Zellteilung', 'Aus einer Zelle entstehen zwei neue Zellen.'],
  ];
  function glossaryEntries() {
    return Object.keys(P).map((k) => [P[k].name, sentence(k, P)])
      .concat(Object.keys(MP).map((k) => [MP[k].name + ' (Mikroskop)', sentence(k, MP)]))
      .concat(EXTRA_TERMS)
      .sort((a, b) => a[0].localeCompare(b[0], 'de'));
  }
  function glossaryPage(main) {
    const all = glossaryEntries();
    main.innerHTML = `<a href="#/" class="back">← Übersicht</a><h1 class="shop-title">📖 Glossar</h1>
      <p>Alle Fachbegriffe zum Thema Zellen. Tippe eine Karte an, um sie umzudrehen – so kannst du dich selbst abfragen!</p>
      <div class="gloss-tools" data-silent><input id="gloss-q" class="chat-input" type="search" placeholder="Begriff suchen …" aria-label="Begriff suchen">
        <button class="btn small ghost" id="gloss-flip">🔄 Alle umdrehen</button></div>
      <div class="gloss-grid"></div>`;
    const grid = main.querySelector('.gloss-grid');
    let flipAll = false;
    const draw = () => {
      const q = main.querySelector('#gloss-q').value.trim().toLowerCase();
      grid.innerHTML = all.filter(([t, d]) => !q || t.toLowerCase().includes(q) || d.toLowerCase().includes(q))
        .map(([t, d]) => `<button class="gloss-card${flipAll ? ' flipped' : ''}" data-silent><span class="front">${esc(t)}</span><span class="back">${d}</span></button>`).join('') || '<p>Nichts gefunden.</p>';
      grid.querySelectorAll('.gloss-card').forEach((c) => c.addEventListener('click', () => { c.classList.toggle('flipped'); S().play('swoosh'); }));
    };
    main.querySelector('#gloss-q').addEventListener('input', draw);
    main.querySelector('#gloss-flip').addEventListener('click', () => { flipAll = !flipAll; draw(); S().play('select'); });
    draw();
  }

  // ---------- Fragen-Knöpfe für den Tutor ----------
  const PLURAL = ['mitochondrium', 'chloroplast', 'ribosomen', 'plasmid', 'pili', 'klemmen'];
  const fq = (k, src) => [`${PLURAL.includes(k) ? 'Was machen die' : 'Was macht ' + ART[k].toLowerCase()} ${src[k].name}?`, sentence(k, src) + (src[k].more ? '\n' + src[k].more : '')];
  const FAQ = {
    1: [['Was ist eine Zelle?', 'Die Zelle ist die kleinste lebende Einheit. Alle Lebewesen bestehen aus einer oder vielen Zellen.'],
      ['Was ist der Unterschied zwischen Einzellern und Vielzellern?', 'Einzeller bestehen aus nur einer Zelle (z. B. Bakterien). Vielzeller bestehen aus vielen Zellen, die sich die Arbeit teilen (z. B. der Mensch).'],
      ['Was sind die Kennzeichen des Lebens?', 'Stoffwechsel, Wachstum, Fortpflanzung, Reizbarkeit und Bewegung. Schon eine einzelne Zelle zeigt sie alle.'],
      ['Wie groß ist eine Zelle?', 'Meist nur wenige Mikrometer: Bakterien ca. 1–5 µm, Tierzellen ca. 10–30 µm, Pflanzenzellen oft größer. 1 mm = 1000 µm.']],
    2: [['Welche Teile hat ein Mikroskop?', 'Okular, Tubus, Revolver, Objektive, Objekttisch mit Klemmen, Blende, Lichtquelle, Grobtrieb, Feintrieb, Stativ und Fuß.'],
      fq('okular', MP), fq('blende', MP), ['Wie berechne ich die Gesamtvergrößerung?', 'Okular × Objektiv. Beispiel: 10 × 40 = 400-fach.']],
    3: [['Wie gehe ich beim Mikroskopieren vor?', MICRO_STEPS.map((s, i) => `${i + 1}. ${s}`).join('\n')],
      ['Wie stelle ich ein Nasspräparat her?', WET_STEPS.map((s, i) => `${i + 1}. ${s}`).join('\n')],
      ['Warum nur den Feintrieb bei großer Vergrößerung?', 'Das Objektiv ist dann ganz nah am Präparat. Mit dem Grobtrieb könnte man das Deckglas zerdrücken.']],
    4: [['Wie zeichne ich eine gute Skizze?', 'Spitzer Bleistift, groß zeichnen, klare Linien ohne Schatten, Beschriftungslinien mit Lineal ohne Kreuzungen, Überschrift.'],
      ['Was gehört in eine Pflanzenzelle?', 'Zellwand, Zellmembran, Zellplasma, Zellkern, große Vakuole, Chloroplasten, Mitochondrien (und Ribosomen).'],
      ['Was gehört in eine Bakterienzelle?', 'Zellwand, Zellmembran, Zellplasma, ringförmige DNA (Bakterienchromosom), Plasmide, Ribosomen, oft Geißel, Pili und Kapsel.']],
    5: [['Welche Teile hat nur die Pflanzenzelle?', 'Zellwand (aus Cellulose), große Vakuole und Chloroplasten – im Vergleich zur Tierzelle.'],
      ['Welche Teile haben alle Zellen?', 'Zellmembran, Zellplasma, Ribosomen und Erbinformation (DNA).'], fq('zellplasma', P)],
    6: [fq('zellkern', P), fq('mitochondrium', P), fq('chloroplast', P), fq('vakuole', P), fq('zellmembran', P)],
    7: [['Wie erkenne ich eine Bakterienzelle?', 'Sie hat keinen Zellkern. Die DNA liegt frei im Plasma. Sie ist sehr klein.'],
      ['Wie unterscheide ich Tier- und Pflanzenzelle?', 'Pflanzenzellen haben eine Zellwand, eine große Vakuole und oft Chloroplasten. Tierzellen haben das nicht.'],
      ['Warum ist die Zwiebelhaut eine Pflanzenzelle ohne Chloroplasten?', 'Die Zwiebel wächst unter der Erde – ohne Licht braucht sie keine Chloroplasten. Zellwand und Vakuole hat sie trotzdem.']],
    8: [['Was ist ein Prokaryot?', 'Ein Lebewesen ohne Zellkern – z. B. Bakterien. „Eukaryoten“ haben einen echten Zellkern.'],
      ['Was haben alle Zellen gemeinsam?', 'Zellmembran, Zellplasma, Ribosomen und DNA.'], fq('plasmid', P), fq('geissel', P)],
    9: [['Wie berechne ich die wirkliche Größe?', 'Größe im Bild : Vergrößerung. Beispiel: 8 mm : 400 = 0,02 mm = 20 µm.'],
      ['Wie bereite ich mich auf die Klassenarbeit vor?', 'Checkliste nutzen und Plan machen, Glossar anlegen, Aufgaben üben und vergleichen, sich mit anderen gegenseitig abfragen.'],
      ['Warum haben Wurzelzellen keine Chloroplasten?', 'Unter der Erde ist es dunkel. Ohne Licht keine Fotosynthese – also keine Chloroplasten.']],
  };

  root.BioTopics = { list: TOPICS, widgets: WIDGETS, FAQ, glossaryPage, glossaryEntries };
})(window);
