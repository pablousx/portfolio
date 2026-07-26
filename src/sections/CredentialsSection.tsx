import styles from '@/styles/CredentialsSection.module.css'

import Icon from '@/components/Icon'
import RichText from '@/components/RichText'
import Section from '@/components/Section'
import getDictionary from 'i18n/server'
import type { Dictionary } from 'i18n/config'
import type { SectionComponentProps } from '@/types/sections'

type CredentialData =
  | Dictionary['credentials']['certifications'][number]
  | Dictionary['credentials']['education'][number]

function CredentialCard({ credential }: { credential: CredentialData }) {
  const { description, icon, institution, label, period } = credential

  return (
    <article className={`${styles.card} interactive-border`}>
      <header className={styles.cardHeader}>
        <Icon className={styles.logo} src={icon} hidden />
        <div>
          <h3>{label}</h3>
          <p className={styles.period}>{period}</p>
        </div>
      </header>
      <div className={styles.body}>
        <p className={styles.institution}>{institution}</p>
        <RichText as='p' className={styles.description}>
          {description}
        </RichText>
      </div>
    </article>
  )
}

export default async function CredentialsSection({ id }: SectionComponentProps) {
  const { title, education, certifications } = await getDictionary('credentials')

  return (
    <Section id={id} title={title} className={styles.base}>
      <div className={styles.cards}>
        <div>
          {education.map((credential) => (
            <CredentialCard key={credential.name} credential={credential} />
          ))}
        </div>
        <div>
          {certifications.map((credential) => (
            <CredentialCard key={credential.name} credential={credential} />
          ))}
        </div>
      </div>
    </Section>
  )
}
