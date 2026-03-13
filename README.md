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

```text
public/
  images/
  3dmodels/
src/
  components/
  content/blog/
  layouts/
  pages/
  styles/
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Install

```bash
pnpm install
```

### Run locally

```bash
pnpm dev
```

Site runs at `http://localhost:4321`.

## Available Scripts

- `pnpm dev` — start local dev server
- `pnpm build` — build production output
- `pnpm preview` — preview production build
- `pnpm lint` — run ESLint
- `pnpm lint:fix` — run ESLint with auto-fixes
- `pnpm format` — run Prettier
- `pnpm check-types` — run TypeScript type checks

## Content

- Blog content lives in `src/content/blog` as `.mdx` files.
- Global site metadata and SEO defaults are in `src/consts.ts`.

## Deployment

This project is configured for static deployment and includes `vercel.json`.

Typical deploy flow:

```bash
pnpm install
pnpm build
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
