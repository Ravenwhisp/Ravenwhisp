import engineModuleImages from '@/data/engine-module-images.json'

/** Image paths and alt text for engine module pages (used by MDX generator and Astro pages). */

export type EngineFigure = {
  src: string
  alt: string
  caption?: string
}

export type EngineModuleImages = {
  imageUrl?: string
  imageAlt?: string
  figures: EngineFigure[]
}

export const ENGINE_MODULE_IMAGES = engineModuleImages as Record<string, EngineModuleImages>

export function getEngineModuleImages(slug: string): EngineModuleImages | undefined {
  return ENGINE_MODULE_IMAGES[slug]
}
