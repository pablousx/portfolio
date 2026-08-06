import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/constants/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/send-email',
      other: {
        'Content-Signal': 'ai-train=no, search=yes, ai-input=no'
      }
    },
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`
  }
}
