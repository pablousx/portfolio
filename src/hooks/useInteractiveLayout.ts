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
  .map((interactiveElementType) =>
    interactiveElementType.tag
      ? interactiveElementType.tag
      : `.${interactiveElementType.className}`
  )
  .join(',')

const getElements = (mainElement: HTMLElement): HTMLElement[] =>
  Array.from(mainElement.querySelectorAll<HTMLElement>(interactiveElementSelector))

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
    if (!layoutElement) return () => {}

    const interactiveElements = new Map<HTMLElement, HTMLElement>()
    let observedElements = new Set<HTMLElement>()
    let animationFrame: number | undefined
    let settleFrames = 0

    const resizeObserver = new ResizeObserver(() => scheduleSynchronization())

    const synchronizeLayout = () => {
      animationFrame = undefined

      const mainElement = document.querySelector<HTMLElement>('main')
      const sourceElements = mainElement ? getElements(mainElement) : []
      const sourceElementSet = new Set(sourceElements)

      for (const [sourceElement, interactiveElement] of interactiveElements) {
        if (sourceElementSet.has(sourceElement)) continue

        interactiveElement.remove()
        interactiveElements.delete(sourceElement)
      }

      for (const [index, sourceElement] of sourceElements.entries()) {
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
        interactiveElement.dataset.interactiveIndex = String(index)

        const parentSourceElement = sourceElements.findLast(
          (candidate) => candidate !== sourceElement && candidate.contains(sourceElement)
        )
        const parent = parentSourceElement
          ? interactiveElements.get(parentSourceElement)
          : layoutElement
        const targetParent = parent ?? layoutElement

        targetParent.appendChild(interactiveElement)
        interactiveElements.set(sourceElement, interactiveElement)
      }

      for (const [index, sourceElement] of sourceElements.entries()) {
        const interactiveElement = interactiveElements.get(sourceElement)
        if (!interactiveElement) continue

        interactiveElement.dataset.interactiveIndex = String(index)
        updateElementPosition(sourceElement, interactiveElement)
      }

      const nextObservedElements = new Set(sourceElements)
      if (mainElement) nextObservedElements.add(mainElement)

      for (const element of observedElements) {
        if (!nextObservedElements.has(element)) resizeObserver.unobserve(element)
      }
      for (const element of nextObservedElements) {
        if (!observedElements.has(element)) resizeObserver.observe(element)
      }
      observedElements = nextObservedElements

      if (settleFrames === 0) return

      settleFrames -= 1
      animationFrame = window.requestAnimationFrame(synchronizeLayout)
    }

    const scheduleSynchronization = () => {
      settleFrames = 2
      if (animationFrame !== undefined) return

      animationFrame = window.requestAnimationFrame(synchronizeLayout)
    }

    const mutationObserver = new MutationObserver((records) => {
      const mainElement = document.querySelector('main')
      const hasSourceMutation = records.some((record) => {
        const { target } = record
        if (target === layoutElement || layoutElement.contains(target)) return false
        if (mainElement && (target === mainElement || mainElement.contains(target))) {
          return true
        }
        if (record.type !== 'childList') return false

        return [...record.addedNodes, ...record.removedNodes].some(
          (node) =>
            node instanceof Element &&
            (node.matches('main') || node.querySelector('main'))
        )
      })
      if (hasSourceMutation) scheduleSynchronization()
    })

    const fontSet = document.fonts
    const handleSourceEvent = (event: Event) => {
      if (event.target instanceof Node && layoutElement.contains(event.target)) return
      scheduleSynchronization()
    }

    mutationObserver.observe(document.body, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true
    })
    window.addEventListener('resize', scheduleSynchronization)
    window.addEventListener('pageshow', scheduleSynchronization)
    document.addEventListener('load', handleSourceEvent, true)
    document.addEventListener('transitionend', handleSourceEvent, true)
    document.addEventListener('animationend', handleSourceEvent, true)
    fontSet.addEventListener('loadingdone', scheduleSynchronization)
    scheduleSynchronization()

    return () => {
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame)

      window.removeEventListener('resize', scheduleSynchronization)
      window.removeEventListener('pageshow', scheduleSynchronization)
      document.removeEventListener('load', handleSourceEvent, true)
      document.removeEventListener('transitionend', handleSourceEvent, true)
      document.removeEventListener('animationend', handleSourceEvent, true)
      fontSet.removeEventListener('loadingdone', scheduleSynchronization)
      mutationObserver.disconnect()
      resizeObserver.disconnect()

      for (const interactiveElement of interactiveElements.values()) {
        interactiveElement.remove()
      }
    }
  }, [])
}
