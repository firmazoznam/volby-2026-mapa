/* Vloženie mapy výsledkov komunálnych volieb 2026 do článku.
 * Použitie v článku:
 *   <div class="volby-mapa" data-obec="518158"></div>          (data-obec je voliteľné: kód obce ŠÚ SR, mapa sa otvorí priblížená na obec)
 *   <script src="https://VAS-CDN/volby-mapa/embed.js" async></script>
 * Skript vytvorí <iframe> (lazy, bez povolení), prispôsobuje jeho výšku obsahu a nič iné na stránke nemení.
 */
(function () {
  var BASE = (function () { var s = document.currentScript && document.currentScript.src; return s ? s.replace(/[^\/]*$/, '') : ''; })();
  var frames = [];
  function mount(el) {
    if (el.getAttribute('data-mounted')) return; el.setAttribute('data-mounted', '1');
    var p = [];
    if (el.getAttribute('data-obec')) p.push('obec=' + encodeURIComponent(el.getAttribute('data-obec')));
    if (el.getAttribute('data-mode')) p.push('mode=' + encodeURIComponent(el.getAttribute('data-mode')));
    var f = document.createElement('iframe');
    f.src = BASE + 'index.html' + (p.length ? '?' + p.join('&') : '');
    f.title = 'Mapa výsledkov komunálnych volieb 2026';
    f.loading = 'lazy';
    f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
    f.style.cssText = 'display:block;width:100%;border:0;height:' + (el.getAttribute('data-height') || '760') + 'px;max-width:100%';
    el.appendChild(f); frames.push(f);
  }
  window.addEventListener('message', function (e) {
    var d = e.data; if (!d || d.type !== 'volby-mapa-height' || typeof d.height !== 'number') return;
    for (var i = 0; i < frames.length; i++) { if (frames[i].contentWindow === e.source) { frames[i].style.height = Math.max(300, Math.min(6000, d.height)) + 'px'; } }
  });
  function init() { var els = document.querySelectorAll('.volby-mapa'); for (var i = 0; i < els.length; i++) mount(els[i]); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
