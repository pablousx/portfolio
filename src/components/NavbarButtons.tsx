import ThemeButton from '@/components/ThemeButton'
import styles from '@/styles/NavbarButtons.module.css'
import LocaleButton from 'src/components/LocaleButton';

export default async function NavbarButtons() {

  return (
    <div className={styles.base}>
      <LocaleButton />
      <ThemeButton />
    </div>
  )
}
