/*
 * Avatar – SVG-Figur mit Grundaussehen (kostenlos) und Shop-Artikeln (kosten Credits).
 */
(function (root) {
  'use strict';

  const SKINS = ['#f9d7b5', '#f1c27d', '#d9a066', '#a8714a', '#6b4329'];
  const HAIR_COLORS = { braun: '#6b3e1f', schwarz: '#1f1b18', blond: '#e6be6a', rot: '#b8461f' };
  const HAIR_STYLES = { kurz: 'Kurz', lang: 'Lang', locken: 'Locken', zopf: 'Dutt', stachel: 'Stacheln', keine: 'Ohne' };

  // Shop-Artikel: slot, Name, Preis, Zeichenfunktion(s) für vordere/hintere Ebene
  const ITEMS = [
    // Oberteile
    { id: 'shirt-blau', slot: 'shirt', name: 'T-Shirt Blau', price: 0, color: '#3b82f6' },
    { id: 'shirt-gruen', slot: 'shirt', name: 'T-Shirt Grün', price: 15, color: '#22c55e' },
    { id: 'hoodie', slot: 'shirt', name: 'Hoodie', price: 40, color: '#8b5cf6' },
    { id: 'trikot', slot: 'shirt', name: 'Fußball-Trikot', price: 50, color: '#ef4444' },
    { id: 'laborkittel', slot: 'shirt', name: 'Forscher-Kittel', price: 70, color: '#f8fafc' },
    { id: 'held', slot: 'shirt', name: 'Mathe-Held mit Umhang', price: 140, color: '#dc2626' },
    // Kopfbedeckungen
    { id: 'partyhut', slot: 'hat', name: 'Partyhut', price: 25 },
    { id: 'muetze', slot: 'hat', name: 'Wollmütze', price: 35 },
    { id: 'cap', slot: 'hat', name: 'Basecap', price: 45 },
    { id: 'zauberhut', slot: 'hat', name: 'Zauberhut', price: 110 },
    { id: 'krone', slot: 'hat', name: 'Krone', price: 220 },
    // Brillen
    { id: 'rundbrille', slot: 'glasses', name: 'Runde Brille', price: 30 },
    { id: 'sonnenbrille', slot: 'glasses', name: 'Sonnenbrille', price: 55 },
    { id: 'sternbrille', slot: 'glasses', name: 'Sternen-Brille', price: 80 },
    // Extras
    { id: 'schal', slot: 'extra', name: 'Schal', price: 35 },
    { id: 'kopfhoerer', slot: 'extra', name: 'Kopfhörer', price: 65 },
    { id: 'medaille', slot: 'extra', name: 'Goldmedaille', price: 90 },
    // Haarfarben
    { id: 'haar-pink', slot: 'dye', name: 'Haarfarbe Pink', price: 30, color: '#ec4899' },
    { id: 'haar-blau', slot: 'dye', name: 'Haarfarbe Blau', price: 30, color: '#3b82f6' },
    { id: 'haar-gruen', slot: 'dye', name: 'Haarfarbe Grün', price: 30, color: '#10b981' },
    // Hintergründe
    { id: 'bg-hell', slot: 'bg', name: 'Hell', price: 0 },
    { id: 'bg-karo', slot: 'bg', name: 'Rechenkaro', price: 30 },
    { id: 'bg-sonne', slot: 'bg', name: 'Sonnenuntergang', price: 45 },
    { id: 'bg-weltall', slot: 'bg', name: 'Weltall', price: 95 },
  ];
  const SLOTS = [
    { id: 'shirt', name: 'Oberteile', emoji: '👕' },
    { id: 'hat', name: 'Hüte', emoji: '🎩' },
    { id: 'glasses', name: 'Brillen', emoji: '🕶️' },
    { id: 'extra', name: 'Extras', emoji: '🎧' },
    { id: 'dye', name: 'Haarfarben', emoji: '🎨' },
    { id: 'bg', name: 'Hintergründe', emoji: '🌌' },
  ];
  const byId = (id) => ITEMS.find((i) => i.id === id);

  function defaults() {
    return { skin: 1, hair: 'kurz', hairColor: 'braun', owned: ['shirt-blau', 'bg-hell'], equipped: { shirt: 'shirt-blau', bg: 'bg-hell' } };
  }

  let uid = 0;
  function background(id, k) {
    switch (id) {
      case 'bg-karo':
        return `<defs><pattern id="g${k}" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M14 0H0V14" fill="none" stroke="#bfdbfe" stroke-width="1.5"/></pattern></defs>
          <rect width="200" height="200" fill="#eff6ff"/><rect width="200" height="200" fill="url(#g${k})"/>
          <text x="22" y="40" font-size="16" fill="#93c5fd" font-weight="800">x²</text><text x="150" y="58" font-size="15" fill="#93c5fd" font-weight="800">a+b</text>`;
      case 'bg-sonne':
        return `<defs><linearGradient id="s${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fb923c"/><stop offset="1" stop-color="#f472b6"/></linearGradient></defs>
          <rect width="200" height="200" fill="url(#s${k})"/><circle cx="150" cy="60" r="26" fill="#fde047" opacity=".9"/>`;
      case 'bg-weltall': {
        let stars = '';
        [[20, 30], [170, 25], [40, 150], [160, 140], [100, 15], [185, 90], [15, 95], [60, 60], [140, 100]].forEach(([x, y], i) => {
          stars += `<circle cx="${x}" cy="${y}" r="${i % 3 ? 1.6 : 2.6}" fill="#fff"/>`;
        });
        return `<rect width="200" height="200" fill="#1e1b4b"/>${stars}<circle cx="165" cy="45" r="13" fill="#a78bfa"/><ellipse cx="165" cy="45" rx="22" ry="5" fill="none" stroke="#fde68a" stroke-width="2"/>`;
      }
      default:
        return '<rect width="200" height="200" fill="#ede9fe"/>';
    }
  }

  function hairBack(style, c) {
    if (style === 'lang') return `<path d="M52 92 Q48 40 100 38 Q152 40 148 92 L152 150 Q100 162 48 150 Z" fill="${c}"/>`;
    if (style === 'zopf') return `<circle cx="100" cy="36" r="17" fill="${c}"/>`;
    return '';
  }
  function hairFront(style, c) {
    switch (style) {
      case 'kurz':
      case 'lang':
      case 'zopf':
        return `<path d="M57 88 Q55 42 100 41 Q145 42 143 88 Q132 62 100 63 Q76 62 66 74 Q62 80 57 88 Z" fill="${c}"/>`;
      case 'locken': {
        let s = '';
        [[62, 72], [72, 56], [88, 47], [104, 45], [120, 50], [134, 60], [141, 76], [58, 88], [142, 90]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="13" fill="${c}"/>`; });
        return s;
      }
      case 'stachel':
        return `<path d="M58 84 L60 52 L72 64 L78 38 L90 58 L100 32 L110 58 L122 38 L128 64 L140 52 L142 84 Q130 64 100 64 Q70 64 58 84 Z" fill="${c}"/>`;
      default:
        return '';
    }
  }

  function shirt(item) {
    const c = item ? item.color : '#3b82f6';
    let s = `<path d="M30 200 Q30 146 100 138 Q170 146 170 200 Z" fill="${c}" stroke="rgba(0,0,0,.12)" stroke-width="2"/>`;
    if (!item) return s;
    if (item.id === 'hoodie') s += '<path d="M76 142 Q100 162 124 142" fill="none" stroke="#6d28d9" stroke-width="5"/><line x1="92" y1="152" x2="90" y2="176" stroke="#fff" stroke-width="3"/><line x1="108" y1="152" x2="110" y2="176" stroke="#fff" stroke-width="3"/><rect x="74" y="178" width="52" height="18" rx="6" fill="#7c3aed"/>';
    if (item.id === 'trikot') s += '<text x="100" y="186" text-anchor="middle" font-size="34" font-weight="900" fill="#fff" font-family="sans-serif">7</text><path d="M30 170 L52 158 M170 170 L148 158" stroke="#fff" stroke-width="5"/>';
    if (item.id === 'laborkittel') s += '<path d="M100 140 L84 200 M100 140 L116 200" stroke="#cbd5e1" stroke-width="3"/><rect x="122" y="166" width="16" height="4" fill="#3b82f6"/><text x="70" y="186" font-size="13" fill="#64748b" font-weight="800">π</text>';
    if (item.id === 'held') s += '<path d="M100 160 L106 172 L119 173 L109 181 L113 194 L100 186 L87 194 L91 181 L81 173 L94 172 Z" fill="#fde047"/>';
    return s;
  }
  function cape(item) {
    return item && item.id === 'held' ? '<path d="M44 150 Q20 200 30 200 L170 200 Q180 200 156 150 Z" fill="#1d4ed8"/>' : '';
  }
  function hat(id) {
    switch (id) {
      case 'partyhut': return '<path d="M100 8 L76 58 Q100 66 124 58 Z" fill="#f472b6"/><path d="M88 34 L112 34 M82 46 L118 46" stroke="#fde047" stroke-width="5"/><circle cx="100" cy="8" r="7" fill="#fde047"/>';
      case 'muetze': return '<path d="M56 76 Q56 30 100 30 Q144 30 144 76 Z" fill="#14b8a6"/><rect x="52" y="68" width="96" height="16" rx="8" fill="#0f766e"/><circle cx="100" cy="26" r="10" fill="#fff"/>';
      case 'cap': return '<path d="M58 70 Q58 32 100 32 Q142 32 142 70 Z" fill="#f97316"/><path d="M100 64 Q150 58 166 72 Q140 78 100 72 Z" fill="#ea580c"/><circle cx="100" cy="34" r="4" fill="#ea580c"/>';
      case 'zauberhut': return '<path d="M100 0 L66 66 L134 66 Z" fill="#6d28d9"/><ellipse cx="100" cy="66" rx="52" ry="10" fill="#5b21b6"/><text x="92" y="44" font-size="16" fill="#fde047">★</text><text x="104" y="24" font-size="10" fill="#fde047">★</text>';
      case 'krone': return '<path d="M64 62 L64 26 L82 44 L100 18 L118 44 L136 26 L136 62 Z" fill="#facc15" stroke="#ca8a04" stroke-width="3"/><circle cx="100" cy="48" r="6" fill="#ef4444"/><circle cx="78" cy="54" r="4" fill="#3b82f6"/><circle cx="122" cy="54" r="4" fill="#22c55e"/>';
      default: return '';
    }
  }
  function glasses(id) {
    switch (id) {
      case 'rundbrille': return '<g fill="rgba(255,255,255,.25)" stroke="#1f2937" stroke-width="3"><circle cx="84" cy="92" r="12"/><circle cx="116" cy="92" r="12"/></g><path d="M96 91 Q100 87 104 91" stroke="#1f2937" stroke-width="3" fill="none"/>';
      case 'sonnenbrille': return '<g fill="#111827"><rect x="68" y="83" width="28" height="18" rx="7"/><rect x="104" y="83" width="28" height="18" rx="7"/></g><path d="M96 89 L104 89" stroke="#111827" stroke-width="4"/><path d="M73 87 L80 87" stroke="#fff" stroke-width="2" opacity=".6"/>';
      case 'sternbrille': {
        const star = (cx) => `<path transform="translate(${cx} 92) scale(1.25)" d="M0 -12 L3.5 -4 L12 -4 L5.5 2 L8 11 L0 6 L-8 11 L-5.5 2 L-12 -4 L-3.5 -4 Z" fill="#f472b6" stroke="#be185d" stroke-width="1.5"/>`;
        return star(84) + star(116) + '<path d="M96 91 L104 91" stroke="#be185d" stroke-width="3"/>';
      }
      default: return '';
    }
  }
  function extra(id) {
    switch (id) {
      case 'schal': return '<path d="M70 132 Q100 148 130 132 L132 146 Q100 160 68 146 Z" fill="#ef4444"/><rect x="112" y="142" width="14" height="34" rx="4" fill="#dc2626"/><path d="M112 166 H126" stroke="#fff" stroke-width="3"/>';
      case 'kopfhoerer': return '<path d="M54 94 Q54 36 100 36 Q146 36 146 94" fill="none" stroke="#111827" stroke-width="7"/><rect x="44" y="82" width="18" height="28" rx="8" fill="#ec4899"/><rect x="138" y="82" width="18" height="28" rx="8" fill="#ec4899"/>';
      case 'medaille': return '<path d="M86 140 L100 168 L114 140" fill="none" stroke="#ef4444" stroke-width="6"/><circle cx="100" cy="174" r="12" fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/><text x="100" y="179" text-anchor="middle" font-size="12" font-weight="900" fill="#a16207">1</text>';
      default: return '';
    }
  }

  /** Zeichnet den Avatar. preview: {slot: itemId} überschreibt Ausgerüstetes (zum Anprobieren). */
  function render(av, opts) {
    opts = opts || {};
    const a = Object.assign(defaults(), av || {});
    const eq = Object.assign({}, a.equipped, opts.preview || {});
    const k = ++uid;
    const skin = SKINS[a.skin] || SKINS[1];
    const dye = eq.dye && byId(eq.dye);
    const hc = dye ? dye.color : HAIR_COLORS[a.hairColor] || HAIR_COLORS.braun;
    const sh = eq.shirt && byId(eq.shirt);
    const body =
      background(eq.bg, k) +
      cape(sh) +
      hairBack(a.hair, hc) +
      shirt(sh) +
      `<rect x="88" y="118" width="24" height="24" rx="6" fill="${skin}"/>` +
      `<circle cx="58" cy="94" r="9" fill="${skin}"/><circle cx="142" cy="94" r="9" fill="${skin}"/>` +
      `<ellipse cx="100" cy="90" rx="42" ry="46" fill="${skin}"/>` +
      '<circle cx="84" cy="93" r="5.5" fill="#1f2937"/><circle cx="116" cy="93" r="5.5" fill="#1f2937"/>' +
      '<circle cx="86" cy="91" r="1.8" fill="#fff"/><circle cx="118" cy="91" r="1.8" fill="#fff"/>' +
      '<circle cx="74" cy="106" r="6" fill="#fb7185" opacity=".35"/><circle cx="126" cy="106" r="6" fill="#fb7185" opacity=".35"/>' +
      '<path d="M88 110 Q100 121 112 110" fill="none" stroke="#7c2d12" stroke-width="3.5" stroke-linecap="round"/>' +
      hairFront(a.hair, hc) +
      extra(eq.extra) +
      glasses(eq.glasses) +
      hat(eq.hat);
    return `<svg class="avatar-svg ${opts.cls || ''}" viewBox="0 0 200 200" role="img" aria-label="Dein Avatar">${body}</svg>`;
  }

  root.Avatar = { ITEMS, SLOTS, SKINS, HAIR_COLORS, HAIR_STYLES, defaults, render, byId };
})(window);
