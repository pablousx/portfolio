import Hint from '@/components/Hint'
import styles from '@/styles/Icon.module.css'
import clsx from 'clsx/lite'

import ICONS from '@/constants/icons'
import type { IconName } from '@/types/content'
import type { SVGProps } from 'react'

const classNameByType = {
  secondary: styles.secondary
} as const

export interface IconProps extends Omit<
  SVGProps<SVGSVGElement>,
  'className' | 'src' | 'type'
> {
  accentColor?: boolean
  alt?: string
  backgroundColor?: boolean
  border?: boolean
  className?: string
  foregroundColor?: boolean
  hidden?: boolean
  hint?: string
  hintPosition?: 'bottom' | 'bottom-left' | 'top'
  interactive?: boolean
  lightColor?: boolean
  src: IconName
  type?: keyof typeof classNameByType | 'primary'
}

export default function Icon({
  className,
  type = 'primary',
  border = false,
  interactive = false,
  hint,
  hintPosition,
  src,
  alt,
  hidden = false,
  foregroundColor = false,
  backgroundColor = false,
  accentColor = false,
  lightColor = false,
  ...props
}: IconProps) {
  const SvgIcon = ICONS[src] || ICONS.missing
  const ariaHidden = hidden ? true : undefined

  return (
    <figure
      className={clsx(
        className,
        styles.base,
        type === 'secondary' && classNameByType.secondary,
        border && styles.border,
        interactive && (border ? 'interactive-border' : 'interactive-icon'),
        foregroundColor && styles.foregroundColor,
        backgroundColor && styles.backgroundColor,
        accentColor && styles.accentColor,
        lightColor && styles.lightColor
      )}
      aria-hidden={ariaHidden}
    >
      <Hint label={hint} position={hintPosition}>
        <SvgIcon
          className={styles.icon}
          title={alt}
          {...props}
          aria-hidden={ariaHidden}
        />
      </Hint>
    </figure>
  )
}
