/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'))

    // config.module.rules.push(
    //   {
    //     ...fileLoaderRule,
    //     test: /\.svg$/i,
    //     resourceQuery: /url/
    //   },
    //   {
    //     test: /\.svg$/i,
    //     issuer: fileLoaderRule.issuer,
    //     resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
    //     use: [
    //       {
    //         loader: '@svgr/webpack',
    //         options: {
    //           svgoConfig: {
    //             plugins: [
    //               'preset-default',
    //               'removeXMLNS',
    //               'removeUnknownsAndDefaults',
    //               'prefixIds'
    //             ]
    //           }
    //         }
    //       }
    //     ]
    //   }
    // )

    // fileLoaderRule.exclude = /\.svg$/i

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
