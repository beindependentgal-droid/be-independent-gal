import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const publicDir = path.resolve('./public/images')
const outDir = path.resolve('./public/images/optimized')

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const targets = [
  'hero-women.png',
  'sister.jpg',
  'mbl.jpg',
  'together.jpg',
  'we.jpg',
  'retr.jpg',
  'hero-women3.jpg',
  'posing.jpg'
]

async function optimize(file) {
  const input = path.join(publicDir, file)
  if (!fs.existsSync(input)) {
    console.warn('Missing', input)
    return
  }

  const name = path.parse(file).name

  const avifOut = path.join(outDir, `${name}.avif`)
  const webpOut = path.join(outDir, `${name}.webp`)

  try {
    await sharp(input)
      .avif({ quality: 60 })
      .toFile(avifOut)
    console.log('Wrote', avifOut)
  } catch (e) {
    console.error('AVIF failed for', file, e.message)
  }

  try {
    await sharp(input)
      .webp({ quality: 70 })
      .toFile(webpOut)
    console.log('Wrote', webpOut)
  } catch (e) {
    console.error('WebP failed for', file, e.message)
  }
}

async function run() {
  for (const f of targets) {
    // only process existing files
    try {
      await optimize(f)
    } catch (e) {
      console.error('Error optimizing', f, e)
    }
  }
  console.log('Done')
}

run()
