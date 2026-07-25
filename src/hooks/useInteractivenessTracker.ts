'use client'

import { useEffect } from 'react'

export default function useInteractivenessTracker() {
  useEffect(() => {
    const layoutElement = document.getElementById('layout')
    if (!layoutElement) return () => {}

    const pointerQuery = window.matchMedia('(pointer: coarse)')
    let animationFrame: number | undefined
    let nextPosition: { x: number | null; y: number | null } | undefined

    const updatePosition = () => {
      animationFrame = undefined
      if (!nextPosition) return

      const { x, y } = nextPosition
      nextPosition = undefined

      if (x != null) layoutElement.style.setProperty('--x', `${x}px`)
      if (y != null) layoutElement.style.setProperty('--y', `${y}px`)
    }

    const schedulePositionUpdate = (x: number | null, y: number | null) => {
      nextPosition = { x, y }
      if (animationFrame !== undefined) return

      animationFrame = window.requestAnimationFrame(updatePosition)
    }

    const trackCoarsePointer = () => {
      schedulePositionUpdate(null, window.scrollY + window.innerHeight / 2)
    }

    const trackFinePointer = (event: MouseEvent) => {
      const layoutRect = layoutElement.getBoundingClientRect()
      schedulePositionUpdate(
        event.clientX - layoutRect.left,
        event.clientY - layoutRect.top
      )
    }

    const handleScroll = () => {
      if (pointerQuery.matches) trackCoarsePointer()
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!pointerQuery.matches) trackFinePointer(event)
    }

    const handleWheel = (event: WheelEvent) => {
      if (!pointerQuery.matches) trackFinePointer(event)
    }

    const handlePointerChange = () => {
      if (pointerQuery.matches) trackCoarsePointer()
    }

    if (pointerQuery.matches) trackCoarsePointer()

    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('wheel', handleWheel, { passive: true })
    pointerQuery.addEventListener('change', handlePointerChange)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('wheel', handleWheel)
      pointerQuery.removeEventListener('change', handlePointerChange)
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame)
    }
  }, [])
}
