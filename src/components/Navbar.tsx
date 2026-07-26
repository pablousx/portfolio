import styles from '@/styles/Navbar.module.css'

import Logo from '@/components/Logo'
import NavbarButtons from '@/components/NavbarButtons'
import NavbarLinks from '@/components/NavbarLinks'
import sectionMetadata from '@/constants/sectionMetadata'
import getDictionary from 'i18n/server'

export default async function Navbar() {
  const dictionary = await getDictionary()
  const links: Array<{ id: string; label: string; number: string }> = []
  for (const { id, noQuickLink } of sectionMetadata.slice(1)) {
    if (noQuickLink) continue

    const sectionDictionary = dictionary[id]
    if (!('title' in sectionDictionary)) continue

    links.push({
      id,
      label: sectionDictionary.title,
      number: String(links.length + 1).padStart(2, '0')
    })
  }

  return (
    <nav className={styles.base}>
      <Logo />
      <NavbarLinks links={links} />
      <NavbarButtons />
    </nav>
  )
}
