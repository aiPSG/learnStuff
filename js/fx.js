/*
 * FX – visuelle Effekte: Konfetti, schwebende Punkte, Wackeln, Pulsieren.
 */
(function (root) {
  'use strict';

  const reduced = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COLORS = ['#ff5d8f', '#ffb703', '#3ddc97', '#4cc9f0', '#8b5cf6', '#ff7b00'];

  let canvas, cctx, parts = [], running = false;

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.className = 'fx-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    cctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = root.innerWidth * (root.devicePixelRatio || 1);
      canvas.height = root.innerHeight * (root.devicePixelRatio || 1);
      cctx.setTransform(root.devicePixelRatio || 1, 0, 0, root.devicePixelRatio || 1, 0, 0);
    };
    resize();
    root.addEventListener('resize', resize);
  }

  function confetti(x, y, count) {
    if (reduced) return;
    ensureCanvas();
    x = x == null ? root.innerWidth / 2 : x;
    y = y == null ? root.innerHeight / 3 : y;
    count = count || 80;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 3 + Math.random() * 7;
      parts.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 5,
        r: 4 + Math.random() * 5,
        rot: Math.random() * 6,
        vr: (Math.random() - 0.5) * 0.4,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        life: 0,
        shape: Math.random() < 0.3 ? 'circle' : 'rect',
      });
    }
    if (!running) { running = true; requestAnimationFrame(step); }
  }

  function step() {
    cctx.clearRect(0, 0, root.innerWidth, root.innerHeight);
    parts.forEach((p) => {
      p.vy += 0.25;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;
      cctx.save();
      cctx.globalAlpha = Math.max(0, 1 - p.life / 120);
      cctx.translate(p.x, p.y);
      cctx.rotate(p.rot);
      cctx.fillStyle = p.color;
      if (p.shape === 'circle') { cctx.beginPath(); cctx.arc(0, 0, p.r / 2, 0, Math.PI * 2); cctx.fill(); }
      else cctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
      cctx.restore();
    });
    parts = parts.filter((p) => p.life < 120 && p.y < root.innerHeight + 40);
    if (parts.length) requestAnimationFrame(step);
    else { running = false; cctx.clearRect(0, 0, root.innerWidth, root.innerHeight); }
  }

  function burstAt(el, count) {
    if (!el) return confetti(null, null, count);
    const r = el.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height / 2, count || 40);
  }

  function floatText(el, text, cls) {
    const r = el ? el.getBoundingClientRect() : { left: root.innerWidth / 2, top: root.innerHeight / 2, width: 0, height: 0 };
    const d = document.createElement('div');
    d.className = 'float-text ' + (cls || '');
    d.textContent = text;
    d.style.left = r.left + r.width / 2 + 'px';
    d.style.top = r.top + 'px';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 1200);
  }

  function anim(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth; // Animation neu starten
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 700);
  }

  root.FX = {
    confetti,
    burstAt,
    floatText,
    shake: (el) => anim(el, 'fx-shake'),
    pop: (el) => anim(el, 'fx-pop'),
    glow: (el) => anim(el, 'fx-glow'),
    reduced,
  };
})(window);
