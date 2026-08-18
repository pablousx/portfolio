import styles from './resume.module.css'

import RichText from '@/components/RichText'
import StructuredData from '@/components/StructuredData'
import {
  languageAlternates,
  localizedUrl,
  PERSON_ID,
  SITE_URL,
  WEBSITE_ID
} from '@/constants/seo'
import { loadDictionary, locales } from 'i18n/config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

interface ResumePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ResumePageProps): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(locales, locale)) notFound()

  const { landing, resume } = await loadDictionary(locale)
  const title = `${landing.name} — ${resume.title}`
  const canonical = localizedUrl(locale, '/resume')

  return {
    title,
    description: resume.profile,
    alternates: {
      canonical,
      languages: languageAlternates('/resume')
    },
    openGraph: {
      title,
      description: resume.profile,
      type: 'profile',
      url: canonical,
      images: [`${SITE_URL}/images/landing/profile-photo.png`]
    },
    twitter: {
      card: 'summary',
      title,
      description: resume.profile,
      images: [`${SITE_URL}/images/landing/profile-photo.png`]
    }
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ResumePage({ params }: ResumePageProps) {
  const { locale } = await params
  if (!hasLocale(locales, locale)) notFound()

  setRequestLocale(locale)
  const dictionary = await loadDictionary(locale)
  const { contacts, credentials, experience, landing, resume, skills } = dictionary
  const canonical = localizedUrl(locale, '/resume')
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${canonical}#resume`,
    url: canonical,
    name: `${landing.name} — ${resume.title}`,
    description: resume.profile,
    inLanguage: locale,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: { '@id': PERSON_ID },
    primaryImageOfPage: `${SITE_URL}/images/landing/profile-photo.png`
  }

  return (
    <main className={styles.page}>
      <StructuredData data={structuredData} />

      <nav className={styles.actions} aria-label={resume.title}>
        <a href={`/${locale}`}>{resume.backLabel}</a>
        <a className={styles.download} href={`/${locale}/cv`} download>
          {resume.downloadLabel}
        </a>
      </nav>

      <header className={styles.header}>
        <p className={styles.eyebrow}>{resume.title}</p>
        <h1>{landing.name}</h1>
        <p className={styles.location}>{resume.location}</p>
        <p className={styles.availability}>{resume.availability}</p>
      </header>

      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <section aria-labelledby='resume-profile'>
            <h2 id='resume-profile'>{resume.profileLabel}</h2>
            <p>{resume.profile}</p>
          </section>

          <section aria-labelledby='resume-experience'>
            <h2 id='resume-experience'>{experience.title}</h2>
            <p className={styles.intro}>{experience.intro}</p>
            <div className={styles.entries}>
              {experience.content.map((item) => (
                <article key={`${item.company}-${item.period}`}>
                  <header className={styles.entryHeader}>
                    <div>
                      <h3>{item.role}</h3>
                      <p className={styles.organization}>{item.company}</p>
                    </div>
                    <p className={styles.period}>{item.period}</p>
                  </header>
                  <RichText as='p'>{item.description}</RichText>
                  <ul>
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <p className={styles.technologies}>{item.skills.join(' · ')}</p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby='resume-education'>
            <h2 id='resume-education'>{credentials.educationLabel}</h2>
            <div className={styles.entries}>
              {credentials.education.map((item) => (
                <article key={item.name}>
                  <header className={styles.entryHeader}>
                    <div>
                      <h3>{item.label}</h3>
                      <p className={styles.organization}>{item.institution}</p>
                    </div>
                    <p className={styles.period}>{item.period}</p>
                  </header>
                  <RichText as='p'>{item.description}</RichText>
                  <ul>
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby='resume-certification'>
            <h2 id='resume-certification'>{credentials.certificationLabel}</h2>
            <div className={styles.entries}>
              {credentials.certifications.map((item) => (
                <article key={item.name}>
                  <header className={styles.entryHeader}>
                    <div>
                      <h3>{item.label}</h3>
                      <p className={styles.organization}>{item.institution}</p>
                    </div>
                    <p className={styles.period}>{item.period}</p>
                  </header>
                  <RichText as='p'>{item.description}</RichText>
                  <ul>
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <section aria-labelledby='resume-contact'>
            <h2 id='resume-contact'>{resume.contactLabel}</h2>
            <ul className={styles.plainList}>
              {contacts.map((contact) => (
                <li key={contact.name}>
                  <a href={contact.url}>{contact.name}</a>
                </li>
              ))}
              <li>
                <a href={localizedUrl(locale)}>{resume.portfolioLabel}</a>
              </li>
            </ul>
          </section>

          <section aria-labelledby='resume-skills'>
            <h2 id='resume-skills'>{resume.skillsLabel}</h2>
            <div className={styles.skillGroups}>
              {skills.content.slice(0, 6).map((group) => (
                <div key={group.name}>
                  <h3>{group.name}</h3>
                  <p>{group.skills.map(({ name }) => name).join(' · ')}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby='resume-languages'>
            <h2 id='resume-languages'>{resume.languagesLabel}</h2>
            <p>{resume.languages}</p>
          </section>
        </aside>
      </div>
    </main>
  )
}
