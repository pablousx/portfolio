'use client'

import styles from '@/styles/LocaleButton.module.css'

import Hint from '@/components/Hint'
import linkStyles from '@/styles/Link.module.css'
import useDictionary from 'i18n/client'
import { Link, usePathname } from 'i18n/navigation'
import { useLocale } from 'next-intl'

export default function LocaleButton() {
  const { aria } = useDictionary()
  const locale = useLocale()
  const pathname = usePathname()
  const nextLocale = locale === 'en' ? 'es' : 'en'

  return (
    <Hint position='bottom-left' label={aria.toggleLocale} visibility='until-click'>
      <Link
        className={`${linkStyles.base} ${styles.base}`}
        href={pathname}
        locale={nextLocale}
        scroll={false}
        replace
      >
        {locale}
      </Link>
    </Hint>
  )
}
