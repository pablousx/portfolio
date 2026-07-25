import 'hint.css/hint.min.css'
import './global.css'

import { bodyFont, titleFont } from 'app/fonts'
import clsx from 'clsx/lite'
import { loadDictionary, locales } from 'i18n/config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'

import ProductionInsights from '@/components/ProductionInsights'

interface LocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params
}: Pick<LocaleLayoutProps, 'params'>): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(locales, locale)) notFound()

  const { meta } = await loadDictionary(locale)
  const { title, description } = meta

  const languages: Record<string, string> = {}
  for (const supportedLocale of locales) {
    languages[supportedLocale] = `https://pablousx.vercel.app/${supportedLocale}`
  }

  const image = (await import(`i18n/locales/${locale}/splash.jpg`)).default
  const { src: url, width, height } = image

  return {
    title,
    description,
    metadataBase: new URL(`https://pablousx.vercel.app/${locale}`),
    alternates: {
      canonical: 'https://pablousx.vercel.app/',
      languages
    },
    openGraph: {
      siteName: title,
      type: 'website',
      locale,
      images: {
        url,
        height,
        width,
        type: 'image/jpeg',
        alt: 'pablousx.vercel.app'
      }
    },
    appleWebApp: {
      title
    }
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ params, children }: LocaleLayoutProps) {
  const { locale } = await params
  if (!hasLocale(locales, locale)) notFound()

  setRequestLocale(locale)

  return (
    <html lang={locale} translate='no'>
      <body className={clsx(titleFont.variable, bodyFont.variable)} top='true'>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <ProductionInsights />
      </body>
    </html>
  )
}
