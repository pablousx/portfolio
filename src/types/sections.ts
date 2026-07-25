export type SectionId =
  | 'about-me'
  | 'contact'
  | 'landing'
  | 'projects'
  | 'quote'
  | 'skills'

export interface SectionComponentProps {
  id: SectionId
}
