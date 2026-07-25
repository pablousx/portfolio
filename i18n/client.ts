import 'client-only'

import type { Dictionary } from '@/types/content'
import { useMessages } from 'next-intl'

export default function useDictionary(): Dictionary
export default function useDictionary<Scope extends keyof Dictionary>(
  scope: Scope
): Dictionary[Scope]
export default function useDictionary<Scope extends keyof Dictionary>(scope?: Scope) {
  const dictionary = useMessages() as Dictionary

  return scope ? dictionary[scope] : dictionary
}
