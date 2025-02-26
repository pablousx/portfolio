import RichText from '@/components/RichText'
import Section from '@/components/Section'
import styles from '@/styles/QuoteSection.module.css'
import clsx from 'clsx/lite'
import getDictionary from 'i18n/server'

export default async function QuoteSection({ id }) {
  const dictionary = await getDictionary(id)

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
