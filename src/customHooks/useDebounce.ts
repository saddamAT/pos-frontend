// hooks/useDebounce.ts

import { useState, useEffect } from 'react'

/**
 * useDebounce Hook
 * Delays updating the value until after the specified delay.
 *
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup timeout if value or delay changes
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
