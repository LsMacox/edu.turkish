import type { PrismaClient } from '@prisma/client'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { importUniversityFromJson } from './university-import'

const UNIVERSITIES_DIR = join(process.cwd(), 'prisma', 'seed', 'json', 'universities')

export async function seedUniversities(prisma: PrismaClient) {
  if (!existsSync(UNIVERSITIES_DIR)) {
    console.warn('⚠️ Universities seed directory not found:', UNIVERSITIES_DIR)
    return
  }

  const files = readdirSync(UNIVERSITIES_DIR).filter((f) => f.endsWith('.json')).sort()
  if (files.length === 0) {
    console.warn('⚠️ No university JSON files found in', UNIVERSITIES_DIR)
    return
  }

  console.log(`📚 Found ${files.length} university files to import`)

  let success = 0
  let failed = 0
  for (const file of files) {
    const fullPath = join(UNIVERSITIES_DIR, file)
    try {
      await importUniversityFromJson(prisma, fullPath, { upsertBy: 'slug' })
      success += 1
      console.log(`✅ Imported ${file}`)
    } catch (error) {
      failed += 1
      console.error(`❌ Failed to import ${file}:`, error)
    }
  }

  console.log(
    `\n🏁 Universities processed: ${success + failed} (ok=${success}, failed=${failed})`,
  )

  if (failed > 0) {
    throw new Error('Some university imports failed')
  }
}

