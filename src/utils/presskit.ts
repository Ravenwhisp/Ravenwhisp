import { readdirSync } from 'node:fs'
import { join } from 'node:path'

export interface PressKitAsset {
  fileName: string
  src: string
  title: string
}

const publicDir = join(process.cwd(), 'public')

function formatAssetTitle(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getPressKitAssets(folderName: string): PressKitAsset[] {
  const folderPath = join(publicDir, 'images', 'presskit', folderName)

  try {
    return readdirSync(folderPath)
      .filter(fileName => /\.(png|jpe?g|webp|svg)$/i.test(fileName))
      .sort((left, right) => left.localeCompare(right))
      .map(fileName => ({
        fileName,
        src: `/images/presskit/${folderName}/${fileName}`,
        title: formatAssetTitle(fileName)
      }))
  } catch {
    return []
  }
}
