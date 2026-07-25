import RichText from '@/components/RichText'
import Section from '@/components/Section'
import styles from '@/styles/QuoteSection.module.css'
import clsx from 'clsx/lite'
import getDictionary from 'i18n/server'
import type { SectionComponentProps } from '@/types/sections'

export default async function QuoteSection(_props: SectionComponentProps) {
  const dictionary = await getDictionary('quote')

  const { text, author } = dictionary

  return (
    <Section className={styles.base}>
      <blockquote className={clsx(styles.quote, 'interactive-border')}>
        <p>
          <sup>“</sup>
          <RichText as='span'>{text}</RichText>
          <sup>”</sup>
        </p>
        <p className={styles.author}>— {author}</p>
      </blockquote>
    </Section>
  )
}
