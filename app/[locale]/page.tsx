import styles from './page.module.css'

import sections from '@/constants/sections'
import Interactive from '@/components/Interactive'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShowcaseLoader from '@/components/ShowcaseLoader'
import type { Locale } from 'i18n/config'
import { setRequestLocale } from 'next-intl/server'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <Interactive>
      <main className={styles.base}>
        <Navbar />
        {sections.map(({ id, Tag }) => (
          <Tag key={id} id={id} />
        ))}
        <Footer />
        <ShowcaseLoader />
      </main>
    </Interactive>
  )
}
