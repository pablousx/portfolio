import styles from '@/styles/LandingSection.module.css'

import Avatar from '@/components/Avatar'
import ContactIcons from '@/components/ContactIcons'
import Hint from '@/components/Hint'
import Icon from '@/components/Icon'
import Link from '@/components/Link'
import RichText from '@/components/RichText'
import Section from '@/components/Section'
import clsx from 'clsx/lite'
import getDictionary, { getCurrentLocale } from 'i18n/server'

export default async function LandingSection({ id }) {
  const locale = await getCurrentLocale()
  const dictionary = await getDictionary()

  const { landing, aria } = dictionary
  const { name, presentation, cvButton, image } = landing

  return (
    <Section as='header' background={false} className={styles.base} id={id}>
      <div className={styles.info}>
        <h1 className={styles.title}>{name}</h1>
        <RichText as='p' className={clsx(styles.presentation, 'interactive-layout')}>
          {presentation}
        </RichText>
        <div className={styles.buttons}>
          <Hint position='bottom' label={aria.downloaded} showOnClick>
            <Link asButton variant='primary' href={`/${locale}/cv`} decoration={false}>
              {cvButton}
              <Icon src='download' backgroundColor />
            </Link>
          </Hint>
          <ContactIcons className={styles.contact} />
        </div>
      </div>
      <Avatar className={styles.avatar} image={image} />
    </Section>
  )
}
