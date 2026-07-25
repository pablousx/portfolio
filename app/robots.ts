import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/en/'
      },
      {
        userAgent: '*',
        allow: '/es/'
      },
      {
        userAgent: '*',
        allow: '/en/cv/'
      },
      {
        userAgent: '*',
        allow: '/es/cv/'
      },
      {
        userAgent: '*',
        allow: '/splash/'
      },
      {
        userAgent: '*',
        disallow: '/static/'
      }
    ],
    sitemap: 'https://pablousx.vercel.app/sitemap.xml'
  }
}
