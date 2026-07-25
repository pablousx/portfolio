import type { HTMLAttributes } from 'react'

declare global {
  interface Element {
    interactiveElement?: HTMLElement
  }
}

declare module 'react' {
  interface HTMLAttributes<T> {
    top?: string
  }
}

export {}
