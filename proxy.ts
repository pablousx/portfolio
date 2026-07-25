import { i18n } from 'i18n/config'
import { createI18nMiddleware } from 'next-international/middleware'
import type { NextRequest } from 'next/server'

const I18nMiddleware = createI18nMiddleware(i18n)

export function proxy(request: NextRequest) {
  if (request.method !== 'GET') return

  return I18nMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)']
}
