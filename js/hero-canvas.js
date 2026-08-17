/**
 * GoldenJDM - Liquid aurora canvas animation for the #hero-canvas element.
 * Pauses while the tab is hidden and debounces resize re-initialisation.
 */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const PALETTE = [
    [110, 45, 220], [175, 30, 195], [210, 55, 130],
    [60, 55, 200], [145, 65, 230], [200, 100, 200]
  ];

  let blobs = [], W = 0, H = 0, raf, startTime = null;

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
      gradient.addColorStop(0, `rgba(${b.r},${b.g},${b.b}, 0.45)`);
      gradient.addColorStop(0.25, `rgba(${b.r},${b.g},${b.b}, 0.55)`);
      gradient.addColorStop(0.55, `rgba(${b.r},${b.g},${b.b}, 0.30)`);
      gradient.addColorStop(0.80, `rgba(${b.r},${b.g},${b.b}, 0.10)`);
      gradient.addColorStop(1, `rgba(${b.r},${b.g},${b.b}, 0)`);

      ctx.globalCompositeOperation = 'plus-lighter';
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(tick);
  }

  resize();
  init();
  raf = requestAnimationFrame(tick);

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { resize(); init(); }, 250);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    document.hidden ? cancelAnimationFrame(raf) : (startTime = null, raf = requestAnimationFrame(tick));
  });
})();
