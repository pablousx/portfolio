'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ShowcaseImage {
  alt: string
  contrast?: boolean
  height?: number
  icon?: boolean
  placeholder?: string
  src: string
  width?: number
}

interface ShowcaseState {
  images: ShowcaseImage[]
  index: number
  onIndexChange?: (index: number) => void
  open: boolean
}

interface AppState {
  closeShowcase: () => void
  currentSection?: string
  openShowcase: (showcase?: Partial<ShowcaseState>) => void
  prefersDarkScheme?: boolean
  setCurrentSection: (currentSection: string) => void
  setPrefersDarkScheme: (prefersDarkScheme: boolean) => void
  setShowcase: (showcase: Partial<ShowcaseState>) => void
  showcase: ShowcaseState
  theme?: 'dark' | 'light'
  toggleTheme: (dark: boolean) => void
}

const initialState: Pick<
  AppState,
  'currentSection' | 'prefersDarkScheme' | 'showcase' | 'theme'
> = {
  theme: undefined,
  prefersDarkScheme: undefined,
  currentSection: undefined,
  showcase: { images: [], index: 0, open: false }
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      toggleTheme: (dark) => set(() => ({ theme: dark ? 'dark' : 'light' })),
      setPrefersDarkScheme: (prefersDarkScheme) => set(() => ({ prefersDarkScheme })),
      setCurrentSection: (currentSection) => set(() => ({ currentSection })),
      openShowcase: ({ open = true, index = 0, images = [], ...showcase } = {}) => {
        document.body.classList.add('no-scroll')
        set(() => ({ showcase: { open, index, images, ...showcase } }))
      },
      closeShowcase: () => {
        document.body.classList.remove('no-scroll')
        set((state) => ({ showcase: { ...state.showcase, open: false } }))
      },
      setShowcase: (showcase) =>
        set((state) => ({ showcase: { ...state.showcase, ...showcase } }))
    }),
    {
      name: 'app-storage',
      partialize: ({ theme, prefersDarkScheme }) => ({
        theme,
        prefersDarkScheme
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return

        const currentSection = window.location.hash.slice(1)
        if (currentSection) state.setCurrentSection(currentSection)

        const prefersDarkScheme = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        state.setPrefersDarkScheme(prefersDarkScheme)

        if (state.theme != null || !(state.theme === 'dark' && prefersDarkScheme)) return

        if (state.prefersDarkScheme !== prefersDarkScheme && prefersDarkScheme)
          state.toggleTheme(true)
        else if (prefersDarkScheme) state.toggleTheme(true)
      }
    }
  )
)

export default useAppStore
