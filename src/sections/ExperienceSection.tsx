import styles from '@/styles/ExperienceSection.module.css'

import Icon from '@/components/Icon'
import Section from '@/components/Section'
import getDictionary from 'i18n/server'
import type { SectionComponentProps } from '@/types/sections'

export default async function ExperienceSection({ id }: SectionComponentProps) {
  const { title, intro, content } = await getDictionary('experience')

  return (
    <Section id={id} title={title} className={styles.base}>
      <p className={styles.intro}>{intro}</p>
      <div className={styles.content}>
        <ol className={styles.entries}>
          {content.map(({ company, description, highlights, icon, period, role }) => {
            const year = period.match(/\d{4}/)?.[0]

            return (
              <li key={`${company}-${period}`} className={styles.entry}>
                <article className={`${styles.card} interactive-border`}>
                  <header className={styles.cardHeader}>
                    <Icon className={styles.logo} src={icon} hidden />
                    <div>
                      <h3>{company}</h3>
                      <p className={styles.period}>{period}</p>
                    </div>
                  </header>
                  <h4>{role}</h4>
                  <p className={styles.description}>{description}</p>
                  <ul className={styles.outcomes}>
                    {highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </article>
                {year && <span className={styles.year}>{year}</span>}
              </li>
            )
          })}
        </ol>
        <div className={styles.timeline} aria-hidden='true'>
          <Icon src='arrow' foregroundColor hidden />
        </div>
      </div>
    </Section>
  )
}
