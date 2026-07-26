'use client'

import styles from '@/styles/Interactive.module.css'
import clsx from 'clsx/lite'

import useInteractiveLayout from '@/hooks/useInteractiveLayout'
import useInteractivenessTracker from '@/hooks/useInteractivenessTracker'
import useSectionObserver from '@/hooks/useSectionObserver'
import useTopObserver from '@/hooks/useTopObserver'
import useAppStore from '@/state/store'
import { useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import Development from 'src/components/Development'

export default function Interactive({ children }: { children: ReactNode }) {
  const theme = useAppStore((state) => state.theme)

  useInteractivenessTracker()
  useInteractiveLayout()
  useTopObserver()
  useSectionObserver()

  useLayoutEffect(() => {
    document.body.setAttribute('dark', String(theme === 'dark'))
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
      <Development />
    </>
  )
}
