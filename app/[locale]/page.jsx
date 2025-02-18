import styles from './page.module.css'

// import { Analytics } from '@vercel/analytics/react'
// import { SpeedInsights } from '@vercel/speed-insights/react'

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
        {/* <SpeedInsights debug={false} /> */}
        {/* <Analytics debug={false} /> */}
      </main>
    </Interactive>
  )
}
