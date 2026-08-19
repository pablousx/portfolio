import styles from '@/styles/ExperienceSection.module.css'

import Icon from '@/components/Icon'
import Link from '@/components/Link'
import RichText from '@/components/RichText'
import Section from '@/components/Section'
import Skill from '@/components/Skill'
import type { SkillData } from '@/components/Skill'
import type { Dictionary } from 'i18n/config'
import getDictionary from 'i18n/server'
import type { SectionComponentProps } from '@/types/sections'

type Experience = Dictionary['experience']['content'][number]

export default async function ExperienceSection({ id }: SectionComponentProps) {
  const [dictionary, skillsDictionary] = await Promise.all([
    getDictionary('experience'),
    getDictionary('skills')
  ])
  const { title, presentLabel, websiteButton, content } = dictionary
  const allSkills = skillsDictionary.content.flatMap(
    (skillGroup) => skillGroup.skills as SkillData[]
  )
  const experiencesPerYear = content
    .reduce<{ experiences: Experience[]; isCurrent: boolean; year: number }[]>(
      (acc, experience) => {
        const year = Number(experience.period.match(/\d{4}/)?.[0] ?? 0)
        const isCurrent = /present|actualidad/i.test(experience.period)
        let experiencesForYear = acc.find(
          ({ year: candidateYear }) => candidateYear === year
        )

        if (!experiencesForYear) {
          experiencesForYear = { experiences: [], isCurrent, year }
          acc.push(experiencesForYear)
        }

        experiencesForYear.experiences.push(experience)
        return acc
      },
      []
    )
    .sort((a, b) => b.year - a.year)

  return (
    <Section id={id} title={title} className={styles.base}>
      <div className={styles.content}>
        <div className={styles.allExperience}>
          {experiencesPerYear.map(({ experiences, isCurrent, year }) => (
            <div key={year}>
              {!isCurrent && <h3>{year}</h3>}
              <ol className={styles.entries}>
                {experiences.map(
                  ({
                    company,
                    description,
                    highlights,
                    icon,
                    period,
                    role,
                    skills,
                    website
                  }) => {
                    const experienceSkills = skills.flatMap((name) => {
                      const skill = allSkills.find((candidate) => candidate.name === name)
                      return skill ? [skill] : []
                    })

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
                          <h5>{role}</h5>
                          <RichText as='p' className={styles.description}>
                            {description}
                          </RichText>
                          <ul className={styles.outcomes}>
                            {highlights.map((highlight) => (
                              <li key={highlight}>{highlight}</li>
                            ))}
                          </ul>
                          <div className={styles.skills}>
                            {experienceSkills.map((skill) => (
                              <Skill key={skill.name} {...skill} />
                            ))}
                          </div>
                          <Link
                            asButton
                            variant='primary'
                            href={website}
                            isExternal
                            decoration={false}
                            className={styles.website}
                          >
                            {websiteButton}
                            <Icon src='website' backgroundColor />
                          </Link>
                        </article>
                      </li>
                    )
                  }
                )}
              </ol>
            </div>
          ))}
        </div>
        <div className={styles.timeline}>
          <Icon src='arrow' foregroundColor />
          <h3 className={styles.present}>{presentLabel}</h3>
        </div>
      </div>
    </Section>
  )
}
