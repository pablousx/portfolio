import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { localizedUrl, SITE_URL } from '@/constants/seo'

const themeColor = '#7c7edf'

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'Pablo Pineda',
  authors: [{ name: 'Pablo Pineda', url: localizedUrl('en') }],
  creator: 'Pablo Pineda',
  publisher: 'Pablo Pineda',
  referrer: 'origin-when-cross-origin',
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent'
  }
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children
}
