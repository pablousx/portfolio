import { SITE_URL } from '@/constants/seo'

const content = `# Pablo Pineda

> Full-Stack Product Engineer and hands-on Tech Lead based in Guatemala, available for remote international employment and freelance work.

Pablo builds business-critical software products end to end, connecting product thinking, technical leadership, and reliable full-stack delivery.

## Profiles
- English portfolio: ${SITE_URL}/en
- Spanish portfolio: ${SITE_URL}/es
- English resume: ${SITE_URL}/en/resume
- Spanish resume: ${SITE_URL}/es/resume
- English CV (PDF): ${SITE_URL}/en/cv
- Spanish CV (PDF): ${SITE_URL}/es/cv
- GitHub: https://github.com/pablousx
- LinkedIn: https://www.linkedin.com/in/pablousx

## Core expertise
- End-to-end product engineering
- Business-critical production software
- Hands-on technical leadership
- React, TypeScript, Node.js, NestJS, PostgreSQL, and AWS

## Languages
- English (C2 proficient)
- Spanish (native)
`

export function GET() {
  return new Response(content, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      'Content-Type': 'text/plain; charset=utf-8'
    }
  })
}
