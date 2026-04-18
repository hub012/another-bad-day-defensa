# Another Bad Day · Defensa TFM

Presentación interactiva de defensa para el TFM **Another Bad Day: Delivery Simulator** (UNIR · Máster en Diseño y Desarrollo de Videojuegos · 2026).

Construida con **Reveal.js 5** + tema custom **Firewatch Sunset** inspirado en la dirección artística del propio juego.

**🌐 Live:** https://hub012.github.io/another-bad-day-defensa/
**📦 Repo:** https://github.com/hub012/another-bad-day-defensa

---

## Quickstart

```bash
npm install
npm start
```

Abre `http://localhost:8000`. Navega con **← →**.

---

## Atajos

| Tecla | Acción |
|---|---|
| `← →` | Slide anterior / siguiente |
| `↑ ↓` | Subir / bajar dentro de fragments |
| `F` | Toggle modo Focus (oculta rail y topbar) |
| `S` | Abrir vista de orador (speaker notes en ventana aparte) |
| `Esc` | Vista resumen de todas las slides |
| `f` (minúscula) | Pantalla completa |
| `+` / `-` | Aumentar / disminuir tamaño de texto |
| `0` | Reset zoom al 100% |

> Los botones **A−**, **A+** y el contador `100%` en la topbar también controlan el zoom.

---

## Exportar a PDF (backup)

Con el servidor `npm start` corriendo en otra terminal:

```bash
npm run build:pdf
```

Genera `dist/presentacion-tfm.pdf` con las 24 slides a 1920×1080. Tarda ~30 s.

> Si decktape no encuentra Chromium, instálalo con `npx puppeteer browsers install chrome`.

---

## Estructura

```
presentacion/
├── index.html              ← Deck con las 24 slides como <section>
├── css/
│   ├── firewatch-theme.css ← Paleta + tipografías + base
│   ├── reveal-overrides.css ← Customización del chrome de Reveal
│   └── components.css      ← Rail, cards, paleta, loop, demo, QR
├── js/
│   └── deck.js             ← Init Reveal + lógica del rail/progress/focus
├── assets/
│   └── images/             ← QR codes (itch.io, GitHub, memoria)
├── dist/
│   └── presentacion-tfm.pdf ← Output del export PDF
└── node_modules/           ← Reveal.js, decktape, http-server
```

---

## Mapa de las 24 slides

| # | Módulo | Slide |
|---|---|---|
| 01 | 1 · Apertura | Cover con sol radiante |
| 02 | 1 · Apertura | El problema (gig economy + stats) |
| 03 | 1 · Apertura | La tesis (pregunta provocadora) |
| 04 | 2 · Pitch | One-liner + ficha técnica |
| 05 | 2 · Pitch | 4 USPs (cards con fragments) |
| 06 | 2 · Pitch | Referencias de diseño |
| 07 | 3 · Diseño | Rulay City (mapa) |
| 08 | 3 · Diseño | Las 3Cs (control, cámara, character) |
| 09 | 3 · Diseño | Game loop (diagrama 5 nodos) |
| 10 | 3 · Diseño | Sistemas complementarios |
| 11 | 4 · Arte | **Paleta interactiva** (click para copiar HEX) |
| 12 | 4 · Arte | Visual storytelling |
| 13 | 5 · Técnico | Stack (Godot, GDScript, etc.) |
| 14 | 5 · Técnico | Cifras reales del proyecto |
| 15 | 5 · Técnico | Event-driven con 6 autoloads |
| 16 | 5 · Técnico | Innovaciones técnicas |
| 17 | 5 · Técnico | Snippet GDScript |
| 18 | 6 · Demo | **Demo en vivo** (itch.io + ejecutable) |
| 19 | 7 · Postmortem | Lo que salió bien _(lorem ipsum — TODO)_ |
| 20 | 7 · Postmortem | Lo que salió mal _(lorem ipsum — TODO)_ |
| 21 | 7 · Postmortem | Lecciones aprendidas _(lorem ipsum — TODO)_ |
| 22 | 8 · Cierre | Cumplimiento OE1–OE5 |
| 23 | 8 · Cierre | Líneas futuras |
| 24 | 8 · Cierre | Recursos / Q&A (3 QR codes) |

---

## Discrepancias memoria vs código

Esta presentación usa los **valores reales del código**, no los de la memoria escrita. Las que aparecen marcadas con `código: …`:

| Dato | Memoria | Código (real) | Slide |
|---|---|---|---|
| Tamaño del mapa | 300×300 u | **400×400 u** | 07 |
| Sprint boost | +60 % | **+40 % (1.4×)** | 08 |
| Duración del día | 36 min reales | **12 min reales** | 10 |
| Multa semáforo | 10 € | **15 €** | 10 |
| Peatones simultáneos | 20 | **12** | 10 |
| Shader emociones | "Shader propio" | **Material shader simple** | 16 |

Si el tribunal pregunta por la diferencia: la implementación final ajustó por rendimiento y feel después de playtesting.

---

## Demo durante la defensa

La slide 18 ofrece tres caminos:

1. **Lanzar en itch.io** (botón verde sólido) — Abre `https://hub012.itch.io/another-bad-day` en pestaña nueva. Recomendado para demo principal.
2. **Embebido aquí** (botón ghost) — Carga el juego dentro de la slide vía iframe. Útil si no quieres salir del deck.
3. **Backup local** — Tener `index.exe` del proyecto Godot en el escritorio. Minimizar deck si todo lo demás falla.

---

## Speaker notes

Cada slide tiene una `<aside class="notes">` con timing aproximado. Pulsa **S** para abrir la vista de orador en otra ventana — verás las notas + slide actual + siguiente. La suma total apunta a ~15 minutos.

---

## TODO antes de la defensa

- [ ] Rellenar slides **19, 20, 21** (postmortem) con contenido real — actualmente lorem ipsum
- [ ] Verificar que el iframe de itch.io carga correctamente desde la red del aula
- [ ] Tener `index.exe` del juego en escritorio como plan C
- [ ] Probar la presentación a pantalla completa en el monitor de proyección del aula
- [ ] Ensayar al menos una vez con timing real

---

## Deploy a GitHub Pages

Ya está deployado en **https://hub012.github.io/another-bad-day-defensa/**.

Para republicar después de cambios:

```bash
git add .
git commit -m "Update deck"
git push
```

GitHub Pages detecta el push y rebuild automáticamente (~30-60 s).

**Nota:** No hay build step. El deck es 100% estático — `index.html` referencia `vendor/reveal/` y `css/`/`js/` directamente. Por eso `vendor/` está commiteado al repo (no se ignora como `node_modules/`).

---

## Stack & créditos

- **[Reveal.js 5](https://revealjs.com)** — Framework de presentaciones
- **[Decktape](https://github.com/astefanutti/decktape)** — Export PDF
- **Bricolage Grotesque** + **Fraunces** + **Geist** + **JetBrains Mono** — Tipografías (Google Fonts)
- Paleta inspirada en _Firewatch_ (Campo Santo, 2016)

Autores del TFM: **Abel Quiñones · Martin Zarate** · Director: **Adrián Suárez Mouriño** · UNIR 2026
