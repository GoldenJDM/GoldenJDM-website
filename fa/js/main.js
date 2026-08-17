/**
 * GoldenJDM Portfolio - Main JavaScript
 * Author: Amirhossein Zarniyan (@GoldenJDM)
 *
 * The hero canvas animation lives in the shared /js/hero-canvas.js.
 */

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
