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

import Development from 'src/components/Development'
import Production from 'src/components/Production'
import StructuredData from '@/components/StructuredData'
import {
  languageAlternates,
  localizedUrl,
  PERSON_ID,
  SEO_KEYWORDS,
  SITE_URL,
  WEBSITE_ID
} from '@/constants/seo'

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

  const image = (await import(`i18n/locales/${locale}/splash.jpg`)).default
  const { src: url, width, height } = image
  const canonical = localizedUrl(locale)
  const openGraphLocale = locale === 'es' ? 'es_GT' : 'en_US'

  return {
    title,
    description,
    keywords: SEO_KEYWORDS[locale],
    alternates: {
      canonical,
      languages: languageAlternates()
    },
    openGraph: {
      title,
      description,
      siteName: 'Pablo Pineda',
      type: 'website',
      url: canonical,
      locale: openGraphLocale,
      alternateLocale: locale === 'es' ? ['en_US'] : ['es_GT'],
      images: {
        url,
        height,
        width,
        type: 'image/jpeg',
        alt: new URL(SITE_URL).hostname
      }
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [url]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
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
  const { aria, contact, meta } = await loadDictionary(locale)
  const clientMessages = {
    aria,
    contact: {
      form: contact.form
    }
  }
  const canonical = localizedUrl(locale)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: SITE_URL,
        name: 'Pablo Pineda',
        description: meta.description,
        inLanguage: ['en', 'es']
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: 'Pablo Pineda',
        alternateName: 'pablousx',
        url: canonical,
        image: `${SITE_URL}/images/landing/profile-photo.png`,
        description: meta.description,
        jobTitle: ['Full-Stack Product Engineer', 'Tech Lead'],
        sameAs: ['https://github.com/pablousx', 'https://www.linkedin.com/in/pablousx'],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Guatemala City',
          addressCountry: 'GT'
        },
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'University of San Carlos of Guatemala',
          alternateName: 'Universidad de San Carlos de Guatemala',
          url: 'https://www.usac.edu.gt/'
        },
        worksFor: {
          '@type': 'Organization',
          name: 'Lomax Technologies S.A.',
          url: 'https://lomax.com.gt'
        },
        hasOccupation: {
          '@type': 'Occupation',
          name: 'Full-Stack Product Engineer',
          occupationLocation: {
            '@type': 'Country',
            name: 'Guatemala'
          },
          skills:
            'End-to-end product engineering, React, TypeScript, Node.js, NestJS, PostgreSQL, AWS'
        },
        hasCredential: [
          {
            '@type': 'EducationalOccupationalCredential',
            name: 'Computer Science and Systems Engineering degree',
            credentialCategory: 'degree',
            recognizedBy: {
              '@type': 'CollegeOrUniversity',
              name: 'University of San Carlos of Guatemala'
            }
          },
          {
            '@type': 'EducationalOccupationalCredential',
            name: 'EF SET English Certificate — C2 Proficient',
            credentialCategory: 'certificate',
            recognizedBy: {
              '@type': 'Organization',
              name: 'EF Standard English Test'
            }
          }
        ],
        knowsLanguage: ['English', 'Spanish'],
        knowsAbout: [
          'End-to-end product engineering',
          'Business-critical software',
          'Technical leadership',
          'React',
          'TypeScript',
          'Node.js',
          'NestJS',
          'PostgreSQL',
          'Amazon Web Services'
        ],
        subjectOf: localizedUrl(locale, '/resume')
      },
      {
        '@type': 'ProfilePage',
        '@id': `${canonical}#profile-page`,
        url: canonical,
        name: meta.title,
        description: meta.description,
        inLanguage: locale,
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': PERSON_ID }
      }
    ]
  }

  return (
    <html lang={locale} translate='no' suppressHydrationWarning>
      <head>
        <StructuredData data={structuredData} />
      </head>
      <body className={clsx(titleFont.variable, bodyFont.variable)} top='true'>
        <NextIntlClientProvider messages={clientMessages}>
          {children}
        </NextIntlClientProvider>
        <Development />
        <Production />
      </body>
    </html>
  )
}
