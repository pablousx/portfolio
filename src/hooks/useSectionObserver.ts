import sections from '@/constants/sectionMetadata'
import useAppStore from '@/state/store'
import { useEffect } from 'react'

export default function useSectionObserver() {
  const currentSection = useAppStore((state) => state.currentSection)
  const setCurrentSection = useAppStore((state) => state.setCurrentSection)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const maxIntersection = Math.max(
          ...entries.map((entry) => entry.intersectionRect.height)
        )
        const mostVisibleEntry = entries.find(
          (candidate) => candidate.intersectionRect.height === maxIntersection
        )
        if (!mostVisibleEntry?.isIntersecting) return

        const section = sections.find(({ id }) => id === mostVisibleEntry.target.id)

        if (section) setCurrentSection(section.id)
      },
      { threshold: 0.4 }
    )

    for (const section of sections) {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    }

    return () => {
      observer.disconnect()
    }
  }, [setCurrentSection])

  useEffect(() => {
    if (!currentSection) return

    const section = sections.find(({ id }) => id === currentSection)
    if (!section) return

    const nextUrl = section.noHash
      ? `${window.location.pathname}${window.location.search}`
      : `#${currentSection}`
    window.history.replaceState(null, '', nextUrl)
  }, [currentSection])
}
