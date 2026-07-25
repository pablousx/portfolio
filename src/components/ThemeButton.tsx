'use client'

import styles from '@/styles/ThemeButton.module.css'

import Hint from '@/components/Hint'
import useAppStore from '@/state/store'
import useDictionary from 'i18n/client'
import { DarkModeSwitch } from 'react-toggle-dark-mode'

export default function ThemeButton() {
  const { theme, toggleTheme } = useAppStore()
  const { aria } = useDictionary()

  return (
    <Hint
      className={styles.base}
      position='bottom-left'
      label={aria.toggleTheme}
      visibility='until-click'
    >
      <DarkModeSwitch
        checked={theme === 'dark'}
        onChange={toggleTheme}
        moonColor='var(--foreground-color)'
        sunColor='var(--foreground-color)'
        title={aria.toggleTheme}
      />
    </Hint>
  )
}
