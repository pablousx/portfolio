'use client'

import { debounce } from 'lib/debounce'
import { useEffect } from 'react'

const updatePosition = (x: number | null, y: number | null) => {
  const element = document.getElementById('layout')
  if (!element) return

  if (x != null) element.style.setProperty('--x', `${x}px`)
  if (y != null) element.style.setProperty('--y', `${y}px`)
}

export default function useInteractivenessTracker() {
  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches

    if (isCoarse) {
      let updateTimer: ReturnType<typeof setTimeout> | undefined
      const handleTrackInteractiveness = () => {
        const y = document.documentElement.scrollTop + window.screen.height / 2

        clearTimeout(updateTimer)
        updateTimer = setTimeout(() => updatePosition(null, y), 200)
      }

      handleTrackInteractiveness()

      window.addEventListener('scroll', handleTrackInteractiveness)

      return () => {
        clearTimeout(updateTimer)
        window.removeEventListener('scroll', handleTrackInteractiveness)
      }
    }

    const element = document.body
    if (!element) return

    const handleTrackInteractiveness = (e: MouseEvent) => {
      const { x, y } = element.getBoundingClientRect()
      updatePosition(e.clientX - x, e.clientY - y)
    }

    const debouncedHandleTrackInteractiveness = debounce((e: WheelEvent) => {
      handleTrackInteractiveness(e)
    }, 100)

    element.addEventListener('mousemove', handleTrackInteractiveness)
    element.addEventListener('pointermove', handleTrackInteractiveness)
    element.addEventListener('wheel', debouncedHandleTrackInteractiveness, {
      passive: true
    })

    return () => {
      if (!element) return

      element.removeEventListener('mousemove', handleTrackInteractiveness)
      element.removeEventListener('pointermove', handleTrackInteractiveness)
      element.removeEventListener('wheel', debouncedHandleTrackInteractiveness)
      debouncedHandleTrackInteractiveness.cancel()
    }
  }, [])
}
