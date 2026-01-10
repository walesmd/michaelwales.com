# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog (michaelwales.com) built with Eleventy (11ty), a static site generator. The built output is deployed to a separate repository (walesmd.github.io) for GitHub Pages hosting.

## Build Commands

```bash
# Install dependencies
npm install

# Build static site (outputs to _site/)
npm run build

# Development server with live reload
npm run serve

# Clean build output
npm run clean
```

## Deployment

Deployment is automated via GitHub Actions. Pushing to `main` triggers:
1. Build with Eleventy
2. Deploy to walesmd/walesmd.github.io repository

Manual deployment requires setting up a deploy key between repositories (see `.github/workflows/deploy.yml`).

## Architecture

**Static Site Generator**: Eleventy 3.x with Nunjucks templating

**Directory Structure**:
```
src/
├── _includes/       # Nunjucks templates (base.njk, article.njk, etc.)
├── _data/           # Global data (site.json)
├── articles/        # Blog posts: {slug}/index.md + images
├── about/           # About page
├── resume/          # Resume page
├── styles/          # CSS files
├── fonts/           # Icon fonts (ionicons)
└── index.md         # Homepage
```

**Content Structure**:
- Articles live in `src/articles/{slug}/index.md` with co-located images
- Directory data file (`src/articles/articles.json`) sets defaults for all articles
- Frontmatter uses ISO date format: `date: 2014-02-12`

**Templates** (`src/_includes/`):
- `base.njk` - Base layout with header, nav, footer
- `article.njk`, `page.njk`, `home.njk`, `resume.njk` - Extend base.njk

**Configuration** (`eleventy.config.js`):
- Date filters: `readableDate`, `htmlDateString` (using Luxon)
- Syntax highlighting via `@11ty/eleventy-plugin-syntaxhighlight`
- Articles collection sorted by date descending
- Passthrough copy for styles, fonts, images

## Adding New Articles

Create `src/articles/{slug}/index.md`:
```yaml
---
title: Article Title
date: 2024-01-15
---

Article content in Markdown...
```

Images can be placed alongside `index.md` and referenced with relative paths:
```markdown
![Alt text](image.png)
```
