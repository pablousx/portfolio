import type { Dictionary } from '@/types/content'
import enDictionary from './locales/en/transpiled-dictionary.json'
import esDictionary from './locales/es/transpiled-dictionary.json'

export const dictionaries = {
  en: enDictionary as Dictionary,
  es: esDictionary as Dictionary
}

export type Locale = keyof typeof dictionaries

export const localeLoaders = {
  en: async () => dictionaries.en,
  es: async () => dictionaries.es
}

export const locales = Object.keys(dictionaries) as Locale[]

const defaultLocale = locales[0]!

export const i18n = {
  locales,
  defaultLocale,
  urlMappingStrategy: 'rewriteDefault'
} as const
