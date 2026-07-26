import type { Messages } from 'next-intl'
import type messages from './locales/en/dictionary.json'

export const locales = ['en', 'es'] as const

export type Locale = (typeof locales)[number]
export type Dictionary = typeof messages

export async function loadMessages(locale: Locale): Promise<Messages> {
  return (await import(`./locales/${locale}/dictionary.json`)).default as Messages
}

export async function loadDictionary(locale: Locale): Promise<Dictionary> {
  return (await loadMessages(locale)) as Dictionary
}
