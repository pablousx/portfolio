export default function sitemap() {
  return [
    {
      url: 'https://nandous.com/en',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1
    },
    {
      url: 'https://nandous.com/es',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    }
  ]
}
