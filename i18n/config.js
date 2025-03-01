import en from './locales/en/transpiled-dictionary'
import es from './locales/es/transpiled-dictionary'

export const dictionaries = {
  en,
  es
}

export const locales = Object.keys(dictionaries)

export const defaultLocale = locales[0]

export const i18n = {
  locales,
  defaultLocale
}
