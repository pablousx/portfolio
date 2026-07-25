import styles from '@/styles/ContactSection.module.css'

import ContactForm from '@/components/ContactForm'
import ContactIcons from '@/components/ContactIcons'
import Section from '@/components/Section'
import getDictionary from 'i18n/server'
import type { SectionComponentProps } from '@/types/sections'

export default async function ContactSection({ id }: SectionComponentProps) {
  const dictionary = await getDictionary('contact')
  const { title, messageText } = dictionary

  return (
    <Section className={styles.base} id={id} background={false}>
      <div className={styles.title}>
        <h2>{title}</h2>
        <ContactIcons className={styles.contact} />
      </div>
      <ContactForm label={title}>
        <p>{messageText}</p>
      </ContactForm>
    </Section>
  )
}
