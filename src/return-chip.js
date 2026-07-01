/* ===========================================================================
   return-chip.js — a style-isolated "back to michaelwales.com" pill.
   ---------------------------------------------------------------------------
   The ONLY Michael Wales touch that lives INSIDE a self-contained experience.
   It renders in Shadow DOM with all brand values hard-coded, so it neither
   inherits the host experience's styles nor leaks into them — drop it into any
   project (any framework, any CSS) and it looks identical and isolated.

   Hosted here at https://michaelwales.com/return-chip.js (source of truth is the
   michael-wales-design system's assets/return-chip.js — keep the two in sync).

   USAGE — add once, anywhere in the experience's HTML:
       <script src="https://michaelwales.com/return-chip.js" defer></script>
       <mw-return></mw-return>

   Options (attributes):
       href      destination (default "https://michaelwales.com/")
       label     text (default "michaelwales.com")
       position  bottom-left | bottom-right | top-left | top-right
                 (default bottom-left)
   =========================================================================== */
(function () {
  if (customElements.get('mw-return')) return;

  const POS = {
    'bottom-left':  'bottom:16px;left:16px;',
    'bottom-right': 'bottom:16px;right:16px;',
    'top-left':     'top:16px;left:16px;',
    'top-right':    'top:16px;right:16px;',
  };

  class MWReturn extends HTMLElement {
    connectedCallback() {
      const href = this.getAttribute('href') || 'https://michaelwales.com/';
      const label = this.getAttribute('label') || 'michaelwales.com';
      const pos = POS[this.getAttribute('position')] || POS['bottom-left'];
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <style>
          :host { all: initial; }
          .chip {
            position: fixed; ${pos} z-index: 2147483000;
            display: inline-flex; align-items: center; gap: 8px;
            font-family: 'Archivo Narrow','Helvetica Neue',Arial,sans-serif;
            font-size: 14px; font-weight: 600; letter-spacing: -0.01em;
            color: #ffffff; text-decoration: none;
            background: #252D38; border: 1px solid rgba(255,255,255,.14);
            padding: 8px 12px 8px 10px; border-radius: 999px;
            box-shadow: 0 4px 14px rgba(0,0,0,.28);
            opacity: .92; transition: opacity .15s ease, transform .15s ease, background-color .15s ease;
          }
          .chip:hover { opacity: 1; transform: translateY(-1px); background: #2f3a48; }
          .arrow { width: 15px; height: 15px; fill: #B9CC72; flex: none; }
          .mw { color: #B9CC72; }
          @media print { .chip { display: none; } }
          @media (prefers-reduced-motion: reduce) { .chip { transition: none; } }
        </style>
        <a class="chip" href="${href}" aria-label="Back to ${label}">
          <svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd"/></svg>
          <span><span class="mw">MW</span> ${label}</span>
        </a>`;
    }
  }
  customElements.define('mw-return', MWReturn);
})();
