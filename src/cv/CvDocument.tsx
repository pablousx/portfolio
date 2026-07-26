import type { Dictionary } from 'i18n/config'

type CredentialData =
  | Dictionary['credentials']['certifications'][number]
  | Dictionary['credentials']['education'][number]
type ExperienceData = Dictionary['experience']['content'][number]

const {
  Circle,
  Defs,
  Document,
  LinearGradient,
  Link,
  Page,
  Path,
  Polygon,
  Rect,
  Stop,
  StyleSheet,
  Svg,
  Text,
  View
} = await import('@react-pdf/renderer')

const colors = {
  accent: '#278fe4',
  altAccent: '#4f46a9',
  black: '#050505',
  dim: '#343434',
  paper: '#ffffff'
}

const styles = StyleSheet.create({
  page: {
    position: 'relative',
    padding: '62 42 38 63',
    color: colors.black,
    backgroundColor: colors.paper,
    fontFamily: 'Helvetica',
    fontSize: 8.8,
    lineHeight: 1.28
  },
  rail: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 33,
    height: 842
  },
  header: {
    marginBottom: 43
  },
  name: {
    marginBottom: 10,
    fontFamily: 'Helvetica-BoldOblique',
    fontSize: 33,
    letterSpacing: -1.45,
    lineHeight: 1,
    textTransform: 'uppercase'
  },
  roleLine: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 3,
    fontSize: 14.5
  },
  role: {
    fontFamily: 'Helvetica-Bold'
  },
  location: {
    marginLeft: 4
  },
  columns: {
    display: 'flex',
    flexDirection: 'row',
    gap: 26
  },
  main: {
    flexGrow: 1,
    flexBasis: 0
  },
  aside: {
    width: 158
  },
  section: {
    marginBottom: 17
  },
  sectionTitle: {
    position: 'relative',
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    marginBottom: 13,
    color: colors.paper,
    fontFamily: 'Helvetica-BoldOblique',
    fontSize: 11.5,
    lineHeight: 1,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  sectionChip: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  sectionTitleText: {
    position: 'relative'
  },
  timelineEntry: {
    position: 'relative',
    minHeight: 42,
    marginLeft: 15,
    padding: '0 0 13 29',
    borderLeft: `0.7 solid ${colors.black}`
  },
  marker: {
    position: 'absolute',
    top: 0,
    left: -14,
    width: 28,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `0.8 solid ${colors.black}`,
    borderRadius: 14,
    backgroundColor: colors.paper
  },
  markerText: {
    color: colors.accent,
    fontFamily: 'Helvetica-BoldOblique',
    fontSize: 5.8,
    textAlign: 'center'
  },
  timelineEnd: {
    position: 'absolute',
    bottom: -1.5,
    left: -1.5,
    width: 3,
    height: 3,
    border: `0.7 solid ${colors.black}`,
    borderRadius: 1.5,
    backgroundColor: colors.paper
  },
  entryTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.3
  },
  entrySubtitle: {
    marginTop: 1,
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.7
  },
  period: {
    marginTop: 1,
    color: colors.dim,
    fontSize: 8.2
  },
  description: {
    marginTop: 2,
    color: colors.dim
  },
  list: {
    marginTop: 4
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 2
  },
  bullet: {
    width: 11,
    fontFamily: 'Helvetica-Bold'
  },
  listText: {
    flexGrow: 1,
    flexBasis: 0
  },
  contactRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  contactIcon: {
    width: 8,
    height: 8,
    marginRight: 5
  },
  contactLink: {
    color: colors.black,
    textDecoration: 'underline'
  },
  skillGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5
  },
  skillBullet: {
    width: 8,
    color: colors.accent,
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    lineHeight: 1
  },
  skillContent: {
    flexGrow: 1,
    flexBasis: 0
  },
  skillName: {
    fontFamily: 'Helvetica-Bold'
  },
  skillList: {
    marginTop: 1,
    color: colors.dim
  }
})

function printable(value: string) {
  return value
    .replace(/<[^>]*>/g, '')
    .replaceAll('—', '-')
    .replaceAll('·', '-')
}

function shortUrl(url: string) {
  return url
    .replace(/^mailto:/, '')
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
}

function SectionTitle({ children }: { children: string }) {
  const width = Math.max(92, Math.min(182, children.length * 6.7 + 24))

  return (
    <View style={[styles.sectionTitle, { width }]}>
      <Svg style={styles.sectionChip} width={width} height={24}>
        <Polygon points={`10,0 ${width},0 ${width - 10},24 0,24`} fill={colors.black} />
      </Svg>
      <Text style={styles.sectionTitleText}>{children}</Text>
    </View>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={item} style={styles.listItem}>
          <Text style={styles.bullet}>-</Text>
          <Text style={styles.listText}>{printable(item)}</Text>
        </View>
      ))}
    </View>
  )
}

function ContactIcon({ icon }: { icon: string }) {
  const stroke = { stroke: colors.black, strokeWidth: 0.8, fill: 'none' }

  if (icon === 'email') {
    return (
      <Svg style={styles.contactIcon} viewBox='0 0 8 8'>
        <Rect x={0.75} y={1.5} width={6.5} height={5} rx={0.75} {...stroke} />
        <Path d='M1.2 2.1L4 4.3l2.8-2.2' {...stroke} />
      </Svg>
    )
  }

  if (icon === 'linkedin') {
    return (
      <Svg style={styles.contactIcon} viewBox='0 0 8 8'>
        <Rect x={0.5} y={0.5} width={7} height={7} rx={0.75} fill={colors.black} />
        <Circle cx={2.2} cy={2.35} r={0.45} fill={colors.paper} />
        <Path
          d='M1.8 3.25v2.7M3.2 5.95v-2.7M3.2 4.35c0-1.1 2.1-1.1 2.1 0v1.6'
          stroke={colors.paper}
          strokeWidth={0.8}
          fill='none'
        />
      </Svg>
    )
  }

  if (icon === 'github') {
    return (
      <Svg style={styles.contactIcon} viewBox='0 0 8 8'>
        <Circle cx={4} cy={4} r={3.3} fill={colors.black} />
        <Path
          d='M2.4 4.1c0-1 3.2-1 3.2 0v1.2c-.45-.15-.75.1-.75.45M3.15 5.75c0-.35-.3-.6-.75-.45'
          stroke={colors.paper}
          strokeWidth={0.7}
          fill='none'
        />
      </Svg>
    )
  }

  return (
    <Svg style={styles.contactIcon} viewBox='0 0 8 8'>
      <Circle cx={4} cy={4} r={3.25} {...stroke} />
      <Path
        d='M0.9 4h6.2M4 .75c1.4 1.65 1.4 4.85 0 6.5M4 .75c-1.4 1.65-1.4 4.85 0 6.5'
        {...stroke}
      />
    </Svg>
  )
}

function ContactRow({
  icon,
  url,
  children
}: {
  children: string
  icon: string
  url: string
}) {
  return (
    <View style={styles.contactRow}>
      <ContactIcon icon={icon} />
      <Link src={url} style={styles.contactLink}>
        {children}
      </Link>
    </View>
  )
}

function TimelineEntry({
  badge,
  title,
  subtitle,
  period,
  description,
  highlights,
  showEnd = false
}: {
  badge: string
  description?: string
  highlights: string[]
  period: string
  showEnd?: boolean
  subtitle: string
  title: string
}) {
  return (
    <View style={styles.timelineEntry} wrap={false}>
      <View style={styles.marker}>
        <Text style={styles.markerText}>{badge}</Text>
      </View>
      {showEnd ? <View style={styles.timelineEnd} /> : null}
      <Text style={styles.entryTitle}>{printable(title)}</Text>
      <Text style={styles.entrySubtitle}>{printable(subtitle)}</Text>
      <Text style={styles.period}>{printable(period)}</Text>
      {description ? (
        <Text style={styles.description}>{printable(description)}</Text>
      ) : null}
      <BulletList items={highlights} />
    </View>
  )
}

function ExperienceEntry({ item, showEnd }: { item: ExperienceData; showEnd: boolean }) {
  const badge = item.company.toUpperCase().includes('KOLO') ? 'KOLO' : 'LOMAX'

  return (
    <TimelineEntry
      badge={badge}
      title={item.role}
      subtitle={item.company}
      period={item.period}
      description={item.description}
      highlights={item.highlights}
      showEnd={showEnd}
    />
  )
}

function CredentialEntry({ item, showEnd }: { item: CredentialData; showEnd: boolean }) {
  return (
    <TimelineEntry
      badge={item.badge}
      title={item.name}
      subtitle={item.institution}
      period={item.period}
      highlights={item.highlights}
      showEnd={showEnd}
    />
  )
}

export default function CvDocument({ dictionary }: { dictionary: Dictionary }) {
  const { landing, contacts, experience, credentials, resume, skills } = dictionary
  const credentialEntries: CredentialData[] = [
    ...credentials.education,
    ...credentials.certifications
  ]
  const selectedSkillGroups = skills.content.slice(0, 6)
  const externalContacts = []
  for (const contact of contacts) {
    if (contact.icon !== 'email') externalContacts.push(contact)
  }

  return (
    <Document
      title={`${landing.name} - ${resume.title}`}
      author={landing.name}
      subject={resume.profile}
      language={resume.fileName.endsWith('-es.pdf') ? 'es' : 'en'}
    >
      <Page size='A4' style={styles.page}>
        <Svg style={styles.rail} width={33} height={842} fixed>
          <Defs>
            <LinearGradient id='left-rail-gradient' x1='0' y1='0' x2='0' y2='1'>
              <Stop offset='0%' stopColor='#78a4eb' />
              <Stop offset='100%' stopColor={colors.altAccent} />
            </LinearGradient>
          </Defs>
          <Rect width='100%' height='100%' fill='url(#left-rail-gradient)' />
        </Svg>

        <View style={styles.header}>
          <Text style={styles.name}>{landing.name}</Text>
          <View style={styles.roleLine}>
            <Text style={styles.role}>{resume.title}</Text>
            <Text style={styles.location}>- {resume.location}</Text>
          </View>
        </View>

        <View style={styles.columns}>
          <View style={styles.main}>
            <View style={styles.section}>
              <SectionTitle>{experience.title}</SectionTitle>
              {experience.content.map((item, index) => (
                <ExperienceEntry
                  key={`${item.company}-${item.period}`}
                  item={item}
                  showEnd={index === experience.content.length - 1}
                />
              ))}
            </View>

            <View style={styles.section}>
              <SectionTitle>{credentials.educationLabel}</SectionTitle>
              {credentialEntries.map((item, index) => (
                <CredentialEntry
                  key={item.name}
                  item={item}
                  showEnd={index === credentialEntries.length - 1}
                />
              ))}
            </View>
          </View>

          <View style={styles.aside}>
            <View style={styles.section}>
              <SectionTitle>{resume.contactLabel}</SectionTitle>
              <ContactRow icon='website' url='https://pablousx.vercel.app'>
                pablousx.vercel.app
              </ContactRow>
              <ContactRow icon='email' url={`mailto:${landing.email}`}>
                {landing.email}
              </ContactRow>
              {externalContacts.map(({ icon, name, url }) => (
                <ContactRow key={name} icon={icon} url={url}>
                  {shortUrl(url)}
                </ContactRow>
              ))}
            </View>

            <View style={styles.section}>
              <SectionTitle>{resume.skillsLabel}</SectionTitle>
              {selectedSkillGroups.map((group) => (
                <View key={group.name} style={styles.skillGroup}>
                  <Text style={styles.skillBullet}>•</Text>
                  <View style={styles.skillContent}>
                    <Text style={styles.skillName}>{group.name}</Text>
                    <Text style={styles.skillList}>
                      {group.skills
                        .slice(0, 6)
                        .map(({ name }) => name)
                        .join(' - ')}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
