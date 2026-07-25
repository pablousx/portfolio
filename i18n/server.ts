'use server'

import type { Dictionary } from '@/types/content'
import { getLocale, getMessages } from 'next-intl/server'

export { getLocale as getCurrentLocale }

export default async function getDictionary(): Promise<Dictionary>
export default async function getDictionary<Scope extends keyof Dictionary>(
  scope: Scope
): Promise<Dictionary[Scope]>
export default async function getDictionary<Scope extends keyof Dictionary>(
  scope?: Scope
) {
  const dictionary = (await getMessages()) as Dictionary

  return scope ? dictionary[scope] : dictionary
}
