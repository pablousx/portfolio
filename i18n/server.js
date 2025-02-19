'use server'

import { dictionaries } from 'i18n/config'
import { createI18nServer } from 'next-international/server'

const { getCurrentLocale, getStaticParams } = createI18nServer(dictionaries)

export { getCurrentLocale, getStaticParams }

export default async function getDictionary(scope) {
  const locale = await getCurrentLocale()
  const dictionary = dictionaries[locale]

  return scope ? dictionary[scope] : dictionary
}
