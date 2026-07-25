import type ICONS from '@/constants/icons'

export type IconName = keyof typeof ICONS

export interface ImageData {
  alt: string
  contrast?: boolean
  height?: number
  icon?: boolean
  placeholder?: string
  src: string
  width?: number
}

export interface SkillData {
  contrast?: boolean
  icon: IconName
  name: string
  type?: 'primary' | 'secondary'
}

export interface ProjectData {
  code?: string
  description: string
  icon: IconName
  images?: ImageData[]
  name: string
  skills: string[]
  website: string
  year: number
}

export interface ExperienceData {
  company: string
  description: string
  highlights: string[]
  icon: IconName
  period: string
  role: string
}

export interface CredentialData {
  badge: string
  highlights: string[]
  institution: string
  name: string
  period: string
}

export interface Dictionary {
  'about-me': {
    content: Array<{ images?: ImageData[]; text: string }>
    title: string
  }
  aria: {
    available: string
    close: string
    copied: string
    downloaded: string
    goTo: string
    goToTop: string
    navigateTo: string
    nextImage: string
    openShowcase: string
    previousImage: string
    seeImage: string
    toggleLocale: string
    toggleTheme: string
    zoomIn: string
    zoomOut: string
    zoomReset: string
  }
  contact: {
    form: {
      emailLabel: string
      error400Message: string
      error500Message: string
      errorMessage: string
      hint: string
      messageLabel: string
      messagePlaceholder: string
      nameDefault: string
      nameLabel: string
      requiredLabel: string
      subjectDefault: string
      subjectLabel: string
      subjectPlaceholder: string
      submitButton: string
      successMessage: string
      successTooltip: string
    }
    messageText: string
    title: string
  }
  credentials: {
    certificationLabel: string
    certifications: CredentialData[]
    education: CredentialData[]
    educationLabel: string
    intro: string
    title: string
  }
  contacts: Array<{
    icon: IconName
    name: string
    props?: { foregroundColor?: boolean }
    url: string
  }>
  email: {
    html: string
    subject: string
  }
  experience: {
    content: ExperienceData[]
    intro: string
    title: string
  }
  landing: {
    cvButton: string
    email: string
    emailButton: string
    image: ImageData
    name: string
    presentation: string
    title: string
  }
  meta: {
    description: string
    title: string
  }
  projects: {
    codeButton: string
    content: ProjectData[]
    title: string
    websiteButton: string
  }
  quote: {
    author: string
    text: string
  }
  resume: {
    contactLabel: string
    fileName: string
    location: string
    portfolioLabel: string
    profile: string
    profileLabel: string
    skillsLabel: string
    title: string
  }
  skills: {
    content: Array<{ name: string; skills: SkillData[] }>
    title: string
  }
}
