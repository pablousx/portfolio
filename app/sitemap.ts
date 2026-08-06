import type { MetadataRoute } from 'next'

import { languageAlternates, localizedUrl } from '@/constants/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: localizedUrl('en'),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages: languageAlternates() }
    },
    {
      url: localizedUrl('es'),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages: languageAlternates() }
    },
    {
      url: localizedUrl('en', '/resume'),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: languageAlternates('/resume') }
    },
    {
      url: localizedUrl('es', '/resume'),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: languageAlternates('/resume') }
    }
  ]
}
