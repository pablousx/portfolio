import type { SectionId } from '@/types/sections'

export interface SectionMetadata {
  id: SectionId
  noHash?: boolean
  noQuickLink?: boolean
}

const sectionMetadata: SectionMetadata[] = [
  {
    id: 'landing',
    noHash: true
  },
  {
    id: 'experience'
  },
  {
    id: 'projects'
  },
  {
    id: 'credentials'
  },
  {
    id: 'skills'
  },
  {
    id: 'about-me'
  },
  {
    id: 'contact'
  },
  {
    id: 'quote',
    noHash: true,
    noQuickLink: true
  }
]

export default sectionMetadata
