import { readdirSync } from 'node:fs'
import { join } from 'node:path'

export interface PressKitAsset {
  fileName: string
  src: string
  title: string
  alt: string
}

const publicDir = join(process.cwd(), 'public')

function formatAssetTitle(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getLogoPackImageAlt(fileName: string): string {
  const normalized = fileName.toLowerCase()

  if (normalized.includes('transparent_black')) {
    return 'Black Ravenwhisp Studios logo on a transparent background'
  }

  if (normalized.includes('transparent') && !normalized.includes('black')) {
    return 'White Ravenwhisp Studios logo on a transparent background'
  }

  if (normalized.includes('_dark')) {
    return 'Ravenwhisp Studios logo on a dark background'
  }

  if (normalized.includes('_light')) {
    return 'Ravenwhisp Studios logo on a light background'
  }

  return formatAssetTitle(fileName)
}

function getPressKitImageAlt(folderName: string, fileName: string): string {
  if (fileName === 'placeholder.png') {
    return ''
  }

  if (folderName === 'logo-pack') {
    return getLogoPackImageAlt(fileName)
  }

  return ''
}

export function getPressKitAssets(folderName: string): PressKitAsset[] {
  const folderPath = join(publicDir, 'images', 'presskit', folderName)

  return readdirSync(folderPath)
    .filter(fileName => /\.(png|jpe?g|webp|svg)$/i.test(fileName))
    .sort((left, right) => left.localeCompare(right))
    .map(fileName => ({
      fileName,
      src: `/images/presskit/${folderName}/${fileName}`,
      title: formatAssetTitle(fileName),
      alt: getPressKitImageAlt(folderName, fileName)
    }))
}
