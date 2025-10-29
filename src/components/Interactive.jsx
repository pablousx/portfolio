'use client'

import styles from '@/styles/Interactive.module.css'
import clsx from 'clsx/lite'

import useInteractiveLayout from '@/hooks/useInteractiveLayout'
import useInteractivenessTracker from '@/hooks/useInteractivenessTracker'
import useSectionObserver from '@/hooks/useSectionObserver'
import useTopObserver from '@/hooks/useTopObserver'
import useAppStore from '@/state/store'
import { useLayoutEffect } from 'react'
import { ClickToComponent } from 'click-to-react-component'

export default function Interactive({ children }) {
  const { theme } = useAppStore()

  useInteractivenessTracker()
  useInteractiveLayout()
  useTopObserver()
  useSectionObserver()

  useLayoutEffect(() => {
    document.body.setAttribute('dark', theme === 'dark')
  }, [theme])

  return (
    <>
      {children}
      <div
        id='layout'
        className={clsx(styles.base, 'no-select')}
        aria-hidden
        role='presentation'
      />
      <ClickToComponent />
    </>
  )
}
