import styles from '@/styles/LandingSection.module.css'
import buttonStyles from '@/styles/Button.module.css'

import Avatar from '@/components/Avatar'
import ContactIcons from '@/components/ContactIcons'
import Icon from '@/components/Icon'
import RichText from '@/components/RichText'
import Section from '@/components/Section'
import clsx from 'clsx/lite'
import getDictionary, { getCurrentLocale } from 'i18n/server'
import type { SectionComponentProps } from '@/types/sections'

export default async function LandingSection({ id }: SectionComponentProps) {
  const [locale, dictionary] = await Promise.all([getCurrentLocale(), getDictionary()])

  const { landing } = dictionary
  const { name, presentation, cvButton, image } = landing

  return (
    <Section as='header' background={false} className={styles.base} id={id}>
      <div className={styles.info}>
        <h1 className={styles.title}>{name}</h1>
        <RichText as='p' className={clsx(styles.presentation, 'interactive-layout')}>
          {presentation}
        </RichText>
        <div className={styles.buttons}>
          <a
            className={clsx(
              buttonStyles.base,
              buttonStyles.primary,
              'interactive-button-primary no-select'
            )}
            href={`/${locale}/cv`}
            download
          >
            {cvButton}
            <Icon src='download' backgroundColor />
          </a>
          <ContactIcons className={styles.contact} />
        </div>
      </div>
      <Avatar className={styles.avatar} image={image} />
    </Section>
  )
}
