import styles from '@/styles/ProjectsSection.module.css'

import Project from '@/components/Project'
import Section from '@/components/Section'

import Icon from '@/components/Icon'
import getDictionary from 'i18n/server'

export default async function ProjectsSection({ id }) {
  const dictionary = await getDictionary(id)
  const skillsDictionary = await getDictionary('skills')

  const { title, content: projects } = dictionary
  const { content: skillsGroups } = skillsDictionary

  const allSkills = skillsGroups.reduce(
    (allSkills, skillGroup) => [...allSkills, ...skillGroup.skills],
    []
  )
  console.log('🚀 | allSkills:', allSkills)

  const projectsPerYear = projects
    .reduce((acc, project) => {
      let yearObject = acc.find((yearObject) => yearObject.year === project.year)
      if (!yearObject) {
        yearObject = { year: project.year, projects: [] }
        acc.push(yearObject)
      }

      yearObject.projects.push({
        ...project,
        skills: project.skills.map(
          (name) => allSkills.find((skill) => skill.name === name) || {}
        )
      })

      return acc
    }, [])
    .sort((a, b) => b.year - a.year)

  return (
    <Section id={id} title={title} className={styles.base}>
      <div className={styles.content}>
        <div className={styles.allProjects}>
          {projectsPerYear.map(({ year, projects }) => (
            <div key={year}>
              <h3>{year}</h3>
              <div className={styles.projects}>
                {projects.map((project, i) => (
                  <Project key={i} {...project} allSkills={allSkills} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.timeline}>
          <Icon src='arrow' foregroundColor />
        </div>
      </div>
    </Section>
  )
}
