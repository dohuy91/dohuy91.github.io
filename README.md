# dohuy91.github.io

Personal technical blog for Do Quang Huy, built with Next.js, Tailwind CSS, MDX, and Contentlayer.

Live site: [https://dohuy91.github.io](https://dohuy91.github.io)

## Stack

- Next.js 15 App Router
- Tailwind CSS 4
- MDX content via Contentlayer
- Pliny for search, comments, newsletter, and analytics integrations
- GitHub Actions deployment to `gh-pages`

## Local development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Run the lightweight filter tests:

```bash
node --test lib/blog-filters.test.mjs
```

Build the static export:

```bash
npm run build
```

## Content and configuration

- [data/siteMetadata.js](/Volumes/Data/Code/Projects/dohuy91.github.io/data/siteMetadata.js): site identity, comments, analytics, newsletter, search
- [data/authors/default.mdx](/Volumes/Data/Code/Projects/dohuy91.github.io/data/authors/default.mdx): author profile
- [data/blog](/Volumes/Data/Code/Projects/dohuy91.github.io/data/blog): blog posts
- [data/projectsData.ts](/Volumes/Data/Code/Projects/dohuy91.github.io/data/projectsData.ts): project cards
- [contentlayer.config.ts](/Volumes/Data/Code/Projects/dohuy91.github.io/contentlayer.config.ts): MDX schema and generated tag/search data
- [css/tailwind.css](/Volumes/Data/Code/Projects/dohuy91.github.io/css/tailwind.css): site theme and prose styling

## Deployment

This repo deploys through [deploy.yml](/Volumes/Data/Code/Projects/dohuy91.github.io/.github/workflows/deploy.yml), which builds the static site and publishes `out/` to the `gh-pages` branch.

For GitHub Pages to serve the deployed site correctly, repository Pages settings should point to:

- Branch: `gh-pages`
- Folder: `/ (root)`

## Notes

- `public/search.json` and `app/tag-data.json` are generated during builds.
- The blog supports English and Vietnamese posts through the `language` frontmatter field.
