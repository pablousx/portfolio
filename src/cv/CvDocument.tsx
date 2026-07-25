import type { CredentialData, Dictionary, ExperienceData } from '@/types/content'

const { Document, Link, Page, StyleSheet, Text, View } =
  await import('@react-pdf/renderer')

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
    padding: '62 42 38 70',
    color: colors.black,
    backgroundColor: colors.paper,
    fontFamily: 'Helvetica',
    fontSize: 8.8,
    lineHeight: 1.28
  },
  rail: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 7,
    width: 33,
    backgroundColor: colors.altAccent
  },
  railAccent: {
    position: 'absolute',
    top: 0,
    left: 7,
    width: 33,
    height: 255,
    backgroundColor: '#78a4eb'
  },
  header: {
    marginBottom: 35
  },
  name: {
    marginBottom: 10,
    fontFamily: 'Helvetica-BoldOblique',
    fontSize: 29,
    letterSpacing: -1.1,
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
    alignSelf: 'flex-start',
    marginBottom: 10,
    padding: '5 14 4',
    borderRadius: 14,
    color: colors.paper,
    backgroundColor: colors.black,
    fontFamily: 'Helvetica-BoldOblique',
    fontSize: 11.5
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
  contactLead: {
    marginBottom: 6,
    fontFamily: 'Helvetica-Bold'
  },
  contactLink: {
    marginBottom: 4,
    color: colors.black,
    textDecoration: 'underline'
  },
  skillGroup: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 5
  },
  skillBullet: {
    width: 10,
    fontFamily: 'Helvetica-Bold'
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
  return value.replaceAll('—', '-').replaceAll('·', '-')
}

function shortUrl(url: string) {
  return url
    .replace(/^mailto:/, '')
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '')
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

function TimelineEntry({
  badge,
  title,
  subtitle,
  period,
  description,
  highlights
}: {
  badge: string
  description?: string
  highlights: string[]
  period: string
  subtitle: string
  title: string
}) {
  return (
    <View style={styles.timelineEntry} wrap={false}>
      <View style={styles.marker}>
        <Text style={styles.markerText}>{badge}</Text>
      </View>
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

function ExperienceEntry({ item }: { item: ExperienceData }) {
  const badge = item.company.toUpperCase().includes('KOLO') ? 'KOLO' : 'LOMAX'

  return (
    <TimelineEntry
      badge={badge}
      title={item.role}
      subtitle={item.company}
      period={item.period}
      description={item.description}
      highlights={item.highlights}
    />
  )
}

function CredentialEntry({ item }: { item: CredentialData }) {
  return (
    <TimelineEntry
      badge={item.badge}
      title={item.name}
      subtitle={item.institution}
      period={item.period}
      highlights={item.highlights}
    />
  )
}

export default function CvDocument({ dictionary }: { dictionary: Dictionary }) {
  const { landing, contacts, experience, credentials, resume, skills } = dictionary
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
        <View style={styles.rail} fixed />
        <View style={styles.railAccent} fixed />

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
              <Text style={styles.sectionTitle}>{experience.title}</Text>
              {experience.content.map((item) => (
                <ExperienceEntry key={`${item.company}-${item.period}`} item={item} />
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{credentials.educationLabel}</Text>
              {credentials.education.map((item) => (
                <CredentialEntry key={item.name} item={item} />
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{credentials.certificationLabel}</Text>
              {credentials.certifications.map((item) => (
                <CredentialEntry key={item.name} item={item} />
              ))}
            </View>
          </View>

          <View style={styles.aside}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{resume.contactLabel}</Text>
              <Text style={styles.contactLead}>{resume.portfolioLabel}</Text>
              <Link src='https://pablousx.vercel.app' style={styles.contactLink}>
                pablousx.vercel.app
              </Link>
              <Link src={`mailto:${landing.email}`} style={styles.contactLink}>
                {landing.email}
              </Link>
              {externalContacts.map(({ name, url }) => (
                <Link key={name} src={url} style={styles.contactLink}>
                  {shortUrl(url)}
                </Link>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{resume.skillsLabel}</Text>
              {selectedSkillGroups.map((group) => (
                <View key={group.name} style={styles.skillGroup}>
                  <Text style={styles.skillBullet}>-</Text>
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
