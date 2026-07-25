export type SectionId =
  | 'about-me'
  | 'contact'
  | 'credentials'
  | 'experience'
  | 'landing'
  | 'projects'
  | 'quote'
  | 'skills'

export interface SectionComponentProps {
  id: SectionId
}
