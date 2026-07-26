'use client'

import styles from '@/styles/ThemeButton.module.css'

import Hint from '@/components/Hint'
import useAppStore from '@/state/store'
import useDictionary from 'i18n/client'

export default function ThemeButton() {
  const theme = useAppStore((state) => state.theme)
  const toggleTheme = useAppStore((state) => state.toggleTheme)
  const { aria } = useDictionary()
  const isDark = theme === 'dark'
  const label = isDark ? aria.useLightTheme : aria.useDarkTheme

  return (
    <Hint
      className={styles.base}
      position='bottom-left'
      label={label}
      visibility='until-click'
    >
      <button
        className={styles.button}
        type='button'
        role='switch'
        aria-checked={isDark}
        aria-label={label}
        title={label}
        onClick={() => toggleTheme(!isDark)}
      >
        <span className={styles.track} aria-hidden='true'>
          <span className={styles.orbGlow}>
            <span className={styles.orb} />
          </span>
        </span>
      </button>
    </Hint>
  )
}
