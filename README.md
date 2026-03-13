# Bound by Death — Website

Official website for **Bound by Death**, built with **Astro + React + Tailwind CSS**.

This repo contains the marketing site, blog/content pages, and the interactive Three.js hero experience used on the homepage.

## Tech Stack

- Astro 5
- React 19
- Tailwind CSS 4
- TypeScript
- Three.js
- MDX content collections

## Project Structure

```shadcn-studio-astro-template/
├── public/                    # Public static assets
│   ├── favicon/               # Favicon files
│   ├── images/                # Public images
│   ├── 3dmodels/                # 3D Models for threejs
│   ├── _headers               # Netlify Deploy Headers
│   ├── robots.txt             # SEO crawler rules
│   └── site.webmanifest       # PWA manifest
│
├── src/
│   ├── assets/                # SVG and other assets
│   │
│   ├── components/            # Reusable UI components
│   │   └── blocks/            # Block components
│   │   └── layout/            # Layout components
│   │   └── sections/          # Data of components
│   │   └── ui/                # Base UI components
│   │
│   ├── layouts/               # Astro layout files
│   │   ├── BlankLayout.astro  # Minimal layout
│   │   ├── HeadSeo.astro      # SEO head layout
│   │   └── Layout.astro       # Main site layout
│   │
│   ├── lib/                   # Helper libraries
│   │   └── utils.ts           # Utility functions
│   │
│   ├── pages/                 # Route-based pages
│   │   ├── 404.astro          # 404 page
│   │   ├── index.astro        # Home page
│   │   └── rss.xml.js         # RSS feed generator
│   │
│   ├── styles/
│   │   └── global.css         # Global styles
│   │
│   ├── utils/                 # Utility functions
│   │   └── seo.ts             # SEO helpers
│   └── consts.ts              # Application constants (SEO)
│
├── astro.config.mjs           # Astro configuration
├── content.config.ts          # Content collections config
├── .env.example               # Environment variable template
├── components.json            # shadcn/ui config
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript configuration
└── vercel.json                # Vercel deployment config
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm or npm

### Install

```bash
npm install
```

### Run locally

```bash
npm dev
```

Site runs at `http://localhost:4321`.

## Available Scripts

- `npm dev` — start local dev server
- `npm build` — build production output
- `npm preview` — preview production build
- `npm lint` — run ESLint
- `npm lint:fix` — run ESLint with auto-fixes
- `npm format` — run Prettier
- `npm check-types` — run TypeScript type checks

## Content

- Blog content lives in `src/content/blog` as `.mdx` files.
- Global site metadata and SEO defaults are in `src/consts.ts`.

## Deployment

This project is configured for static deployment and includes `vercel.json`.

Typical deploy flow:

```bash
npm install
npm build
```

Then deploy the generated `dist/` output (or connect the repo to Vercel).

## Repository

- Primary remote: `https://github.com/Ravenwhisp/Ravenwhisp-Web.git`
- Previous template remote can remain as backup under `old-origin`.

## Credits

- Built from a shadcn/studio Astro template.
- Original template license and attribution are preserved in `LICENSE.md`.

## License

MIT (see `LICENSE.md`).
