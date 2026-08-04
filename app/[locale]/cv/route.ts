import { loadDictionary, locales, type Locale } from 'i18n/config'

interface RouteContext {
  params: Promise<{ locale: string }>
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) {
    return new Response('Unsupported locale', { status: 404 })
  }

  const [dictionary, { renderToBuffer }, { default: CvDocument }] = await Promise.all([
    loadDictionary(locale as Locale),
    import('@react-pdf/renderer'),
    import('@/cv/CvDocument')
  ])
  const document = CvDocument({ dictionary })
  const file = await renderToBuffer(document)

  return new Response(new Uint8Array(file), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${dictionary.resume.fileName}"`
    }
  })
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const dynamic = 'force-static'
export const runtime = 'nodejs'
