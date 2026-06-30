# michaelwales.com — Improvement & Tech-Debt Plan

A prioritized backlog from a full review of the site (2026-06-26). Use the
checkboxes to track work. File references are `path:line` against `src/` unless
noted.

## How this was produced

Reviewed across 8 dimensions (SEO, accessibility, performance, templates/markup,
CSS, content/branding, build/CI, and the new `/schedule` redirect). Every
candidate finding was then adversarially re-checked against the actual files,
which **downgraded ~15 inflated severities and rejected 4 false positives**. The
severities below are the *verified* ones, calibrated for a low-traffic personal
blog/portfolio.

## Verdict

The site is in good shape — small, clean, fast, and the `/schedule` feature is
sound. **Nothing is critical or high after verification.** The one real standout
is *content/identity drift* (the bio contradicts itself across the site). The
rest is cheap, high-leverage polish plus low-urgency tech debt.

Suggested first branch: **`site-refresh`** covering Tier 1.

---

## Tier 1 — Worth doing soon (real signal, mostly cheap)

### 1. Professional identity is stale and self-contradictory  `[medium]`
Flagged independently by two dimensions; the only items rated medium.
- `_includes/base.njk:8` — meta description (shown in Google results + link
  previews): *"over 18 years developing web applications for the US Department
  of Defense and Intelligence communities…"*
- `_includes/base.njk:26` — subtitle: *"Full-Stack Web Developer & Open Source
  Advocate"*
- `about/index.md:7` / `resume/index.md:8` — *"Engineering Leader … Senior
  Director of AI Programs at CodePath"*
- `_data/site.json:3`, `package.json:4`, and the `index.md` title each say
  something different.
- Years-of-experience claim is inconsistent: **18** (`base.njk:8`) vs **20**
  (`resume/index.md:8`).

**Why it matters:** every search snippet and shared link advertises a
web-developer-at-DoD identity that no longer reflects the current role. Highest-
value fix on the list.

**Fix:** settle on one current positioning and apply it everywhere. Make the
meta description per-page (`{{ description or site.description }}`) and update
`site.json`, the subtitle, and `package.json` to match.

- [x] Rewrite `base.njk:8` meta description to current role
- [x] Reconcile subtitle (`base.njk:26`), `site.json:3`, `package.json:4`, `index.md` title
- [x] Fix 18-vs-20-years inconsistency

> Done on branch `site-refresh` (2026-06-26). Standardized on **"Engineering
> Leader & Open Source Advocate"**; meta description now reflects 20+ years and
> the current CodePath role with no DoD framing. Historical resume entries
> (`resume:69,78,91,114`) and article prose left intact intentionally.

### 2. No favicon at all  `[low]`
- `eleventy.config.js:28` passes through `src/favicon.ico`, **but that file does
  not exist** — silent no-op (confirmed: build reports "Copied 11", nothing
  shipped). There is also no `<link rel="icon">` in `base.njk`.
- **Impact:** every visitor's browser 404s on `/favicon.ico`.
- [x] Add a real `src/favicon.ico` (and/or SVG) + `<link rel="icon">` in `base.njk`

> Done on branch `favicon` (2026-06-29). Authored `favicon.svg` (MW monogram,
> font-independent vector strokes, green `#B9CC72` on dark `#252D38`); generated a
> multi-size `favicon.ico` (16/32/48) and a 180×180 `apple-touch-icon.png` (no
> alpha) from it; passthrough-copied all three; added the modern 3-tag `<link>`
> set to `base.njk`. The `/favicon.ico` 404 is resolved. Adversarially verified —
> 0 defects. **This completes Tier 1.**

### 3. Mobile nav is icon-only with no accessible name  `[medium]`
- `_includes/base.njk:32,35` + `styles/style.css:132` (re-shown only ≥780px at
  `style.css:310`). Below 780px the `<span>Resume</span>` label is
  `display:none`, leaving a bare icon glyph; the accessible name falls back to
  the `title` attribute, which is unreliable on touch / screen readers.
- **Fix:** add `aria-label="Resume"` / `aria-label="About"` to the anchors, or
  swap `display:none` for a screen-reader-only utility class.
- [x] Give the two nav links a reliable accessible name at all widths

> Done on branch `a11y-pass` (2026-06-29). Added `aria-label` to both nav anchors
> (visible text matches → SC 2.5.3 clean) and `aria-hidden="true"` to the decorative
> icon glyphs.

### 4. Cheap SEO infrastructure for a blog  `[low]` (do as one pass)
- [x] `<link rel="canonical" href="{{ site.url }}{{ page.url }}">` in `base.njk`
      (`site.url` is defined in `site.json:4` but currently unused)
- [x] Open Graph + Twitter Card tags in `base.njk` (currently none → bare,
      image-less link previews)
- [x] RSS/Atom feed — add `@11ty/eleventy-plugin-rss` + a `feed.njk`, link via
      `<link rel="alternate">`
- [x] `sitemap.xml` template iterating the collections
- [x] Per-page meta descriptions (today all pages share the one global string)

> Done on branch `seo-sharing` (2026-06-29). Per-page descriptions (6 articles +
> about + resume) with `{{ description or site.description }}` fallback; canonical,
> Open Graph (incl. `og:image:alt` + `article:published_time`), and Twitter
> `summary` cards (@walesmd) in `base.njk`; Atom feed at `/feed.xml`; `/sitemap.xml`
> (excludes the `noindex` `/schedule` stubs). Adversarially verified across Atom,
> OG/Twitter, sitemap, and regression specs — 0 real defects.
> Note: installing the RSS plugin surfaced pre-existing dev-only `npm audit`
> findings in Eleventy's transitive deps (not shipped to the static site); left as
> a separate tech-debt follow-up.

### 5. Quick accessibility fixes  `[low]`
- [x] `<html lang="en">` (`_includes/base.njk:2` — currently bare `<html>`)
- [x] `alt` on the 3 images: `about/index.md:7` (gravatar),
      `getting-started-with-gulpjs/index.md:9,11` (Grunt/Gulp logos)
- [x] Darken post-date color — `styles/style.css:197` `#AAA` on white is
      ~2.32:1, below the 4.5:1 AA minimum; use ≥`#767676`

> Done on branch `a11y-pass` (2026-06-29). `<html lang="en">`; `alt="Michael Wales"`
> on the gravatar and descriptive alt on both logos; `.post-date` → `#6E6E6E`
> (measured 5.10:1 on white, passes AA). Adversarially verified (WCAG fixes,
> contrast math, regressions) — 0 real defects.

---

## Tier 2 — Nice-to-have polish

### Performance / assets
- [ ] **Typekit dependency** (`base.njk` Typekit embed): render-blocking synchronous
      script; all fonts (`Athelas`, `Nimbus-Sans-Condensed`, `Source-Code-Pro`) live
      only in that kit (live today, but a single point of failure). Move to async
      embed or self-host with `font-display: swap`.

  > **Deferred (2026-06-29).** Decision: leave as-is for now. It works today, and
  > the lowest-effort fix (Typekit JS→CSS embed + `font-display: optional` in the
  > kit settings) needs access to the Adobe Fonts account for kit `byn8skt`, which
  > we don't currently have. Not worth the effort/risk while the kit serves fine.
  > If revisited: of the 3 faces, **Source Code Pro** is OFL (freely self-hostable),
  > **Athelas** is an Apple system font (already local on macOS/iOS), and only
  > **Nimbus-Sans-Condensed** is a genuine Typekit dependency. The highest-leverage
  > polish (regardless of host) is metric-matched fallbacks to make any fallback
  > moment imperceptible.
- [x] **Concrete font bug:** `styles/style.css:91` declares
      `font-family: 'Source-Code-Pro'` with **no generic fallback** — add
      `, monospace`.
- [x] **ionicons bloat:** ~515 KB of font files across 4 formats (incl. IE-only
      `.eot`) + a ~700-selector stylesheet to render **5 glyphs**
      (`styles/ionicons.min.css`, `fonts/ionicons.*`, linked at `base.njk:12`).
      Replace with 5 inline SVGs, or at minimum drop `.eot`/`.svg`.

  > Done on branch `tier2-ionicons` (2026-06-29). Replaced the font with 5 inline
  > SVGs via an `{% icon %}` shortcode (paths inlined in `eleventy.config.js`):
  > GitHub (Simple Icons, official), LinkedIn (Bootstrap Icons), document-text /
  > information-circle / envelope (Heroicons solid). Deleted ~515 KB of fonts +
  > the 34 KB stylesheet (4 stylesheets → 3); `.icon` uses `fill: currentColor`.
  > Temp packages used only to extract paths, then removed — no new deps.
  > Visually verified via headless Chrome (desktop + mobile vs master) and
  > adversarially verified (completeness, correctness, a11y, regressions) — 0 defects.
- [x] **CLS:** article images set `width` but no `height`
      (`getting-started-with-gulpjs/index.md:9,11`).
- [~] 4 separate unminified/unbundled/non-cache-busted stylesheets in `<head>`.

  > **Deprioritized (2026-06-29).** A Lighthouse run showed the page is ~96% Adobe
  > Typekit (186 KB fonts + a 764 ms render-blocking loader JS); the three local
  > stylesheets total only ~4.9 KB gzipped, and Lighthouse reports **0 bytes** of
  > savings from CSS minification. Bundling/minifying is a micro-optimization that
  > wouldn't move the needle, so we're parking it. The real lever is Typekit (above,
  > also deferred). If ever revisited, inlining the ~5 KB of CSS into `<head>` (not
  > bundling to one external file) is the higher-leverage move.
- [x] **Load the Prism theme only on pages with highlighted code** (perf, surfaced
      during the 2026-06-29 Lighthouse audit). `prism-github.css` was shipped on every
      page even though most have no code blocks.

  > Done on branch `prism-conditional` (2026-06-29). Syntax highlighting is done at
  > **build time** (the `@11ty/eleventy-plugin-syntaxhighlight` plugin bakes
  > `class="token"`/`language-` markup into the HTML — there is no client-side Prism
  > JS). `base.njk` now emits the `prism-github.css` `<link>` only when the rendered
  > `content` contains `language-` markup (`{% if "language-" in (content | string) %}`).
  > Result: the theme loads on exactly the 2 code pages (gulp, gitconfig) and is
  > dropped from the other 10 (home, about, resume, 404, 2 schedule stubs, 4 no-code
  > articles). Verified the invariant (link iff code) across all built pages; confirmed
  > `prism-github.css` only targets `[class*="language-"]`/`.token`, so the
  > language-less `resurrecting` article (bare `<pre><code>`) was never styled by it —
  > zero visual change. Pure build-time, no client JS.
- [x] Add a `404.html` (GitHub Pages will serve it; currently the generic default).

### More accessibility
- [x] Decorative `<i>` icons lack `aria-hidden="true"` (`base.njk:32,35`,
      `about/index.md:15,18,21`) — done in the `a11y-pass` branch (2026-06-29)
      alongside Tier 1 Task 3.
- [x] Heading hierarchy: homepage emits the sidebar `<h1>` plus one `<h1>` per
      article (`home.njk:9`); demote article-list titles to `<h2>`. The
      `header-subtitle` `<h2>` is also `display:none` (`base.njk:26` /
      `style.css:148`).
- [x] Post titles self-link to their own URL on single views
      (`article.njk:6`, `page.njk:6`) — render as plain heading text there.

> Done on branch `tier2-quick-wins` (2026-06-29). Bundled: code `monospace`
> fallback; `/404.html` (full chrome, excluded from sitemap/feed); logo `height`
> attrs (aspect-correct) + `img { height: auto }` for CLS; homepage titles
> `<h1>`→`<h2>` with a `.post-title` font-size rule so rendered size is unchanged;
> dropped the self-referential `<a>` on single-page titles. Adversarially verified
> (heading/visual-preservation, CSS/CLS/404, regressions) — 0 real defects.

- [ ] **Mobile nav doesn't surface in the header band at narrow widths** (observed
      while doing the ionicons work, 2026-06-29). The 2014 float-based nav
      (`.nav { float: right; margin-top: -2.15em }`, `style.css`) doesn't show the
      icon-only Resume/About links in the dark header band on narrow screens.
      **Pre-existing** — confirmed identical on `master` before the icon swap, so
      not a regression. Worth revisiting as its own small layout fix.
> Remaining Tier 2: Typekit dependency, ionicons slim-down, stylesheet
> bundling/minification (the three judgment-heavy refactors).
> The `header-subtitle` h2 was left as-is — `display:none` removes it from the
> a11y tree entirely, so it's not a real outline problem.

---

## Tier 3 — Tech debt / cleanup (low effort, low urgency)

### CSS
- [ ] Obsolete `-webkit/-moz/-o` transition prefixes tripling every rule
      (`style.css:33-36, 49-52, 122-125, 162-165, 171-174`) and `-moz-box-sizing`
      (`style.css:9`, `normalize.css:153,360-361`)
- [ ] Hardcoded palette repeated ~6× (`#252D38`, `#B9CC72`, `#586A84` …) → CSS
      custom properties; the `$VARIABLES` comment block (`style.css:1-5`) pretends
      to be variables but is dead text
- [ ] `transition: all` watches every animatable property (`style.css:33,36,52,165`)
- [ ] `normalize.css` pinned at v2.1.3 (2013), ~13 years stale (`normalize.css:1`)
- [ ] Dead form/`label` selectors that never appear in the site
      (`style.css:61-63, 65-74`)

### Build / config
- [ ] `eleventy.config.js:26` `addPassthroughCopy("src/images")` targets a
      non-existent dir (silent no-op)
- [ ] `.jshintrc` is dead config — no JS to lint, no lint script/dependency
- [ ] **`CLAUDE.md:27` says deploy triggers on `main`, but it's `master`**
      (`.github/workflows/deploy.yml:4-6`) — doc drift
- [ ] Document the `/schedule` redirect engine in `CLAUDE.md` / `README`

### Templates
- [ ] Obsolete `X-UA-Compatible IE=edge` meta (`base.njk:5`)
- [ ] Empty `<footer>` renders nothing (`base.njk:46-48`)
- [ ] Protocol-relative `//schema.org/...` itemtypes (`base.njk:20,22`,
      `article.njk:5`, `home.njk:8`) → use `https://schema.org/...`
- [ ] Title template yields a leading `" - Michael Wales"` if a title block is
      ever empty (`base.njk:6`) — make the separator conditional, source name
      from `site.title`
- [ ] 5 near-identical layout includes could collapse to 1–2

---

## Checked and found fine (rejected false positives)

- **`rel=canonical` → google.com in `/schedule` stubs** — correct by design for a
  redirect page.
- **Bare `/schedule/` 404s** — intentional; no index page needed.
- **No `robots.txt`** — not needed for a fully-indexable small site.
- **`package.json` description staleness** — text exists but low value; folded
  into the identity-drift item above.
