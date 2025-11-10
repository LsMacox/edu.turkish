import prismaPkg from '@prisma/client'
import { seedFAQs } from './faqs'
import { seedFaqCategories } from './faq-categories'
import { seedLocations } from './locations'
import { seedReviews } from './reviews'
import { seedBlog } from './blog'
import { seedStudyDirections } from './study-directions'
import { seedServices } from './services'
const { PrismaClient } = prismaPkg as any

const prisma = new PrismaClient()

// Определение сидеров с их зависимостями и таблицами для очистки
interface Seeder {
  name: string
  description: string
  tables: string[] // Таблицы для очистки (в порядке зависимостей)
  dependencies?: string[] // Другие сидеры, которые должны быть запущены перед этим
  run: (prisma: any, context?: any) => Promise<any>
}

const seeders: Record<string, Seeder> = {
  locations: {
    name: 'locations',
    description: 'Страны и города',
    tables: ['cityTranslation', 'city', 'countryTranslation', 'country'],
    run: async (prisma) => await seedLocations(prisma),
  },
  'study-directions': {
    name: 'study-directions',
    description: 'Направления обучения',
    tables: ['studyDirectionTranslation', 'studyDirection'],
    run: async (prisma) => await seedStudyDirections(prisma),
  },
  reviews: {
    name: 'reviews',
    description: 'Отзывы университетов',
    tables: ['universityReviewTranslation', 'universityReview'],
    run: async (prisma) => await seedReviews(prisma),
  },
  'faq-categories': {
    name: 'faq-categories',
    description: 'Категории FAQ',
    tables: ['faqCategoryTranslation', 'faqCategory'],
    run: async (prisma) => await seedFaqCategories(prisma),
  },
  faqs: {
    name: 'faqs',
    description: 'FAQ вопросы',
    tables: ['faqTranslation', 'faq'],
    dependencies: ['faq-categories'],
    run: async (prisma, context) => await seedFAQs(prisma, context.faqCategoryMap),
  },
  blog: {
    name: 'blog',
    description: 'Блог статьи и категории',
    tables: ['blogArticleTranslation', 'blogArticle', 'blogCategoryTranslation', 'blogCategory'],
    run: async (prisma) => await seedBlog(prisma),
  },
  services: {
    name: 'services',
    description: 'Сервисы и подсервисы',
    tables: [
      'serviceCategory',
      'serviceCategoryTranslation',
      'subService',
      'subServiceTranslation',
    ],
    run: async (prisma) => await seedServices(prisma),
  },
}

async function clearTables(tables: string[]) {
  if (tables.length === 0) return

  console.log(`🧹 Clearing tables: ${tables.join(', ')}...`)

  const deleteOperations = tables.map((table) => {
    return (prisma as any)[table].deleteMany()
  })

  await prisma.$transaction(deleteOperations)
  console.log('✅ Tables cleared')
}

function resolveDependencies(selectedSeeders: string[]): string[] {
  const resolved = new Set<string>()
  const queue = [...selectedSeeders]

  while (queue.length > 0) {
    const current = queue.shift()!
    if (resolved.has(current)) continue

    const seeder = seeders[current]
    if (!seeder) {
      console.warn(`⚠️  Seeder "${current}" not found, skipping...`)
      continue
    }

    // Добавляем зависимости в очередь
    if (seeder.dependencies) {
      for (const dep of seeder.dependencies) {
        if (!resolved.has(dep)) {
          queue.unshift(dep) // Добавляем в начало для обработки первыми
        }
      }
    }

    resolved.add(current)
  }

  // Сортируем с учетом зависимостей
  const sorted: string[] = []
  const visited = new Set<string>()

  function visit(name: string) {
    if (visited.has(name)) return
    visited.add(name)

    const seeder = seeders[name]
    if (seeder?.dependencies) {
      for (const dep of seeder.dependencies) {
        if (resolved.has(dep)) {
          visit(dep)
        }
      }
    }

    sorted.push(name)
  }

  for (const name of resolved) {
    visit(name)
  }

  return sorted
}

async function main() {
  // Парсинг аргументов командной строки
  const args = process.argv.slice(2)
  let selectedSeeders: string[]

  if (args.length === 0 || args.includes('--all')) {
    // Запуск всех сидеров
    selectedSeeders = Object.keys(seeders)
    console.log('🌱 Starting full database seeding...')
  } else if (args.includes('--help') || args.includes('-h')) {
    // Показать справку
    console.log('\n📖 Использование: pnpm db:seed [options] [seeders...]\n')
    console.log('Опции:')
    console.log('  --all, -a          Запустить все сидеры (по умолчанию)')
    console.log('  --help, -h         Показать эту справку\n')
    console.log('Доступные сидеры:')
    for (const [key, seeder] of Object.entries(seeders)) {
      const deps = seeder.dependencies ? ` (зависит от: ${seeder.dependencies.join(', ')})` : ''
      console.log(`  ${key.padEnd(20)} ${seeder.description}${deps}`)
    }
    console.log('\nПримеры:')
    console.log('  pnpm db:seed --all              # Запустить все сидеры')
    console.log('  pnpm db:seed blog reviews       # Запустить только blog и reviews')
    console.log(
      '  pnpm db:seed faqs               # Запустить faqs (автоматически запустит faq-categories)\n',
    )
    process.exit(0)
  } else {
    // Запуск выбранных сидеров
    selectedSeeders = args.filter((arg) => !arg.startsWith('--'))
    console.log(`🌱 Starting selective database seeding: ${selectedSeeders.join(', ')}...`)
  }

  // Разрешаем зависимости
  const seedersToRun = resolveDependencies(selectedSeeders)

  if (seedersToRun.length === 0) {
    console.log('⚠️  No valid seeders selected')
    process.exit(0)
  }

  console.log(`\n📋 Seeders to run (in order): ${seedersToRun.join(' → ')}\n`)

  // Собираем все таблицы для очистки
  const tablesToClear = new Set<string>()
  for (const name of seedersToRun) {
    const seeder = seeders[name]
    if (!seeder) continue
    for (const table of seeder.tables) {
      tablesToClear.add(table)
    }
  }

  // Очищаем таблицы (в обратном порядке для соблюдения зависимостей)
  await clearTables(Array.from(tablesToClear).reverse())

  // Запускаем сидеры
  const context: any = {}
  for (const name of seedersToRun) {
    const seeder = seeders[name]
    if (!seeder) continue
    console.log(`\n${getEmoji(name)} Seeding ${seeder.description}...`)
    const result = await seeder.run(prisma, context)

    // Сохраняем результаты для зависимых сидеров
    if (name === 'faq-categories') {
      context.faqCategoryMap = result
    }
  }

  console.log('\n✅ Database seeding completed!')
}

function getEmoji(seederName: string): string {
  const emojiMap: Record<string, string> = {
    locations: '🗺️',
    'study-directions': '📚',
    reviews: '⭐',
    'faq-categories': '📂',
    faqs: '❓',
    blog: '📰',
    services: '🛠️',
  }
  return emojiMap[seederName] || '🌱'
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
