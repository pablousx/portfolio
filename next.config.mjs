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
  experimental: {
    turbo: {
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
    }
  }
}

export default nextConfig
