import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

const themeColor = '#7c7edf'

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor
}

export const metadata: Metadata = {
  keywords:
    'portfolio, portafolio, full stack, frontend, javascript, developer, guatemala',
  appleWebApp: {
    statusBarStyle: 'black-translucent'
  }
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children
}
