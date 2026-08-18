import type { Dictionary } from 'i18n/config'

import { SITE_URL } from '@/constants/seo'

type CredentialData =
  | Dictionary['credentials']['certifications'][number]
  | Dictionary['credentials']['education'][number]
type ExperienceData = Dictionary['experience']['content'][number]

const { Document, Font, Link, Page, StyleSheet, Text, View } =
  await import('@react-pdf/renderer')

Font.registerHyphenationCallback((word) => [word])

const colors = {
  ink: '#111111',
  paper: '#ffffff'
}

const siteHostname = new URL(SITE_URL).hostname

const styles = StyleSheet.create({
  page: {
    padding: '36 42 34',
    color: colors.ink,
    backgroundColor: colors.paper,
    fontFamily: 'Times-Roman',
    fontSize: 9.7,
    lineHeight: 1.22
  },
  header: {
    alignItems: 'center',
    marginBottom: 7,
    textAlign: 'center'
  },
  name: {
    fontFamily: 'Times-Bold',
    fontSize: 21,
    lineHeight: 1
  },
  role: {
    marginTop: 3,
    fontFamily: 'Times-Bold',
    fontSize: 11
  },
  location: {
    marginTop: 2
  },
  contactLine: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 1.5,
    fontSize: 9.1
  },
  contactLink: {
    color: colors.ink,
    textDecoration: 'none'
  },
  section: {
    marginBottom: 6
  },
  sectionTitle: {
    marginTop: 2,
    marginBottom: 4,
    paddingBottom: 1,
    borderBottom: `0.75 solid ${colors.ink}`,
    fontFamily: 'Times-Bold',
    fontSize: 11,
    lineHeight: 1.1
  },
  skillLine: {
    marginBottom: 1.25
  },
  skillLabel: {
    fontFamily: 'Times-Bold'
  },
  entry: {
    marginBottom: 5
  },
  entryRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  organization: {
    fontFamily: 'Times-Bold',
    fontSize: 10
  },
  entryTitle: {
    flexGrow: 1,
    flexBasis: 0,
    fontFamily: 'Times-Italic'
  },
  period: {
    marginLeft: 12,
    fontSize: 9.2,
    textAlign: 'right'
  },
  list: {
    marginTop: 1.5
  },
  listItem: {
    marginBottom: 1,
    paddingLeft: 10,
    textIndent: -8
  },
  technologies: {
    marginTop: 0.5,
    fontSize: 9
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
  return (
    <Text style={styles.sectionTitle} minPresenceAhead={36}>
      {children}
    </Text>
  )
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null

  return (
    <View style={styles.list}>
      {items.map((item) => (
        <Text key={item} style={styles.listItem}>
          • {printable(item)}
        </Text>
      ))}
    </View>
  )
}

function ExperienceEntry({
  item,
  technologiesLabel
}: {
  item: ExperienceData
  technologiesLabel: string
}) {
  return (
    <View style={styles.entry} wrap={false}>
      <Text style={styles.organization}>{printable(item.company)}</Text>
      <View style={styles.entryRow}>
        <Text style={styles.entryTitle}>{printable(item.role)}</Text>
        <Text style={styles.period}>{printable(item.period)}</Text>
      </View>
      <BulletList items={[item.description, ...item.highlights]} />
      <Text style={styles.technologies}>
        <Text style={styles.skillLabel}>{technologiesLabel}: </Text>
        {item.skills.join(', ')}
      </Text>
    </View>
  )
}

function CredentialEntry({
  item,
  showHighlights = true
}: {
  item: CredentialData
  showHighlights?: boolean
}) {
  return (
    <View style={styles.entry} wrap={false}>
      <Text style={styles.organization}>{printable(item.institution)}</Text>
      <View style={styles.entryRow}>
        <Text style={styles.entryTitle}>{printable(item.name)}</Text>
        <Text style={styles.period}>{printable(item.period)}</Text>
      </View>
      {showHighlights ? <BulletList items={item.highlights} /> : null}
    </View>
  )
}

export default function CvDocument({ dictionary }: { dictionary: Dictionary }) {
  const { contacts, credentials, experience, landing, resume, skills } = dictionary
  const linkedIn = contacts.find(({ icon }) => icon === 'linkedin')
  const github = contacts.find(({ icon }) => icon === 'github')

  return (
    <Document
      title={`${landing.name} - ${resume.title}`}
      author={landing.name}
      subject={resume.profile}
      keywords={skills.content
        .flatMap(({ skills: entries }) => entries.map(({ name }) => name))
        .join(', ')}
      language={resume.fileName.endsWith('-es.pdf') ? 'es' : 'en'}
    >
      <Page size='A4' style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{landing.name}</Text>
          <Text style={styles.role}>{resume.title}</Text>
          <Text style={styles.location}>{resume.location}</Text>

          <View style={styles.contactLine}>
            <Link src={`mailto:${landing.email}`} style={styles.contactLink}>
              {landing.email}
            </Link>
            <Text> • </Text>
            <Link src={SITE_URL} style={styles.contactLink}>
              {siteHostname}
            </Link>
            {linkedIn ? (
              <>
                <Text> • </Text>
                <Link src={linkedIn.url} style={styles.contactLink}>
                  {shortUrl(linkedIn.url)}
                </Link>
              </>
            ) : null}
            {github ? (
              <>
                <Text> • </Text>
                <Link src={github.url} style={styles.contactLink}>
                  {shortUrl(github.url)}
                </Link>
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <SectionTitle>{resume.profileLabel}</SectionTitle>
          <Text>{printable(resume.profile)}</Text>
        </View>

        <View style={styles.section}>
          <SectionTitle>{experience.title}</SectionTitle>
          {experience.content.map((item) => (
            <ExperienceEntry
              key={`${item.company}-${item.period}`}
              item={item}
              technologiesLabel={resume.technologiesLabel}
            />
          ))}
        </View>

        <View style={styles.section}>
          <SectionTitle>{credentials.educationLabel}</SectionTitle>
          {credentials.education.map((item) => (
            <CredentialEntry key={item.name} item={item} />
          ))}
        </View>

        <View style={styles.section}>
          <SectionTitle>{credentials.certificationLabel}</SectionTitle>
          {credentials.certifications.map((item) => (
            <CredentialEntry key={item.name} item={item} showHighlights={false} />
          ))}
        </View>

        <View style={styles.section}>
          <SectionTitle>{resume.skillsLabel}</SectionTitle>
          {skills.content.slice(0, 6).map((group) => (
            <Text key={group.name} style={styles.skillLine}>
              <Text style={styles.skillLabel}>{group.name}: </Text>
              {group.skills.map(({ name }) => name).join(', ')}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <SectionTitle>{resume.languagesLabel}</SectionTitle>
          <Text>{printable(resume.languages)}</Text>
        </View>
      </Page>
    </Document>
  )
}
