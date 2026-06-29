---
title: Resurrecting a 2014 Codebase in 2026
date: 2026-01-10
description: "Reviving a brittle, decade-old blog buried under technical debt—handing the whole repository to Claude Code and migrating from Wintersmith to a modern Eleventy build."
---

For many developers, software projects never truly die - they just become harder and harder to touch. The code still exists; the ideas still matter; the content or functionality still has value. What disappears first is the ability to reasonably maintain that code. Over time, dependencies rot, build tools get abandoned, and the cognitive cost of even small changes steadily rises until the only sensible option seems to be "don’t touch it." That was the state of this blog - not broken in concept, but brittle and immobilized under a decade of technical debt.

For years, this blog has had outdated information - locations, employers, etc. Simply because the technical overhead in getting things functional again didn't outweigh my other responsibilities nor the ability to just edit the source in Dev Tools and print to PDF whenever I needed a current resume.

When I set out to revive this blog, I wasn’t trying to resurrect a nostalgia project. What I was confronting was a classic technical debt problem: the system was stable enough to serve pages but too fragile to evolve. It was built on [Wintersmith](http://wintersmith.io/), a static site generator that hasn’t seen meaningful maintenance in years; it used [Bower](https://bower.io/) for front-end dependencies; it relied on [Moment.js](https://momentjs.com/) for dates; and it had no modern deployment pipeline. Any attempt to update a post or add a new feature would require untangling all of these brittle pieces first. In other words, it was trapped in its own legacy. I wanted to see whether an AI assistant could help liberate it.

The approach I took with [Claude Code](https://claude.com/product/claude-code) was not to ask for guides or to tell it what the new architecture should look like, but to provide the entire repository and a single directive: make this buildable and deployable again on contemporary tooling. What followed was a migration process that, by traditional measures, would have taken a developer at least a few days of uninterrupted work - possibly longer if they needed to reacquaint themselves with tools that haven’t been in common use for years.

The first substantive change the AI applied was migrating away from Wintersmith to [Eleventy](https://www.11ty.dev/) 3.x. Eleventy has emerged as a robust, versatile static site generator that embraces simplicity and extensibility, making it an excellent destination for this kind of project. Claude reconstructed the directory structure into Eleventy’s conventions, organized templates into `_includes`, applied readable date handling with [Luxon](https://moment.github.io/luxon/#/) instead of Moment, and rewrote syntax highlighting to use build-time [Prism](https://prismjs.com/) rather than client-side `highlight.js`. Every one of these decisions reflects a modernization that reduces runtime complexity and improves maintainability.

At every step, the AI had to reason about context that typically only a human engineer would understand. When Eleventy failed to build because templates couldn’t find `base.njk`, the system identified that Wintersmith’s layout placement did not align with Eleventy’s [Nunjucks](https://mozilla.github.io/nunjucks/) lookup paths and moved the files into a structure Eleventy expects. When initial GitHub Actions failed to trigger because the workflow was configured to watch the `main` branch while the repository’s default branch was `master`, Claude detected and corrected the discrepancy. Later, when the static site was being published to the wrong branch for GitHub Pages, the deploy workflow was updated to publish to `master` instead of `main` so that Pages would correctly serve the updated content. These are the kinds of integration and platform details that usually require reading documentation, trial and error, or painful debugging sessions; the AI internalized and applied them in real time.

Along the way, the repository was cleaned up: thousands of lines of obsolete configuration and unused assets were removed, replaced by a leaner, more modern codebase that reflected current best practices. A GitHub Actions workflow was introduced that builds and deploys the site automatically on push, eliminating the need for manual scripts.

The reason this matters is not because I was able to publish a blog post - it’s that a realistic, non-toy codebase was migrated, modernized, and restored to a state where it can be meaningfully improved again. Most abandoned projects don’t fail outright; they erode incrementally, and this erosion accumulates into a threshold beyond which no one wants to touch the code for fear of breaking something that nobody understands. Tools rot. Build processes become inscrutable. Developers forget the original mental model. What once might have taken a weekend of yak-shaving now can be addressed without painful context switching.

What this experience highlights is an evolution in developer productivity that goes beyond code generation. It’s not always about asking an AI assistant to write a new feature from scratch - it can be about using AI to restore the ability to reason about and work with existing systems. It can be about bringing a legacy codebase back into a form where the cost of change is low again. That unlocks a spectrum of opportunity: documentation sites that can finally be updated, internal tools that can be maintained without fear, prototypes that can be evolved into products, and so on. Instead of writing new code to replace old systems, we can now consider reviving them with far less investment than would have been plausible even a year ago.

This isn’t automation in the sense of replacing the developer. Throughout the process, I reviewed diffs, made architectural choices, accepted or rejected decisions based on intent and context. What the AI handled was the heavy lifting - the tedious, error-prone migrations and integration tweaks that typically occupy the margins of every significant change. With that burden reduced, developers are free to focus on what matters: reasoning about the user experience, the architecture, and the goals of the software itself.

## Technical Appendix

This section exists for the people who want to understand not just that a legacy project was modernized, but how it was done and what kinds of transformations are now feasible with AI-assisted tooling.

### Repository-Level Modernization

The original `michaelwales.com` repository was structured around Wintersmith, Bower, and hand-rolled shell scripts. Its directory layout looked roughly like this:

```
/contents
/templates
/plugins
/bower_components
/config.json
/build.sh
```

This layout assumed:

* a global Wintersmith installation,
* front-end assets fetched via Bower,
* runtime JavaScript for things like syntax highlighting and date formatting,
* and a human running build and deploy scripts locally.

Claude migrated this into a contemporary Eleventy-based static site with a structure more like:

```
/src
  /_includes
  /_data
  /posts
  /assets
.eleventy.js
package.json
.github/workflows/deploy.yml
```

This matters because it replaces implicit, tribal-knowledge-based build steps with explicit, reproducible infrastructure. Anyone who clones the repo can now run npm install and npm run build and get the same result, which is a non-negotiable requirement for sustainable software.

### Template Migration: Wintersmith to Nunjucks (Eleventy)

Wintersmith templates were written in a dialect of Nunjucks but organized around layout inheritance rules that Eleventy does not share. For example, Wintersmith allowed templates to reference layouts by name regardless of location, while Eleventy requires layouts to live under `_includes`.

Claude didn’t just convert syntax — it re-modeled the template graph.

A Wintersmith page like this:

```
{% raw %}{% extends "layout.html" %}
{% block content %}
  <article>
    <h1>{{ title }}</h1>
    {{ contents | safe }}
  </article>
{% endblock %}{% endraw %}
```

Was converted into an Eleventy-compatible version like:

```
{% raw %}---
layout: base.njk
---

<article>
  <h1>{{ title }}</h1>
  {{ content | safe }}
</article>{% endraw %}
```

And the base layout was relocated into: `src/_includes/base.njk`


So Eleventy’s resolver could actually find it. This is a perfect example of where most migrations stall: the syntax might be "compatible" but the tooling assumptions are not. AI was able to discover, test, and correct those mismatches iteratively.

### Syntax Highlighting: Runtime to Build Time

Originally, syntax highlighting was done in the browser using highlight.js. Claude replaced this with Eleventy’s Prism integration, so code blocks are rendered as HTML during the build.

Before:

* Browser downloads `highlight.js`
* DOM is scanned
* Code blocks are post-processed

After:

* Markdown → HTML with Prism classes at build time
* Zero runtime cost

This again reflects a broader pattern: AI naturally gravitates toward architectures that are simpler to reason about and less fragile in production.

### GitHub Actions: From Shell Scripts to CI

The old deployment flow relied on shell scripts that pushed a built directory to GitHub Pages manually. Claude replaced this with a GitHub Actions workflow:

```
name: Build and Deploy Eleventy Site

on:
  push:
    branches:
      - master

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
          publish_branch: master
```

Two interesting things happened here:

1. The AI initially assumed the default branch was main, then corrected itself when the workflow failed.
2. It discovered that GitHub Pages was serving from `master`, not `gh-pages`, and updated the deploy target accordingly.

That kind of "platform awareness" is exactly what makes legacy projects so expensive to maintain — and what AI is now able to absorb.

### Codebase Shrinkage as a Signal

One of the strongest signals of success was the net change in the repository:

* ~35,000 lines removed
* ~2,000 lines added

Most of what disappeared was:

* vendored libraries,
* legacy build glue,
* unused scripts,
* obsolete configs.

What replaced it was:

* a modern dependency graph,
* a single, readable build pipeline,
* and a small, understandable project footprint.

That ratio is what real modernization looks like.

### Why This Works Now

None of this required "understanding" in the human sense. What the AI brought was something else: the ability to navigate, simulate, and adapt complex systems quickly enough that exploration is cheap.

This is what makes old codebases newly valuable. They don’t need to be rewritten; they need to be translated forward.

That’s the real unlock.

### Some Fun Things to Note

I have a lot of experience with AI in the form of OpenAI's/Anthropic's chatbots, or Cursor's/Windsurf's/VSCode's in-IDE experiences, but my history with agentic AI experiences is pretty minimal right now - probably limited to various iterations of [BMAD](https://github.com/bmad-code-org/BMAD-METHOD) in all of the tools previously mentioned.

Claude Code did phenomenally well here and I'm happy with the results, but I was surprised as how quickly I burned through all of my tokens for a 6-hour block of time (Claude Pro). I did use Opus and planning mode for the first prompt or two, until I felt like I understood the plan it was coming up with and trusted it to "just go do things" - more experimentation is in order on my part to figure out the best times to opt-in to the more resource intensive compute.