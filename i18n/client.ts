import 'client-only'

import { dictionaries, localeLoaders } from 'i18n/config'
import { createI18nClient } from 'next-international/client'
import type { Dictionary } from '@/types/content'

const { useCurrentLocale } = createI18nClient(localeLoaders)

export default function useDictionary(): Dictionary
export default function useDictionary<Scope extends keyof Dictionary>(
  scope: Scope
): Dictionary[Scope]
export default function useDictionary<Scope extends keyof Dictionary>(scope?: Scope) {
  const locale = useCurrentLocale()
  const dictionary = dictionaries[locale]

  return scope ? dictionary[scope] : dictionary
}
