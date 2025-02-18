'use client'
import Hint from '@/components/Hint'
import styles from '@/styles/Icon.module.css'
import clsx from 'clsx/lite'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const classNameByType = {
  secondary: styles.secondary
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
}) {
  const [SvgIcon, setIcon] = useState(() => () => null)
  const ariaHidden = hidden ? true : undefined

  useEffect(() => {
    console.log('🚀 | src:', src)
    setIcon(() => dynamic(() => import(`../../public/icons/${src}`)))
  }, [src])

  return (
    <figure
      className={clsx(
        className,
        styles.base,
        classNameByType[type],
        border && styles.border,
        interactive && (border ? 'interactive-border' : 'interactive-icon'),
        foregroundColor && styles.foregroundColor,
        backgroundColor && styles.backgroundColor,
        accentColor && styles.accentColor,
        lightColor && styles.lightColor
      )}
      aria-hidden={ariaHidden}
    >
      {hint ? (
        <Hint label={hint} position={hintPosition}>
          <SvgIcon
            className={styles.icon}
            title={alt}
            {...props}
            aria-hidden={ariaHidden}
          />
        </Hint>
      ) : (
        <SvgIcon
          className={styles.icon}
          title={alt}
          {...props}
          aria-hidden={ariaHidden}
        />
      )}
    </figure>
  )
}
