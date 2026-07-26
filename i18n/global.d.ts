import messages from './locales/en/dictionary.json'
import { routing } from './routing'

type IntlMessages<Value> = {
  [Key in keyof Value as Value[Key] extends string
    ? Key
    : Value[Key] extends readonly unknown[]
      ? never
      : Value[Key] extends object
        ? Key
        : never]: Value[Key] extends string
    ? Value[Key]
    : Value[Key] extends object
      ? IntlMessages<Value[Key]>
      : never
}

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: IntlMessages<typeof messages>
  }
}
