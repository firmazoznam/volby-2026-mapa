/* Vloženie mapy výsledkov komunálnych volieb 2026 do článku.
 * Použitie v článku:
 *   <div class="volby-mapa" data-obec="518158"></div>          (data-obec je voliteľné: kód obce ŠÚ SR, mapa sa otvorí priblížená na obec)
 *   data-scroll-offset="60"  výška fixnej hlavičky webu v px, aby pri posune na detail obce nebol názov obce schovaný pod ňou
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
    if (el.getAttribute('data-scroll-offset')) f.setAttribute('data-scroll-offset', el.getAttribute('data-scroll-offset'));
    el.appendChild(f); frames.push(f);
  }
  window.addEventListener('message', function (e) {
    var d = e.data; if (!d || typeof d.type !== 'string') return;
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].contentWindow !== e.source) continue;
      if (d.type === 'volby-mapa-height' && typeof d.height === 'number') { frames[i].style.height = Math.max(300, Math.min(6000, d.height)) + 'px'; }
      if (d.type === 'volby-mapa-scroll' && typeof d.y === 'number') {
        // posun stránky tak, aby detail obce začínal tesne pod horným okrajom okna (rovnaké miesto pri každom výbere)
        var top = frames[i].getBoundingClientRect().top + window.pageYOffset + d.y - (parseInt(frames[i].getAttribute('data-scroll-offset') || '0', 10) || 0) - 12;
        try { window.scrollTo({ top: top, behavior: 'smooth' }); } catch (err) { window.scrollTo(0, top); }
        try { e.source.postMessage({ type: 'volby-mapa-scroll-ok' }, '*'); } catch (err2) {}
      }
    }
  });
  function init() { var els = document.querySelectorAll('.volby-mapa'); for (var i = 0; i < els.length; i++) mount(els[i]); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
