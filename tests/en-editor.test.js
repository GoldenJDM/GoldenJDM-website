import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';

// The Vercel editor only initializes on localhost, which is jsdom's default origin.
// The script is loaded once so a single editor instance handles all messages.

function msg(data) {
  window.dispatchEvent(new MessageEvent('message', { data }));
}

function setMode(on) {
  msg({ t: 'mode', v: on });
}

function clickToSelect(el) {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

let postMessageSpy;

beforeAll(async () => {
  await import('../en/js/main.js');
});

beforeEach(() => {
  document.body.innerHTML = '';
  document.body.style.cursor = '';
  postMessageSpy = vi.spyOn(window, 'postMessage').mockImplementation(() => {});
});

afterEach(() => {
  setMode(false);
  vi.restoreAllMocks();
});

describe('vercel editor mode', () => {
  it('toggles the crosshair cursor with mode messages', () => {
    setMode(true);
    expect(document.body.style.cursor).toBe('crosshair');
    setMode(false);
    expect(document.body.style.cursor).toBe('');
  });

  it('selects a clicked element and posts its details', () => {
    setMode(true);
    document.body.innerHTML = '<p id="target">Hello</p>';
    clickToSelect(document.getElementById('target'));

    expect(postMessageSpy).toHaveBeenCalledWith(
      expect.objectContaining({ t: 'sel', tag: 'p', textContent: 'Hello', id: 'target' }),
      '*'
    );
  });

  it('applies text and style properties to the selected element', () => {
    setMode(true);
    document.body.innerHTML = '<p id="target">Hello</p>';
    const target = document.getElementById('target');
    clickToSelect(target);
    postMessageSpy.mockClear();

    msg({ t: 'apply', p: { textContent: 'Updated', color: 'red', fontSize: '20px', href: '/x' } });
    expect(target.textContent).toBe('Updated');
    expect(target.style.color).toBe('red');
    expect(target.style.fontSize).toBe('20px');
    expect(target.getAttribute('href')).toBe('/x');
    expect(postMessageSpy).toHaveBeenCalledWith(expect.objectContaining({ t: 'html' }), '*');
  });

  it('deletes the selected element', () => {
    setMode(true);
    document.body.innerHTML = '<div id="wrap"><p id="target">Hello</p></div>';
    const target = document.getElementById('target');
    clickToSelect(target);

    msg({ t: 'del' });
    expect(document.body.contains(target)).toBe(false);
  });

  it('duplicates the selected element after itself', () => {
    setMode(true);
    document.body.innerHTML = '<div id="wrap"><p id="target">Hello</p></div>';
    const wrap = document.getElementById('wrap');
    clickToSelect(document.getElementById('target'));

    msg({ t: 'dup' });
    expect(wrap.children).toHaveLength(2);
    expect(wrap.children[1].textContent).toBe('Hello');
  });

  it('moves the selected element up and down among its siblings', () => {
    setMode(true);
    document.body.innerHTML = '<div id="wrap"><p id="a">A</p><p id="b">B</p></div>';
    const wrap = document.getElementById('wrap');
    clickToSelect(document.getElementById('b'));

    msg({ t: 'up' });
    expect(Array.from(wrap.children).map((c) => c.id)).toEqual(['b', 'a']);

    msg({ t: 'dn' });
    expect(Array.from(wrap.children).map((c) => c.id)).toEqual(['a', 'b']);
  });

  it('wraps the selected element in a padded container', () => {
    setMode(true);
    document.body.innerHTML = '<div id="wrap"><p id="target">Hello</p></div>';
    const target = document.getElementById('target');
    clickToSelect(target);

    msg({ t: 'wrap' });
    expect(target.parentElement.tagName).toBe('DIV');
    expect(target.parentElement.style.padding).toBe('10px');
    expect(target.parentElement.parentElement.id).toBe('wrap');
  });

  it('shows a hover overlay in edit mode and removes it on mouseout', () => {
    setMode(true);
    document.body.innerHTML = '<p id="target">Hello</p>';
    const target = document.getElementById('target');

    target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    const overlay = Array.from(document.body.children).find(
      (el) => el.style.outline === '2px solid #e8a838'
    );
    expect(overlay).toBeTruthy();
    expect(overlay.textContent).toBe('<p>');
    expect(postMessageSpy).toHaveBeenCalledWith({ t: 'hover', tag: 'p' }, '*');

    target.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    expect(document.body.contains(overlay)).toBe(false);
    expect(postMessageSpy).toHaveBeenCalledWith({ t: 'hover', tag: null }, '*');
  });

  it('ignores clicks and hovers when edit mode is off', () => {
    setMode(false);
    document.body.innerHTML = '<p id="target">Hello</p>';
    const target = document.getElementById('target');

    clickToSelect(target);
    target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    expect(postMessageSpy).not.toHaveBeenCalled();
  });
});
