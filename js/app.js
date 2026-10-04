/*
 * TermQuest – App-Logik: Navigation, Lernkarten, Quiz, Fortschritt.
 */
(function () {
  'use strict';

  const S = window.Sound, FX = window.FX, M = window.MathTerm, R = window.Rand, AV = window.Avatar, TU = window.Tutor;
  const TOPICS = window.Topics.list;
  const esc = window.Visuals.esc;
  const main = document.getElementById('main');

  const KEY = 'termquest-v1';
  const SELF = ['Das kann ich anderen erklären.', 'Dabei mache ich nur selten Fehler.', 'Das muss ich noch üben.', 'Dabei brauche ich Hilfe von anderen.'];
  const SELF_ICON = ['🧑‍🏫', '✅', '🏋️', '🙋'];
  const LEVELS = ['Term-Neuling', 'Variablen-Entdecker', 'Klammer-Knacker', 'Term-Profi', 'Algebra-Ass', 'Term-Meister', 'Mathe-Legende'];
  const QUIZ_LEN = 8;
  const PRAISE = ['Richtig! 🎉', 'Stark! 💪', 'Super gemacht! ⭐', 'Genau so! 🙌', 'Klasse! 🚀', 'Volltreffer! 🎯'];
  const HINTS = {
    4: 'Tipp: Setze negative Zahlen in Klammern und denk an Punkt vor Strich.',
    5: 'Tipp: Fasse nur Terme mit genau denselben Variablen und Hochzahlen zusammen.',
    6: 'Tipp: Multipliziere erst die Zahlen, dann die Variablen. Zähle die Minuszeichen!',
    7: 'Tipp: Minus vor der Klammer dreht ALLE Vorzeichen in der Klammer um.',
    8: 'Tipp: Jeder Summand in der Klammer wird mit dem Faktor multipliziert – Vorzeichen beachten!',
    9: 'Tipp: Jeder mit jedem – und am Ende gleichartige Terme zusammenfassen.',
    10: 'Tipp: Fläche = Länge · Breite. Zusammengesetzte Seiten gehören in Klammern.',
  };

  // ---------- Speicher ----------
  function load() {
    const def = { name: '', xp: 0, best: {}, self: {}, plays: {}, test: null, credits: 0, avatar: AV.defaults() };
    let st;
    try { st = Object.assign(def, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { st = def; }
    st.avatar = Object.assign(AV.defaults(), st.avatar || {});
    return st;
  }
  const store = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* privater Modus */ } }

  // Jedes Level braucht mehr XP: 100, 300, 600, 1000, 1500, 2100, …
  const levelStart = (l) => 50 * l * (l + 1);
  const level = () => { let l = 0; while (store.xp >= levelStart(l + 1)) l++; return l; };
  const levelProgress = () => { const l = level(); return (store.xp - levelStart(l)) / (levelStart(l + 1) - levelStart(l)); };
  const levelName = (l) => LEVELS[Math.min(l, LEVELS.length - 1)];
  const starsFor = (frac) => (frac >= 0.95 ? 3 : frac >= 0.75 ? 2 : frac >= 0.5 ? 1 : 0);
  const starStr = (n) => '★'.repeat(n) + '☆'.repeat(3 - n);

  // ---------- Kopfzeile ----------
  const hdr = {
    level: document.getElementById('hdr-level'),
    bar: document.getElementById('hdr-xpbar'),
    xp: document.getElementById('hdr-xp'),
    mute: document.getElementById('btn-mute'),
    credits: document.getElementById('hdr-credits'),
    avatar: document.getElementById('hdr-avatar'),
    settings: document.getElementById('btn-settings'),
  };
  function updateHeader(pop) {
    const l = level();
    hdr.level.textContent = 'Lv ' + (l + 1);
    hdr.level.title = levelName(l);
    hdr.bar.style.width = levelProgress() * 100 + '%';
    hdr.xp.textContent = store.xp + ' XP';
    hdr.credits.textContent = store.credits;
    hdr.avatar.innerHTML = AV.render(store.avatar, { cls: 'mini' });
    if (pop) FX.pop(hdr.xp.parentElement);
  }

  function addCredits(n, el) {
    if (n <= 0) return;
    store.credits += n;
    save();
    updateHeader();
    S.play('coin');
    FX.pop(hdr.credits.parentElement);
    if (el) FX.floatText(el, '+' + n + ' 🪙', 'coins');
  }
  function updateMute() {
    hdr.mute.textContent = S.isMuted() ? '🔇' : '🔊';
    hdr.mute.setAttribute('aria-label', S.isMuted() ? 'Ton einschalten' : 'Ton ausschalten');
    hdr.mute.setAttribute('aria-pressed', S.isMuted() ? 'true' : 'false');
  }
  hdr.mute.addEventListener('click', () => {
    S.setMuted(!S.isMuted());
    updateMute();
    if (!S.isMuted()) S.play('select');
    toast(S.isMuted() ? 'Ton aus' : 'Ton an');
  });

  function addXP(n, el) {
    const before = level();
    store.xp += n;
    save();
    updateHeader(true);
    if (el) FX.floatText(el, '+' + n + ' XP', 'xp');
    if (level() > before) {
      setTimeout(() => {
        S.play('levelup');
        FX.confetti(null, 80, 120);
        toast(`⬆️ Level ${level() + 1}! Du bist jetzt <b>${levelName(level())}</b>`, 3200);
      }, 500);
    }
  }

  let toastTimer;
  function toast(html, ms) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.innerHTML = html;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), ms || 1800);
  }

  // Klick-Geräusch für alle Knöpfe und Links (Antwortknöpfe haben eigene Sounds)
  document.addEventListener('click', (e) => {
    const el = e.target.closest('a, button');
    if (el && !el.closest('[data-silent]') && !el.disabled) S.play('tap');
  });

  // ---------- Navigation ----------
  let quiz = null;
  function route() {
    S.stopSpeaking();
    quiz = null;
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    if (parts[0] === 't' && TOPICS[parts[1] - 1]) {
      if (parts[2] === 'quiz') startQuiz('topic', +parts[1]);
      else renderTopic(+parts[1]);
    } else if (parts[0] === 'test') {
      startQuiz('test');
    } else if (parts[0] === 'shop') {
      renderShop();
    } else {
      renderHome();
    }
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', route);

  // ---------- Startseite ----------
  function renderHome() {
    document.title = 'TermQuest – Terme II';
    const l = level();
    const totalStars = TOPICS.reduce((s, t) => s + starsFor(store.best[t.id] || 0), 0);
    main.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <h1>Hallo <input id="name" class="name-input" maxlength="20" placeholder="Name" value="${esc(store.name)}" aria-label="Dein Name" autocomplete="off">! 👋</h1>
          <p>Willkommen bei <b>TermQuest</b>. Hier lernst und übst du alles aus dem Selbstdiagnosebogen <b>„Terme II“</b>.
          Wähle ein Thema, lies die Erklärung und sammle beim Üben Sterne ⭐ und XP!</p>
        </div>
        <div class="level-card">
          <a class="lvl-avatar" href="#/shop" aria-label="Avatar anziehen">${AV.render(store.avatar)}</a>
          <div class="lvl-name">${levelName(l)}</div>
          <div class="lvl-sub">Level ${l + 1} · ${store.xp} XP</div>
          <div class="xpbar"><div style="width:${levelProgress() * 100}%"></div></div>
          <div class="lvl-sub">⭐ ${totalStars} / ${TOPICS.length * 3} Sterne · 🪙 ${store.credits} Credits</div>
          <a class="btn small shop-btn" href="#/shop">🛍️ Avatar-Shop</a>
        </div>
      </section>
      <div class="home-actions">
        <a class="btn big test-btn" href="#/test">🏆 Großer Test <small>2 Fragen zu jedem Thema</small></a>
        ${store.test ? `<div class="last-test">Letzter Test: <b>${store.test.score} / ${store.test.max}</b> Punkte</div>` : ''}
      </div>
      <h2 class="section-title">Deine 10 Themen</h2>
      <div class="topic-grid">
        ${TOPICS.map((t) => {
          const st = starsFor(store.best[t.id] || 0);
          const self = store.self[t.id];
          return `<a class="topic-card" href="#/t/${t.id}" style="--c:${t.color}">
            <span class="tc-num">${t.id}</span>
            <span class="tc-emoji" aria-hidden="true">${t.emoji}</span>
            <span class="tc-title">${t.title}</span>
            <span class="tc-foot">
              <span class="tc-stars" aria-label="${st} von 3 Sternen">${starStr(st)}</span>
              ${self != null ? `<span class="tc-self" title="${SELF[self]}">${SELF_ICON[self]}</span>` : ''}
            </span>
          </a>`;
        }).join('')}
      </div>
      <p class="footnote">Dein Fortschritt wird nur auf diesem Gerät gespeichert. <button class="linklike" id="reset">Fortschritt zurücksetzen</button></p>`;

    const name = document.getElementById('name');
    const fit = () => { name.style.width = Math.max(4, (name.value || name.placeholder).length + 1) + 'ch'; };
    fit();
    name.addEventListener('input', () => { fit(); S.play('key'); });
    name.addEventListener('change', () => {
      store.name = name.value.trim(); save();
      if (store.name) { toast(`Schön, dass du da bist, ${esc(store.name)}! 😊`); S.play('select'); }
    });
    document.getElementById('reset').addEventListener('click', () => {
      if (confirm('Wirklich alle Sterne, XP und Einschätzungen löschen?')) {
        Object.assign(store, { xp: 0, best: {}, self: {}, plays: {}, test: null, credits: 0, avatar: AV.defaults() });
        save(); updateHeader(); renderHome(); S.play('swoosh');
      }
    });
    document.querySelectorAll('.topic-card').forEach((c, i) => { c.style.animationDelay = i * 40 + 'ms'; });
  }

  // ---------- Themenseite ----------
  function renderTopic(id) {
    const t = TOPICS[id - 1];
    document.title = `${t.title} – TermQuest`;
    let card = 0;
    main.innerHTML = `
      <div class="topic-head" style="--c:${t.color}">
        <a href="#/" class="back">← Übersicht</a>
        <div class="th-title"><span class="th-emoji" aria-hidden="true">${t.emoji}</span><div><small>Thema ${t.id}</small><h1>${t.title}</h1></div></div>
        <p class="goal">🎯 ${t.goal}</p>
      </div>
      <section class="learn" style="--c:${t.color}" aria-label="Erklärung">
        <div class="card learn-card" aria-live="polite"></div>
        <div class="learn-nav">
          <button class="btn ghost" id="lc-prev" aria-label="Vorherige Karte">←</button>
          <div class="dots">${t.learn.map((_, i) => `<button class="dot" data-i="${i}" aria-label="Karte ${i + 1}"></button>`).join('')}</div>
          <button class="btn" id="lc-next">Weiter →</button>
        </div>
      </section>
      <div class="cta-row"><a class="btn big play-btn" style="--c:${t.color}" href="#/t/${t.id}/quiz">🎮 Jetzt üben!</a>
        <span class="best">Bester Versuch: <b>${starStr(starsFor(store.best[t.id] || 0))}</b></span></div>
      <section class="card self-card">
        <h2>So geht es mir bei diesem Thema:</h2>
        <div class="self-chips">${SELF.map((s, i) => `<button class="chip${store.self[t.id] === i ? ' on' : ''}" data-i="${i}" data-silent aria-pressed="${store.self[t.id] === i}">${SELF_ICON[i]} ${s}</button>`).join('')}</div>
      </section>
      ${t.book ? `<section class="card book-card"><h2>📚 Mehr Übungen im Buch</h2><p>${t.book}</p><small>(Angaben vom Selbstdiagnosebogen)</small></section>` : ''}
      <div class="topic-nav">
        ${id > 1 ? `<a class="btn ghost" href="#/t/${id - 1}">← Thema ${id - 1}</a>` : '<span></span>'}
        ${id < TOPICS.length ? `<a class="btn ghost" href="#/t/${id + 1}">Thema ${id + 1} →</a>` : '<span></span>'}
      </div>`;

    const box = main.querySelector('.learn-card');
    const prev = document.getElementById('lc-prev');
    const next = document.getElementById('lc-next');
    const dots = main.querySelectorAll('.dot');

    function showCard(i, dir) {
      S.stopSpeaking();
      card = i;
      const c = t.learn[i];
      box.innerHTML = `<div class="lc-head"><h2><span class="lc-num">${i + 1}/${t.learn.length}</span> ${c.title}</h2>
        ${S.canSpeak() ? '<button class="btn small ghost speak-btn" aria-label="Vorlesen">🔊 Vorlesen</button>' : ''}</div>
        <div class="lc-body">${c.html}</div>`;
      box.classList.remove('slide-l', 'slide-r');
      void box.offsetWidth;
      box.classList.add(dir < 0 ? 'slide-r' : 'slide-l');
      if (c.widget) window.Topics.widgets[c.widget](box);
      dots.forEach((d, k) => d.classList.toggle('on', k === i));
      prev.disabled = i === 0;
      next.textContent = i === t.learn.length - 1 ? 'Jetzt üben! 🎮' : 'Weiter →';
      const sp = box.querySelector('.speak-btn');
      if (sp) {
        sp.addEventListener('click', () => {
          if (sp.classList.contains('on')) { S.stopSpeaking(); return; }
          const ok = S.speak(c.title + '. ' + box.querySelector('.lc-body').innerText, () => { sp.classList.remove('on'); sp.textContent = '🔊 Vorlesen'; });
          if (ok) { sp.classList.add('on'); sp.textContent = '⏹ Stopp'; }
        });
      }
    }
    prev.addEventListener('click', () => { if (card > 0) { S.play('swoosh'); showCard(card - 1, -1); } });
    next.addEventListener('click', () => {
      if (card < t.learn.length - 1) { S.play('swoosh'); showCard(card + 1, 1); }
      else location.hash = `#/t/${t.id}/quiz`;
    });
    dots.forEach((d) => d.addEventListener('click', () => { const i = +d.dataset.i; showCard(i, i < card ? -1 : 1); }));
    showCard(0, 1);

    main.querySelectorAll('.chip').forEach((ch) => ch.addEventListener('click', () => {
      const i = +ch.dataset.i;
      store.self[t.id] = i; save();
      main.querySelectorAll('.chip').forEach((o) => { o.classList.toggle('on', o === ch); o.setAttribute('aria-pressed', o === ch); });
      S.play('select');
      FX.pop(ch);
      toast(i <= 1 ? 'Super – dann zeig es im Quiz! 💪' : 'Gut, dass du ehrlich bist! Üben hilft. 🌱');
    }));
  }

  // ---------- Quiz ----------
  function sig(q) { return q.prompt + '|' + (q.visual || '') + '|' + (q.expected || q.answer || ''); }
  function buildItems(mode, topicId) {
    const items = [];
    const seen = new Set();
    const pushQ = (t, gen) => {
      let q, tries = 0;
      do { q = gen(); tries++; } while (seen.has(sig(q)) && tries < 8);
      seen.add(sig(q));
      items.push({ topic: t, q });
    };
    if (mode === 'test') {
      TOPICS.forEach((t) => R.shuffle(t.gens).concat(t.gens).slice(0, 2).forEach((g) => pushQ(t, g)));
    } else {
      const t = TOPICS[topicId - 1];
      let gens = [];
      while (gens.length < QUIZ_LEN) gens = gens.concat(R.shuffle(t.gens));
      gens.slice(0, QUIZ_LEN).forEach((g) => pushQ(t, g));
    }
    return items;
  }

  function startQuiz(mode, topicId) {
    quiz = { mode, topicId, items: buildItems(mode, topicId), idx: 0, points: 0, xp: 0, streak: 0, bestStreak: 0, results: [], chat: [] };
    const t = topicId ? TOPICS[topicId - 1] : null;
    document.title = (t ? t.title : 'Großer Test') + ' – Üben – TermQuest';
    renderQuestion();
  }

  function mountTutor(t, q) {
    TU.mount(main.querySelector('.tutor-slot'), {
      topic: t,
      history: quiz.chat,
      hint: HINTS[t.id],
      getContext: () => {
        const plain = (sel) => { const el = main.querySelector(sel); return el ? el.innerText.replace(/\s+/g, ' ').trim() : ''; };
        return {
          topicTitle: t.title,
          question: [plain('.q-prompt'), plain('.q-visual')].filter(Boolean).join(' – ') +
            (q.type === 'mc' ? ' Antwortmöglichkeiten: ' + q.options.map((o) => o.replace(/<[^>]+>/g, '')).join(' | ') : ''),
          answered: !!(quiz && quiz.answered),
          solution: solutionHtml(q).replace(/<[^>]+>/g, ''),
        };
      },
    });
  }


  function renderQuestion() {
    const qz = quiz;
    const { topic: t, q } = qz.items[qz.idx];
    qz.attempts = 0;
    qz.answered = false;
    const n = qz.items.length;
    const exitHref = qz.mode === 'test' ? '#/' : `#/t/${qz.topicId}`;
    main.innerHTML = `
      <div class="quiz" style="--c:${t.color}">
        <div class="quiz-top">
          <a class="btn ghost small" href="${exitHref}" aria-label="Quiz beenden">✕</a>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${qz.idx}">
            ${qz.items.map((_, i) => `<span class="seg ${i < qz.idx ? (qz.results[i] === 1 ? 'ok' : qz.results[i] > 0 ? 'half' : 'bad') : i === qz.idx ? 'cur' : ''}"></span>`).join('')}
          </div>
          <div class="streak${qz.streak >= 2 ? ' hot' : ''}" title="Richtig in Folge">🔥 ${qz.streak}</div>
        </div>
        <div class="card q-card">
          <div class="q-meta"><span class="q-topic">${t.emoji} ${qz.mode === 'test' ? 'Thema ' + t.id + ': ' + t.title : t.title}</span><span>Frage ${qz.idx + 1} / ${n}</span></div>
          <div class="q-prompt-row"><h2 class="q-prompt">${q.prompt}</h2>
            ${S.canSpeak() ? '<button class="btn small ghost q-speak" aria-label="Frage vorlesen">🔊</button>' : ''}</div>
          ${q.visual ? `<div class="q-visual">${q.visual}</div>` : ''}
          <div class="q-answer"></div>
          <div class="feedback" aria-live="assertive" hidden></div>
        </div>
        <div class="q-actions">
          <button class="btn ghost" id="q-skip">🤷 Weiß ich nicht</button>
          <button class="btn big" id="q-check" data-silent>Prüfen ✔</button>
          <button class="btn big" id="q-next" hidden>Weiter →</button>
        </div>
        <div class="tutor-slot"></div>
      </div>`;

    mountTutor(t, q);

    const ans = main.querySelector('.q-answer');
    const check = document.getElementById('q-check');
    const skip = document.getElementById('q-skip');
    const nextBtn = document.getElementById('q-next');

    if (q.type === 'mc') {
      check.hidden = true;
      ans.innerHTML = `<div class="options ${q.optionStyle || ''}" data-silent>${q.options.map((o, i) =>
        `<button class="opt" data-i="${i}"><span class="opt-key">${'ABCD'[i]}</span><span class="opt-body">${o}</span></button>`).join('')}</div>`;
      ans.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => answerMC(+b.dataset.i)));
    } else {
      const letters = q.type === 'term' ? Array.from(new Set(((q.expected || '') + (q.prefix || '')).match(/[a-z]/g) || [])).sort() : [];
      const keys = q.type === 'term'
        ? letters.concat(['²', '³', '(', ')', '+', '−', '·'])
        : ['−', ','];
      // „4a − 2b = 2 · (“ → Zeile darüber „4a − 2b =“, direkt vor dem Eingabefeld „2 · (“
      const cut = q.prefix ? q.prefix.lastIndexOf('= ') : -1;
      const lead = cut >= 0 ? q.prefix.slice(0, cut + 1) : '';
      const inline = q.prefix ? q.prefix.slice(cut + 1).trim() : '';
      ans.innerHTML = `
        ${lead ? `<div class="input-lead m">${lead}</div>` : ''}
        <div class="input-row">
          ${inline ? `<span class="m affix">${inline}</span>` : ''}
          <input id="q-input" class="q-input${q.type === 'num' ? ' num' : ''}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"
            ${q.type === 'num' ? 'inputmode="decimal"' : ''} placeholder="${q.type === 'num' ? 'Zahl' : 'Dein Term'}" aria-label="Deine Antwort">
          ${q.suffix ? `<span class="m affix">${q.suffix}</span>` : ''}
        </div>
        <div class="keypad" data-silent>${keys.map((k) => `<button class="key" data-k="${k}" aria-label="${k}">${k}</button>`).join('')}
          <button class="key wide" data-k="back" aria-label="Löschen">⌫</button></div>
        ${q.type === 'term' ? '<div class="preview" aria-live="polite"></div>' : ''}`;
      const input = document.getElementById('q-input');
      const preview = ans.querySelector('.preview');
      const upd = () => {
        if (!preview) return;
        const v = input.value.trim();
        preview.innerHTML = v ? `So lese ich das: <span class="m">${esc(M.pretty(v))}</span>` : '<small>Tipp: Schreibe z. B. <b>3a^2</b> oder <b>3a²</b>, Malpunkte darfst du weglassen.</small>';
      };
      upd();
      input.addEventListener('input', () => { upd(); S.play('key'); });
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); if (!qz.answered) checkInput(); } });
      ans.querySelectorAll('.key').forEach((k) => k.addEventListener('click', () => {
        const val = k.dataset.k;
        const s = input.selectionStart == null ? input.value.length : input.selectionStart;
        const e = input.selectionEnd == null ? input.value.length : input.selectionEnd;
        if (val === 'back') {
          if (s === e && s > 0) { input.value = input.value.slice(0, s - 1) + input.value.slice(e); input.setSelectionRange(s - 1, s - 1); }
          else { input.value = input.value.slice(0, s) + input.value.slice(e); input.setSelectionRange(s, s); }
        } else {
          input.value = input.value.slice(0, s) + val + input.value.slice(e);
          input.setSelectionRange(s + val.length, s + val.length);
        }
        S.play('key');
        FX.pop(k);
        upd();
        input.focus();
      }));
      check.addEventListener('click', checkInput);
      if (window.matchMedia('(pointer: fine)').matches) input.focus();
    }

    skip.addEventListener('click', () => { if (!qz.answered) finish(false, true); });
    nextBtn.addEventListener('click', nextQuestion);
    const sp = main.querySelector('.q-speak');
    if (sp) sp.addEventListener('click', () => {
      const vis = main.querySelector('.q-visual .big-math, .q-visual .word-form');
      S.speak(main.querySelector('.q-prompt').innerText + (vis ? '. ' + vis.innerText : ''));
    });
  }

  function feedback(kind, html) {
    const fb = main.querySelector('.feedback');
    fb.hidden = false;
    fb.className = 'feedback ' + kind;
    fb.innerHTML = html;
    FX.pop(fb);
  }

  function solutionHtml(q) {
    if (q.type === 'num') return `<span class="m">${M.fmtNum(q.answer).replace('-', '−')}</span>`;
    if (q.type === 'term') {
      const sol = q.simplified ? M.simplify(q.expected) : M.pretty(q.expected);
      return `<span class="m">${q.prefix ? q.prefix + sol + (q.suffix || '') : sol}</span>`;
    }
    return q.options[q.correct];
  }

  function answerMC(i) {
    const qz = quiz;
    if (qz.answered) return;
    const q = qz.items[qz.idx].q;
    const btns = main.querySelectorAll('.opt');
    btns.forEach((b) => { b.disabled = true; });
    btns[q.correct].classList.add('correct');
    if (i !== q.correct) { btns[i].classList.add('wrong'); FX.shake(btns[i]); }
    finish(i === q.correct, false, btns[i]);
  }

  function checkInput() {
    const qz = quiz;
    const q = qz.items[qz.idx].q;
    const input = document.getElementById('q-input');
    const val = input.value.trim();
    if (!val) {
      FX.shake(input); S.play('almost');
      feedback('info', '✏️ Gib zuerst eine Antwort ein.');
      return;
    }
    let ok;
    if (q.type === 'num') {
      const norm = val.replace(/[−–]/g, '-').replace(',', '.').replace(/\s/g, '');
      if (!/^[-+]?\d*\.?\d+$/.test(norm)) {
        FX.shake(input); S.play('almost');
        feedback('info', '🤔 Gib bitte nur eine Zahl ein, z. B. <b>−7</b> oder <b>2,5</b>.');
        return;
      }
      ok = Math.abs(parseFloat(norm) - q.answer) < 1e-6;
    } else {
      const r = M.checkTerm(val, q.expected, { simplified: q.simplified });
      if (r.status === 'error') {
        FX.shake(input); S.play('almost');
        feedback('info', '🤔 ' + r.msg);
        return;
      }
      if (r.status === 'almost') {
        FX.shake(input); S.play('almost');
        feedback('almost', '👍 <b>Fast!</b> Dein Term ist gleichwertig – aber noch nicht fertig. ' + r.msg);
        return;
      }
      ok = r.status === 'ok';
    }
    if (!ok && qz.attempts === 0) {
      qz.attempts = 1;
      FX.shake(main.querySelector('.q-card'));
      S.play('wrong');
      feedback('retry', `❌ <b>Noch nicht richtig.</b> Du hast noch einen Versuch!<br><small>${HINTS[qz.items[qz.idx].topic.id] || 'Schau dir die Aufgabe noch einmal genau an.'}</small>`);
      input.select();
      return;
    }
    input.disabled = true;
    main.querySelectorAll('.key').forEach((k) => { k.disabled = true; });
    finish(ok, false, document.getElementById('q-check'));
  }

  function finish(ok, skipped, el) {
    const qz = quiz;
    const q = qz.items[qz.idx].q;
    qz.answered = true;
    const pts = ok ? (qz.attempts === 0 ? 1 : 0.5) : 0;
    qz.points += pts;
    qz.results[qz.idx] = pts;
    const card = main.querySelector('.q-card');
    const streakEl = main.querySelector('.streak');
    if (ok) {
      const xp = pts === 1 ? 10 : 5;
      qz.xp += xp;
      if (pts === 1) qz.streak++; else qz.streak = 0;
      qz.bestStreak = Math.max(qz.bestStreak, qz.streak);
      S.play('correct');
      FX.glow(card);
      FX.burstAt(el || card, 30);
      addXP(xp, el || card);
      if ([3, 5, 8, 10, 15, 20].includes(qz.streak)) {
        setTimeout(() => { S.play('streak'); FX.floatText(streakEl, `🔥 ${qz.streak}er-Serie!`, 'streak'); }, 350);
      }
      feedback('good', `<b>${R.pick(PRAISE)}</b>${pts < 1 ? ' <small>(im zweiten Versuch)</small>' : ''}<div class="explain">${q.explain || ''}</div>`);
    } else {
      qz.streak = 0;
      if (!skipped) { S.play('wrong'); FX.shake(card); } else { S.play('swoosh'); }
      if (q.type === 'mc') main.querySelectorAll('.opt').forEach((b) => { b.disabled = true; });
      main.querySelectorAll('.opt')[q.correct] && q.type === 'mc' && main.querySelectorAll('.opt')[q.correct].classList.add('correct');
      const inp = document.getElementById('q-input');
      if (inp) inp.disabled = true;
      main.querySelectorAll('.key').forEach((k) => { k.disabled = true; });
      feedback('bad', `<b>${skipped ? 'Kein Problem – so geht es:' : 'Leider falsch.'}</b> Richtig ist: ${solutionHtml(q)}<div class="explain">${q.explain || ''}</div>`);
    }
    streakEl.textContent = '🔥 ' + qz.streak;
    streakEl.classList.toggle('hot', qz.streak >= 2);
    FX.pop(streakEl);
    const seg = main.querySelectorAll('.seg')[qz.idx];
    seg.className = 'seg ' + (pts === 1 ? 'ok' : pts > 0 ? 'half' : 'bad');
    document.getElementById('q-check').hidden = true;
    document.getElementById('q-skip').hidden = true;
    const nb = document.getElementById('q-next');
    nb.hidden = false;
    nb.textContent = qz.idx === qz.items.length - 1 ? 'Ergebnis 🏁' : 'Weiter →';
    setTimeout(() => nb.focus({ preventScroll: true }), 50);
    main.querySelector('.feedback').scrollIntoView({ behavior: FX.reduced ? 'auto' : 'smooth', block: 'nearest' });
  }

  function nextQuestion() {
    if (!quiz) return;
    S.stopSpeaking();
    quiz.idx++;
    if (quiz.idx >= quiz.items.length) renderResults();
    else { renderQuestion(); S.play('swoosh'); window.scrollTo({ top: 0, behavior: FX.reduced ? 'auto' : 'smooth' }); }
  }

  document.addEventListener('keydown', (e) => {
    if (!quiz || !main.querySelector('.q-card')) return;
    // Tippen im Chat oder in Dialogen darf keine Quiz-Tastenkürzel auslösen
    if (e.target.closest && e.target.closest('.tutor, dialog')) return;
    if (e.key === 'Enter' && quiz.answered && document.activeElement && document.activeElement.id !== 'q-next') { e.preventDefault(); nextQuestion(); }
    const q = quiz.items[quiz.idx].q;
    if (q.type === 'mc' && !quiz.answered) {
      const map = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 };
      const i = map[e.key.toLowerCase()];
      if (i != null && i < q.options.length) answerMC(i);
    }
  });

  // ---------- Ergebnis ----------
  function renderResults() {
    const qz = quiz;
    const max = qz.items.length;
    const frac = qz.points / max;
    const stars = starsFor(frac);
    const isTest = qz.mode === 'test';
    let newBest = false;
    if (!isTest) {
      const prev = store.best[qz.topicId] || 0;
      if (frac > prev) { store.best[qz.topicId] = frac; newBest = prev > 0 || frac > 0; }
      store.plays[qz.topicId] = (store.plays[qz.topicId] || 0) + 1;
    } else {
      store.test = { score: qz.points, max, date: new Date().toISOString() };
    }
    save();
    // Credits: 5 pro Punkt + Sterne-Bonus
    const earned = Math.round(qz.points * 5) + [0, 0, 5, 15][stars];

    const headline = stars === 3 ? 'Perfekt! 🏆' : stars === 2 ? 'Stark gemacht! 💪' : stars === 1 ? 'Gut – weiter so! 🌱' : 'Dranbleiben! 🧗';
    const name = store.name ? ', ' + esc(store.name) : '';

    let testTable = '';
    if (isTest) {
      const per = {};
      qz.items.forEach((it, i) => { per[it.topic.id] = (per[it.topic.id] || 0) + (qz.results[i] || 0); });
      testTable = `<table class="nice-table result-table"><tr><th>Thema</th><th>Punkte</th><th>Empfehlung</th></tr>
        ${TOPICS.map((t) => {
          const p = per[t.id] || 0;
          const self = store.self[t.id];
          let rec = p >= 2 ? '✅ Sitzt!' : p >= 1 ? '🙂 Fast sicher' : '🏋️ Nochmal üben';
          if (p < 1.5 && (self === 0 || self === 1)) rec += '<br><small>Du hast dich hier sicher eingeschätzt – schau nochmal rein!</small>';
          if (p >= 2 && (self === 2 || self === 3)) rec += '<br><small>Besser als gedacht! Pass deine Einschätzung an? 😉</small>';
          return `<tr><td><a href="#/t/${t.id}">${t.emoji} ${t.title}</a></td><td>${M.fmtNum(p)} / 2</td><td>${rec}</td></tr>`;
        }).join('')}</table>`;
    }

    const t = qz.topicId ? TOPICS[qz.topicId - 1] : null;
    main.innerHTML = `
      <div class="card results" style="--c:${t ? t.color : '#8b5cf6'}">
        <h1>${headline.replace(/(!)/, name + '$1')}</h1>
        <div class="big-stars" aria-label="${stars} von 3 Sternen">${[0, 1, 2].map((i) => `<span class="bstar" data-i="${i}">★</span>`).join('')}</div>
        <p class="score">Du hast <b>${M.fmtNum(qz.points)} von ${max}</b> Punkten.</p>
        <div class="res-stats">
          <div><b>+${qz.xp}</b><span>XP</span></div>
          <div class="coin-stat"><b>+${earned} 🪙</b><span>Credits</span></div>
          <div><b>🔥 ${qz.bestStreak}</b><span>beste Serie</span></div>
          <div><b>${Math.round(frac * 100)}%</b><span>richtig</span></div>
        </div>
        ${newBest ? '<p class="new-best">🎖️ Neuer Rekord für dieses Thema!</p>' : ''}
        ${testTable}
        <div class="res-actions">
          <a class="btn big" href="${isTest ? '#/test' : `#/t/${qz.topicId}/quiz`}" id="again">🔁 Nochmal</a>
          ${t ? `<a class="btn ghost" href="#/t/${t.id}">📖 Zur Erklärung</a>` : ''}
          ${t && t.id < TOPICS.length ? `<a class="btn ghost" href="#/t/${t.id + 1}">Nächstes Thema →</a>` : ''}
          <a class="btn ghost" href="#/shop">🛍️ Avatar-Shop (${store.credits + earned} 🪙)</a>
          <a class="btn ghost" href="#/">🏠 Übersicht</a>
        </div>
      </div>`;
    setTimeout(() => addCredits(earned, main.querySelector('.coin-stat')), 900);
    // „Nochmal“ auf derselben URL: hashchange feuert nicht → selbst neu starten
    document.getElementById('again').addEventListener('click', (e) => {
      const target = isTest ? '#/test' : `#/t/${qz.topicId}/quiz`;
      if (location.hash === target) { e.preventDefault(); route(); }
    });

    const bstars = main.querySelectorAll('.bstar');
    for (let i = 0; i < stars; i++) {
      setTimeout(() => {
        bstars[i].classList.add('on');
        S.play('star');
        FX.burstAt(bstars[i], 18);
      }, 400 + i * 450);
    }
    setTimeout(() => {
      if (stars >= 2) { S.play('fanfare'); FX.confetti(null, null, stars === 3 ? 160 : 90); }
      else if (stars === 0) S.play('almost');
    }, 400 + stars * 450 + 100);
    quiz = null;
  }


  // ---------- Avatar-Shop ----------
  function renderShop() {
    document.title = 'Avatar-Shop – TermQuest';
    const av = store.avatar;
    let slot = 'shirt';
    let preview = null; // Artikel, der gerade anprobiert wird

    main.innerHTML = `
      <a href="#/" class="back">← Übersicht</a>
      <h1 class="shop-title">🛍️ Avatar-Shop</h1>
      <div class="shop">
        <aside class="card shop-side">
          <div class="shop-avatar"></div>
          <div class="wallet" aria-live="polite">🪙 <b id="wallet">${store.credits}</b> Credits</div>
          <p class="wallet-hint">Credits bekommst du für jedes abgeschlossene Quiz – je mehr richtig, desto mehr!</p>
          <h2>Aussehen <small>(kostenlos)</small></h2>
          <div class="look-row" data-silent aria-label="Hautfarbe">${AV.SKINS.map((c, i) => `<button class="swatch skin" data-skin="${i}" style="background:${c}" aria-label="Hautfarbe ${i + 1}"></button>`).join('')}</div>
          <div class="look-row" data-silent aria-label="Frisur">${Object.entries(AV.HAIR_STYLES).map(([k, n]) => `<button class="look-btn" data-hair="${k}">${n}</button>`).join('')}</div>
          <div class="look-row" data-silent aria-label="Haarfarbe">${Object.entries(AV.HAIR_COLORS).map(([k, c]) => `<button class="swatch" data-hc="${k}" style="background:${c}" aria-label="Haarfarbe ${k}"></button>`).join('')}</div>
        </aside>
        <section class="shop-main">
          <div class="slot-tabs" role="tablist" data-silent>${AV.SLOTS.map((s) => `<button class="slot-tab" role="tab" data-slot="${s.id}">${s.emoji} ${s.name}</button>`).join('')}</div>
          <div class="item-grid"></div>
        </section>
      </div>`;

    const big = main.querySelector('.shop-avatar');
    const grid = main.querySelector('.item-grid');
    const drawBig = () => {
      big.innerHTML = AV.render(av, { preview: preview ? { [preview.slot]: preview.id } : null }) +
        (preview && !av.owned.includes(preview.id) ? '<div class="try-tag">Anprobiert 👀</div>' : '');
    };
    const markLook = () => {
      main.querySelectorAll('[data-skin]').forEach((b) => b.classList.toggle('on', +b.dataset.skin === av.skin));
      main.querySelectorAll('[data-hair]').forEach((b) => b.classList.toggle('on', b.dataset.hair === av.hair));
      main.querySelectorAll('[data-hc]').forEach((b) => b.classList.toggle('on', b.dataset.hc === av.hairColor && !av.equipped.dye));
    };
    const changed = () => { save(); updateHeader(); drawBig(); markLook(); };

    function drawGrid() {
      main.querySelectorAll('.slot-tab').forEach((b) => { b.classList.toggle('on', b.dataset.slot === slot); b.setAttribute('aria-selected', b.dataset.slot === slot); });
      grid.innerHTML = AV.ITEMS.filter((it) => it.slot === slot).map((it) => {
        const owned = av.owned.includes(it.id) || it.price === 0;
        const worn = av.equipped[it.slot] === it.id;
        const canBuy = store.credits >= it.price;
        const action = worn ? (it.slot === 'shirt' || it.slot === 'bg' ? '✔ Angezogen' : 'Ausziehen')
          : owned ? 'Anziehen' : `Kaufen · ${it.price} 🪙`;
        return `<div class="item${worn ? ' worn' : ''}${owned ? ' owned' : ''}${preview && preview.id === it.id ? ' trying' : ''}" data-id="${it.id}">
          <button class="item-thumb" data-act="try" data-silent aria-label="${it.name} anprobieren">${AV.render(av, { preview: { [it.slot]: it.id }, cls: 'thumb' })}</button>
          <div class="item-name">${it.name}</div>
          <button class="btn small item-btn${!owned && !canBuy ? ' poor' : ''}" data-act="main" data-silent ${worn && (it.slot === 'shirt' || it.slot === 'bg') ? 'disabled' : ''}>${action}</button>
        </div>`;
      }).join('');
      grid.querySelectorAll('.item').forEach((card) => {
        const it = AV.byId(card.dataset.id);
        card.querySelector('[data-act="try"]').addEventListener('click', () => {
          preview = preview && preview.id === it.id ? null : it;
          S.play('swoosh'); drawBig(); FX.pop(big); drawGrid();
        });
        card.querySelector('[data-act="main"]').addEventListener('click', (e) => {
          const owned = av.owned.includes(it.id) || it.price === 0;
          if (!owned) {
            if (store.credits < it.price) {
              S.play('wrong'); FX.shake(card);
              toast(`Dir fehlen noch <b>${it.price - store.credits} 🪙</b> – mach ein Quiz! 🎮`, 2600);
              preview = it; drawBig();
              return;
            }
            store.credits -= it.price;
            av.owned.push(it.id);
            av.equipped[it.slot] = it.id;
            if (it.slot === 'dye') { /* Haarfarbe aus dem Shop ersetzt die Grundfarbe */ }
            preview = null;
            S.play('coin'); setTimeout(() => S.play('levelup'), 150);
            FX.burstAt(card, 50);
            FX.floatText(e.currentTarget, '−' + it.price + ' 🪙', 'coins');
            toast(`🎉 <b>${it.name}</b> gehört jetzt dir!`, 2200);
            document.getElementById('wallet').textContent = store.credits;
          } else if (av.equipped[it.slot] === it.id) {
            delete av.equipped[it.slot];
            S.play('swoosh');
          } else {
            av.equipped[it.slot] = it.id;
            preview = null;
            S.play('select'); FX.pop(card);
          }
          changed(); drawGrid();
        });
      });
    }

    main.querySelectorAll('.slot-tab').forEach((b) => b.addEventListener('click', () => { slot = b.dataset.slot; preview = null; S.play('select'); drawBig(); drawGrid(); }));
    main.querySelectorAll('[data-skin]').forEach((b) => b.addEventListener('click', () => { av.skin = +b.dataset.skin; S.play('select'); changed(); FX.pop(big); drawGrid(); }));
    main.querySelectorAll('[data-hair]').forEach((b) => b.addEventListener('click', () => { av.hair = b.dataset.hair; S.play('select'); changed(); FX.pop(big); drawGrid(); }));
    main.querySelectorAll('[data-hc]').forEach((b) => b.addEventListener('click', () => { av.hairColor = b.dataset.hc; delete av.equipped.dye; S.play('select'); changed(); FX.pop(big); drawGrid(); }));
    drawBig(); markLook(); drawGrid();
  }

  // ---------- Einstellungen für Eltern (Claude-Zugang) ----------
  hdr.settings.addEventListener('click', () => {
    let dlg = document.getElementById('settings');
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.id = 'settings';
      document.body.appendChild(dlg);
    }
    const proxy = window.TQ_CONFIG && window.TQ_CONFIG.proxyUrl;
    dlg.innerHTML = `
      <form method="dialog" class="settings" data-silent>
        <h2>⚙️ Einstellungen für Eltern</h2>
        ${proxy ? `<p>✅ Claude ist über den Schul-/Familien-Server eingerichtet. Hier musst du nichts tun.</p>` : `
        <p>Für den Chat mit Claude braucht die App einen <b>Anthropic-API-Key</b>. Er wird <b>nur in diesem Browser auf diesem Gerät</b> gespeichert und nie ins Internet hochgeladen – außer direkt an Anthropic.</p>
        <p class="warn">⚠️ Wer an diesem Gerät die Entwicklerwerkzeuge öffnet, kann den Key sehen. Nutze einen eigenen Key mit niedrigem Ausgabenlimit (in der Anthropic Console einstellbar). Für mehrere Kinder/eine Klasse ist ein Proxy sicherer (siehe <i>proxy/README.md</i> im Projekt).</p>
        <label>API-Key<input type="password" id="api-key" autocomplete="off" placeholder="sk-ant-…" value="${TU.getKey() ? '••••••••••' : ''}"></label>
        <div class="settings-status">${TU.getKey() ? '🟢 Ein Key ist gespeichert.' : '⚪ Kein Key gespeichert – die Fragen-Knöpfe funktionieren trotzdem.'}</div>`}
        <div class="settings-actions">
          ${proxy ? '' : '<button class="btn ghost" value="delete" type="submit">Key löschen</button><button class="btn" value="save" type="submit">Speichern</button>'}
          <button class="btn ghost" value="close" type="submit">Schließen</button>
        </div>
      </form>`;
    dlg.onclose = () => {
      if (dlg.returnValue === 'save') {
        const v = dlg.querySelector('#api-key').value.trim();
        if (v && !v.startsWith('•')) { TU.setKey(v); toast('🔑 Key gespeichert'); S.play('correct'); }
      } else if (dlg.returnValue === 'delete') {
        TU.setKey(''); toast('Key gelöscht'); S.play('swoosh');
      }
      // Chat neu aufbauen, damit der Status (eingerichtet / nicht eingerichtet) stimmt
      if (quiz && main.querySelector('.tutor-slot')) mountTutor(quiz.items[quiz.idx].topic, quiz.items[quiz.idx].q);
    };
    dlg.showModal();
    S.play('select');
  });

  // Für automatische Tests: aktuelle Frage auslesen
  window.TermQuest = { currentQuestion: () => (quiz ? quiz.items[quiz.idx].q : null) };

  // ---------- Start ----------
  updateHeader();
  updateMute();
  route();
})();
