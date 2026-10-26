# Mapa výsledkov komunálnych volieb 2026 - widget

Samostatný widget bez externých knižníc a fontov. Jeden HTML súbor (mapa kreslená do canvasu), jeden JSON so všetkými obcami a 64 malých JSON súborov s detailmi.

## Nasadenie

Celý priečinok `dist/` nahrať na CDN alebo statický hosting (napr. `https://s.aimg.sk/volby-mapa/`). Štruktúra:

```
index.html          widget (otvára sa v iframe)
embed.js            vloženie do článku (vytvorí iframe, rieši výšku)
data/mapa.json      všetky obce: body, kategórie, účasť (523 KB, gzip 139 KB)
data/d/00-63.json   detaily obcí po košoch (kód obce mod 64), načítavajú sa až po kliknutí (do 70 KB každý)
```

Server musí posielať JSON s gzip/brotli kompresiou a `Cache-Control` (dáta sú definitívne, pokojne `max-age=86400`). Ak je CDN na inej doméne než index.html, nič ďalšie netreba - JSON sa načítava relatívne k index.html, nie k článku.

## Vloženie do článku

```html
<div class="volby-mapa"></div>
<script src="https://VAS-CDN/volby-mapa/embed.js" async></script>
```

Voliteľné atribúty na `div`:

- `data-obec="518158"` - kód obce ŠÚ SR, mapa sa otvorí priblížená na obec aj s detailom (vhodné do článku konkrétnej obce, kód je v importe ako `special=kod_obce=...`)
- `data-mode="starosta|zast|ucast|obhajoba"` - úvodné zobrazenie
- `data-height="760"` - počiatočná výška v px, kým sa widget načíta

Alternatíva bez embed.js (statická výška):

```html
<iframe src="https://VAS-CDN/volby-mapa/index.html" loading="lazy" title="Mapa výsledkov komunálnych volieb 2026" style="width:100%;height:760px;border:0" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe>
```

## Bezpečnosť a výkon

- iframe so `sandbox` - widget nemá prístup k stránke článku, cookies ani k DOM.
- `loading="lazy"` - nič sa nesťahuje, kým čitateľ k mape nedoscrolluje. Článok sa načíta rovnako rýchlo ako bez widgetu.
- Komunikácia s článkom je len jedna správa `postMessage({type:'volby-mapa-height', height})`, embed.js ju prijme len od vlastného iframu.
- Žiadne externé požiadavky (mapové dlaždice, fonty, knižnice, analytika). Celkovo sa pri otvorení stiahne cca 140 KB (gzip), pri kliknutí na obec ďalších 10 až 30 KB.
- Vyhľadávanie a kreslenie beží lokálne v prehliadači, 2 923 bodov sa vykreslí za pár milisekúnd aj na mobile.

## Odkazy na články o obciach

Ak chcete v detaile obce tlačidlo „Článok o obci", vytvorte `widget/clanky_url.json` v tvare `{"518158": "https://www.topky.sk/...", ...}` a spustite `python3 widget/build.py` znova.

## Rozdelenie strán do kategórií (režim Starosta a Zastupiteľstvo)

Podľa navrhovateľa zvoleného starostu: Nezávislí (NEKA), Hlas-SD, Smer-SD, Koalícia Smer-SD a Hlas-SD (aj s ďalšími stranami), KDH, Maďarská aliancia, SNS, PS/SaS/Demokrati/Slovensko a ich koalície, Iné strany a koalície. Remíza a obce bez kandidáta sú bielym bodom. Zoznam strán pre kategórie je v `build_data.py` (`OPOZ`, `KOAL`).

## Regenerovanie

```
python3 widget/build.py
```

Vstupy: `dataset/vysledky_2026.json`, `dataset/obce_2026_s_vysledkami_2022.json`, `geo/coords.json`, hranice okresov z `drakh/slovakia-gps-data` (GeoJSON).
