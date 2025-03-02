import sections from '@/constants/sections'
import useAppStore from '@/state/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function useSectionObserver() {
  const { currentSection, setCurrentSection } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const maxIntersection = Math.max(
          ...entries.map((entry) => entry.intersectionRect.height)
        )
        const entry = entries.find(
          (entry) => entry.intersectionRect.height === maxIntersection
        )
        if (!entry.isIntersecting) return

        const section = sections.find(({ id }) => id === entry.target.id)

        if (section) setCurrentSection(section.id)
      },
      { threshold: 0.4 }
    )

    sections
      .map((section) => document.getElementById(section.id))
      .forEach((element) => {
        if (element != null) observer.observe(element)
      })

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!currentSection) return

    setCurrentSection(currentSection)

    const section = sections.find(({ id }) => id === currentSection)
    router.replace(section.noHash ? '' : `#${currentSection}`, { scroll: false })
  }, [setCurrentSection, currentSection, router])
}
