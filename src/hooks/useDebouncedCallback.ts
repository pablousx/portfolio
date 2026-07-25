import { debounce } from 'lib/debounce'
import { useEffect } from 'react'

const useDebouncedCallback = <Arguments extends unknown[]>(
  callback: (...args: Arguments) => void,
  wait: number
) => {
  const debouncedCallback = debounce(callback, wait)

  useEffect(() => {
    return () => debouncedCallback.cancel()
  }, [debouncedCallback])

  return debouncedCallback
}

export default useDebouncedCallback
