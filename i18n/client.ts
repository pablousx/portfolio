import 'client-only'

import { useMessages } from 'next-intl'

import type { Dictionary } from './config'

export default function useDictionary(): Dictionary
export default function useDictionary<Scope extends keyof Dictionary>(
  scope: Scope
): Dictionary[Scope]
export default function useDictionary<Scope extends keyof Dictionary>(scope?: Scope) {
  const dictionary = useMessages() as Dictionary

  return scope ? dictionary[scope] : dictionary
}
