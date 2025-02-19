import styles from '@/styles/Footer.module.css'

import Icon from '@/components/Icon'
import Link from '@/components/Link'
import { githubIcon } from '@/constants/icons'

export default async function Footer() {
  return (
    <footer className={styles.base}>
      <Link href='https://github.com/nandou54/portfolio' isExternal decoration={false}>
        Source
        <Icon src={githubIcon} lightColor />
      </Link>
      <p>2024</p>
    </footer>
  )
}
