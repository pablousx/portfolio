'use client'

import styles from '@/styles/NavbarLinks.module.css'

import Button from '@/components/Button'
import IconButton from '@/components/IconButton'
import Link from '@/components/Link'
import sections from '@/constants/sections'
import useAppStore from '@/state/store'
import clsx from 'clsx/lite'
import useDictionary from 'i18n/client'
import { useEffect, useRef, useState } from 'react'

export default function NavbarLinks() {
  const { currentSection: currentSectionId } = useAppStore()
  const dictionary = useDictionary()
  const { aria } = dictionary

  const [isMenuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDialogElement>(null)
  const navigatorRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleOpenMenu = () => setMenuOpen(true)

  const handleCloseMenu = () => {
    const shouldRestoreFocus = isMenuOpen
    setMenuOpen(false)

    if (shouldRestoreFocus) {
      requestAnimationFrame(() => navigatorRef.current?.focus())
    }
  }

  const links: Array<{ id: string; label: string }> = []
  for (const { id, noQuickLink } of sections.slice(1)) {
    if (noQuickLink) continue

    const sectionDictionary = dictionary[id]
    if ('title' in sectionDictionary) {
      links.push({ id, label: sectionDictionary.title })
    }
  }
  const currentSection =
    links.find(({ id }) => id === currentSectionId)?.label ?? links[0]?.label ?? ''

  const renderLinks = (isOverlay = false) =>
    links.map(({ id, label }) => (
      <Link
        key={id}
        asButton
        href={`#${id}`}
        className={clsx(styles.link, currentSectionId === id && styles.current)}
        title={`${aria.goTo} ${label}`}
        onClick={handleCloseMenu}
        aria-hidden={isOverlay || undefined}
        tabIndex={isOverlay ? -1 : undefined}
      >
        {label}
        {id === 'contact' && (
          <span className={clsx(styles.status, 'no-select')}>{aria.available}</span>
        )}
      </Link>
    ))

  useEffect(() => {
    if (!CSS.supports('animation-timeline', 'scroll()')) return

    const overlayElement = overlayRef.current
    if (!overlayElement) return

    const updateOverlay = () => {
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
    }

    const resizeObserver = new ResizeObserver(updateOverlay)
    resizeObserver.observe(overlayElement)
    updateOverlay()

    return () => resizeObserver.disconnect()
  }, [currentSectionId])

  useEffect(() => {
    if (!isMenuOpen) return

    document.body.classList.add('navbar-menu-open')

    return () => document.body.classList.remove('navbar-menu-open')
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) return

    const menuElement = menuRef.current
    if (!menuElement) return

    menuElement.showModal()

    return () => {
      if (menuElement.open) menuElement.close()
    }
  }, [isMenuOpen])

  return (
    <>
      <div className={styles.base}>
        <div ref={overlayRef} className={clsx(styles.base, styles.overlay)}>
          {renderLinks(true)}
        </div>
        {renderLinks()}
        {currentSection && (
          <Button
            ref={navigatorRef}
            className={clsx(styles.link, styles.current, styles.navigator)}
            onClick={handleOpenMenu}
            title={aria.navigateTo}
            aria-controls='navigation-menu'
            aria-expanded={isMenuOpen}
            aria-haspopup='dialog'
            aria-label={aria.navigateTo}
          >
            {currentSection}
          </Button>
        )}
      </div>
      {isMenuOpen && (
        <dialog
          ref={menuRef}
          id='navigation-menu'
          className={styles.menu}
          aria-label={aria.navigateTo}
          onCancel={(event) => {
            event.preventDefault()
            handleCloseMenu()
          }}
        >
          <IconButton
            src='close'
            iconProps={{ lightColor: true }}
            title={aria.close}
            className={styles.closeButton}
            onClick={handleCloseMenu}
          />
          {renderLinks()}
        </dialog>
      )}
    </>
  )
}
