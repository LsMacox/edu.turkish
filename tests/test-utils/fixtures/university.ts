import { Prisma } from '@prisma/client'

export interface UniversityFixture {
  id: number
  countryId: number | null
  cityId: number | null
  foundedYear: number | null
  type: string | null
  tuitionMin: Prisma.Decimal | null
  tuitionMax: Prisma.Decimal | null
  currency: string | null
  totalStudents: number | null
  internationalStudents: number | null
  rankingScore: number | null
  hasAccommodation: boolean
  hasScholarships: boolean
  heroImage: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
  translations: Array<{
    id: number
    universityId: number
    locale: string
    title: string
    description: string | null
    slug: string
    about: string | null
    keyInfoTexts: any
    createdAt: Date
    updatedAt: Date
  }>
}

const baseDate = new Date('2024-01-01T00:00:00.000Z')
let universityIdCounter = 1
let translationIdCounter = 1

export function createUniversity(overrides?: Partial<UniversityFixture>): UniversityFixture {
  const id = overrides?.id ?? universityIdCounter++

  const defaults: UniversityFixture = {
    id,
    countryId: 1,
    cityId: 1,
    foundedYear: 1950,
    type: 'public',
    tuitionMin: new Prisma.Decimal(3000),
    tuitionMax: new Prisma.Decimal(8000),
    currency: 'USD',
    totalStudents: 15000,
    internationalStudents: 2000,
    rankingScore: null,
    hasAccommodation: true,
    hasScholarships: true,
    heroImage: null,
    image: 'university.jpg',
    createdAt: baseDate,
    updatedAt: baseDate,
    translations: [
      {
        id: translationIdCounter++,
        universityId: id,
        locale: 'en',
        title: `University ${id}`,
        description: `Description for University ${id}`,
        slug: `university-${id}`,
        about: null,
        keyInfoTexts: {},
        createdAt: baseDate,
        updatedAt: baseDate,
      },
      {
        id: translationIdCounter++,
        universityId: id,
        locale: 'ru',
        title: `Университет ${id}`,
        description: `Описание Университета ${id}`,
        slug: `university-${id}`,
        about: null,
        keyInfoTexts: {},
        createdAt: baseDate,
        updatedAt: baseDate,
      },
      {
        id: translationIdCounter++,
        universityId: id,
        locale: 'kk',
        title: `Университет ${id}`,
        description: `Университет ${id} сипаттамасы`,
        slug: `university-${id}`,
        about: null,
        keyInfoTexts: {},
        createdAt: baseDate,
        updatedAt: baseDate,
      },
      {
        id: translationIdCounter++,
        universityId: id,
        locale: 'tr',
        title: `Üniversite ${id}`,
        description: `Üniversite ${id} açıklaması`,
        slug: `university-${id}`,
        about: null,
        keyInfoTexts: {},
        createdAt: baseDate,
        updatedAt: baseDate,
      },
    ],
  }

  return {
    ...defaults,
    ...overrides,
    translations: overrides?.translations || defaults.translations,
  }
}
