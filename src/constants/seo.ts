import type { Locale } from 'i18n/config'

export const SITE_URL = (process.env.SITE_URL ?? 'https://pablo.steralynx.com').replace(
  /\/+$/,
  ''
)
export const PERSON_ID = `${SITE_URL}/#pablo-pineda`
export const WEBSITE_ID = `${SITE_URL}/#website`

export const SEO_KEYWORDS: Record<Locale, string[]> = {
  en: [
    'Full-Stack Product Engineer',
    'Product Engineer',
    'end-to-end product engineering',
    'Hands-on Tech Lead',
    'remote Full-Stack Engineer',
    'business-critical software',
    'React',
    'TypeScript',
    'Node.js',
    'NestJS',
    'PostgreSQL',
    'AWS'
  ],
  es: [
    'Ingeniero de Producto Full-Stack',
    'Product Engineer',
    'ingeniería de producto end-to-end',
    'Tech Lead',
    'ingeniero Full-Stack remoto',
    'software crítico para el negocio',
    'React',
    'TypeScript',
    'Node.js',
    'NestJS',
    'PostgreSQL',
    'AWS'
  ]
}

export function localizedUrl(locale: Locale, path = '') {
  return `${SITE_URL}/${locale}${path}`
}

export function languageAlternates(path = '') {
  return {
    en: localizedUrl('en', path),
    es: localizedUrl('es', path),
    'x-default': localizedUrl('en', path)
  }
}
