import { execFileSync, spawn } from 'node:child_process'
import type { ChildProcess } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

type ResumeFixture = {
  locale: 'en' | 'es'
  fileName: string
  identity: readonly [string, ...string[]]
  sections: readonly [string, ...string[]]
  content: readonly string[]
}

const port = process.env.CV_ATS_PORT ?? '3117'
const configuredBaseUrl = process.env.CV_ATS_BASE_URL?.replace(/\/+$/, '')
const baseUrl = configuredBaseUrl ?? `http://127.0.0.1:${port}`

const resumes = [
  {
    locale: 'en',
    fileName: 'Pablo-Pineda-CV-en.pdf',
    identity: [
      'Pablo Pineda',
      'Full-Stack Product Engineer & Tech Lead',
      'pablo@steralynx.com',
      'linkedin.com/in/pablousx',
      'github.com/pablousx'
    ],
    sections: [
      'Professional Summary',
      'Experience',
      'Education',
      'Certification',
      'Technical Skills',
      'Languages'
    ],
    content: [
      'Lomax Technologies S.A.',
      'September 2024 - Present',
      'KOLO S.A.',
      'Next.js',
      'Node.js',
      'PostgreSQL',
      'University of San Carlos'
    ]
  },
  {
    locale: 'es',
    fileName: 'Pablo-Pineda-CV-es.pdf',
    identity: [
      'Pablo Pineda',
      'Ingeniero de Producto Full-Stack y Tech Lead',
      'pablo@steralynx.com',
      'linkedin.com/in/pablousx',
      'github.com/pablousx'
    ],
    sections: [
      'Resumen profesional',
      'Experiencia',
      'Educación',
      'Certificación',
      'Habilidades técnicas',
      'Idiomas'
    ],
    content: [
      'Lomax Technologies S.A.',
      'Septiembre de 2024 - Presente',
      'KOLO S.A.',
      'Next.js',
      'Node.js',
      'PostgreSQL',
      'Universidad de San Carlos'
    ]
  }
] satisfies readonly ResumeFixture[]

function requireGhostscript(): void {
  try {
    execFileSync('gs', ['--version'], { stdio: 'ignore' })
  } catch {
    throw new Error(
      'Ghostscript is required for ATS text extraction. Install `gs` and try again.'
    )
  }
}

function escapePostScriptPath(path: string): string {
  return path.replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)')
}

function extractPdfText(path: string): string {
  return execFileSync(
    'gs',
    ['-q', '-dNOPAUSE', '-dBATCH', '-sDEVICE=txtwrite', '-sOutputFile=-', path],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
  )
}

function getPageCount(path: string): number {
  const escapedPath = escapePostScriptPath(path)
  const output = execFileSync(
    'gs',
    [
      '-q',
      '-dNODISPLAY',
      '-c',
      `(${escapedPath}) (r) file runpdfbegin pdfpagecount = quit`
    ],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
  )

  return Number.parseInt(output.trim(), 10)
}

function normalized(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

function assertIncludes(text: string, expected: string, label: string): void {
  if (!text.includes(expected)) {
    throw new Error(`${label}: ATS text is missing "${expected}"`)
  }
}

function assertReadingOrder(
  text: string,
  sections: readonly string[],
  label: string
): void {
  let previousIndex = -1

  for (const section of sections) {
    const index = text.indexOf(section)

    if (index === -1) throw new Error(`${label}: section "${section}" is missing`)
    if (index <= previousIndex) {
      throw new Error(`${label}: section "${section}" is out of reading order`)
    }

    previousIndex = index
  }
}

async function waitForServer(child: ChildProcess, attempt = 0): Promise<void> {
  if (attempt >= 60) throw new Error(`Timed out waiting for ${baseUrl}`)

  if (child.exitCode !== null) {
    throw new Error(`Next.js exited before the ATS check (code ${child.exitCode})`)
  }

  try {
    const response = await fetch(`${baseUrl}/en/resume`)
    if (response.ok) return
  } catch {
    // The production server is still starting.
  }

  return new Promise((resolve) => setTimeout(resolve, 500)).then(() =>
    waitForServer(child, attempt + 1)
  )
}

async function validateResume(resume: ResumeFixture, directory: string): Promise<void> {
  const response = await fetch(`${baseUrl}/${resume.locale}/cv`)

  if (!response.ok) {
    throw new Error(`${resume.locale}: CV endpoint returned HTTP ${response.status}`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/pdf')) {
    throw new Error(`${resume.locale}: expected a PDF, received "${contentType}"`)
  }

  const pdf = Buffer.from(await response.arrayBuffer())
  const path = join(directory, resume.fileName)
  writeFileSync(path, pdf)

  const pages = getPageCount(path)
  if (pages !== 1) throw new Error(`${resume.locale}: expected 1 page, found ${pages}`)

  const extracted = normalized(extractPdfText(path))
  if (extracted.includes('\uFFFD')) {
    throw new Error(`${resume.locale}: extracted text contains invalid characters`)
  }

  for (const value of [...resume.identity, ...resume.content]) {
    assertIncludes(extracted, value, resume.locale)
  }
  assertReadingOrder(extracted, resume.sections, resume.locale)

  const nameIndex = extracted.indexOf(resume.identity[0])
  const firstSectionIndex = extracted.indexOf(resume.sections[0])
  if (nameIndex === -1 || nameIndex > firstSectionIndex) {
    throw new Error(`${resume.locale}: candidate identity is not first in reading order`)
  }

  console.log(
    `✓ ${resume.locale.toUpperCase()}: 1 page, selectable text, contact fields, content, and section order passed`
  )
}

requireGhostscript()

const directory = mkdtempSync(join(tmpdir(), 'portfolio-cv-ats-'))
const server = configuredBaseUrl
  ? null
  : spawn(
      process.execPath,
      [
        'node_modules/next/dist/bin/next',
        'start',
        '--hostname',
        '127.0.0.1',
        '--port',
        port
      ],
      { stdio: 'ignore' }
    )

try {
  if (server) await waitForServer(server)
  await Promise.all(resumes.map((resume) => validateResume(resume, directory)))
  console.log('ATS simulation passed for both CVs.')
} finally {
  server?.kill('SIGTERM')
  rmSync(directory, { recursive: true, force: true })
}
