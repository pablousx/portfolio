import styles from '@/styles/Footer.module.css'

import Icon from '@/components/Icon'
import Link from '@/components/Link'

const year = new Date().getFullYear()

export default async function Footer() {
  return (
    <footer className={styles.base}>
      <Link href='https://github.com/pablousx/portfolio' isExternal decoration={false}>
        Source
        <Icon src='github' lightColor />
      </Link>
      <p>{year}</p>
    </footer>
  )
}
