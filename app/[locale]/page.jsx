import styles from './page.module.css'

import sections from '@/constants/sections'
import Interactive from '@/components/Interactive'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Showcase from '@/components/Showcase'

export default async function Page() {
  return (
    <Interactive>
      <main className={styles.base}>
        <Navbar />
        {sections.map(({ id, Tag }) => (
          <Tag key={id} id={id} />
        ))}
        <Footer />
        <Showcase />
      </main>
    </Interactive>
  )
}
