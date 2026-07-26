import styles from '@/styles/CredentialsSection.module.css'

import Section from '@/components/Section'
import getDictionary from 'i18n/server'
import type { Dictionary } from 'i18n/config'
import type { SectionComponentProps } from '@/types/sections'

type CredentialData =
  | Dictionary['credentials']['certifications'][number]
  | Dictionary['credentials']['education'][number]

function CredentialCard({
  credential,
  label
}: {
  credential: CredentialData
  label: string
}) {
  const { badge, highlights, institution, name, period } = credential

  return (
    <article className={`${styles.card} interactive-border`}>
      <header className={styles.cardHeader}>
        <div className={styles.badge} aria-hidden='true'>
          <span>{badge}</span>
        </div>
        <div>
          <p className={styles.label}>{label}</p>
          <p className={styles.period}>{period}</p>
        </div>
      </header>
      <h3>{name}</h3>
      <p className={styles.institution}>{institution}</p>
      <ul>
        {highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    </article>
  )
}

export default async function CredentialsSection({ id }: SectionComponentProps) {
  const { title, intro, educationLabel, education, certificationLabel, certifications } =
    await getDictionary('credentials')

  return (
    <Section id={id} title={title} className={styles.base}>
      <p className={styles.intro}>{intro}</p>
      <div className={styles.cards}>
        <div>
          {education.map((credential) => (
            <CredentialCard
              key={credential.name}
              credential={credential}
              label={educationLabel}
            />
          ))}
        </div>
        <div>
          {certifications.map((credential) => (
            <CredentialCard
              key={credential.name}
              credential={credential}
              label={certificationLabel}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}
