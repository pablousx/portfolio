import Hint from '@/components/Hint'
import Link from '@/components/Link'
import ThemeButton from '@/components/ThemeButton'
import styles from '@/styles/NavbarButtons.module.css'
import clsx from 'clsx/lite'
import getDictionary, { getCurrentLocale } from 'i18n/server'

export default async function NavbarButtons() {
  const [{ aria }, locale] = await Promise.all([getDictionary(), getCurrentLocale()])

  return (
    <div className={styles.base}>
      <Hint position='bottom-left' label={aria.toggleLocale} visibility='until-click'>
        <Link
          className={clsx(styles.language)}
          href={locale === 'en' ? '/es' : '/en'}
          scroll={false}
          decoration={false}
          replace
        >
          {locale}
        </Link>
      </Hint>
      <ThemeButton />
    </div>
  )
}
