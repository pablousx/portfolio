'use client'

import { useEffect } from 'react'

const interactiveElementTypes = [
  {
    className: 'interactive-layout'
  },
  {
    className: 'interactive-aura',
    clone: true
  },
  {
    className: 'interactive-border'
  },
  {
    tag: 'h2',
    clone: true
  },
  {
    tag: 'strong',
    clone: true
  },
  {
    className: 'interactive-text',
    clone: true
  },
  {
    className: 'interactive-icon',
    clone: true
  }
]

const interactiveElementSelector = interactiveElementTypes
  .map(
    (interactiveElementType) =>
      `main ${
        interactiveElementType.tag
          ? interactiveElementType.tag
          : `.${interactiveElementType.className}`
      }`
  )
  .join(',')

const getElements = (): HTMLElement[] =>
  Array.from(document.querySelectorAll<HTMLElement>(interactiveElementSelector))

const getInteractiveElementType = (element: HTMLElement) => {
  return interactiveElementTypes.find((interactiveElementType) =>
    interactiveElementType.tag
      ? element.tagName.toLowerCase() === interactiveElementType.tag
      : element.classList.contains(interactiveElementType.className ?? '')
  )
}

const updateElementPosition = (
  sourceElement: HTMLElement,
  interactiveElement: HTMLElement
) => {
  const sourceRect = sourceElement.getBoundingClientRect()
  const interactiveParent = interactiveElement.parentElement
  if (!interactiveParent) return

  const isInRootLayout = interactiveParent.id === 'layout'
  const parentRect = isInRootLayout ? null : interactiveParent.getBoundingClientRect()

  interactiveElement.style.width = `${sourceElement.offsetWidth}px`
  interactiveElement.style.height = `${sourceElement.offsetHeight}px`
  interactiveElement.style.top = `${
    isInRootLayout
      ? window.scrollY + sourceRect.top
      : sourceRect.top - (parentRect?.top ?? 0) - interactiveParent.clientTop
  }px`
  interactiveElement.style.left = `${
    isInRootLayout
      ? window.scrollX + sourceRect.left
      : sourceRect.left - (parentRect?.left ?? 0) - interactiveParent.clientLeft
  }px`
  interactiveElement.style.opacity = '1'
}

export default function useInteractiveLayout() {
  useEffect(() => {
    const layoutElement = document.getElementById('layout')
    const mainElement = document.querySelector('main')
    if (!layoutElement || !mainElement) return () => {}

    const interactiveElements = new Map<HTMLElement, HTMLElement>()
    let animationFrame: number | undefined

    const synchronizeLayout = () => {
      animationFrame = undefined

      const sourceElements = getElements()
      const sourceElementSet = new Set(sourceElements)

      for (const [sourceElement, interactiveElement] of interactiveElements) {
        if (sourceElementSet.has(sourceElement)) continue

        interactiveElement.remove()
        interactiveElements.delete(sourceElement)
      }

      for (const sourceElement of sourceElements) {
        if (interactiveElements.has(sourceElement)) continue

        const interactiveElementType = getInteractiveElementType(sourceElement)
        if (!interactiveElementType) continue

        const interactiveElement = interactiveElementType.clone
          ? (sourceElement.cloneNode(true) as HTMLElement)
          : document.createElement('div')

        if (interactiveElementType.clone)
          interactiveElement.setAttribute('aria-hidden', 'true')
        else interactiveElement.classList.add(...sourceElement.classList)

        interactiveElement.style.opacity = '0'

        const parentSourceElement = sourceElements.findLast(
          (candidate) => candidate !== sourceElement && candidate.contains(sourceElement)
        )
        const parent = parentSourceElement
          ? interactiveElements.get(parentSourceElement)
          : layoutElement

        parent?.appendChild(interactiveElement)
        interactiveElements.set(sourceElement, interactiveElement)
      }

      for (const sourceElement of sourceElements) {
        const interactiveElement = interactiveElements.get(sourceElement)
        if (interactiveElement) updateElementPosition(sourceElement, interactiveElement)
      }
    }

    const scheduleSynchronization = () => {
      if (animationFrame !== undefined) return

      animationFrame = window.requestAnimationFrame(synchronizeLayout)
    }

    const resizeObserver = new ResizeObserver(scheduleSynchronization)
    const mutationObserver = new MutationObserver(scheduleSynchronization)

    resizeObserver.observe(mainElement)
    mutationObserver.observe(mainElement, { childList: true, subtree: true })
    window.addEventListener('resize', scheduleSynchronization)
    synchronizeLayout()

    return () => {
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame)

      window.removeEventListener('resize', scheduleSynchronization)
      mutationObserver.disconnect()
      resizeObserver.disconnect()

      for (const interactiveElement of interactiveElements.values()) {
        interactiveElement.remove()
      }
    }
  }, [])
}
