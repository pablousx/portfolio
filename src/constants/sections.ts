import AboutMeSection from '@/sections/AboutMeSection'
import ContactSection from '@/sections/ContactSection'
import CredentialsSection from '@/sections/CredentialsSection'
import ExperienceSection from '@/sections/ExperienceSection'
import LandingSection from '@/sections/LandingSection'
import ProjectsSection from '@/sections/ProjectsSection'
import QuoteSection from '@/sections/QuoteSection'
import SkillsSection from '@/sections/SkillsSection'
import type { ComponentType } from 'react'
import type { SectionComponentProps } from '@/types/sections'
import sectionMetadata from '@/constants/sectionMetadata'
import type { SectionMetadata } from '@/constants/sectionMetadata'

interface SectionDefinition extends SectionMetadata {
  Tag: ComponentType<SectionComponentProps>
}

const sectionComponents = [
  LandingSection,
  ExperienceSection,
  ProjectsSection,
  CredentialsSection,
  SkillsSection,
  AboutMeSection,
  ContactSection,
  QuoteSection
]

const sections: SectionDefinition[] = []
for (const [index, metadata] of sectionMetadata.entries()) {
  sections.push({
    ...metadata,
    Tag: sectionComponents[index]!
  })
}

export default sections
