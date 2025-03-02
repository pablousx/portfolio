'use client'

import { debounce } from 'lib/debounce'
import { useCallback, useEffect } from 'react'

export default function useInteractivenessTracker() {
  const callback = useCallback((x, y) => {
    const element = document.getElementById('layout')
    if (x != null) element.style.setProperty('--x', `${x}px`)
    if (y != null) element.style.setProperty('--y', `${y}px`)
  }, [])

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches

    if (isCoarse) {
      const handleTrackInteractiveness = () => {
        const y = document.documentElement.scrollTop + window.screen.height / 2

        setTimeout(() => callback(null, y), 200)
      }

      handleTrackInteractiveness()

      window.addEventListener('scroll', handleTrackInteractiveness)

      return () => {
        window.removeEventListener('scroll', handleTrackInteractiveness)
      }
    }

    const element = document.body
    if (!element) return

    const handleTrackInteractiveness = (e) => {
      const { x, y } = element.getBoundingClientRect()
      callback(e.clientX - x, e.clientY - y)
    }

    const debouncedHandleTrackInteractiveness = debounce((e) => {
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
      element.removeEventListener('wheel', debouncedHandleTrackInteractiveness, {
        passive: true
      })
    }
  }, [callback])
}
