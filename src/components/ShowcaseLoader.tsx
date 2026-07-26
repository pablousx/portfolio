'use client'

import useAppStore from '@/state/store'
import dynamic from 'next/dynamic'

const Showcase = dynamic(() => import('@/components/Showcase'), {
  ssr: false
})

export default function ShowcaseLoader() {
  const isOpen = useAppStore((state) => state.showcase.open)

  return isOpen ? <Showcase /> : null
}
