import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'

import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)
const markdownPaths = /^\/(?:en|es)(?:\/resume)?\/?$/

export default function proxy(request: NextRequest) {
  const acceptsMarkdown = request.headers
    .get('accept')
    ?.split(',')
    .some((mediaType) => mediaType.trim().split(';', 1)[0] === 'text/markdown')
  const isMarkdownPage =
    request.nextUrl.pathname === '/' || markdownPaths.test(request.nextUrl.pathname)

  if (acceptsMarkdown && isMarkdownPage && !request.headers.has('x-markdown-source')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-markdown-path', request.nextUrl.pathname)

    const markdownUrl = request.nextUrl.clone()
    markdownUrl.pathname = '/agent-markdown'
    markdownUrl.search = ''
    markdownUrl.searchParams.set('path', request.nextUrl.pathname)

    return NextResponse.rewrite(markdownUrl, {
      request: { headers: requestHeaders }
    })
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: '/((?!agent-markdown|api|static|send-email|_next|_vercel|.*\\..*).*)'
}
