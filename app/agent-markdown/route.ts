import TurndownService from 'turndown'

import { SITE_URL } from '@/constants/seo'

const negotiatedPaths = new Set(['/', '/en', '/es', '/en/resume', '/es/resume'])

function extractMetadata(html: string, turndown: TurndownService) {
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]
  const description = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i
  )?.[1]

  return {
    description: description ? turndown.turndown(description).trim() : undefined,
    title: title ? turndown.turndown(title).trim() : undefined
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const path =
    request.headers.get('x-markdown-path') ?? requestUrl.searchParams.get('path')

  if (!path || !negotiatedPaths.has(path)) {
    return new Response('Not Found', { status: 404 })
  }

  const deploymentOrigin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : requestUrl.origin
  const sourceUrl = new URL(path, deploymentOrigin)
  const sourceResponse = await fetch(sourceUrl, {
    cache: 'no-store',
    headers: {
      Accept: 'text/html',
      'X-Markdown-Source': '1'
    },
    redirect: 'follow'
  })

  if (!sourceResponse.ok) {
    return new Response('Unable to render Markdown', { status: sourceResponse.status })
  }

  const html = await sourceResponse.text()
  const turndown = new TurndownService({
    bulletListMarker: '-',
    headingStyle: 'atx'
  })
  turndown.remove(['script', 'style', 'noscript'])
  turndown.addRule('removeSvg', {
    filter: (node) => node.nodeName === 'SVG',
    replacement: () => ''
  })

  const metadata = extractMetadata(html, turndown)
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html
  const markdown = turndown.turndown(body).trim()
  const frontmatter = [
    '---',
    metadata.title ? `title: ${JSON.stringify(metadata.title)}` : undefined,
    metadata.description
      ? `description: ${JSON.stringify(metadata.description)}`
      : undefined,
    `source: ${JSON.stringify(new URL(path, SITE_URL).href)}`,
    '---'
  ]
    .filter(Boolean)
    .join('\n')

  return new Response(`${frontmatter}\n\n${markdown}\n`, {
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept'
    }
  })
}
