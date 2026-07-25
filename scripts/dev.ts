import { spawn } from 'node:child_process'
import { watch } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { init } from '../init.ts'

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const localesDirectory = path.join(rootDirectory, 'i18n', 'locales')
const require = createRequire(import.meta.url)
const nextBinary = require.resolve('next/dist/bin/next')

await init()

let regenerationTimer: ReturnType<typeof setTimeout> | undefined
let regeneration: Promise<void> = Promise.resolve()

const localeWatcher = watch(
  localesDirectory,
  { recursive: true },
  (_eventType, filename) => {
    if (!filename || path.basename(filename) !== 'dictionary.json') return

    clearTimeout(regenerationTimer)
    regenerationTimer = setTimeout(() => {
      regeneration = regeneration
        .then(init)
        .then(() => console.log('Regenerated locale dictionaries.'))
        .catch((error) =>
          console.error('Failed to regenerate locale dictionaries.', error)
        )
    }, 100)
  }
)

const next = spawn(process.execPath, [nextBinary, 'dev', ...process.argv.slice(2)], {
  cwd: rootDirectory,
  stdio: 'inherit'
})

const exitCode = await new Promise<number | null>((resolve, reject) => {
  next.once('error', reject)
  next.once('exit', resolve)
})

clearTimeout(regenerationTimer)
localeWatcher.close()
await regeneration
process.exitCode = exitCode ?? 0
