const baseDate = new Date('2024-01-01T00:00:00.000Z')
let reviewIdCounter = 1
let translationIdCounter = 1

export interface ReviewFixture {
  id: number
  universityId: number | null
  studentName: string
  rating: number
  featured: boolean
  image: string | null
  createdAt: Date
  updatedAt: Date
  translations: Array<{
    id: number
    reviewId: number
    locale: string
    text: string
    studyProgram: string | null
    createdAt: Date
    updatedAt: Date
  }>
}

export function createReview(overrides?: Partial<ReviewFixture>): ReviewFixture {
  const id = overrides?.id ?? reviewIdCounter++

  const defaults: ReviewFixture = {
    id,
    universityId: 1,
    studentName: `Student ${id}`,
    rating: 5,
    featured: false,
    image: null,
    createdAt: baseDate,
    updatedAt: baseDate,
    translations: [
      {
        id: translationIdCounter++,
        reviewId: id,
        locale: 'en',
        text: `Great university experience! Review ${id}`,
        studyProgram: 'Computer Science',
        createdAt: baseDate,
        updatedAt: baseDate,
      },
      {
        id: translationIdCounter++,
        reviewId: id,
        locale: 'ru',
        text: `Отличный университет! Отзыв ${id}`,
        studyProgram: 'Информатика',
        createdAt: baseDate,
        updatedAt: baseDate,
      },
      {
        id: translationIdCounter++,
        reviewId: id,
        locale: 'kk',
        text: `Керемет университет! Пікір ${id}`,
        studyProgram: 'Информатика',
        createdAt: baseDate,
        updatedAt: baseDate,
      },
      {
        id: translationIdCounter++,
        reviewId: id,
        locale: 'tr',
        text: `Harika üniversite deneyimi! İnceleme ${id}`,
        studyProgram: 'Bilgisayar Bilimi',
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
