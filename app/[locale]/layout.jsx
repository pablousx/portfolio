import 'node_modules/hint.css/hint.min.css'
import './global.css'

import { bodyFont, titleFont } from 'app/fonts'
import clsx from 'clsx/lite'
import { locales } from 'i18n/config'
import getDictionary, { getStaticParams } from 'i18n/server'
import { setStaticParamsLocale } from 'next-international/server'

export async function generateMetadata({ params }) {
  const { locale } = await params
  const { title, description } = await getDictionary('meta')

  const languages = {}
  for (const locale of locales) {
    languages[locale] = `https://nandous.com/${locale}`
  }

  const image = (await import(`i18n/locales/${locale}/splash.jpg`)).default
  const { src: url, width, height } = image

  return {
    title,
    description,
    metadataBase: `https://nandous.com/${locale}`,
    alternates: {
      canonical: 'https://nandous.com/',
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
        alt: 'nandous.com'
      }
    },
    appleWebApp: {
      title
    }
  }
}

export async function generateStaticParams() {
  return await getStaticParams()
}

export default async function LocaleLayout({ params, children }) {
  const { locale } = await params
  setStaticParamsLocale(locale)

  return (
    <html lang={locale} translate='no'>
      <body className={clsx(titleFont.variable, bodyFont.variable)} top='true'>
        {children}
      </body>
    </html>
  )
}
