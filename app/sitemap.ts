import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://pablousx.vercel.app/en',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1
    },
    {
      url: 'https://pablousx.vercel.app/es',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1
    },
    {
      url: 'https://quiz.pablousx.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: 'https://jolc.pablousx.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: 'https://translator.pablousx.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    }
  ]
}
