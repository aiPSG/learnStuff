/*
 * Tutor – Chat mit Claude unter jeder Quizfrage + Knöpfe mit typischen Fragen.
 *
 * Die Fragen-Knöpfe beantworten wir mit fest hinterlegten, geprüften Erklärungen
 * (funktioniert auch ohne API-Key und kostet nichts). Freie Fragen gehen an Claude.
 *
 * Woher kommt der Zugang zu Claude?
 *   1. TQ_CONFIG.proxyUrl gesetzt → Anfragen gehen an den eigenen Proxy (Key liegt dort).
 *   2. Sonst: Key, den ein Elternteil unter ⚙️ eingegeben hat (nur localStorage dieses Geräts).
 */
(function (root) {
  'use strict';

  const CFG = root.TQ_CONFIG || {};
  const KEY_STORE = 'tq-anthropic-key';
  const USAGE_STORE = 'tq-tutor-usage';
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ---------- Typische Fragen pro Thema (mit geprüften Antworten) ----------
  const FAQ = {
    1: [
      ['Was ist eine Variable?', 'Eine Variable ist ein Platzhalter für eine Zahl – meistens ein Buchstabe wie x, a oder n. Für die Variable kann man verschiedene Zahlen einsetzen.'],
      ['Was ist ein Term?', 'Ein Term ist ein sinnvoller Rechenausdruck aus Zahlen, Variablen, Rechenzeichen und Klammern – aber ohne Gleichheitszeichen.\nBeispiele: 3x + 5, 2·(a − 4), 17'],
      ['Was ist der Unterschied zwischen Term und Gleichung?', 'Ein Term hat kein „=“, z. B. 2x + 1.\nEine Gleichung verbindet zwei Terme mit genau einem „=“, z. B. 2x + 1 = 9.'],
      ['Was ist eine Gleichungskette?', 'Mehrere „=“ hintereinander, z. B. beim Ausrechnen:\n3·4 + 2 = 12 + 2 = 14\nAlle Teile der Kette müssen denselben Wert haben.'],
      ['Ist eine einzelne Zahl auch ein Term?', 'Ja! Auch 17 ist ein Term. Und eine einzelne Variable wie x eigentlich auch – in den Aufgaben hier nennen wir einen einzelnen Buchstaben aber „Variable“.'],
    ],
    2: [
      ['Was sagt das Kommutativgesetz?', 'Vertauschungsgesetz: Bei Plus und Mal darfst du die Zahlen vertauschen.\na + b = b + a (Summanden vertauschen)\na · b = b · a (Faktoren vertauschen)'],
      ['Was sagt das Assoziativgesetz?', 'Verbindungsgesetz: Bei reinen Summen oder reinen Produkten darfst du die Klammern beliebig setzen.\n(a + b) + c = a + (b + c)\n(a · b) · c = a · (b · c)'],
      ['Gelten die Gesetze auch für Minus und Geteilt?', 'Nein! 7 − 3 = 4, aber 3 − 7 = −4.\nUnd 12 : 6 = 2, aber 6 : 12 = 0,5.\nBei Subtraktion und Division darfst du nicht vertauschen.'],
      ['Was sind Summanden und Faktoren?', 'Summand + Summand = Summe (z. B. 4 + 7)\nFaktor · Faktor = Produkt (z. B. 4 · 7)\nMinuend − Subtrahend = Differenz\nDividend : Divisor = Quotient'],
      ['Wozu braucht man die Gesetze?', 'Zum geschickten Rechnen: 4 · 13 · 25 = 4 · 25 · 13 = 100 · 13 = 1300.\nUnd beim Vereinfachen: 3a · 5b = 3 · 5 · a · b = 15ab.'],
    ],
    3: [
      ['Wie finde ich die Termart heraus?', 'Schau, welche Rechnung als LETZTE ausgeführt wird (Klammer vor Punkt vor Strich).\nZuletzt + → Summe, − → Differenz, · → Produkt, : → Quotient.\nBeispiel: (3 + x) · 5 ist ein Produkt.'],
      ['Wie lese ich einen Rechenbaum?', 'Oben stehen Zahlen und Variablen. Jeder Kreis rechnet die beiden Dinge darüber zusammen. Ganz unten steht die Rechnung, die zuletzt kommt – sie bestimmt die Termart.'],
      ['Wie schreibe ich einen Term in Wortform?', 'Beginne mit der letzten Rechenart: „das Produkt aus … und …“. Dann beschreibst du den linken und den rechten Teil.\n(3 + x) · 5 → „das Produkt aus der Summe aus 3 und x und 5“'],
      ['Warum sind die Klammern so wichtig?', 'Klammern ändern, was zuerst gerechnet wird – und damit die Termart.\n3 + x · 5 ist eine Summe.\n(3 + x) · 5 ist ein Produkt.'],
    ],
    4: [
      ['Wie berechne ich den Wert eines Terms?', 'Setze für jede Variable die Zahl ein und rechne aus.\n3x + 2 für x = 4: 3·4 + 2 = 14'],
      ['Warum muss ich negative Zahlen einklammern?', 'Sonst passieren Fehler! x² für x = −3:\n(−3)² = (−3)·(−3) = 9 ✔\nOhne Klammer würde man −3² = −9 rechnen ✘'],
      ['Welche Reihenfolge gilt beim Rechnen?', 'Klammern → Potenzen → Punkt (·, :) → Strich (+, −).'],
      ['Was bedeutet 4x genau?', '4x heißt 4 · x. Für x = 5 also 4 · 5 = 20 – nicht 45!'],
    ],
    5: [
      ['Was sind gleichartige Terme?', 'Terme mit genau denselben Variablen und denselben Hochzahlen. Nur die Zahl davor darf anders sein.\n3x und −5x ✔, 2a² und 7a² ✔\n4x und 4x² ✘, 3a und 3b ✘'],
      ['Wie fasse ich Terme zusammen?', 'Addiere oder subtrahiere nur die Zahlen vor den gleichartigen Termen – die Variable bleibt gleich.\n4x + 2y − x + 3y = 3x + 5y'],
      ['Was bedeutet ein x ohne Zahl davor?', 'x bedeutet 1x und −x bedeutet −1x.\n7a − a = 6a'],
      ['Kann ich 3x + 2y zusammenfassen?', 'Nein – das sind verschiedene Variablen („Äpfel und Birnen“). 3x + 2y bleibt so stehen.'],
    ],
    6: [
      ['Wie vereinfache ich ein Produkt wie 3a · 4b?', 'Zahlen zu Zahlen, Buchstaben zu Buchstaben:\n3a · 4b = 3 · 4 · a · b = 12ab'],
      ['Was ist x · x?', 'x · x = x² (x hoch 2). Und x² · x = x³.\n2a · 5a = 10a²'],
      ['Welche Vorzeichenregeln gelten beim Multiplizieren?', 'plus · plus = plus\nminus · minus = plus\nplus · minus = minus\nTipp: Gerade Anzahl Minuszeichen → plus, ungerade → minus.'],
      ['Darf ich den Malpunkt weglassen?', 'Ja, zwischen Zahl und Variable oder zwischen Variablen: 12 · a · b = 12ab. Zwischen zwei Zahlen aber nicht: 3 · 4 ist nicht 34!'],
    ],
    7: [
      ['Was ist eine Minusklammer?', 'Eine Klammer, vor der ein Minus steht, z. B. 5 − (2x − 3).'],
      ['Wie löse ich eine Minusklammer auf?', 'Minus und Klammer weglassen und JEDES Vorzeichen in der Klammer umdrehen:\n5 − (2x − 3) = 5 − 2x + 3 = 8 − 2x'],
      ['Was ist mit dem ersten Glied in der Klammer?', 'Es hat ein unsichtbares Plus. Das wird auch umgedreht:\n−(4a + b) = −4a − b'],
      ['Und bei einer Plusklammer?', 'Einfach die Klammer weglassen, nichts ändert sich:\n5 + (2x − 3) = 5 + 2x − 3'],
    ],
    8: [
      ['Was ist das Distributivgesetz?', 'Verteilungsgesetz: a · (b + c) = a·b + a·c\nDer Faktor vor der Klammer wird auf jeden Summanden „verteilt“.'],
      ['Wie multipliziere ich aus?', 'Jeden Summanden in der Klammer mit dem Faktor davor multiplizieren:\n3 · (x + 4) = 3x + 12\n−2 · (x − 5) = −2x + 10'],
      ['Wie klammere ich aus?', '1. Gemeinsamen Faktor suchen (Zahl und Variable).\n2. Jeden Summanden durch ihn teilen.\n3. Probe durch Ausmultiplizieren.\n6x + 9 = 3 · (2x + 3)'],
      ['Woran erkenne ich den größten gemeinsamen Faktor?', 'Nimm den größten gemeinsamen Teiler der Zahlen und die Variablen, die in ALLEN Summanden vorkommen.\n4ab + 6a → ggT(4, 6) = 2, gemeinsam ist a → 2a'],
    ],
    9: [
      ['Wie multipliziere ich zwei Klammern?', 'Jeder Summand der ersten Klammer mal jeden der zweiten:\n(a + b)(c + d) = ac + ad + bc + bd'],
      ['Wie viele Produkte entstehen?', 'Anzahl der Summanden in Klammer 1 mal Anzahl in Klammer 2.\n2 und 2 → 4 Produkte, 3 und 2 → 6 Produkte.'],
      ['Kannst du ein Beispiel mit Minus zeigen?', '(x − 4)(x + 2)\n= x² + 2x − 4x − 8\n= x² − 2x − 8'],
      ['Was muss ich am Ende noch machen?', 'Gleichartige Terme zusammenfassen:\nx² + 3x + 2x + 6 = x² + 5x + 6'],
    ],
    10: [
      ['Wie stelle ich einen Term für eine Fläche auf?', 'Rechteck: A = Länge · Breite. Besteht eine Seite aus Stücken, kommt sie in Klammern:\nBreite x + 4, Höhe 3 → A = 3 · (x + 4)'],
      ['Wie gehe ich bei zusammengesetzten Figuren vor?', 'Zerlege die Figur in Rechtecke, stelle für jedes einen Term auf und addiere sie.'],
      ['Wie berechne ich das Volumen eines Quaders?', 'V = Länge · Breite · Höhe\n2x · 3 · x = 6x²'],
      ['Warum gibt es mehrere richtige Terme?', 'Weil gleichwertige Terme dieselbe Fläche beschreiben: 3 · (x + 4) und 3x + 12 sind gleich – das ist das Distributivgesetz.'],
    ],
  };

  // ---------- Zugang ----------
  function getKey() { try { return localStorage.getItem(KEY_STORE) || ''; } catch (e) { return ''; } }
  function setKey(k) { try { if (k) localStorage.setItem(KEY_STORE, k); else localStorage.removeItem(KEY_STORE); } catch (e) { /* ignore */ } client = null; }
  const mode = () => (CFG.proxyUrl ? 'proxy' : getKey() ? 'key' : 'none');
  const available = () => mode() !== 'none';

  let sdk = null, client = null;
  async function getClient() {
    if (client) return client;
    if (root.__TQ_TEST_CLIENT) { client = root.__TQ_TEST_CLIENT; sdk = { default: {} }; return client; }
    sdk = sdk || (await import(CFG.sdkUrl));
    const Anthropic = sdk.default;
    client = CFG.proxyUrl
      ? new Anthropic({ apiKey: 'via-proxy', baseURL: CFG.proxyUrl, dangerouslyAllowBrowser: true, maxRetries: 1 })
      : new Anthropic({ apiKey: getKey(), dangerouslyAllowBrowser: true, maxRetries: 1 });
    return client;
  }

  function usageToday() {
    const today = new Date().toISOString().slice(0, 10);
    let u = { day: today, n: 0 };
    try { const s = JSON.parse(localStorage.getItem(USAGE_STORE) || 'null'); if (s && s.day === today) u = s; } catch (e) { /* ignore */ }
    return u;
  }
  function countUse() { const u = usageToday(); u.n++; try { localStorage.setItem(USAGE_STORE, JSON.stringify(u)); } catch (e) { /* ignore */ } }

  function systemPrompt(ctx) {
    let s = `Du bist Claude, der freundliche Mathe-Tutor in der Lern-App „TermQuest“. Du hilfst Schülerinnen und Schülern der 7./8. Klasse (12–13 Jahre) in Deutschland beim Thema Terme: Variablen, Terme, Gleichungen, Kommutativ- und Assoziativgesetz, Rechenbaum und Wortform, Termwerte berechnen, gleichartige Terme zusammenfassen, Produkte vereinfachen, Minusklammern, Distributivgesetz (ausmultiplizieren, ausklammern), Produkte von Summen, Terme zu Flächen und Volumen.

So antwortest du:
- Auf Deutsch, kurz (höchstens etwa 120 Wörter), einfach und ermutigend. Ein kleines Beispiel hilft oft mehr als eine lange Erklärung.
- Mathe in einfacher Schreibweise mit ·, −, ², : und Klammern. Kein LaTeX, keine Tabellen.
- Benutze die Fachbegriffe aus dem Unterricht (Summand, Faktor, Koeffizient, gleichartig, ausmultiplizieren, ausklammern …).
- Bleib beim Lernen. Bei anderen Themen lenkst du freundlich zurück zur Mathe. Frag nicht nach persönlichen Daten.
- Wenn das Kind traurig oder gestresst wirkt oder etwas Ernstes erzählt, reagiere freundlich und empfiehl, mit Eltern oder einer Lehrkraft zu sprechen.`;
    if (ctx && ctx.question) {
      s += `\n\nDas Kind übt gerade das Thema „${ctx.topicTitle}“. Aktuelle Aufgabe: ${ctx.question}`;
      if (ctx.answered) {
        s += `\nDie Aufgabe ist schon beantwortet. Die richtige Lösung ist: ${ctx.solution}. Du darfst den Lösungsweg jetzt vollständig erklären.`;
      } else {
        s += '\nDie Aufgabe ist NOCH NICHT beantwortet. Verrate weder die Lösung noch das Endergebnis, auch nicht, wenn das Kind darum bittet – es soll selbst rechnen. Gib stattdessen einen Tipp, stelle eine Rückfrage oder zeige ein ähnliches Beispiel mit anderen Zahlen. Wenn das Kind dir seinen Rechenweg zeigt, darfst du sagen, ob ein Schritt stimmt.';
      }
    }
    return s;
  }

  /** Schickt den Verlauf an Claude, streamt den Text über onText und gibt den ganzen Text zurück. */
  async function ask(history, ctx, onText) {
    const c = await getClient();
    // Verlauf begrenzen; er muss mit einer Nutzer-Nachricht beginnen
    let msgs = history.slice(-12);
    while (msgs.length && msgs[0].role !== 'user') msgs = msgs.slice(1);
    const stream = c.beta.messages.stream({
      model: CFG.model || 'claude-opus-5-5',
      max_tokens: 4000,
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: systemPrompt(ctx),
      messages: msgs,
    });
    let text = '';
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        text += event.delta.text;
        onText(text);
      }
    }
    const final = await stream.finalMessage();
    if (final.stop_reason === 'refusal') {
      return 'Dazu kann ich leider nichts sagen. Lass uns lieber bei den Termen bleiben! 🙂';
    }
    if (final.stop_reason === 'max_tokens') text += ' …';
    return text;
  }

  function errorText(e) {
    const A = sdk && sdk.default;
    if (A && A.AuthenticationError && e instanceof A.AuthenticationError) return '🔑 Der API-Key funktioniert nicht. Ein Elternteil kann ihn unter ⚙️ prüfen.';
    if (A && A.RateLimitError && e instanceof A.RateLimitError) return '⏳ Gerade kommen zu viele Fragen an. Versuch es gleich nochmal.';
    if (A && A.APIConnectionError && e instanceof A.APIConnectionError) return '📡 Keine Verbindung zu Claude. Bist du online?';
    if (A && A.APIError && e instanceof A.APIError) return '😕 Claude ist gerade nicht erreichbar (Fehler ' + (e.status || '?') + ').';
    return '😕 Das hat nicht geklappt. Versuch es später nochmal.';
  }

  // Einfache Formatierung für Antworten: **fett**, Zeilenumbrüche
  const fmt = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');

  /**
   * Baut das Chat-Fenster in container ein.
   * opts: { topic, history (Array, wird weiterverwendet), getContext(), hint, sound, fx }
   */
  function mount(container, opts) {
    const S = root.Sound, FX = root.FX;
    const faq = FAQ[opts.topic.id] || [];
    const history = opts.history;
    container.innerHTML = `
      <section class="card tutor" aria-label="Frag Claude">
        <div class="tutor-head">
          <div class="tutor-bot" aria-hidden="true">🤖</div>
          <div><h2>Frag Claude</h2><small>${available() ? 'Dein KI-Mathe-Tutor – gibt Tipps, aber verrät keine Lösungen, solange du rechnest.' : 'Die Fragen-Knöpfe funktionieren immer. Für eigene Fragen muss ein Elternteil Claude unter ⚙️ einrichten.'}</small></div>
        </div>
        <div class="faq-chips" data-silent>
          <button class="faq-chip tip" data-tip="1">💡 Gib mir einen Tipp zu dieser Aufgabe</button>
          ${faq.map(([q], i) => `<button class="faq-chip" data-i="${i}">${esc(q)}</button>`).join('')}
        </div>
        <div class="chat-log" aria-live="polite"></div>
        <form class="chat-form" data-silent>
          <input class="chat-input" type="text" maxlength="400" autocomplete="off" placeholder="${available() ? 'Deine Frage zu Termen …' : 'Claude ist noch nicht eingerichtet'}" ${available() ? '' : 'disabled'} aria-label="Frage an Claude">
          <button class="btn small" type="submit" ${available() ? '' : 'disabled'}>Senden ➤</button>
        </form>
      </section>`;
    const log = container.querySelector('.chat-log');
    const form = container.querySelector('.chat-form');
    const input = container.querySelector('.chat-input');
    let busy = false;

    function bubble(role, html, extraCls) {
      const d = document.createElement('div');
      d.className = 'bubble ' + role + (extraCls ? ' ' + extraCls : '');
      d.innerHTML = html;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
      return d;
    }
    // Bisherigen Verlauf (aus früheren Fragen dieses Quiz) anzeigen
    history.forEach((m) => bubble(m.role === 'user' ? 'me' : 'bot', fmt(m.content)));

    async function send(text) {
      if (busy) return;
      if (!available()) return;
      const u = usageToday();
      if (u.n >= (CFG.dailyMessageLimit || 40)) {
        bubble('bot', 'Für heute hast du schon ganz viele Fragen gestellt. Morgen geht es weiter! 🌙', 'info');
        S.play('almost');
        return;
      }
      busy = true;
      form.classList.add('busy');
      history.push({ role: 'user', content: text });
      bubble('me', fmt(text));
      S.play('select');
      const b = bubble('bot', '<span class="typing"><i></i><i></i><i></i></span>');
      try {
        countUse();
        const answer = await ask(history, opts.getContext(), (t) => { b.innerHTML = fmt(t); log.scrollTop = log.scrollHeight; });
        b.innerHTML = fmt(answer);
        history.push({ role: 'assistant', content: answer });
        S.play('correct');
        FX.pop(b);
      } catch (e) {
        history.pop(); // fehlgeschlagene Frage nicht im Verlauf lassen
        b.classList.add('error');
        b.innerHTML = errorText(e);
        S.play('wrong');
        if (root.console) console.warn('Tutor-Fehler', e);
      } finally {
        busy = false;
        form.classList.remove('busy');
      }
    }

    container.querySelectorAll('.faq-chip').forEach((chip) => chip.addEventListener('click', () => {
      FX.pop(chip);
      if (chip.dataset.tip) {
        if (available()) { send('Kannst du mir einen Tipp zu dieser Aufgabe geben, ohne die Lösung zu verraten?'); return; }
        bubble('me', 'Gib mir einen Tipp zu dieser Aufgabe');
        bubble('bot', fmt(opts.hint || 'Lies die Aufgabe genau und schau dir die Erklärung zum Thema noch einmal an.'), 'faq');
        S.play('select');
        return;
      }
      const [q, a] = faq[+chip.dataset.i];
      bubble('me', esc(q));
      const b = bubble('bot', fmt(a) + '<div class="faq-src">📘 aus dem Lernheft</div>', 'faq');
      S.play('select');
      FX.pop(b);
      // In den Verlauf aufnehmen, damit Claude bei Rückfragen den Zusammenhang kennt
      history.push({ role: 'user', content: q }, { role: 'assistant', content: a });
    }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = input.value.trim();
      if (!t) { FX.shake(input); return; }
      input.value = '';
      send(t);
    });
  }

  root.Tutor = { mount, available, mode, getKey, setKey, FAQ, systemPrompt };
})(window);
