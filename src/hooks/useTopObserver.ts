import { useLayoutEffect } from 'react'

export default function useTopObserver() {
  useLayoutEffect(() => {
    const handleTopListener = () => {
      const newIsOnTop = document.documentElement.scrollTop < 50
      document.body.setAttribute('top', String(newIsOnTop))
    }

    handleTopListener()
    window.addEventListener('scroll', handleTopListener)

    return () => window.removeEventListener('scroll', handleTopListener)
  }, [])
}
