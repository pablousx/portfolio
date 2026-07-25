import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { format, type FormatConfig } from 'oxfmt'
import { getPlaceholder, type PlaceholderImage } from './lib/get-placeholder.ts'

const rootDirectory = path.dirname(fileURLToPath(import.meta.url))
const localesDirectory = path.join(rootDirectory, 'i18n', 'locales')
const formatterConfig = JSON.parse(
  await readFile(path.join(rootDirectory, '.oxfmtrc.json'), 'utf8')
) as FormatConfig & { $schema?: string }

delete formatterConfig.$schema
delete formatterConfig.ignorePatterns

type SourceImage = PlaceholderImage & { ignorePlaceholder?: boolean }

const handleImages = async (dictionary: unknown): Promise<unknown> => {
  if (Array.isArray(dictionary)) {
    return Promise.all(dictionary.map(handleImages))
  }

  if (dictionary !== null && typeof dictionary === 'object') {
    const { image, images, ...newDictionary } = dictionary as Record<string, unknown>
    const treatedEntries = await Promise.all(
      Object.entries(newDictionary).map(async ([key, value]) => [
        key,
        await handleImages(value)
      ])
    )
    const treatedDictionary = Object.fromEntries(treatedEntries)

    if (image) {
      const sourceImage = image as SourceImage
      if (sourceImage.ignorePlaceholder) {
        const imageWithoutFlag = { ...sourceImage }
        delete imageWithoutFlag.ignorePlaceholder
        treatedDictionary.image = imageWithoutFlag
      } else {
        treatedDictionary.image = await getPlaceholder(sourceImage)
      }
    }

    if (Array.isArray(images) && images.length > 0) {
      const [firstImage, ...remainingImages] = images
      treatedDictionary.images = [
        await getPlaceholder(firstImage as PlaceholderImage),
        ...remainingImages
      ]
    }

    return treatedDictionary
  }

  return dictionary
}

export const init = async () => {
  const localeEntries = await readdir(localesDirectory, { withFileTypes: true })
  const localeDirectories = localeEntries.filter((entry) => entry.isDirectory())

  await Promise.all(
    localeDirectories.map(async ({ name: locale }) => {
      const localeDirectory = path.join(localesDirectory, locale)
      const dictionary = JSON.parse(
        await readFile(path.join(localeDirectory, 'dictionary.json'), 'utf8')
      )
      const treatedDictionary = await handleImages(dictionary)
      const outputPath = path.join(localeDirectory, 'transpiled-dictionary.json')
      const { code: output, errors } = await format(
        outputPath,
        JSON.stringify(treatedDictionary),
        formatterConfig
      )

      if (errors.length > 0) {
        throw new AggregateError(errors, `Could not format ${outputPath}`)
      }

      await writeFile(outputPath, output)
    })
  )
}

const isDirectExecution =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href

if (isDirectExecution) {
  await init()
}
