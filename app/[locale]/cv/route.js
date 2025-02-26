import fs from 'fs/promises'
import path from 'path'

export async function GET(_, { params }) {
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
