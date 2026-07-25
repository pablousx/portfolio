import styles from '@/styles/Skill.module.css'

import Icon from '@/components/Icon'
import OpenShowcase from '@/components/OpenShowcase'
import clsx from 'clsx/lite'
import type { SkillData } from '@/types/content'

interface SkillProps extends SkillData {
  className?: string
}

export default function Skill({
  className,
  icon,
  type,
  name,
  contrast = false
}: SkillProps) {
  return (
    <OpenShowcase
      className={clsx(className, styles.base)}
      images={[{ src: icon, alt: name, icon: true, contrast }]}
    >
      <Icon
        src={icon}
        type={type}
        interactive
        hint={name}
        foregroundColor={contrast}
        border
      />
    </OpenShowcase>
  )
}
