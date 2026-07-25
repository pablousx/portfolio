import { defineRouting } from 'next-intl/routing'

import { locales } from './config'

export const routing = defineRouting({
  defaultLocale: 'en',
  localePrefix: 'always',
  locales
})
