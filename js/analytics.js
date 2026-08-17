/**
 * GoldenJDM - Shared analytics loader
 * Google Analytics (gtag.js), Microsoft Clarity, and the Vercel Speed
 * Insights queue.
 *
 * Usage (in <head>, before other scripts):
 *   <script src="/js/analytics.js" data-clarity-id="vnyjem18db"></script>
 *
 * data-clarity-id is optional and accepts a comma-separated list of
 * Clarity project IDs.
 */
(function () {
  var GA_ID = 'G-4B8TR0WWKR';

  // Google tag (gtag.js)
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  var ga = document.createElement('script');
  ga.async = true;
  ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(ga);

  // Microsoft Clarity
  var clarityIds = ((document.currentScript && document.currentScript.getAttribute('data-clarity-id')) || '').split(',');
  clarityIds.forEach(function (id) {
    id = id.trim();
    if (!/^[a-z0-9]+$/i.test(id)) return;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(i);
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', id);
  });

  // Vercel Speed Insights queue
  window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
})();
