import AboutMeSection from '@/sections/AboutMeSection'
import ContactSection from '@/sections/ContactSection'
import CredentialsSection from '@/sections/CredentialsSection'
import ExperienceSection from '@/sections/ExperienceSection'
import LandingSection from '@/sections/LandingSection'
import ProjectsSection from '@/sections/ProjectsSection'
import QuoteSection from '@/sections/QuoteSection'
import SkillsSection from '@/sections/SkillsSection'
import type { ComponentType } from 'react'
import type { SectionComponentProps, SectionId } from '@/types/sections'

interface SectionDefinition {
  id: SectionId
  noHash?: boolean
  noQuickLink?: boolean
  Tag: ComponentType<SectionComponentProps>
}

const sections: SectionDefinition[] = [
  {
    id: 'landing',
    Tag: LandingSection,
    noHash: true
  },
  {
    id: 'experience',
    Tag: ExperienceSection
  },
  {
    id: 'projects',
    Tag: ProjectsSection
  },
  {
    id: 'credentials',
    Tag: CredentialsSection
  },
  {
    id: 'skills',
    Tag: SkillsSection
  },
  {
    id: 'about-me',
    Tag: AboutMeSection
  },
  {
    id: 'contact',
    Tag: ContactSection
  },
  {
    id: 'quote',
    Tag: QuoteSection,
    noHash: true,
    noQuickLink: true
  }
]

export default sections
