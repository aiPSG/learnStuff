/*
 * Glossar-Seite (für alle Fächer): Karteikarten mit Suche, Antippen dreht um.
 * entries: [[Begriff, Erklärung (HTML)], …]
 */
(function (root) {
  'use strict';
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function page(main, entries, intro) {
    const all = entries.slice().sort((a, b) => a[0].localeCompare(b[0], 'de'));
    main.innerHTML = `<a href="#/" class="back">← Übersicht</a><h1 class="shop-title">📖 Glossar</h1>
      <p>${intro || 'Alle Fachbegriffe.'} Tippe eine Karte an, um sie umzudrehen – so kannst du dich selbst abfragen!</p>
      <div class="gloss-tools" data-silent><input id="gloss-q" class="chat-input" type="search" placeholder="Begriff suchen …" aria-label="Begriff suchen">
        <button class="btn small ghost" id="gloss-flip">🔄 Alle umdrehen</button></div>
      <div class="gloss-grid"></div>`;
    const grid = main.querySelector('.gloss-grid');
    let flipAll = false;
    const draw = () => {
      const q = main.querySelector('#gloss-q').value.trim().toLowerCase();
      grid.innerHTML = all.filter(([t, d]) => !q || t.toLowerCase().includes(q) || d.toLowerCase().includes(q))
        .map(([t, d]) => `<button class="gloss-card${flipAll ? ' flipped' : ''}" data-silent><span class="front">${esc(t)}</span><span class="back">${d}</span></button>`).join('') || '<p>Nichts gefunden.</p>';
      grid.querySelectorAll('.gloss-card').forEach((c) => c.addEventListener('click', () => { c.classList.toggle('flipped'); root.Sound.play('swoosh'); }));
    };
    main.querySelector('#gloss-q').addEventListener('input', draw);
    main.querySelector('#gloss-flip').addEventListener('click', () => { flipAll = !flipAll; draw(); root.Sound.play('select'); });
    draw();
  }

  root.Glossary = { page };
})(window);
