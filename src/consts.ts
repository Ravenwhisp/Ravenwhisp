// Site Configuration
// Centralized configuration for site metadata, SEO, and branding

export const SITE_TITLE = 'Bound By Death Game | Ravenwhisp Studio'
export const SITE_DESCRIPTION = 'Bound By Death is a dark fantasy co-op hack-and-slash for two players.'

export const GITHUB_URL = 'https://github.com/yourusername/master-shadcn-astro' // TODO: Update with your actual GitHub repository URL
export const SITE_URL = 'https://shadcnstudio.com/' // TODO: Update with your actual site URL

export const SITE_METADATA = {
  title: {
    default: 'Bound By Death Game | Ravenwhisp Studio'
  },
  description: 'Bound By Death is a dark fantasy co-op hack-and-slash for two players.',
  themeColor: {
    light: '#111826',
    dark: '#e4e8ef'
  },
  keywords: [
    'Ravenwhisp Studio',
    'Bound by Death',
    'indie game',
    'indie game studio',
    'co-op game',
    'hack-and-slash game',
    'dark fantasy game',
    'action RPG',
    'game development',
    'indie game development',
    'game design',
    'game art',
    'game programming',
    'game portfolio',
    'game showcase',
    'game trailer'
  ],
  authors: [{ name: 'Ravenwhisp Studio', url: SITE_URL }],
  creator: 'Ravenwhisp Studio',
  publisher: 'Ravenwhisp Studio',
  robots: {
    index: true,
    follow: true
  },
  language: 'en-US',
  locale: 'en_US',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: '48x48' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/favicon/favicon.ico' }]
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Bound By Death | Ravenwhisp Studio',
    title: 'Bound By Death | Ravenwhisp Studio',
    description: 'Bound By Death is a dark fantasy co-op hack-and-slash for two players.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Bound By Death | Ravenwhisp Studio',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    // TODO: Update Twitter handle and card type if needed
    card: 'summary_large_image',
    site: '@ravenwhispstudio',
    creator: '@ravenwhispstudio',
    title: 'Bound By Death | Ravenwhisp Studio',
    description: 'Bound By Death is a dark fantasy co-op hack-and-slash for two players.',
    images: ['/images/og-image.png']
  },
  verification: {
    google: '', // Add your Google verification code
    yandex: '', // Add your Yandex verification code
    bing: '' // Add your Bing verification code
  }
}

// Social media links
export const SOCIAL_LINKS = {
  github: GITHUB_URL,
  twitter: 'https://x.com/Raven_Whisp',
  linkedin: 'https://www.linkedin.com/company/ravenwhisp',
  instagram: 'https://www.instagram.com/ravenwhisp_studios',
  tiktok: 'https://www.tiktok.com/@ravenwhisp.studio',
  youtube: 'https://www.youtube.com/@Ravenwhisp'
}

// Company information for structured data
export const COMPANY_INFO = {
  name: 'Bound By Death',
  legalName: 'Ravenwhisp Studio',
  url: SITE_URL,
  logo: `/images/site-logo.png`,
  foundingDate: '2026',
  sameAs: Object.values(SOCIAL_LINKS)
}
