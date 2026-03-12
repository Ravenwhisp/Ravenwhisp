<p align="center"></p>

<p align="center">
   <a href="https://shadcnstudio.com" target="_blank">
      <img src="https://cdn.shadcnstudio.com/ss-assets/logo/logo.png" alt="$brand_name-logo" width="40px" height="auto">
   </a>
</p>

<h1 align="center">
   <a href="https://shadcnstudio.com" target="_blank" align="center">
      shadcn/studio
   </a>
</h1>

<p>
   <a href="https://shadcnstudio.com" target="_blank">
      shadcn/studio
   </a>
   is an open-source collection of copy-and-paste shadcn components, blocks, and templates - paired with a powerful theme generator & AI Tools to craft, customize, and ship faster. 🚀
</p>

<a href="https://shadcnstudio.com" target="_blank">
  <img src="https://cdn.shadcnstudio.com/ss-assets/smm/marketing/shadcn-studio-smm-banner.png" alt="shadcn/studio banner" width="1200">
</a>

<p>
    <a href="https://github.com/themeselection/shadcn-studio/blob/main/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
    <a href="https://x.com/ShadcnStudio" target="_blank">
      <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/ShadcnStudio">
   </a>
</p>

<a href="https://themeselection.com" target="_blank">
  <img
    src="https://cdn.shadcnstudio.com/ts-assets/themeselection/logo/logo.png"
    alt="themeselection logo"
    height="30"
  />
</a>

<p>
  Supported by
  <a href="https://themeselection.com" target="_blank">
    ThemeSelection
  </a>
  , with a commitment to empowering the open-source community.
</p>

---

## Table of Contents 📋

- [Table of Contents 📋](#table-of-contents-)
- [Features ✨](#-features)
- [Project Structure 🏗️](#-project-structure)
- [Quick Start 🚀](#-quick-start)
- [Available Commands 🧞](#-available-commands)
- [Code Formatting 🎨](#-code-formatting)
- [Configuration ⚙️](#-configuration)
- [Dependencies 📦](#-dependencies)
- [Deployment 🌐](#-deployment)
- [Documentation 📚](#documentation-)
- [Community 🤝](#community-)
- [Useful Links 🎁](#useful-links-)
- [Social Media :earth_africa:](#social-media-earth_africa)

---

## Why should I use shadcn/studio? 💡

shadcn/ui aims to provide core components with a unique distribution system, allowing developers to copy and paste reusable, customizable UI elements directly into their codebase.

While this approach offers flexibility and control, it comes with some limitations: a lack of diverse component variants examples, limited theme customization options, and limited pre-built blocks. Additionally, its extensive customization options, though powerful, can sometimes feel overwhelming, especially for those seeking a more guided or streamlined experience.

# Shadcn + Astro — Ink Landing Page

This project showcases a complete business website with sections for Header, Hero, Changelog Timeline,FAQ, and call-to-action components.

## ✨ Features

- 🚀 **Built with Astro** - Fast, modern static site generation
- 🎨 **Shadcn Studio Components** - Beautiful, ready-to-use Tailwind CSS components
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- ⚡ **Optimized Performance** - Fast page loads and excellent SEO
- 🔧 **TypeScript Support** - Type-safe configuration and development
- 💅 **Prettier Integration** - Automatic code formatting with Tailwind class sorting
- 🌙 **Tailwind CSS 4** - Latest Tailwind with modern features

## 🏗️ Project Structure

```text
shadcn-studio-astro-template/
├── public/                    # Public static assets
│   ├── favicon/               # Favicon files
│   ├── images/                # Public images
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

## 🚀 Quick Start

### Prerequisites

- Node.js 18, 20, or 22+
- pnpm (recommended) or npm

### Installation

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start the development server:**

   ```bash
   pnpm run dev
   ```

   The site will be available at `http://localhost:4321`

3. **Build for production:**

   ```bash
   pnpm build
   ```

   The built site will be in the `dist/` folder with relative asset paths for easy deployment.

4. **Preview the production build:**

   ```bash
   pnpm run preview
   ```

## 🧞 Available Commands

The template comes with several pre-configured scripts to help you with development, building, and maintaining your project. All scripts can be run using your package manager of choice (npm, pnpm, yarn, or bun) from the root of the project.

| Command       | Action                                                                                                                                 |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------- |
| `dev`         | Starts the Astro development server with hot-reload enabled. Your application will be available at http://localhost:4321               |
| `build`       | Creates an optimized production build of your application. This command generates static files and optimizes your code for deployment. |
| `preview`     | Preview production site locally. Use this to test your production build locally before deploying.                                      |
| `lint`        | Runs ESLint to check your code for potential errors and code quality issues. This helps maintain clean and consistent code.            |
| `lint:fix`    | Runs ESLint and automatically fixes problems where possible.                                                                           |
| `format`      | Formats all files using Prettier to ensure consistent code style.                                                                      |
| `check-types` | Checks TypeScript types to catch type errors before building or deploying.                                                             |

## 🎨 Code Formatting

This project uses **Prettier** for code formatting with the following features:

- **Automatic formatting on save** in VS Code
- **Tailwind CSS class sorting** - Classes are automatically sorted in the recommended order
- **Extra space removal** - Trailing whitespace and extra spaces are removed
- **Consistent code style** - Enforced across all `.astro`, `.js`, `.ts`, and `.css` files

### Setup

1. **Install recommended VS Code extensions** (you'll be prompted when opening the project):
   - Prettier - Code formatter
   - Astro
   - Tailwind CSS IntelliSense
   - EditorConfig for VS Code

2. **Formatting will work automatically** on save thanks to:
   - `.prettierrc` - Prettier configuration
   - `.editorconfig` - Editor settings
   - `.vscode/settings.json` - VS Code workspace settings

3. **Manual formatting:**

   ```bash
   pnpm run format        # Format all files
   ```

## ⚙️ Configuration

Edit `src/consts.ts` to customize your site:

```typescript
export const SITE_TITLE = 'Bound By Death Game | Ravenwhisp Studio'
export const SITE_DESCRIPTION = 'Bound By Death is a dark fantasy co-op hack-and-slash for two players.'

export const SITE_URL = 'https://your-domain.com/'
export const GITHUB_URL = 'https://github.com/your-org/your-repo'

export const SITE_METADATA = {
  title: { default: SITE_TITLE },
  description: SITE_DESCRIPTION,
  themeColor: {
    light: '#111826',
    dark: '#e4e8ef'
  }
  // openGraph, twitter, icons, verification...
}
```

### 🔍 SEO & Site Configuration

Configure the site's SEO and global metadata in `src/consts.ts`. These settings power the `HeadSeo.astro` layout and `seo.ts` helpers so pages have correct titles, descriptions, and social previews.

Recommended fields in this project:

- `SITE_TITLE` and `SITE_DESCRIPTION`: Defaults used for RSS + SEO fallbacks.
- `SITE_URL`: Canonical base URL used in metadata.
- `GITHUB_URL`: Used by social/profile links.
- `SITE_METADATA.title.default`: Default `<title>` fallback.
- `SITE_METADATA.keywords`: Comma-joined keyword meta values.
- `SITE_METADATA.openGraph`: Open Graph title/description/image defaults.
- `SITE_METADATA.twitter`: Twitter card + account metadata.
- `SITE_METADATA.icons`: Favicon/apple icon definitions.
- `SITE_METADATA.themeColor.light` and `SITE_METADATA.themeColor.dark`: Browser theme color for light/dark mode.
- `SITE_METADATA.verification`: Search engine verification tags.

Example `consts.ts` values for SEO fields:

```typescript
// Example settings — edit src/consts.ts
export const SITE_URL = 'https://ravenwhisp.com/'
export const GITHUB_URL = 'https://github.com/ravenwhisp/Ravenwhisp_web'

export const SITE_METADATA = {
  title: { default: 'Bound By Death Game | Ravenwhisp Studio' },
  description: 'Bound By Death is a dark fantasy co-op hack-and-slash for two players.',
  themeColor: {
    light: '#E8EDE8',
    dark: '#202020'
  },
  openGraph: {
    title: 'Bound By Death | Ravenwhisp Studio',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Raven_Whisp'
  }
}
```

Tips:

- Keep `siteUrl` consistent with your deployed domain to ensure correct canonical and Open Graph URLs.
- Place social preview images in `public/images` and reference them with absolute paths (e.g. `/images/social-preview.png`).

## 🌐 Deployment

The production build creates static files with relative asset paths, making it easy to deploy to:

- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Any static hosting service**

Simply upload the contents of the `dist/` folder after running `pnpm run build`.

## Documentation 📚

For comprehensive documentation, please visit [shadcn/studio documentation](https://shadcnstudio.com/docs/getting-started/shadcn-studio-template-nextjs).

## Community 🤝

Join the shadcn/studio community to discuss the library, ask questions, and share your experiences:

- 🐦 [Follow us on Twitter](https://x.com/ShadCNStudio)
- 🎮 [Join us on Discord](https://discord.com/invite/kBHkY7DekX)

## Useful Links 🎁

- [Shadcn Blocks](https://shadcnstudio.com/blocks)
- [Shadcn Templates](https://shadcnstudio.com/templates)
- [Shadcn Figma UI Kit](https://shadcnstudio.com/figma)
- [Shadcn Theme Generator](https://shadcnstudio.com/theme-generator)
- [Shadcn MCP Server](https://shadcnstudio.com/mcp)
- [Shadcn IDE Extension](https://shadcnstudio.com/ide-extension)
- [Shadcn Components](https://shadcnstudio.com/components)
- [Shadcn Figma to Code](https://shadcnstudio.com/figma-plugin)

## Social Media :earth_africa:

- [x](https://x.com/ShadcnStudio)
- [Discord](https://discord.com/invite/kBHkY7DekX)
- [YouTube](https://www.youtube.com/@themeselection)
