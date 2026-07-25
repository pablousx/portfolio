import styles from '@/styles/Project.module.css'

import Icon from '@/components/Icon'
import ImageCarrousel from '@/components/ImageCarrousel'

import Link from '@/components/Link'
import RichText from '@/components/RichText'
import Skill from '@/components/Skill'
import clsx from 'clsx/lite'
import getDictionary from 'i18n/server'
import type { ProjectData, SkillData } from '@/types/content'

const EMPTY_IMAGES: NonNullable<ProjectData['images']> = []
const EMPTY_SKILLS: SkillData[] = []

interface ProjectProps extends Omit<ProjectData, 'skills' | 'year'> {
  skills?: SkillData[]
}

export default async function Project({
  icon,
  name,
  description,
  website,
  code,
  skills = EMPTY_SKILLS,
  images = EMPTY_IMAGES
}: ProjectProps) {
  const dictionary = await getDictionary('projects')
  const { codeButton, websiteButton } = dictionary

  return (
    <article className={clsx(styles.base, 'interactive-border')}>
      <header>
        <div className={styles.title}>
          <Icon src={icon} alt={name} />
          <h4 className='interactive-text'>{name}</h4>
        </div>
        <RichText as='p'>{description}</RichText>
        <div className={styles.skills}>
          {skills.map((skill) => (
            <Skill key={skill.name} {...skill} />
          ))}
        </div>
      </header>
      {images.length > 0 && <ImageCarrousel images={images} height={213} width={426} />}
      <footer>
        {code && (
          <Link asButton variant='secondary' href={code} isExternal decoration={false}>
            {codeButton}
            <Icon src='code' foregroundColor hidden interactive />
          </Link>
        )}
        <Link asButton variant='primary' href={website} isExternal decoration={false}>
          {websiteButton}
          <Icon src='website' backgroundColor />
        </Link>
      </footer>
    </article>
  )
}
