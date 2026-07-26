'use client'
import styles from '@/styles/Logo.module.css'

import IconLink from '@/components/IconLink'
import useAppStore from '@/state/store'
import clsx from 'clsx/lite'
import useDictionary from 'i18n/client'
import type { MouseEvent } from 'react'

export default function Logo() {
  const currentSection = useAppStore((state) => state.currentSection)
  const aria = useDictionary('aria')

  const handleGoToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    document.getElementById('landing')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={styles.base}>
      <IconLink
        href='#landing'
        className={clsx(styles.logo, currentSection === 'landing' && styles.current)}
        title={aria.goToTop}
        src='logo'
        onClick={handleGoToTop}
      />
    </div>
  )
}
