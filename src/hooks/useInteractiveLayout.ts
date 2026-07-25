'use client'

import { debounce } from 'lib/debounce'
import { useEffect, useEffectEvent, useRef } from 'react'

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

const getElements = (): HTMLElement[] =>
  typeof window === 'undefined'
    ? []
    : Array.from(
        document.querySelectorAll<HTMLElement>(
          interactiveElementTypes
            .map(
              (interactiveElementType) =>
                `main ${
                  interactiveElementType.tag
                    ? interactiveElementType.tag
                    : `.${interactiveElementType.className}`
                }`
            )
            .join(',')
        )
      )

const getInteractiveElementType = (element: HTMLElement) => {
  return interactiveElementTypes.find((interactiveElementType) =>
    interactiveElementType.tag
      ? element.tagName.toLowerCase() === interactiveElementType.tag
      : element.classList.contains(interactiveElementType.className ?? '')
  )
}

interface AlterSizeOptions {
  callback?: () => void
  elements?: Iterable<HTMLElement>
}

const alterSize = debounce(
  ({ elements: suppliedElements, callback }: AlterSizeOptions) => {
    const elements = suppliedElements ?? getElements()
    const measurements: Array<{
      height: number
      interactiveElement: HTMLElement
      left: number
      top: number
      width: number
    }> = []

    for (const sourceElement of elements) {
      const interactiveElement = sourceElement.interactiveElement
      if (!interactiveElement) continue

      const viewportOffset = sourceElement.getBoundingClientRect()
      const interactiveParent = interactiveElement.parentElement
      if (!interactiveParent) continue

      const isInRootLayout = interactiveParent.id === 'layout'
      const parentViewportOffset = isInRootLayout
        ? null
        : interactiveParent.getBoundingClientRect()
      const borderWidth = isInRootLayout
        ? 0
        : Number.parseFloat(
            getComputedStyle(interactiveParent).getPropertyValue('border-left-width')
          )

      measurements.push({
        interactiveElement,
        width: sourceElement.offsetWidth,
        height: sourceElement.offsetHeight,
        top: isInRootLayout
          ? document.documentElement.scrollTop + viewportOffset.top
          : viewportOffset.top - (parentViewportOffset?.top ?? 0) - borderWidth,
        left: isInRootLayout
          ? viewportOffset.left
          : viewportOffset.left - (parentViewportOffset?.left ?? 0) - borderWidth
      })
    }

    for (const { interactiveElement, width, height, top, left } of measurements) {
      interactiveElement.style.cssText += `;width:${width}px;height:${height}px;top:${top}px;left:${left}px;opacity:1`
    }

    if (callback) callback()
  },
  300
)

export default function useInteractiveLayout() {
  const windowWidth = useRef<number | undefined>(undefined)

  const refreshLayoutElements = useEffectEvent(
    ({ elements }: { elements?: HTMLElement[] } = {}) => {
      const layoutElement = document.getElementById('layout')
      if (!layoutElement) return

      layoutElement.style.opacity = '0'
      layoutElement.style.transition = 'none'
      alterSize({
        elements,
        callback: () => {
          layoutElement.style.opacity = ''
          layoutElement.style.transition = ''
        }
      })
    }
  )

  const handleWindowResize = useEffectEvent(() => {
    const newWindowWidth = window.innerWidth

    const testElement = document.querySelector<HTMLElement>('main .interactive-layout')

    if (testElement != null) {
      const viewportOffset = testElement.getBoundingClientRect()
      const offsetTop = document.documentElement.scrollTop + viewportOffset.top
      const isSameHeight =
        Math.abs(
          Number(testElement.interactiveElement?.style.top.slice(0, -2)) - offsetTop
        ) < 1

      if (newWindowWidth === windowWidth.current && isSameHeight) return
    }

    windowWidth.current = newWindowWidth
    refreshLayoutElements()
  })

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)

    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  useEffect(() => {
    const initializationTimer = setTimeout(() => {
      const layoutElement = document.getElementById('layout')
      if (!layoutElement) return

      const elements = getElements()
      const newElements = Array.from(elements).filter(
        (element) => !element.interactiveElement
      )

      if (newElements.length === 0) return

      for (const element of newElements) {
        const interactiveElementType = getInteractiveElementType(element)
        if (!interactiveElementType) continue

        const interactiveElement = interactiveElementType.clone
          ? (element.cloneNode(true) as HTMLElement)
          : document.createElement('div')

        if (interactiveElementType.clone)
          interactiveElement.setAttribute('aria-hidden', 'true')
        else interactiveElement.classList.add(...element.classList)

        interactiveElement.style.opacity = '0'

        element.interactiveElement = interactiveElement

        const parent =
          newElements.findLast(
            (newElement) => newElement.contains(element) && newElement !== element
          )?.interactiveElement ?? layoutElement
        parent.appendChild(interactiveElement)
      }

      refreshLayoutElements({ elements: newElements })
    }, 800)

    return () => {
      clearTimeout(initializationTimer)
      alterSize.cancel()
    }
  }, [])
}
