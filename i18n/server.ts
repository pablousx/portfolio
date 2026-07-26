'use server'

import { getLocale, getMessages } from 'next-intl/server'

import type { Dictionary } from './config'

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
