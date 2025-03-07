import fs from 'fs'
import { getPlaceholder } from './lib/get-placeholder.js'

import en from './i18n/locales/en/dictionary.json' with { type: 'json' }
import es from './i18n/locales/es/dictionary.json' with { type: 'json' }

export const dictionaries = {
  en,
  es
}

const handleImages = async (dictionary) => {
  if (Array.isArray(dictionary)) {
    return await Promise.all(dictionary.map(handleImages))
  } else if (typeof dictionary === 'object') {
    const { image, images, ...newDictionary } = dictionary
    for (let key in newDictionary) {
      newDictionary[key] = await handleImages(newDictionary[key])
    }

    if (image)
      if (image.ignorePlaceholder) {
        delete image.ignorePlaceholder
        newDictionary.image = image
      } else newDictionary.image = await getPlaceholder(image)
    if (images?.length > 0) {
      images[0] = await getPlaceholder(images[0])
      newDictionary.images = images
    }

    return newDictionary
  }

  return dictionary
}

const init = async () => {
  for (const locale in dictionaries) {
    const treatedDictionary = await handleImages(dictionaries[locale])
    fs.writeFile(
      `./i18n/locales/${locale}/transpiled-dictionary.json`,
      JSON.stringify(treatedDictionary, null, 2),
      (err) => {
        if (err) console.log(err)
      }
    )
  }
}

init()
