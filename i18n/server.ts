'use server'

import { dictionaries, localeLoaders } from 'i18n/config'
import { createI18nServer } from 'next-international/server'
import type { Dictionary } from '@/types/content'

const { getCurrentLocale, getStaticParams } = createI18nServer(localeLoaders)

export { getCurrentLocale, getStaticParams }

export default async function getDictionary(): Promise<Dictionary>
export default async function getDictionary<Scope extends keyof Dictionary>(
  scope: Scope
): Promise<Dictionary[Scope]>
export default async function getDictionary<Scope extends keyof Dictionary>(
  scope?: Scope
) {
  const locale = await getCurrentLocale()
  const dictionary = dictionaries[locale]

  return scope ? dictionary[scope] : dictionary
}
