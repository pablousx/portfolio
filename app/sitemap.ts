import type { MetadataRoute } from 'next'
import { cacheLife } from 'next/cache'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  'use cache'

  cacheLife('days')

  const lastModified = new Date()

  return [
    {
      url: 'https://pablousx.vercel.app/en',
      lastModified,
      changeFrequency: 'weekly',
      priority: 1
    },
    {
      url: 'https://pablousx.vercel.app/es',
      lastModified,
      changeFrequency: 'weekly',
      priority: 1
    },
    {
      url: 'https://quiz.pablousx.vercel.app',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: 'https://jolc.pablousx.vercel.app',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: 'https://translator.pablousx.vercel.app',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8
    }
  ]
}
