import Image from '@/components/Image'
import styles from '@/styles/Avatar.module.css'
import clsx from 'clsx/lite'
import type { ImageData } from '@/types/content'

const positions = ['Web Developer', 'Designer', 'UI / UX']

interface AvatarProps {
  className?: string
  image: ImageData
}

export default async function Avatar({ className, image }: AvatarProps) {
  return (
    <div className={styles.base}>
      <div className={clsx(styles.avatar, className, 'interactive-aura')}>
        <div className={styles.box} />
        <Image
          className={styles.img}
          {...image}
          height={304}
          width={304}
          quality={90}
          priority
          zoom={false}
        />
      </div>
      <div className={styles.band}>
        <div className={styles.positions}>
          {positions.map((position) => (
            <span key={`primary-${position}`}>{position}</span>
          ))}
          {positions.map((position) => (
            <span key={`duplicate-${position}`}>{position}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
