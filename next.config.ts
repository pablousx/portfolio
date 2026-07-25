import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  webpack(config) {
    if (!config.module?.rules) return config

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
