import styles from '@/styles/Navbar.module.css'

import Logo from '@/components/Logo'
import NavbarButtons from '@/components/NavbarButtons'
import NavbarLinks from '@/components/NavbarLinks'

export default async function Navbar() {
  return (
    <nav className={styles.base}>
      <Logo />
      <NavbarLinks />
      <NavbarButtons />
    </nav>
  )
}
