import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

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
  await import('../fa/js/main.js');
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

  it('resizes the canvas immediately on window resize', async () => {
    const canvas = addCanvas(800, 600);
    await loadScript();

    Object.defineProperty(canvas, 'offsetWidth', { value: 1000, configurable: true });
    window.dispatchEvent(new Event('resize'));
    expect(canvas.width).toBe(1000);
  });
});

describe('splash screen', () => {
  it('hides then removes the splash after page load', async () => {
    vi.useFakeTimers();
    const splash = document.createElement('div');
    splash.id = 'splash-screen';
    document.body.appendChild(splash);
    await loadScript();

    window.dispatchEvent(new Event('load'));
    expect(splash.classList.contains('hide')).toBe(false);

    vi.advanceTimersByTime(1400);
    expect(splash.classList.contains('hide')).toBe(true);
    expect(document.body.contains(splash)).toBe(true);

    vi.advanceTimersByTime(600);
    expect(document.body.contains(splash)).toBe(false);
  });

  it('does nothing on load when there is no splash element', async () => {
    await loadScript();
    expect(() => window.dispatchEvent(new Event('load'))).not.toThrow();
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
      btn: document.getElementById('hamburger'),
      menu: document.getElementById('navMenu'),
      outside: document.getElementById('outside'),
    };
  }

  it('toggles the menu open and closed on button clicks', async () => {
    const { btn, menu } = setupMenu();
    await loadScript();

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(btn.getAttribute('aria-expanded')).toBe('true');
    expect(menu.classList.contains('open')).toBe(true);

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(menu.classList.contains('open')).toBe(false);
  });

  it('closes the menu when clicking outside of it', async () => {
    const { btn, menu, outside } = setupMenu();
    await loadScript();

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(menu.classList.contains('open')).toBe(true);

    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    expect(menu.classList.contains('open')).toBe(false);
  });

  it('keeps the menu open when clicking inside it', async () => {
    const { btn, menu } = setupMenu();
    await loadScript();

    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    menu.querySelector('a').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(menu.classList.contains('open')).toBe(true);
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

  it('does not construct an observer when there are no triggers', async () => {
    const observerSpy = vi.fn();
    vi.stubGlobal('IntersectionObserver', observerSpy);
    await loadScript();
    expect(observerSpy).not.toHaveBeenCalled();
  });
});
