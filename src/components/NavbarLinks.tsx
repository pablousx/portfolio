'use client'

import styles from '@/styles/NavbarLinks.module.css'

import Button from '@/components/Button'
import IconButton from '@/components/IconButton'
import Link from '@/components/Link'
import sections from '@/constants/sections'
import useAppStore from '@/state/store'
import clsx from 'clsx/lite'
import useDictionary from 'i18n/client'
import { useEffect, useState } from 'react'

export default function NavbarLinks() {
  const { currentSection: currentSectionId } = useAppStore()
  const dictionary = useDictionary()
  const { aria } = dictionary

  const [isMenuOpen, setMenuOpen] = useState(false)

  const handleOpenMenu = () => {
    document.body.classList.add('no-scroll')
    setMenuOpen(true)
  }

  const handleCloseMenu = () => {
    document.body.classList.remove('no-scroll')
    setMenuOpen(false)
  }

  const links = []
  for (const { id, noQuickLink } of sections.slice(1)) {
    if (noQuickLink) continue

    const sectionDictionary = dictionary[id]
    if ('title' in sectionDictionary) {
      links.push({ id, label: sectionDictionary.title })
    }
  }
  const currentSection =
    links.find(({ id }) => id === currentSectionId)?.label ?? links[0]?.label ?? ''

  const linksElements = links.map(({ id, label }) => (
    <Link
      key={id}
      asButton
      href={`#${id}`}
      className={clsx(styles.link, currentSectionId === id && styles.current)}
      title={`${aria.goTo} ${label}`}
      onClick={handleCloseMenu}
    >
      {label}
      {id === 'contact' && (
        <span className={clsx(styles.status, 'no-select')}>{aria.available}</span>
      )}
    </Link>
  ))

  useEffect(() => {
    if (!CSS.supports('animation-timeline', 'scroll()')) return

    const overlayElement = document.querySelector<HTMLElement>(`.${styles.overlay}`)
    if (!overlayElement) return

    const elements = Array.from(overlayElement.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement
    )

    const elementIndex = elements.findIndex((element) =>
      element.classList.contains(styles.current!)
    )
    if (elementIndex === -1) return

    let left = elements.slice(0, elementIndex).reduce((acc, element) => {
      return acc + element.offsetWidth - 12
    }, 16)
    const selectedElement = elements[elementIndex]
    if (!selectedElement) return

    const width = selectedElement.offsetWidth - 4

    if (width === 0) left = -1000

    overlayElement.style.setProperty('--left', `${left}px`)
    overlayElement.style.setProperty('--width', `${width}px`)
  }, [currentSectionId])

  return (
    <>
      <div className={styles.base}>
        <div className={clsx(styles.base, styles.overlay)}>{linksElements}</div>
        {linksElements}
        {currentSection && (
          <Button
            className={clsx(styles.link, styles.current, styles.navigator)}
            onClick={handleOpenMenu}
            title={aria.navigateTo}
          >
            {currentSection}
          </Button>
        )}
      </div>
      <div className={clsx(styles.menu, isMenuOpen && styles.open)}>
        <IconButton
          src='close'
          iconProps={{ lightColor: true }}
          title={aria.close}
          className={styles.closeButton}
          onClick={handleCloseMenu}
        />
        {linksElements}
      </div>
    </>
  )
}
