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
- [ ] Add a real `src/favicon.ico` (and/or SVG) + `<link rel="icon">` in `base.njk`

### 3. Mobile nav is icon-only with no accessible name  `[medium]`
- `_includes/base.njk:32,35` + `styles/style.css:132` (re-shown only ≥780px at
  `style.css:310`). Below 780px the `<span>Resume</span>` label is
  `display:none`, leaving a bare icon glyph; the accessible name falls back to
  the `title` attribute, which is unreliable on touch / screen readers.
- **Fix:** add `aria-label="Resume"` / `aria-label="About"` to the anchors, or
  swap `display:none` for a screen-reader-only utility class.
- [ ] Give the two nav links a reliable accessible name at all widths

### 4. Cheap SEO infrastructure for a blog  `[low]` (do as one pass)
- [ ] `<link rel="canonical" href="{{ site.url }}{{ page.url }}">` in `base.njk`
      (`site.url` is defined in `site.json:4` but currently unused)
- [ ] Open Graph + Twitter Card tags in `base.njk` (currently none → bare,
      image-less link previews)
- [ ] RSS/Atom feed — add `@11ty/eleventy-plugin-rss` + a `feed.njk`, link via
      `<link rel="alternate">`
- [ ] `sitemap.xml` template iterating the collections
- [ ] Per-page meta descriptions (today all pages share the one global string)

### 5. Quick accessibility fixes  `[low]`
- [ ] `<html lang="en">` (`_includes/base.njk:2` — currently bare `<html>`)
- [ ] `alt` on the 3 images: `about/index.md:7` (gravatar),
      `getting-started-with-gulpjs/index.md:9,11` (Grunt/Gulp logos)
- [ ] Darken post-date color — `styles/style.css:197` `#AAA` on white is
      ~2.32:1, below the 4.5:1 AA minimum; use ≥`#767676`

---

## Tier 2 — Nice-to-have polish

### Performance / assets
- [ ] **Typekit dependency** (`base.njk:16`): render-blocking synchronous script;
      all fonts (`Athelas`, `Nimbus-Sans-Condensed`, `Source-Code-Pro`) live only
      in that kit (live today, but a single point of failure). Move to async
      embed or self-host with `font-display: swap`.
- [ ] **Concrete font bug:** `styles/style.css:91` declares
      `font-family: 'Source-Code-Pro'` with **no generic fallback** — add
      `, monospace`.
- [ ] **ionicons bloat:** ~515 KB of font files across 4 formats (incl. IE-only
      `.eot`) + a ~700-selector stylesheet to render **5 glyphs**
      (`styles/ionicons.min.css`, `fonts/ionicons.*`, linked at `base.njk:12`).
      Replace with 5 inline SVGs, or at minimum drop `.eot`/`.svg`.
- [ ] **CLS:** article images set `width` but no `height`
      (`getting-started-with-gulpjs/index.md:9,11`).
- [ ] 4 separate unminified/unbundled/non-cache-busted stylesheets in `<head>`
      (`base.njk:11-14`).
- [ ] Add a `404.html` (GitHub Pages will serve it; currently the generic default).

### More accessibility
- [ ] Decorative `<i>` icons lack `aria-hidden="true"` (`base.njk:32,35`,
      `about/index.md:15,18,21`)
- [ ] Heading hierarchy: homepage emits the sidebar `<h1>` plus one `<h1>` per
      article (`home.njk:9`); demote article-list titles to `<h2>`. The
      `header-subtitle` `<h2>` is also `display:none` (`base.njk:26` /
      `style.css:148`).
- [ ] Post titles self-link to their own URL on single views
      (`article.njk:6`, `page.njk:6`) — render as plain heading text there.

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
