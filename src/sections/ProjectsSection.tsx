import styles from '@/styles/ProjectsSection.module.css'

import Project from '@/components/Project'
import type { ProjectProps } from '@/components/Project'
import Section from '@/components/Section'
import type { SkillData } from '@/components/Skill'

import Icon from '@/components/Icon'
import getDictionary from 'i18n/server'
import type { SectionComponentProps } from '@/types/sections'

interface EnrichedProject extends Omit<ProjectProps, 'skills'> {
  skills: SkillData[]
}

interface ProjectsForYear {
  projects: EnrichedProject[]
  year: number
}

export default async function ProjectsSection({ id }: SectionComponentProps) {
  const [dictionary, skillsDictionary] = await Promise.all([
    getDictionary('projects'),
    getDictionary('skills')
  ])

  const { title, content: projects } = dictionary
  const { content: skillsGroups } = skillsDictionary

  const allSkills = skillsGroups.flatMap((skillGroup) => skillGroup.skills as SkillData[])

  const projectsPerYear = projects
    .reduce<ProjectsForYear[]>((acc, project) => {
      let projectsForYear = acc.find(({ year }) => year === project.year)
      if (!projectsForYear) {
        projectsForYear = { year: project.year, projects: [] }
        acc.push(projectsForYear)
      }

      projectsForYear.projects.push({
        ...project,
        skills: project.skills.flatMap((name) => {
          const skill = allSkills.find((candidate) => candidate.name === name)
          return skill ? [skill] : []
        })
      })

      return acc
    }, [])
    .sort((a, b) => b.year - a.year)

  return (
    <Section id={id} title={title} className={styles.base}>
      <div className={styles.content}>
        <div className={styles.allProjects}>
          {projectsPerYear.map(({ year, projects: yearlyProjects }) => (
            <div key={year}>
              <h3>{year}</h3>
              <div className={styles.projects}>
                {yearlyProjects.map((project) => (
                  <Project key={project.name} {...project} />
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
