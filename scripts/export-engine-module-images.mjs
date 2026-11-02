import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const { ENGINE_MODULE_IMAGES } = await import('../src/utils/engine-module-images.ts')

const outPath = path.join(__dirname, '..', 'src', 'data', 'engine-module-images.json')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, `${JSON.stringify(ENGINE_MODULE_IMAGES, null, 2)}\n`, 'utf8')
console.log(`Wrote ${path.relative(path.join(__dirname, '..'), outPath)}`)
