/*
 * Sound – alle Geräusche werden mit der Web Audio API erzeugt (keine Audiodateien nötig).
 * Vorlesen nutzt die Sprachausgabe des Browsers (speechSynthesis, Deutsch).
 */
(function (root) {
  'use strict';

  let ctx = null;
  let muted = false;
  try { muted = localStorage.getItem('tq-muted') === '1'; } catch (e) { /* ignore */ }

  function ac() {
    if (!ctx) {
      const AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, opts) {
    opts = opts || {};
    const c = ac();
    if (!c) return;
    const t0 = c.currentTime + start;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = opts.type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(opts.slideTo, t0 + dur);
    const vol = opts.vol == null ? 0.18 : opts.vol;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  const sounds = {
    tap() { tone(660, 0, 0.07, { type: 'triangle', vol: 0.12 }); },
    key() { tone(880, 0, 0.04, { type: 'square', vol: 0.05 }); },
    select() { tone(520, 0, 0.06, { type: 'triangle', vol: 0.12 }); tone(780, 0.05, 0.08, { type: 'triangle', vol: 0.1 }); },
    swoosh() { tone(300, 0, 0.25, { type: 'sine', vol: 0.08, slideTo: 900 }); },
    correct() {
      tone(523.25, 0, 0.12, { type: 'triangle' });
      tone(659.25, 0.09, 0.12, { type: 'triangle' });
      tone(783.99, 0.18, 0.22, { type: 'triangle' });
    },
    wrong() {
      tone(220, 0, 0.18, { type: 'sawtooth', vol: 0.08, slideTo: 140 });
      tone(160, 0.16, 0.25, { type: 'sawtooth', vol: 0.07, slideTo: 110 });
    },
    almost() { tone(440, 0, 0.12, { type: 'triangle' }); tone(494, 0.12, 0.18, { type: 'triangle' }); },
    streak() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.06, 0.12, { type: 'square', vol: 0.06 })); },
    star() { tone(1046.5, 0, 0.18, { type: 'sine', vol: 0.15 }); tone(1568, 0.06, 0.25, { type: 'sine', vol: 0.1 }); },
    levelup() {
      [392, 523, 659, 784].forEach((f, i) => tone(f, i * 0.1, 0.15, { type: 'square', vol: 0.07 }));
      tone(1047, 0.42, 0.5, { type: 'triangle', vol: 0.15 });
    },
    fanfare() {
      const seq = [[523, 0], [523, 0.12], [523, 0.24], [659, 0.36], [784, 0.6], [659, 0.78], [784, 0.92]];
      seq.forEach(([f, t]) => tone(f, t, 0.2, { type: 'triangle', vol: 0.15 }));
      tone(1047, 1.08, 0.6, { type: 'triangle', vol: 0.15 });
    },
    tick() { tone(1200, 0, 0.025, { type: 'square', vol: 0.04 }); },
  };

  function play(name) {
    if (muted || !sounds[name]) return;
    try { sounds[name](); } catch (e) { /* Audio kann im Browser blockiert sein */ }
  }

  // ---------- Vorlesen ----------
  function spokenText(text) {
    return String(text)
      .replace(/²/g, ' hoch 2 ')
      .replace(/³/g, ' hoch 3 ')
      .replace(/\^(\d+)/g, ' hoch $1 ')
      .replace(/·/g, ' mal ')
      .replace(/−/g, ' minus ')
      .replace(/(\d)\s*-\s*(\d)/g, '$1 minus $2')
      .replace(/\s:\s/g, ' geteilt durch ')
      .replace(/=/g, ' gleich ')
      .replace(/\(/g, ' Klammer auf ')
      .replace(/\)/g, ' Klammer zu ')
      .replace(/[→⇒]/g, ', ')
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ');
  }

  let speakingCb = null;
  function speak(text, onEnd) {
    if (!('speechSynthesis' in root)) return false;
    stopSpeaking();
    const u = new SpeechSynthesisUtterance(spokenText(text));
    u.lang = 'de-DE';
    u.rate = 0.95;
    const voices = root.speechSynthesis.getVoices();
    const de = voices.find((v) => /^de/i.test(v.lang));
    if (de) u.voice = de;
    speakingCb = onEnd || null;
    u.onend = u.onerror = () => { const cb = speakingCb; speakingCb = null; if (cb) cb(); };
    root.speechSynthesis.speak(u);
    return true;
  }
  function stopSpeaking() {
    if ('speechSynthesis' in root) root.speechSynthesis.cancel();
    const cb = speakingCb; speakingCb = null; if (cb) cb();
  }

  root.Sound = {
    play,
    speak,
    stopSpeaking,
    canSpeak: () => 'speechSynthesis' in root,
    isMuted: () => muted,
    setMuted(v) {
      muted = !!v;
      try { localStorage.setItem('tq-muted', muted ? '1' : '0'); } catch (e) { /* ignore */ }
      if (muted) stopSpeaking();
    },
  };
})(window);
