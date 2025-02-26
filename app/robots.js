export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/'
      },
      {
        userAgent: '*',
        allow: '/cv/'
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
    sitemap: 'https://nandous.com/sitemap.xml'
  }
}
