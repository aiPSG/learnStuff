/*
 * Zell-Diagramme (Pflanzen-, Tier-, Bakterienzelle) und Mikroskop als SVG.
 * Jeder Bestandteil ist eine Gruppe mit data-part, damit man ihn antippen,
 * beschriften, markieren oder (für „Was fehlt?“-Aufgaben) weglassen kann.
 */
(function (root) {
  'use strict';

  const TYPES = {
    pflanze: { name: 'Pflanzenzelle', dat: 'der Pflanzenzelle' },
    tier: { name: 'Tierzelle', dat: 'der Tierzelle' },
    bakterie: { name: 'Bakterienzelle', dat: 'der Bakterienzelle' },
  };
  const ALL = ['pflanze', 'tier', 'bakterie'];

  // Zellbestandteile mit Funktion (Stand: übliche Inhalte Klasse 7/8)
  const PARTS = {
    zellwand: { name: 'Zellwand', fn: 'gibt der Zelle Form und Festigkeit und schützt sie', in: ['pflanze', 'bakterie'], more: 'Bei Pflanzen besteht sie aus Cellulose, bei Bakterien aus einem anderen Stoff (Murein). Tierzellen haben keine Zellwand.' },
    zellmembran: { name: 'Zellmembran', fn: 'grenzt die Zelle nach außen ab und regelt, welche Stoffe hinein und hinaus gelangen', in: ALL, more: 'Sie ist eine dünne, biegsame Haut – wie ein Pförtner.' },
    zellplasma: { name: 'Zellplasma', fn: 'füllt die Zelle aus; darin liegen die Zellbestandteile, und viele Stoffwechselvorgänge laufen hier ab', in: ALL, more: 'Auch Cytoplasma genannt. Es ist eine zähflüssige, gelartige Masse.' },
    zellkern: { name: 'Zellkern', fn: 'steuert die Vorgänge in der Zelle und enthält die Erbinformation (DNA)', in: ['pflanze', 'tier'], more: 'Die „Steuerzentrale“. Bakterien haben keinen Zellkern.' },
    mitochondrium: { name: 'Mitochondrien', fn: 'gewinnen durch Zellatmung Energie aus Nährstoffen (z. B. Traubenzucker)', in: ['pflanze', 'tier'], more: 'Die „Kraftwerke“ der Zelle. Auch Pflanzenzellen haben Mitochondrien!' },
    chloroplast: { name: 'Chloroplasten', fn: 'betreiben Fotosynthese: Sie stellen mit Lichtenergie aus Wasser und Kohlenstoffdioxid Traubenzucker her', in: ['pflanze'], more: 'Sie enthalten den grünen Farbstoff Chlorophyll. Nur in grünen Pflanzenteilen.' },
    vakuole: { name: 'Vakuole', fn: 'speichert Zellsaft (Wasser mit gelösten Stoffen) und hält die Zelle prall und stabil', in: ['pflanze'], more: 'Die große zentrale Vakuole ist typisch für Pflanzenzellen. Verliert sie Wasser, welkt die Pflanze.' },
    ribosomen: { name: 'Ribosomen', fn: 'stellen Eiweiße (Proteine) her', in: ALL, more: 'Winzige Körnchen – es gibt sie in allen Zellen, auch in Bakterien.' },
    bakterien_dna: { name: 'Bakterienchromosom', fn: 'enthält die Erbinformation; die ringförmige DNA liegt frei im Zellplasma, ohne Kernhülle', in: ['bakterie'], more: 'Auch Kernäquivalent oder Kernregion genannt – ein Zellkern ist es nicht!' },
    plasmid: { name: 'Plasmide', fn: 'sind kleine zusätzliche DNA-Ringe, z. B. mit Erbinformation für Antibiotika-Resistenz', in: ['bakterie'], more: 'Bakterien können Plasmide untereinander austauschen.' },
    geissel: { name: 'Geißel', fn: 'dient zur Fortbewegung', in: ['bakterie'], more: 'Sie dreht sich wie ein Propeller. Nicht alle Bakterien haben eine.' },
    pili: { name: 'Pili', fn: 'sind feine Härchen, mit denen sich das Bakterium an Oberflächen anheftet', in: ['bakterie'], more: 'Einzahl: Pilus.' },
    kapsel: { name: 'Kapsel', fn: 'ist eine Schleimhülle, die das Bakterium z. B. vor Austrocknung und vor Abwehrzellen schützt', in: ['bakterie'], more: 'Nicht alle Bakterien haben eine Kapsel.' },
  };

  const MPARTS = {
    okular: { name: 'Okular', fn: 'ist die Linse, durch die man hineinschaut; sie vergrößert (meist 10-fach)' },
    tubus: { name: 'Tubus', fn: 'ist das Rohr, das Okular und Objektive verbindet' },
    revolver: { name: 'Revolver', fn: 'ist die drehbare Scheibe mit den Objektiven – damit wechselt man die Vergrößerung' },
    objektiv: { name: 'Objektiv', fn: 'ist die Linse direkt über dem Präparat; es gibt verschiedene Stärken (z. B. 4×, 10×, 40×)' },
    objekttisch: { name: 'Objekttisch', fn: 'ist die Ablage für den Objektträger mit dem Präparat' },
    klemmen: { name: 'Objektklemmen', fn: 'halten den Objektträger fest' },
    blende: { name: 'Blende', fn: 'regelt, wie viel Licht durch das Präparat fällt (Helligkeit und Kontrast)' },
    lampe: { name: 'Lichtquelle', fn: 'durchleuchtet das Präparat von unten' },
    grobtrieb: { name: 'Grobtrieb', fn: 'ist das große Stellrad zum groben Scharfstellen – nur bei kleiner Vergrößerung' },
    feintrieb: { name: 'Feintrieb', fn: 'ist das kleine Stellrad zum genauen Scharfstellen' },
    stativ: { name: 'Stativ', fn: 'trägt alle Teile; hier fasst man das Mikroskop zum Tragen an' },
    fuss: { name: 'Fuß', fn: 'sorgt dafür, dass das Mikroskop sicher und fest steht' },
  };

  // ---------- Geometrie ----------
  const g = (part, body) => `<g class="part" data-part="${part}">${body}</g>`;
  const ellipse = (cx, cy, rx, ry, rot, cls) => `<ellipse class="${cls}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})"/>`;
  const mito = (cx, cy, rot) => `<g transform="rotate(${rot} ${cx} ${cy})"><ellipse class="c-mito" cx="${cx}" cy="${cy}" rx="12" ry="6.5"/>` +
    `<path class="c-mito-in" d="M${cx - 8} ${cy} l3 -3 l3 6 l3 -6 l3 6 l3 -3"/><ellipse class="hit" cx="${cx}" cy="${cy}" rx="18" ry="13"/></g>`;
  const chloro = (cx, cy, rot) => `<g transform="rotate(${rot} ${cx} ${cy})"><ellipse class="c-chloro" cx="${cx}" cy="${cy}" rx="14" ry="8"/>` +
    `<path class="c-chloro-in" d="M${cx - 8} ${cy - 3} h16 M${cx - 9} ${cy + 1} h18 M${cx - 7} ${cy + 4} h14"/><ellipse class="hit" cx="${cx}" cy="${cy}" rx="18" ry="12"/></g>`;
  const ribos = (pts) => pts.map(([x, y]) => `<circle class="c-ribo" cx="${x}" cy="${y}" r="2.4"/><circle class="hit" cx="${x}" cy="${y}" r="11"/>`).join('');
  const ring = (o, i) => `M${o.x + o.r} ${o.y} H${o.x + o.w - o.r} A${o.r} ${o.r} 0 0 1 ${o.x + o.w} ${o.y + o.r} V${o.y + o.h - o.r} A${o.r} ${o.r} 0 0 1 ${o.x + o.w - o.r} ${o.y + o.h} H${o.x + o.r} A${o.r} ${o.r} 0 0 1 ${o.x} ${o.y + o.h - o.r} V${o.y + o.r} A${o.r} ${o.r} 0 0 1 ${o.x + o.r} ${o.y} Z ` +
    `M${i.x + i.r} ${i.y} H${i.x + i.w - i.r} A${i.r} ${i.r} 0 0 1 ${i.x + i.w} ${i.y + i.r} V${i.y + i.h - i.r} A${i.r} ${i.r} 0 0 1 ${i.x + i.w - i.r} ${i.y + i.h} H${i.x + i.r} A${i.r} ${i.r} 0 0 1 ${i.x} ${i.y + i.h - i.r} V${i.y + i.r} A${i.r} ${i.r} 0 0 1 ${i.x + i.r} ${i.y} Z`;
  const rrect = (o) => `<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${o.r}"`;

  const ANIMAL_PATH = 'M80 140 Q72 62 165 52 Q262 40 322 92 Q362 150 324 212 Q276 270 172 256 Q74 244 80 140 Z';

  // Teile pro Zelltyp: [part, svg]; Reihenfolge = Zeichenreihenfolge (später = oben)
  function cellParts(type) {
    if (type === 'pflanze') {
      const outer = { x: 40, y: 30, w: 320, h: 240, r: 18 }, inner = { x: 52, y: 42, w: 296, h: 216, r: 12 }, mem = { x: 56, y: 46, w: 288, h: 208, r: 10 };
      return [
        ['zellplasma', `${rrect(mem)} class="c-plasma-p"/>`],
        ['vakuole', '<path class="c-vac" d="M130 120 Q140 80 210 85 Q300 80 305 140 Q310 210 220 215 Q130 220 125 165 Z"/>'],
        ['ribosomen', ribos([[150, 60], [232, 58], [268, 66], [66, 200], [140, 242], [200, 240], [336, 244], [110, 54]])],
        ['mitochondrium', mito(78, 140, -15) + mito(245, 246, 10) + mito(322, 160, 70)],
        ['chloroplast', chloro(300, 62, 15) + chloro(330, 110, 80) + chloro(330, 205, 100) + chloro(85, 175, -30) + chloro(95, 225, 20) + chloro(296, 238, -10) + chloro(170, 246, 5)],
        ['zellkern', '<circle class="c-nuc" cx="95" cy="95" r="28"/><circle class="c-nucleolus" cx="101" cy="89" r="8"/>'],
        ['zellmembran', `${rrect(mem)} class="c-mem-p"/>${rrect(mem)} class="hit-stroke"/>`],
        ['zellwand', `<path class="c-wall-p" fill-rule="evenodd" d="${ring(outer, inner)}"/>`],
      ];
    }
    if (type === 'tier') {
      return [
        ['zellplasma', `<path class="c-plasma-t" d="${ANIMAL_PATH}"/>`],
        ['ribosomen', ribos([[110, 165], [160, 88], [250, 86], [306, 172], [200, 228], [240, 246], [102, 196]])],
        ['mitochondrium', mito(120, 110, -20) + mito(292, 122, 30) + mito(142, 210, 15) + mito(272, 214, -25) + mito(222, 74, 0)],
        ['zellkern', '<circle class="c-nuc" cx="200" cy="150" r="36"/><circle class="c-nucleolus" cx="208" cy="142" r="9"/>'],
        ['zellmembran', `<path class="c-mem-t" d="${ANIMAL_PATH}"/><path class="hit-stroke" d="${ANIMAL_PATH}"/>`],
      ];
    }
    // Bakterie
    const cap = { x: 60, y: 85, w: 300, h: 130, r: 65 }, wo = { x: 76, y: 99, w: 268, h: 102, r: 51 }, wi = { x: 86, y: 109, w: 248, h: 82, r: 41 }, mem = { x: 90, y: 113, w: 240, h: 74, r: 37 };
    const dna = 'M150 150 C150 125 185 130 195 145 C205 160 230 125 250 135 C275 148 262 172 240 168 C220 164 205 178 185 170 C165 162 150 172 150 150 Z';
    const flag = 'M356 150 q12 -16 24 0 t24 0 t24 0';
    const piliPath = 'M140 99 L134 74 M185 99 L185 72 M230 99 L236 74 M275 101 L285 78 M150 201 L144 226 M200 201 L200 228 M250 201 L258 226';
    return [
      ['kapsel', `${rrect(cap)} class="c-caps"/>`],
      ['pili', `<path class="c-pili" d="${piliPath}"/><path class="hit-stroke" d="${piliPath}"/>`],
      ['geissel', `<path class="c-flag" d="${flag}"/><path class="hit-stroke wide" d="${flag}"/>`],
      ['zellwand', `<path class="c-wall-b" fill-rule="evenodd" d="${ring(wo, wi)}"/>`],
      ['zellplasma', `${rrect(mem)} class="c-plasma-b"/>`],
      ['ribosomen', ribos([[112, 140], [140, 176], [230, 182], [270, 174], [318, 152], [256, 119]])],
      ['plasmid', '<circle class="c-plasmid" cx="292" cy="135" r="8"/><circle class="hit" cx="292" cy="135" r="17"/><circle class="c-plasmid" cx="118" cy="160" r="7"/><circle class="hit" cx="118" cy="160" r="16"/>'],
      ['bakterien_dna', `<path class="c-dna" d="${dna}"/><path class="hit-stroke wide" d="${dna}"/>`],
      ['zellmembran', `${rrect(mem)} class="c-mem-b"/>${rrect(mem)} class="hit-stroke"/>`],
    ];
  }

  // Anker für Beschriftung/Markierung: [x, y, Seite, Label-y]
  const ANCHORS = {
    pflanze: { W: 400, H: 300, zellkern: [95, 95, 'l', 60], mitochondrium: [78, 140, 'l', 125], chloroplast: [85, 175, 'l', 175], zellmembran: [57, 214, 'l', 215], zellwand: [46, 246, 'l', 258], ribosomen: [268, 66, 'r', 40], vakuole: [292, 120, 'r', 110], zellplasma: [322, 230, 'r', 200] },
    tier: { W: 400, H: 300, mitochondrium: [120, 110, 'l', 80], zellmembran: [80, 140, 'l', 140], ribosomen: [102, 196, 'l', 210], zellkern: [228, 136, 'r', 110], zellplasma: [326, 140, 'r', 175] },
    bakterie: { W: 440, H: 300, pili: [185, 82, 'l', 40], zellmembran: [101, 124, 'l', 100], kapsel: [66, 150, 'l', 150], zellwand: [87, 173, 'l', 200], ribosomen: [140, 176, 'l', 250], bakterien_dna: [250, 135, 'r', 55], plasmid: [292, 135, 'r', 100], geissel: [404, 150, 'r', 150], zellplasma: [300, 172, 'r', 215] },
    mikroskop: { W: 300, H: 420, okular: [168, 36, 'r', 30], stativ: [245, 200, 'r', 190], grobtrieb: [268, 262, 'r', 250], feintrieb: [260, 305, 'r', 305], tubus: [128, 100, 'l', 95], revolver: [100, 155, 'l', 150], objektiv: [114, 200, 'l', 198], klemmen: [72, 232, 'l', 232], objekttisch: [56, 244, 'l', 266], blende: [108, 257, 'l', 298], lampe: [122, 360, 'l', 336], fuss: [42, 392, 'l', 392] },
  };

  function microParts() {
    return [
      ['fuss', '<path class="m-dark" d="M50 375 L250 375 Q262 375 262 387 L262 400 L38 400 L38 387 Q38 375 50 375 Z"/>'],
      ['stativ', '<path class="m-arm" d="M215 375 L245 375 L245 140 Q245 95 175 88 L172 110 Q215 116 215 150 Z"/>'],
      ['lampe', '<circle class="m-lamp" cx="135" cy="360" r="13"/><circle class="hit" cx="135" cy="356" r="20"/><path class="m-ray" d="M135 340 V332 M120 346 l-6 -6 M150 346 l6 -6"/>'],
      ['objekttisch', '<rect class="m-dark" x="55" y="236" width="175" height="12" rx="3"/>'],
      ['blende', '<rect class="m-blende" x="108" y="252" width="54" height="9" rx="4"/><rect class="hit" x="100" y="249" width="70" height="18"/>'],
      ['klemmen', '<rect class="m-clip" x="68" y="228" width="36" height="7" rx="3"/><rect class="m-clip" x="160" y="228" width="36" height="7" rx="3"/><rect class="hit" x="64" y="220" width="44" height="15"/><rect class="hit" x="156" y="220" width="44" height="15"/>'],
      ['grobtrieb', '<circle class="m-knob" cx="250" cy="262" r="18"/><circle class="m-knob-in" cx="250" cy="262" r="6"/>'],
      ['feintrieb', '<circle class="m-knob" cx="250" cy="305" r="10"/><circle class="m-knob-in" cx="250" cy="305" r="3.5"/><circle class="hit" cx="252" cy="306" r="18"/>'],
      ['tubus', '<rect class="m-tube" x="128" y="52" width="34" height="98"/>'],
      ['revolver', '<path class="m-rev" d="M100 150 L190 150 L178 172 L112 172 Z"/>'],
      ['objektiv', '<rect class="m-obj" x="114" y="172" width="14" height="40"/><rect class="m-obj" x="138" y="172" width="14" height="30"/><rect class="m-obj" x="162" y="172" width="14" height="22"/>' +
        '<rect x="114" y="200" width="14" height="4" fill="#3b82f6"/><rect x="138" y="190" width="14" height="4" fill="#eab308"/><rect x="162" y="183" width="14" height="4" fill="#ef4444"/>'],
      ['okular', '<rect class="m-dark" x="122" y="20" width="46" height="34" rx="6"/>'],
    ];
  }

  function arrow(a, W, H) {
    const [x, y] = a;
    const sx = x - 70 < 8 ? x + 70 : x - 70;
    const sy = y - 55 < 8 ? y + 55 : y - 55;
    // Linie endet kurz vor dem Ziel, die Pfeilspitze (marker) zeigt genau darauf
    const d = Math.hypot(x - sx, y - sy), ex = x - ((x - sx) / d) * 4, ey = y - ((y - sy) / d) * 4;
    return `<defs><marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">` +
      `<path d="M0 0 L10 5 L0 10 Z" fill="#dc2626"/></marker></defs>` +
      `<g class="mark-arrow" pointer-events="none"><line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" marker-end="url(#arrowhead)"/><circle cx="${sx}" cy="${sy}" r="5"/></g>`;
  }

  /**
   * Zeichnet ein Diagramm.
   * kind: 'pflanze' | 'tier' | 'bakterie' | 'mikroskop'
   * opts: { labels, omit: [parts], mark: part, interactive, cls, title }
   */
  function draw(kind, opts) {
    opts = opts || {};
    const A = ANCHORS[kind];
    const omit = [].concat(opts.omit || []);
    const parts = (kind === 'mikroskop' ? microParts() : cellParts(kind)).filter(([p]) => !omit.includes(p));
    let body = parts.map(([p, svg]) => g(p, svg)).join('');
    const names = kind === 'mikroskop' ? MPARTS : PARTS;
    let vb = `0 0 ${A.W} ${A.H}`;
    if (opts.labels) {
      const pad = kind === 'mikroskop' ? 135 : 150;
      vb = `${-pad} 0 ${A.W + pad * 2} ${A.H}`;
      parts.forEach(([p]) => {
        const a = A[p];
        if (!a) return;
        const [x, y, side, ly] = a;
        const lx = side === 'l' ? -12 : A.W + 12;
        body += `<g class="label" data-part="${p}"><line x1="${x}" y1="${y}" x2="${lx}" y2="${ly}"/><circle cx="${x}" cy="${y}" r="3"/>` +
          `<text x="${side === 'l' ? lx - 4 : lx + 4}" y="${ly}" dy="0.35em" text-anchor="${side === 'l' ? 'end' : 'start'}">${names[p].name}</text></g>`;
      });
    }
    if (opts.mark && A[opts.mark]) body += arrow(A[opts.mark], A.W, A.H);
    const label = opts.title || (kind === 'mikroskop' ? 'Mikroskop' : TYPES[kind].name);
    return `<svg class="diagram ${kind}${opts.cls ? ' ' + opts.cls : ''}${opts.labels ? ' labeled' : ''}" viewBox="${vb}" role="img" aria-label="${label}">${body}</svg>`;
  }

  const partsOf = (type) => Object.keys(PARTS).filter((p) => PARTS[p].in.includes(type));

  root.Cells = { TYPES, PARTS, MPARTS, ALL, draw, partsOf, ANCHORS };
})(window);
