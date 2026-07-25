export interface DebouncedFunction<Arguments extends unknown[]> {
  (...args: Arguments): void
  cancel: () => void
}

export const debounce = <Arguments extends unknown[]>(
  callback: (...args: Arguments) => void,
  wait: number
): DebouncedFunction<Arguments> => {
  let timeout: ReturnType<typeof setTimeout> | undefined

  const debounced = (...args: Arguments) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback(...args)
    }, wait)
  }

  debounced.cancel = () => clearTimeout(timeout)

  return debounced
}
