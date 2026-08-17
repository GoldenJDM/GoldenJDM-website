import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const SPLASH_KEY = 'goldenjdm_splash_seen_en';

let rafCallbacks;
let ctx;

function stubRaf() {
  rafCallbacks = [];
  vi.stubGlobal('requestAnimationFrame', vi.fn((cb) => rafCallbacks.push(cb)));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
}

function mockCanvasContext() {
  ctx = {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    fillStyle: '',
  };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx);
}

async function loadScript() {
  vi.resetModules();
  await import('../en/js/main.js');
}

function addCanvas(width = 800, height = 600) {
  const canvas = document.createElement('canvas');
  canvas.id = 'hero-canvas';
  Object.defineProperty(canvas, 'offsetWidth', { value: width, configurable: true });
  Object.defineProperty(canvas, 'offsetHeight', { value: height, configurable: true });
  document.body.appendChild(canvas);
  return canvas;
}

beforeEach(() => {
  document.body.innerHTML = '';
  document.body.className = '';
  document.body.style.cursor = '';
  localStorage.clear();
  stubRaf();
  mockCanvasContext();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('hero canvas animation', () => {
  it('does not start the animation loop when the canvas is absent', async () => {
    await loadScript();
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('sizes the canvas to its offset dimensions', async () => {
    const canvas = addCanvas(800, 600);
    await loadScript();
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
  });

  it('draws 6 blobs per frame and schedules the next frame', async () => {
    addCanvas();
    await loadScript();
    expect(rafCallbacks).toHaveLength(1);

    rafCallbacks[0](1000);
    expect(ctx.clearRect).toHaveBeenCalledTimes(1);
    expect(ctx.createRadialGradient).toHaveBeenCalledTimes(6);
    expect(ctx.arc).toHaveBeenCalledTimes(6);
    expect(ctx.fill).toHaveBeenCalledTimes(6);
    expect(rafCallbacks).toHaveLength(2);
  });

  it('resizes the canvas after the debounced resize handler fires', async () => {
    vi.useFakeTimers();
    const canvas = addCanvas(800, 600);
    await loadScript();

    Object.defineProperty(canvas, 'offsetWidth', { value: 1000, configurable: true });
    window.dispatchEvent(new Event('resize'));
    expect(canvas.width).toBe(800);

    vi.advanceTimersByTime(250);
    expect(canvas.width).toBe(1000);
  });

  it('pauses the animation when the page is hidden and resumes when visible', async () => {
    addCanvas();
    await loadScript();

    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(cancelAnimationFrame).toHaveBeenCalled();

    const framesBefore = rafCallbacks.length;
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(rafCallbacks.length).toBeGreaterThan(framesBefore);
  });
});

describe('navigation scroll effect', () => {
  it('toggles the scrolled class based on scroll position', async () => {
    document.body.innerHTML = '<nav></nav>';
    const nav = document.querySelector('nav');
    await loadScript();

    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(nav.classList.contains('scrolled')).toBe(true);

    Object.defineProperty(window, 'scrollY', { value: 10, configurable: true });
    window.dispatchEvent(new Event('scroll'));
    expect(nav.classList.contains('scrolled')).toBe(false);
  });
});

describe('hamburger menu', () => {
  function setupMenu() {
    document.body.innerHTML = `
      <nav>
        <button id="hamburger" aria-expanded="false"></button>
        <ul id="navMenu"><li><a href="#one">One</a></li></ul>
      </nav>
      <main><p id="outside">outside</p></main>
    `;
    return {
      hb: document.getElementById('hamburger'),
      nm: document.getElementById('navMenu'),
      outside: document.getElementById('outside'),
    };
  }

  it('opens the menu and focuses the first link on click', async () => {
    const { hb, nm } = setupMenu();
    await loadScript();

    hb.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(hb.classList.contains('active')).toBe(true);
    expect(nm.classList.contains('active')).toBe(true);
    expect(hb.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(nm.querySelector('a'));
  });

  it('closes the menu when a nav link is clicked', async () => {
    const { hb, nm } = setupMenu();
    await loadScript();

    hb.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    nm.querySelector('a').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(hb.classList.contains('active')).toBe(false);
    expect(nm.classList.contains('active')).toBe(false);
    expect(hb.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the menu when clicking outside the nav', async () => {
    const { hb, nm, outside } = setupMenu();
    await loadScript();

    hb.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(hb.classList.contains('active')).toBe(false);
    expect(nm.classList.contains('active')).toBe(false);
    expect(hb.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('fade-in on scroll', () => {
  it('observes triggers and reveals them when they intersect', async () => {
    const instances = [];
    class MockIntersectionObserver {
      constructor(cb) {
        this.cb = cb;
        this.observe = vi.fn();
        this.unobserve = vi.fn();
        instances.push(this);
      }
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    document.body.innerHTML = `
      <div class="fade-in-trigger" id="a"></div>
      <div class="fade-in-trigger" id="b"></div>
    `;
    const a = document.getElementById('a');
    const b = document.getElementById('b');
    await loadScript();

    const io = instances[instances.length - 1];
    expect(io.observe).toHaveBeenCalledWith(a);
    expect(io.observe).toHaveBeenCalledWith(b);

    io.cb([
      { isIntersecting: true, target: a },
      { isIntersecting: false, target: b },
    ]);
    expect(a.classList.contains('fade-in-visible')).toBe(true);
    expect(b.classList.contains('fade-in-visible')).toBe(false);
    expect(io.unobserve).toHaveBeenCalledWith(a);
    expect(io.unobserve).not.toHaveBeenCalledWith(b);
  });

  it('reveals all triggers immediately when IntersectionObserver is unavailable', async () => {
    document.body.innerHTML = '<div class="fade-in-trigger" id="a"></div>';
    await loadScript();
    expect(document.getElementById('a').classList.contains('fade-in-visible')).toBe(true);
  });
});

describe('splash screen', () => {
  function addSplash() {
    const splash = document.createElement('div');
    splash.id = 'splash-screen';
    document.body.appendChild(splash);
    return splash;
  }

  it('removes the splash immediately when it was already seen', async () => {
    localStorage.setItem(SPLASH_KEY, 'true');
    const splash = addSplash();
    await loadScript();
    expect(document.body.contains(splash)).toBe(false);
    expect(document.body.classList.contains('splash-active')).toBe(false);
  });

  it('shows the splash then hides it after the timers elapse', async () => {
    vi.useFakeTimers();
    const splash = addSplash();
    await loadScript();

    expect(document.body.classList.contains('splash-active')).toBe(true);
    expect(splash.classList.contains('hidden')).toBe(false);

    vi.advanceTimersByTime(2000);
    expect(splash.classList.contains('hidden')).toBe(true);

    vi.advanceTimersByTime(600);
    expect(splash.style.display).toBe('none');
    expect(splash.getAttribute('aria-hidden')).toBe('true');
    expect(document.body.classList.contains('splash-active')).toBe(false);
    expect(localStorage.getItem(SPLASH_KEY)).toBe('true');
  });
});
