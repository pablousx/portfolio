'use client'
import styles from '@/styles/Logo.module.css'

import IconLink from '@/components/IconLink'
import { logoIcon } from '@/constants/icons'
import useAppStore from '@/state/store'
import clsx from 'clsx/lite'
import useDictionary from 'i18n/client'

export default function Logo() {
  const { currentSection } = useAppStore()
  const dictionary = useDictionary()
  const { aria } = dictionary

  return (
    <div className={styles.base}>
      <IconLink
        replace
        href='/'
        className={clsx(styles.logo, currentSection === 'landing' && styles.current)}
        title={aria.goToTop}
        src={logoIcon}
      />
    </div>
  )
}
