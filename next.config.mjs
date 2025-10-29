/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [
                'preset-default',
                'removeXMLNS',
                'removeUnknownsAndDefaults',
                'prefixIds'
              ]
            }
          }
        }
      ]
    })

    return config
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  'preset-default',
                  'removeXMLNS',
                  'removeUnknownsAndDefaults',
                  'prefixIds'
                ]
              }
            }
          }
        ],
        as: '*.js'
      }
    }
  },
  images: {
    qualities: [75, 90]
  }
}

export default nextConfig
