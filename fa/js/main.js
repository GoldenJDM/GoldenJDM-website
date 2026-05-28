/**
 * GoldenJDM Portfolio - Main JavaScript
 * Author: Amirhossein Zarniyan (@GoldenJDM)
 */

// ============================================
// 🎨 LIQUID AURORA CANVAS ANIMATION
// ============================================
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const PALETTE = [
    [110, 45, 220], [175, 30, 195], [210, 55, 130],
    [60, 55, 200], [145, 65, 230], [200, 100, 200]
  ];

  let blobs = [], W = 0, H = 0, startTime = null;

  function resize() {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;
  }

  function makeBlob(i) {
    const [r, g, b] = PALETTE[i % PALETTE.length];
    return {
      cx: W * (0.1 + Math.random() * 0.8),
      cy: H * (0.1 + Math.random() * 0.8),
      ax: W * (0.18 + Math.random() * 0.22),
      ay: H * (0.18 + Math.random() * 0.22),
      speed: 0.00035 + Math.random() * 0.00045,
      offset: Math.random() * Math.PI * 2,
      baseR: Math.min(W, H) * (0.40 + Math.random() * 0.25),
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.006 + Math.random() * 0.005,
      r, g, b
    };
  }

  function init() {
    blobs = [];
    for (let i = 0; i < 6; i++) blobs.push(makeBlob(i));
  }

  function tick(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#08000f';
    ctx.fillRect(0, 0, W, H);

    for (const b of blobs) {
      const angle = elapsed * b.speed + b.offset;
      const x = b.cx + Math.cos(angle) * b.ax;
      const y = b.cy + Math.sin(angle * 0.71) * b.ay;

      b.pulsePhase += b.pulseSpeed;
      const pulse = 1 + Math.sin(b.pulsePhase) * 0.10;
      const radius = b.baseR * pulse;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0,    `rgba(${b.r},${b.g},${b.b}, 0.45)`);
      gradient.addColorStop(0.25, `rgba(${b.r},${b.g},${b.b}, 0.55)`);
      gradient.addColorStop(0.55, `rgba(${b.r},${b.g},${b.b}, 0.30)`);
      gradient.addColorStop(0.80, `rgba(${b.r},${b.g},${b.b}, 0.10)`);
      gradient.addColorStop(1,    `rgba(${b.r},${b.g},${b.b}, 0)`);

      ctx.globalCompositeOperation = 'plus-lighter';
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  requestAnimationFrame(tick);
})();

// ============================================
// 💫 SPLASH SCREEN
// ============================================
window.addEventListener('load', () => {
  const splash = document.getElementById('splash-screen');
  if (!splash) return;
  setTimeout(() => {
    splash.classList.add('hide');
    setTimeout(() => splash.remove(), 600);
  }, 1400);
});

// ============================================
// 🍔 HAMBURGER MENU
// ============================================
(function initNav() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('navMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('open', !open);
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
    }
  });
})();

// ============================================
// 🌊 FADE-IN ON SCROLL
// ============================================
(function initFadeIn() {
  const els = document.querySelectorAll('.fade-in-trigger');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('fade-in-visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => observer.observe(el));
})();
