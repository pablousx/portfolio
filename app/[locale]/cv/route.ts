import { loadDictionary, locales, type Locale } from 'i18n/config'
import { cacheLife } from 'next/cache'

interface RouteContext {
  params: Promise<{ locale: string }>
}

async function renderCv(locale: Locale) {
  'use cache'

  cacheLife('max')

  const [dictionary, { renderToBuffer }, { default: CvDocument }] = await Promise.all([
    loadDictionary(locale),
    import('@react-pdf/renderer'),
    import('@/cv/CvDocument')
  ])
  const document = CvDocument({ dictionary })
  const file = await renderToBuffer(document)

  return { file: new Uint8Array(file), fileName: dictionary.resume.fileName }
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) {
    return new Response('Unsupported locale', { status: 404 })
  }

  const { file, fileName } = await renderCv(locale as Locale)

  return new Response(file, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`
    }
  })
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
