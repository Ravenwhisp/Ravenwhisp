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

const BRIEFING_SLIDE_TITLES: Record<number, string> = {
  1: 'Title',
  2: 'Brief explanation',
  3: 'Logo',
  4: 'Color palette',
  5: 'Logo context',
  6: 'Typography',
  7: 'Motifs'
}

function getBriefingSlideNumber(fileName: string): number | undefined {
  const match = fileName.match(/Visual-Identity-(\d+)\./i)
  if (!match) return undefined
  return Number(match[1])
}

function getBriefingImageTitle(fileName: string): string {
  const slide = getBriefingSlideNumber(fileName)
  if (slide && BRIEFING_SLIDE_TITLES[slide]) {
    return BRIEFING_SLIDE_TITLES[slide]
  }

  return formatAssetTitle(fileName)
}

function getBriefingImageAlt(fileName: string): string {
  const slide = getBriefingSlideNumber(fileName)
  if (slide && BRIEFING_SLIDE_TITLES[slide]) {
    return `Ravenwhisp Studios visual identity briefing — ${BRIEFING_SLIDE_TITLES[slide]}`
  }

  return `Ravenwhisp Studios visual identity briefing — ${formatAssetTitle(fileName)}`
}

function getCollectionImageAlt(folderName: string, fileName: string): string {
  const label = formatAssetTitle(fileName)

  if (folderName === 'screenshots') {
    return `Bound By Death screenshot — ${label}`
  }

  if (folderName === 'key-art') {
    return `Bound By Death key art — ${label}`
  }

  if (folderName === 'studio-shots') {
    return `Ravenwhisp Studios — ${label}`
  }

  return label
}

function getPressKitImageAlt(folderName: string, fileName: string): string {
  if (fileName === 'placeholder.png') {
    return ''
  }

  if (folderName === 'logo-pack') {
    return getLogoPackImageAlt(fileName)
  }

  if (folderName === 'briefing') {
    return getBriefingImageAlt(fileName)
  }

  if (folderName === 'screenshots' || folderName === 'key-art' || folderName === 'studio-shots') {
    return getCollectionImageAlt(folderName, fileName)
  }

  return ''
}

export function getPressKitAssets(folderName: string): PressKitAsset[] {
  const folderPath = join(publicDir, 'images', 'presskit', folderName)

  const fileNames = readdirSync(folderPath)
    .filter(fileName => /\.(png|jpe?g|webp|svg)$/i.test(fileName))
    .filter(fileName => fileName !== 'placeholder.png')
    .sort((left, right) => {
      if (folderName === 'briefing') {
        return (getBriefingSlideNumber(left) ?? 0) - (getBriefingSlideNumber(right) ?? 0)
      }

      return left.localeCompare(right)
    })

  return fileNames.map(fileName => ({
    fileName,
    src: `/images/presskit/${folderName}/${fileName}`,
    title: folderName === 'briefing' ? getBriefingImageTitle(fileName) : formatAssetTitle(fileName),
    alt: getPressKitImageAlt(folderName, fileName)
  }))
}
