import fs from 'fs/promises'
import path from 'path'

interface RouteContext {
  params: Promise<{ locale: string }>
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { locale } = await params

  const filePath = path.resolve(`i18n/locales/${locale}`, 'cv.pdf')
  const file = await fs.readFile(filePath)

  return new Response(file, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=Pablo Pineda - CV.pdf'
    }
  })
}
