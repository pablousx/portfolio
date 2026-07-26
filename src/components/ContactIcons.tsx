import Hint from '@/components/Hint'
import IconLink from '@/components/IconLink'
import styles from '@/styles/ContactIcons.module.css'
import clsx from 'clsx/lite'

import getDictionary from 'i18n/server'

export default async function ContactIcons({ className }: { className?: string }) {
  const contacts = await getDictionary('contacts')

  return (
    <div className={clsx(styles.base, className)}>
      {contacts.map((contact) => {
        const { name, icon, url } = contact

        return (
          <Hint key={name} label={name} position='bottom'>
            <IconLink
              src={icon}
              iconProps={{ foregroundColor: true }}
              title={name}
              href={url}
              isExternal
            />
          </Hint>
        )
      })}
    </div>
  )
}
