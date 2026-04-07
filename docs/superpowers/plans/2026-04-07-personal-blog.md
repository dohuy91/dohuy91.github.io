# Personal Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a Notion-styled personal technical blog at `dohuy91.github.io` using `timlrx/tailwind-nextjs-starter-blog` as the base.

**Architecture:** Fork the starter into the existing repo, configure it for Huy's profile, apply Notion-like style overrides, add a language filter for EN/VI posts, extend the theme toggle to 3 modes, then deploy via GitHub Actions to `gh-pages`.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, MDX via Contentlayer, GitHub Actions, Giscus, Kbar, Umami, Buttondown

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `data/siteMetadata.js` | Modify | Site config, feature toggles (comments, search, analytics, newsletter) |
| `data/authors/default.mdx` | Modify | About page content |
| `data/projectsData.ts` | Modify | Projects showcase data with `techStack[]` |
| `data/blog/` | Modify | Replace sample posts with seed posts in EN + VI |
| `contentlayer.config.ts` | Modify | Add `language` field to Blog document type |
| `tailwind.config.js` | Modify | Inter font, Notion color palette, prose overrides |
| `css/tailwind.css` | Modify | Dark background `#1a1a1a`, prose line-height |
| `components/ThemeSwitch.tsx` | Modify | Extend to 3-mode: Light / Dark / System |
| `components/LanguageFilter.tsx` | Create | Client component: All / English / Tiếng Việt filter |
| `app/blog/page.tsx` | Modify | Wire in `LanguageFilter` component |
| `app/projects/page.tsx` | Modify | Render `techStack[]` badges per project |
| `next.config.js` | Modify | Enable static export (`output: 'export'`) |
| `.github/workflows/deploy.yml` | Create | Build + deploy to `gh-pages` branch |
| `public/.nojekyll` | Create | Prevent GitHub Pages from running Jekyll |
| `.gitignore` | Modify | Add `.superpowers/`, `.contentlayer/` |

---

## Task 1: Bootstrap starter into repo

**Files:**
- Modify: all repo root files (populated by clone)

- [ ] **Step 1: Download starter into repo**

```bash
cd /c/work/playground/dohuy91.github.io

# Download the starter as a zip (avoids git history conflict)
curl -L https://github.com/timlrx/tailwind-nextjs-starter-blog/archive/refs/heads/main.zip -o starter.zip
unzip starter.zip
cp -r tailwind-nextjs-starter-blog-main/. .
rm -rf tailwind-nextjs-starter-blog-main starter.zip
```

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

Expected: packages installed, no errors.

- [ ] **Step 3: Verify dev server runs**

```bash
npm run dev
```

Expected: server starts at `http://localhost:3000`. Open in browser — should show the starter's default homepage with sample posts.

- [ ] **Step 4: Update .gitignore**

Add these lines to `.gitignore`:

```
.contentlayer/
.superpowers/
out/
```

- [ ] **Step 5: Commit bootstrap**

```bash
git add -A
git commit -m "chore: bootstrap tailwind-nextjs-starter-blog"
```

---

## Task 2: Configure site metadata

**Files:**
- Modify: `data/siteMetadata.js`
- Modify: `data/authors/default.mdx`

- [ ] **Step 1: Replace `data/siteMetadata.js`**

```js
const siteMetadata = {
  title: "Huy's Blog",
  author: 'Do Quang Huy',
  headerTitle: "dohuy91",
  description: 'Technical writings on software engineering, productivity, and dev tools.',
  language: 'en-us',
  theme: 'system', // 'system', 'dark', or 'light'
  siteUrl: 'https://dohuy91.github.io',
  siteRepo: 'https://github.com/dohuy91/dohuy91.github.io',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: '',
  github: 'https://github.com/dohuy91',
  linkedin: 'https://www.linkedin.com/in/dohuy91',
  locale: 'en-US',
  stickyNav: false,
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: '', // fill in after signing up at umami.is
    },
  },
  newsletter: {
    provider: 'buttondown',
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: 'dohuy91/dohuy91.github.io',
      repositoryId: '', // fill in from giscus.app after setup
      category: 'Announcements',
      categoryId: '', // fill in from giscus.app after setup
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'en',
    },
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}

module.exports = siteMetadata
```

- [ ] **Step 2: Update `data/authors/default.mdx`**

```mdx
---
name: Do Quang Huy
avatar: /static/images/avatar.jpg
occupation: Lead Software Developer
company: Netcompany
email: ''
github: https://github.com/dohuy91
linkedin: https://www.linkedin.com/in/dohuy91
---

Hi, I'm Huy — a lead software developer based in Ho Chi Minh City, Vietnam.

I work on enterprise banking platforms and enjoy writing about software engineering, productivity tooling, and developer experience.

I write in both **English** and **Tiếng Việt**.
```

- [ ] **Step 3: Add a placeholder avatar**

Place any 200×200 image at `public/static/images/avatar.jpg`. You can replace it later.

- [ ] **Step 4: Commit**

```bash
git add data/siteMetadata.js data/authors/default.mdx
git commit -m "chore: configure site metadata and about page"
```

---

## Task 3: Static export + GitHub Actions deploy

**Files:**
- Modify: `next.config.js`
- Create: `.github/workflows/deploy.yml`
- Create: `public/.nojekyll`

- [ ] **Step 1: Enable static export in `next.config.js`**

Open `next.config.js` and ensure it contains `output: 'export'` and `images: { unoptimized: true }`. The file likely looks like this — replace it entirely:

```js
const { withContentlayer } = require('next-contentlayer2')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  eslint: {
    dirs: ['app', 'components', 'layouts', 'scripts'],
  },
}

module.exports = withContentlayer(nextConfig)
```

- [ ] **Step 2: Verify build produces `out/` directory**

```bash
npm run build
```

Expected: build completes, `out/` directory created containing `index.html` and static assets.

- [ ] **Step 3: Create `public/.nojekyll`**

Create an empty file at `public/.nojekyll`. This tells GitHub Pages not to process the site with Jekyll.

```bash
touch public/.nojekyll
```

- [ ] **Step 4: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
          enable_jekyll: false
```

- [ ] **Step 5: Enable GitHub Pages in repo settings (manual)**

Go to `https://github.com/dohuy91/dohuy91.github.io/settings/pages`:
- Source: **Deploy from a branch**
- Branch: **gh-pages** / **/ (root)**
- Save

> Note: The `gh-pages` branch will be created automatically on first deploy.

- [ ] **Step 6: Commit**

```bash
git add next.config.js .github/workflows/deploy.yml public/.nojekyll
git commit -m "chore: configure static export and GitHub Actions deploy"
```

---

## Task 4: Notion-like style overrides

**Files:**
- Modify: `tailwind.config.js`
- Modify: `css/tailwind.css`

- [ ] **Step 1: Update font and colors in `tailwind.config.js`**

Find the `theme.extend` section in `tailwind.config.js` and update it:

```js
// In theme.extend:
fontFamily: {
  sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
},
colors: {
  // Keep existing primary color, override gray to Notion neutral
  gray: {
    50:  '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
},
```

Also ensure `Inter` is imported. In `css/tailwind.css`, add at the top:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

- [ ] **Step 2: Set Notion dark background and prose in `css/tailwind.css`**

Add these rules to `css/tailwind.css`:

```css
/* Notion-like dark background — not pure black */
.dark body {
  background-color: #1a1a1a;
}

/* Relaxed prose for readability */
.prose {
  line-height: 1.75;
  max-width: 48rem;
}

/* Subtle tag pills */
.tag {
  @apply rounded-full bg-gray-100 px-3 py-0.5 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300;
}
```

- [ ] **Step 3: Verify styles in dev**

```bash
npm run dev
```

Open `http://localhost:3000` — font should be Inter, dark mode background should be `#1a1a1a` (dark gray, not pure black), text should be relaxed.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.js css/tailwind.css
git commit -m "style: apply Notion-like font, colors, and prose overrides"
```

---

## Task 5: Extend theme toggle to 3 modes

**Files:**
- Modify: `components/ThemeSwitch.tsx`

- [ ] **Step 1: Read the existing `components/ThemeSwitch.tsx`**

Open and read it — note the current structure before modifying.

- [ ] **Step 2: Replace with 3-mode toggle**

Replace the entire file contents with:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

type ThemeMode = 'light' | 'dark' | 'system'

const modes: ThemeMode[] = ['light', 'dark', 'system']

const icons: Record<ThemeMode, string> = {
  light: '☀️',
  dark: '🌙',
  system: '💻',
}

const labels: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const current = (theme as ThemeMode) ?? 'system'
  const next = modes[(modes.indexOf(current) + 1) % modes.length]

  return (
    <button
      aria-label={`Switch to ${labels[next]} mode`}
      title={`Current: ${labels[current]} — click for ${labels[next]}`}
      onClick={() => setTheme(next)}
      className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
    >
      <span className="text-base leading-none">{icons[current]}</span>
    </button>
  )
}
```

- [ ] **Step 3: Verify toggle cycles correctly**

```bash
npm run dev
```

Open `http://localhost:3000`. Click the theme icon in the navbar — it should cycle: ☀️ Light → 🌙 Dark → 💻 System → ☀️ Light. Refresh — selected theme should persist.

- [ ] **Step 4: Commit**

```bash
git add components/ThemeSwitch.tsx
git commit -m "feat: extend theme toggle to 3 modes (light/dark/system)"
```

---

## Task 6: Add language field and filter UI

**Files:**
- Modify: `contentlayer.config.ts`
- Create: `components/LanguageFilter.tsx`
- Modify: `app/blog/page.tsx`

- [ ] **Step 1: Add `language` field to `contentlayer.config.ts`**

Open `contentlayer.config.ts`. Find the `Blog` document type's `fields` definition. Add the `language` field:

```ts
// Inside defineDocumentType(() => ({ fields: { ... } }))
language: {
  type: 'enum',
  options: ['en', 'vi'],
  default: 'en',
},
```

- [ ] **Step 2: Rebuild contentlayer types**

```bash
npm run dev
```

Expected: contentlayer regenerates `.contentlayer/generated/`. The `Blog` type now has a `language` field. Stop the server.

- [ ] **Step 3: Create `components/LanguageFilter.tsx`**

```tsx
'use client'

import { useState } from 'react'
import type { Blog } from 'contentlayer/generated'

type Language = 'all' | 'en' | 'vi'

interface Props {
  posts: Blog[]
  renderPosts: (posts: Blog[]) => React.ReactNode
}

const LABELS: Record<Language, string> = {
  all: 'All',
  en: 'English',
  vi: 'Tiếng Việt',
}

export default function LanguageFilter({ posts, renderPosts }: Props) {
  const [lang, setLang] = useState<Language>('all')

  const filtered = lang === 'all' ? posts : posts.filter((p) => p.language === lang)

  return (
    <>
      <div className="mb-6 flex gap-2">
        {(['all', 'en', 'vi'] as Language[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`rounded-full px-4 py-1 text-sm font-medium transition-colors ${
              lang === l
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {LABELS[l]}
          </button>
        ))}
      </div>
      {renderPosts(filtered)}
    </>
  )
}
```

- [ ] **Step 4: Wire `LanguageFilter` into `app/blog/page.tsx`**

Open `app/blog/page.tsx`. Find where it maps over posts to render the listing. Import and wrap the post list with `LanguageFilter`.

The relevant section will look roughly like this — locate the `return` statement and add the filter:

```tsx
import LanguageFilter from '@/components/LanguageFilter'

// Inside the page component, wrap the post list:
// Before (example):
//   <PostList posts={posts} />
//
// After:
<LanguageFilter
  posts={posts}
  renderPosts={(filtered) => <PostList posts={filtered} />}
/>
```

> Note: The exact component name used for the post list (`PostList`, `BlogList`, etc.) will vary — check what `app/blog/page.tsx` currently uses and substitute accordingly.

- [ ] **Step 5: Verify filter works**

```bash
npm run dev
```

Open `http://localhost:3000/blog`. Three buttons should appear: All / English / Tiếng Việt. Clicking them filters the post list in-browser without a page reload.

- [ ] **Step 6: Commit**

```bash
git add contentlayer.config.ts components/LanguageFilter.tsx app/blog/page.tsx
git commit -m "feat: add language field and EN/VI filter on blog listing"
```

---

## Task 7: Enhance projects page with tech stack

**Files:**
- Modify: `data/projectsData.ts`
- Modify: `app/projects/page.tsx`

- [ ] **Step 1: Update `data/projectsData.ts` type and add `techStack`**

Replace the file contents with:

```ts
interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
  techStack?: string[]
}

const projectsData: Project[] = [
  {
    title: 'dohuy91.github.io',
    description: 'My personal blog — built with Next.js, Tailwind CSS, and MDX.',
    href: 'https://dohuy91.github.io',
    techStack: ['Next.js', 'Tailwind CSS', 'MDX'],
  },
]

export default projectsData
```

- [ ] **Step 2: Update `app/projects/page.tsx` to render tech stack badges**

Open `app/projects/page.tsx`. Find where it renders each project card and add tech stack badge rendering after the description:

```tsx
// After the description paragraph, add:
{project.techStack && project.techStack.length > 0 && (
  <div className="mt-3 flex flex-wrap gap-1.5">
    {project.techStack.map((tech) => (
      <span
        key={tech}
        className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300"
      >
        {tech}
      </span>
    ))}
  </div>
)}
```

- [ ] **Step 3: Verify projects page**

```bash
npm run dev
```

Open `http://localhost:3000/projects`. Should show a project card with tech stack badges below the description.

- [ ] **Step 4: Commit**

```bash
git add data/projectsData.ts app/projects/page.tsx
git commit -m "feat: add techStack badges to projects showcase page"
```

---

## Task 8: Configure features (Giscus, Kbar, Umami, Buttondown)

**Files:**
- Modify: `data/siteMetadata.js` (fill in IDs obtained from external services)

> Prerequisites — complete these setup steps before filling in IDs:

### 8a: Giscus setup

- [ ] **Step 1: Enable GitHub Discussions on the repo**

Go to `https://github.com/dohuy91/dohuy91.github.io/settings` → Features → check **Discussions**. Save.

- [ ] **Step 2: Get Giscus IDs**

Visit `https://giscus.app`. Fill in:
- Repository: `dohuy91/dohuy91.github.io`
- Page ↔ Discussion mapping: **Pathname**
- Discussion category: **Announcements**

Copy the `data-repo-id` and `data-category-id` values from the generated script tag.

- [ ] **Step 3: Fill IDs into `siteMetadata.js`**

```js
// In giscusConfig:
repositoryId: 'R_REPLACE_WITH_REPO_ID',
categoryId: 'DIC_REPLACE_WITH_CATEGORY_ID',
```

### 8b: Umami setup

- [ ] **Step 4: Create Umami Cloud account**

Sign up at `https://umami.is`. Create a new website entry for `dohuy91.github.io`. Copy the **Website ID** (a UUID).

- [ ] **Step 5: Fill Umami ID into `siteMetadata.js`**

```js
// In analytics.umamiAnalytics:
umamiWebsiteId: 'REPLACE_WITH_UMAMI_WEBSITE_ID',
```

### 8c: Buttondown setup

- [ ] **Step 6: Create Buttondown account**

Sign up at `https://buttondown.email`. Note your **username** (used in the API endpoint).

- [ ] **Step 7: Set Buttondown username in env**

Create `.env.local`:

```
BUTTONDOWN_USERNAME=your_buttondown_username
```

Add `.env.local` to `.gitignore` (should already be there — confirm).

### 8d: Kbar (search)

Kbar requires a `search.json` to be generated at build time. Confirm `app/api/search/route.ts` or equivalent exists in the starter — if not, this is handled by the starter's built-in script. No extra config needed beyond the `siteMetadata.js` entry already set in Task 2.

- [ ] **Step 8: Commit updated siteMetadata**

```bash
git add data/siteMetadata.js
git commit -m "chore: configure Giscus, Umami, Buttondown feature IDs"
```

---

## Task 9: Seed first content, clear sample posts

**Files:**
- Modify: `data/blog/` (delete samples, add seed posts)
- Modify: `data/authors/default.mdx` (already done in Task 2)

- [ ] **Step 1: Delete all sample blog posts**

```bash
rm data/blog/*.mdx
```

- [ ] **Step 2: Create first English post `data/blog/2026-04-07-hello-world.mdx`**

```mdx
---
title: 'Hello World'
date: '2026-04-07'
language: en
tags: ['meta', 'intro']
summary: 'First post — what this blog is about and what to expect.'
draft: false
---

Welcome to my blog.

I'm Huy — a lead software developer based in Ho Chi Minh City. I've been writing code professionally for 8+ years, mostly on enterprise platforms in .NET/Java, but I'm always exploring new tools and ideas.

This is where I'll write about things I learn, build, or find interesting:

- Software engineering — architecture, patterns, code craft
- Developer tools — AI coding assistants, productivity setups
- Notes from the field — lessons from real projects

Posts will be in **English** or **Tiếng Việt** depending on what feels right for the topic.

Use the filter on the [blog listing](/blog) to switch between languages.
```

- [ ] **Step 3: Create first Vietnamese post `data/blog/2026-04-07-xin-chao.mdx`**

```mdx
---
title: 'Xin chào'
date: '2026-04-07'
language: vi
tags: ['meta', 'giới thiệu']
summary: 'Bài đầu tiên — blog này về chủ đề gì và những gì sắp tới.'
draft: false
---

Xin chào, tôi là Huy.

Tôi là một lead software developer đang làm việc tại TP.HCM. Blog này là nơi tôi ghi lại những thứ tôi học được, xây dựng, hoặc thấy thú vị.

Tôi sẽ viết về:

- Kỹ thuật phần mềm — kiến trúc, design pattern, code quality
- Công cụ lập trình — AI coding tools, productivity setup
- Ghi chú thực tế — bài học từ các dự án thực tế

Bài viết sẽ bằng **Tiếng Việt** hoặc **English** tùy chủ đề.

Dùng bộ lọc trên trang [blog](/blog) để chuyển đổi ngôn ngữ.
```

- [ ] **Step 4: Verify posts render**

```bash
npm run dev
```

Open `http://localhost:3000/blog` — should show 2 posts. Language filter should work: clicking "English" shows only Hello World, clicking "Tiếng Việt" shows only Xin chào.

- [ ] **Step 5: Commit**

```bash
git add data/blog/
git commit -m "content: add seed posts in English and Vietnamese, remove samples"
```

---

## Task 10: Final deploy and verification

- [ ] **Step 1: Run a clean production build locally**

```bash
npm run build
```

Expected: exits with code 0, `out/` directory contains static HTML/CSS/JS.

- [ ] **Step 2: Preview production build locally**

```bash
npx serve out
```

Open `http://localhost:3000` (or the port shown). Verify:
- Home loads
- `/blog` shows posts + language filter
- `/projects` shows card with tech stack badges
- `/about` shows Huy's bio
- `/tags` works
- Theme toggle cycles Light → Dark → System

- [ ] **Step 3: Push to main and watch GitHub Actions**

```bash
git push origin main
```

Go to `https://github.com/dohuy91/dohuy91.github.io/actions` — watch the **Deploy to GitHub Pages** workflow run. Expected: green checkmark within ~2 minutes.

- [ ] **Step 4: Verify live site**

Open `https://dohuy91.github.io`. Verify the live site matches what was tested locally.

> If the site shows a 404, confirm GitHub Pages is configured to serve from the `gh-pages` branch in Settings → Pages.

- [ ] **Step 5: Final commit (if any last tweaks)**

```bash
git add -A
git commit -m "chore: final deploy verification tweaks"
git push origin main
```

---

## Post-Launch Checklist

After the site is live, complete these one-time tasks:

- [ ] Upload a real avatar photo to `public/static/images/avatar.jpg`
- [ ] Fill in Giscus `repositoryId` and `categoryId` (from Task 8)
- [ ] Fill in Umami `umamiWebsiteId` (from Task 8)
- [ ] Create Buttondown account and set `BUTTONDOWN_USERNAME` in repo secrets for Actions
- [ ] Add `BUTTONDOWN_USERNAME` to GitHub Actions secrets: Settings → Secrets → Actions → New secret
