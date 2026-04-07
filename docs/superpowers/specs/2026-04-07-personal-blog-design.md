# Personal Blog Design — dohuy91.github.io

**Date:** 2026-04-07
**Author:** Huy (Do Quang Huy)
**Status:** Approved

---

## Overview

A personal technical blog deployed at `dohuy91.github.io`, built on the `timlrx/tailwind-nextjs-starter-blog` starter. Content is written in MDX files. The visual style is Notion-inspired: Inter font, minimal layout, neutral palette, and clean typography. Posts are written in both English and Vietnamese.

---

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Base template | [timlrx/tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog) |
| Styling | Tailwind CSS + custom Notion-like overrides |
| Content format | MDX (Markdown + JSX) |
| Deployment | GitHub Actions → `gh-pages` branch → `dohuy91.github.io` |
| Domain | `dohuy91.github.io` (no custom domain) |

---

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home — recent posts + intro |
| `/blog` | Post listing with language filter |
| `/blog/[slug]` | Individual post page |
| `/tags` | All tags listing |
| `/tags/[tag]` | Posts filtered by tag |
| `/projects` | Showcase page — project cards only |
| `/about` | About page (MDX) |

---

## Content Structure

```
data/
  blog/           ← MDX post files
  authors/
    default.mdx   ← About page content
  projectsData.ts ← Projects showcase (static data, not MDX pages)
  siteMetadata.js ← Site-wide config

public/           ← Images and static assets
.github/
  workflows/
    deploy.yml    ← Build + deploy to gh-pages
```

### Post Frontmatter

```yaml
---
title: 'Post Title'
date: '2026-04-07'
language: en        # en or vi
tags: ['nextjs', 'tutorial']
summary: 'Short description shown in listing'
draft: false
---
```

### Projects Data (`projectsData.ts`)

Each project entry has: `title`, `description`, `href` (live URL), `imgSrc`, `techStack[]`. No individual project pages — the `/projects` page renders cards from this file.

---

## Bilingual Content

- All posts live in a single `data/blog/` directory
- Language is declared per-post via `language: en | vi` frontmatter
- The `/blog` listing page has a client-side filter: **All / English / Tiếng Việt**
- No routing changes — filtering happens in-browser
- No translated UI strings (nav and labels remain in English)

---

## Features

### Comments — Giscus
- GitHub Discussions-based commenting
- Readers authenticate with GitHub account
- Config: `repo`, `repoId`, `categoryId` in `siteMetadata.js`

### Search — Kbar
- Command palette triggered by `Cmd+K` / `Ctrl+K`
- Searches post titles, summaries, and tags
- Fully client-side, no external service

### Analytics — Umami
- Privacy-friendly, open source alternative to Google Analytics
- Default setup: Umami Cloud (free tier, no infra needed)
- Optional: self-host on Raspberry Pi/NAS later
- GA4 also supported if preferred

### Newsletter — Buttondown
- Simple subscription form in the footer
- Free up to 100 subscribers
- Markdown-based email editor
- Mailchimp supported as alternative

### RSS Feed
- Auto-generated at `/feed.xml`
- No additional config needed

### Theme Toggle
- 3-mode toggle in navbar: **Light / Dark / System**
- System follows OS preference
- Selection persisted in `localStorage`

---

## Notion-like Style Customizations

Overrides applied on top of the starter's default theme via `tailwind.config.js` and global CSS:

| Element | Value |
|---------|-------|
| Font family | Inter (same as Notion) |
| Body text color (light) | `#374151` |
| Body text color (dark) | `#d4d4d4` |
| Background (light) | `#ffffff` |
| Background (dark) | `#1a1a1a` (not pure black) |
| Prose line-height | `1.75` (relaxed) |
| Content max-width | `48rem` (centered) |
| Tag style | Subtle gray pill, no borders |
| Nav | Minimal — logo left, links + theme toggle right |

---

## Deployment

- `main` branch is the source branch
- GitHub Actions workflow triggers on push to `main`
- Runs `next build` + `next export` (static output)
- Deploys static output to `gh-pages` branch
- GitHub Pages serves from `gh-pages`

---

## Out of Scope

- Custom domain
- Full i18n (translated UI strings)
- Individual project detail pages
- Server-side features (API routes, ISR) — fully static export
