import type { Dictionary } from '@/types/content'

export const locales = ['en', 'es'] as const

export type Locale = (typeof locales)[number]

export async function loadDictionary(locale: Locale): Promise<Dictionary> {
  return (await import(`./locales/${locale}/dictionary.json`)).default as Dictionary
}
