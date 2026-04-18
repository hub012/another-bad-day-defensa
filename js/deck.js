/* =========================================================================
   DECK — Reveal.js init + custom UX (rail, progress, focus, text zoom)
   Uses Reveal.js UMD (loaded via <script> in index.html)
   so window.Reveal is available for Decktape PDF export.
   ========================================================================= */

const MODULES = [
  { id: 0, title: 'Apertura' },
  { id: 1, title: 'Pitch del juego' },
  { id: 2, title: 'Diseño del juego' },
  { id: 3, title: 'Dirección artística' },
  { id: 4, title: 'Arquitectura técnica' },
  { id: 5, title: 'Demo en vivo' },
  { id: 6, title: 'Postmortem' },
  { id: 7, title: 'Cierre' },
];

/* Speaker per slide index (0-based). Modules:
   1 Abel · 2/3/4 Martin · 5/6/7 Abel · 8.1 Martin · 8.2/8.3 Abel  */
const SPEAKERS = [
  'abel',   // 01 Cover                     - Módulo 1
  'abel',   // 02 Problema                  - Módulo 1
  'abel',   // 03 Tesis                     - Módulo 1
  'martin', // 04 One-liner + ficha         - Módulo 2
  'martin', // 05 USPs                      - Módulo 2
  'martin', // 06 Referencias               - Módulo 2
  'martin', // 07 Rulay City                - Módulo 3
  'martin', // 08 Las 3Cs                   - Módulo 3
  'martin', // 09 Game loop                 - Módulo 3
  'martin', // 10 Sistemas complementarios  - Módulo 3
  'martin', // 11 Paleta                    - Módulo 4
  'martin', // 12 Visual storytelling       - Módulo 4
  'abel',   // 13 Stack                     - Módulo 5
  'abel',   // 14 Cifras                    - Módulo 5
  'abel',   // 15 Autoloads                 - Módulo 5
  'abel',   // 16 Innovaciones              - Módulo 5
  'abel',   // 17 Snippet GDScript          - Módulo 5
  'abel',   // 18 Demo en vivo              - Módulo 6
  'abel',   // 19 Postmortem — OK           - Módulo 7
  'abel',   // 20 Postmortem — mal          - Módulo 7
  'abel',   // 21 Postmortem — lecciones    - Módulo 7
  'martin', // 22 Cumplimiento OE           - Módulo 8.1
  'abel',   // 23 Líneas futuras            - Módulo 8.2
  'abel',   // 24 Recursos / Q&A            - Módulo 8.3
];

const SPEAKER_NAMES = {
  abel:   'Abel',
  martin: 'Martin',
};

/* === ZOOM STATE ====================================================== */

const ZOOM_STEPS = [0.75, 0.85, 0.95, 1.0, 1.1, 1.25, 1.4];
let zoomIdx = ZOOM_STEPS.indexOf(1.0);

/* === EVENT DELEGATION ================================================
   Attach a single document-level click handler so buttons work even if
   inserted late or replaced. Also survives re-renders.
   ===================================================================== */

document.addEventListener('click', (e) => {
  // Footer prev/next
  if (e.target.closest('#deck-prev')) { Reveal.prev(); return; }
  if (e.target.closest('#deck-next')) { Reveal.next(); return; }

  // Topbar zoom controls
  if (e.target.closest('#zoom-in'))    { setZoom(zoomIdx + 1); return; }
  if (e.target.closest('#zoom-out'))   { setZoom(zoomIdx - 1); return; }
  if (e.target.closest('#zoom-reset')) { setZoom(ZOOM_STEPS.indexOf(1.0)); return; }

  // Rail module jump
  const railBtn = e.target.closest('.rail-module');
  if (railBtn) {
    Reveal.slide(parseInt(railBtn.dataset.first, 10));
    return;
  }

  // Palette swatch — click to copy hex
  const swatch = e.target.closest('.palette-swatch');
  if (swatch && swatch.dataset.hex) {
    navigator.clipboard?.writeText(swatch.dataset.hex);
    const hexEl = swatch.querySelector('.hex');
    if (hexEl) {
      const orig = hexEl.textContent;
      hexEl.textContent = '✓ copiado';
      setTimeout(() => { hexEl.textContent = orig; }, 1200);
    }
    return;
  }

  // Demo iframe toggle
  if (e.target.closest('#embed-toggle')) {
    const iframe = document.getElementById('demo-iframe');
    const btn = e.target.closest('#embed-toggle');
    if (iframe) {
      const hidden = iframe.classList.contains('is-hidden');
      if (hidden) {
        iframe.src = 'https://hub012.itch.io/another-bad-day';
        iframe.classList.remove('is-hidden');
        btn.textContent = 'Ocultar embebido';
      } else {
        iframe.src = 'about:blank';
        iframe.classList.add('is-hidden');
        btn.textContent = 'Embebido aquí';
      }
    }
    return;
  }
});

/* === REVEAL INIT ===================================================== */

Reveal.initialize({
  hash: true,
  history: true,
  progress: false,
  controls: false,
  slideNumber: false,
  center: false,
  transition: 'fade',
  transitionSpeed: 'fast',
  backgroundTransition: 'fade',
  width: 1920,
  height: 1080,
  margin: 0,
  minScale: 0.2,
  maxScale: 1.6,
  pdfSeparateFragments: false,
  keyboard: {
    70: () => toggleFocus(),    // F = focus mode
    187: () => setZoom(zoomIdx + 1),  // = / +
    189: () => setZoom(zoomIdx - 1),  // -
    48:  () => setZoom(ZOOM_STEPS.indexOf(1.0)),  // 0
  },
  plugins: [RevealNotes, RevealHighlight],
}).then(() => {
  setupRail();
  setupTopbar();
  setupProgress();
  updateSpeaker(Reveal.getIndices().h || 0);
  bindReveal();
});

/* === RAIL ============================================================ */

function setupRail() {
  const rail = document.querySelector('.rail');
  if (!rail) return;

  const slides = Array.from(document.querySelectorAll('.reveal .slides section'));
  const moduleSlides = new Map();
  slides.forEach((slide, idx) => {
    const m = parseInt(slide.dataset.module || '0', 10);
    if (!moduleSlides.has(m)) moduleSlides.set(m, []);
    moduleSlides.get(m).push(idx);
  });

  rail.innerHTML = `
    <p class="rail-header">Módulos</p>
    ${MODULES.map(m => {
      const indices = moduleSlides.get(m.id) || [];
      const firstIdx = indices[0] ?? 0;
      return `
        <button class="rail-module" data-module="${m.id}" data-first="${firstIdx}">
          <span class="rail-num">0${m.id + 1}</span>${m.title}
          <div class="rail-dots">
            ${indices.map(i => `<span class="rail-dot" data-slide="${i}"></span>`).join('')}
          </div>
        </button>
      `;
    }).join('')}
  `;
}

/* === TOPBAR ========================================================== */

function setupTopbar() {
  const total = document.querySelectorAll('.reveal .slides section').length;
  const counter = document.querySelector('.counter');
  if (counter) counter.textContent = `01 / ${String(total).padStart(2, '0')}`;
  updateZoomLabel();
}

/* === PROGRESS ======================================================== */

function setupProgress() { updateProgress(0); }

function updateProgress(idx) {
  const total = document.querySelectorAll('.reveal .slides section').length;
  const fill = document.querySelector('.progress-fill');
  if (!fill) return;
  const pct = total <= 1 ? 100 : (idx / (total - 1)) * 100;
  fill.style.width = `${pct}%`;
}

/* === FOCUS MODE (F key) ============================================== */

let focusActive = false;
function toggleFocus() {
  focusActive = !focusActive;
  document.body.classList.toggle('focus-mode', focusActive);
  const badge = document.querySelector('.mode-badge');
  if (badge) {
    badge.textContent = focusActive ? 'FOCUS' : 'NORMAL';
    badge.classList.toggle('is-focus', focusActive);
  }
}

/* === TEXT ZOOM =======================================================
   Strategy: change Reveal's logical width/height. Smaller logical size
   = bigger relative content. Reveal auto-rescales to viewport.
   ===================================================================== */

function setZoom(newIdx) {
  zoomIdx = Math.max(0, Math.min(ZOOM_STEPS.length - 1, newIdx));
  const zoom = ZOOM_STEPS[zoomIdx];
  const baseW = 1920;
  const baseH = 1080;
  // Inverse: bigger content = smaller logical canvas
  Reveal.configure({ width: Math.round(baseW / zoom), height: Math.round(baseH / zoom) });
  Reveal.layout();
  updateZoomLabel();
}

function updateZoomLabel() {
  const label = document.querySelector('#zoom-level');
  if (label) {
    const pct = Math.round(ZOOM_STEPS[zoomIdx] * 100);
    label.textContent = `${pct}%`;
  }
}

/* === SPEAKER BADGE =================================================== */

function updateSpeaker(idx) {
  const badge = document.getElementById('speaker-badge');
  const nameEl = document.getElementById('speaker-name');
  if (!badge || !nameEl) return;

  const speakerKey = SPEAKERS[idx] || SPEAKERS[0];
  const speakerName = SPEAKER_NAMES[speakerKey] || '—';
  const prevKey = badge.dataset.speaker;

  if (prevKey === speakerKey) return;

  if (prevKey) {
    badge.classList.add('is-swapping');
    setTimeout(() => {
      badge.dataset.speaker = speakerKey;
      nameEl.textContent = speakerName;
      badge.classList.remove('is-swapping');
    }, 180);
  } else {
    badge.dataset.speaker = speakerKey;
    nameEl.textContent = speakerName;
  }
}

/* === REVEAL EVENT BINDING ============================================ */

function bindReveal() {
  Reveal.on('slidechanged', (event) => {
    const idx = Reveal.getIndices().h;
    updateProgress(idx);
    updateSpeaker(idx);

    const total = document.querySelectorAll('.reveal .slides section').length;
    const counter = document.querySelector('.counter');
    if (counter) {
      counter.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    }

    const currentSlide = event.currentSlide;
    const currentModule = parseInt(currentSlide.dataset.module || '0', 10);

    document.querySelectorAll('.rail-module').forEach(btn => {
      btn.classList.toggle('is-active', parseInt(btn.dataset.module, 10) === currentModule);
    });

    document.querySelectorAll('.rail-dot').forEach(dot => {
      const slideIdx = parseInt(dot.dataset.slide, 10);
      dot.classList.toggle('is-current', slideIdx === idx);
      dot.classList.toggle('is-visited', slideIdx < idx);
    });
  });
}
