'use server'

import { dictionaries } from 'i18n/config'
import { createI18nServer } from 'next-international/server'

const {
  getCurrentLocale: getServerCurrentLocale,
  getStaticParams: getServerStaticParams
} = createI18nServer(dictionaries)

export async function getCurrentLocale() {
  return await getServerCurrentLocale()
}

export async function getStaticParams() {
  return getServerStaticParams()
}

export default async function getDictionary(scope) {
  const locale = await getCurrentLocale()
  const dictionary = dictionaries[locale]
  const scopedDictionary = scope ? dictionary[scope] : dictionary

  return await scopedDictionary
}
