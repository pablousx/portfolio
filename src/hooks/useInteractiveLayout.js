'use client'

import { debounce } from 'lib/debounce'
import { useCallback, useEffect, useState } from 'react'

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

const getElements = () =>
  typeof window === 'undefined'
    ? []
    : document.querySelectorAll(
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

const getInteractiveElementType = (element) => {
  return interactiveElementTypes.find((interactiveElementType) =>
    interactiveElementType.tag
      ? element.tagName.toLowerCase() === interactiveElementType.tag
      : element.classList.contains(interactiveElementType.className)
  )
}

const alterSize = debounce(({ elements, callback }) => {
  elements ??= getElements()

  for (const element of elements) {
    const interactiveElement = element.interactiveElement
    if (!interactiveElement) continue

    interactiveElement.style.width = `${element.offsetWidth}px`
    interactiveElement.style.height = `${element.offsetHeight}px`

    if (interactiveElement.parentElement.id === 'layout') {
      const viewportOffset = element.getBoundingClientRect()
      interactiveElement.style.top = `${document.documentElement.scrollTop + viewportOffset.top}px`
      interactiveElement.style.left = `${viewportOffset.left}px`
    } else {
      const viewportOffset = element.getBoundingClientRect()
      const parentViewportOffset =
        interactiveElement.parentElement.getBoundingClientRect()

      const borderWidth = Number(
        getComputedStyle(interactiveElement.parentElement)
          .getPropertyValue('border-left-width')
          .slice(0, -2)
      )

      interactiveElement.style.top = `${viewportOffset.top - parentViewportOffset.top - borderWidth}px`
      interactiveElement.style.left = `${viewportOffset.left - parentViewportOffset.left - borderWidth}px`
    }

    interactiveElement.style.opacity = null
  }

  if (callback) callback()
}, 300)

export default function useInteractiveLayout() {
  const elements = getElements()

  const refreshLayoutElements = useCallback(({ elements }) => {
    const layoutElement = document.getElementById('layout')

    layoutElement.style.opacity = 0
    layoutElement.style.transition = 'none'
    alterSize({
      elements,
      callback: () => {
        layoutElement.style.opacity = null
        layoutElement.style.transition = null
      }
    })
  }, [])

  const [windowWidth, setWindowWidth] = useState()

  const handleWindowResize = useCallback(
    (event) => {
      const newWindowWidth = event.target.innerWidth
      setWindowWidth(newWindowWidth)

      const testElement = document.querySelector(
        `main .${interactiveElementTypes[0].className}`
      )

      if (testElement != null) {
        const viewportOffset = testElement.getBoundingClientRect()
        const offsetTop = document.documentElement.scrollTop + viewportOffset.top
        const isSameHeight =
          Math.abs(
            Number(testElement.interactiveElement?.style.top.slice(0, -2)) - offsetTop
          ) < 1

        if (newWindowWidth === windowWidth && isSameHeight) return
      }

      refreshLayoutElements({})
    },
    [windowWidth, refreshLayoutElements]
  )

  useEffect(() => {
    // const layoutElement = document.getElementById('layout')

    // setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleWindowResize)

    return () => window.removeEventListener('resize', handleWindowResize)
  }, [handleWindowResize])

  useEffect(() => {
    setTimeout(() => {
      // if (!layoutElement) return

      const layoutElement = document.getElementById('layout')

      const newElements = Array.from(elements).filter(
        (element) => !element.interactiveElement
      )

      if (newElements.length === 0) return

      for (const element of newElements) {
        const interactiveElementType = getInteractiveElementType(element)

        const interactiveElement = interactiveElementType.clone
          ? element.cloneNode(true)
          : document.createElement('div')

        if (interactiveElementType.clone)
          interactiveElement.setAttribute('aria-hidden', 'true')
        else interactiveElement.classList.add(...element.classList)

        interactiveElement.style.opacity = 0

        element.interactiveElement = interactiveElement

        const parent =
          newElements.findLast(
            (newElement) => newElement.contains(element) && newElement !== element
          )?.interactiveElement ?? layoutElement
        parent.appendChild(interactiveElement)
      }

      refreshLayoutElements({ elements: newElements })
    }, 800)
  }, [elements, refreshLayoutElements])
}
