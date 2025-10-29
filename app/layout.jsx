import { ReactScan } from '@/components/ReactScan'

const themeColor = '#7c7edf'

export const viewport = {
  colorScheme: 'dark light',
  themeColor
}

export const metadata = {
  keywords:
    'portfolio, portafolio, full stack, frontend, javascript, developer, guatemala',
  appleWebApp: {
    statusBarStyle: themeColor
  }
}

export default function RootLayout({ children }) {
  return (
    <>
      <ReactScan />
      {children}
    </>
  )
}
