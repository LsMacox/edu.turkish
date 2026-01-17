import type { PrismaClient, ReviewType, MediaReviewType } from '@prisma/client'

type SeedReview = {
  type: ReviewType
  mediaType?: MediaReviewType
  rating: number
  year?: number
  name: string
  university: string
  quote: string
  avatar?: string
  videoId?: string
  imageUrl?: string
}

const studentReviews: SeedReview[] = [
  {
    type: 'student',
    mediaType: 'video',
    rating: 5,
    year: 2025,
    name: 'Видео отзыв 1',
    university: '',
    quote: 'Видео отзыв',
    videoId: '0ed050a4-d589-4af8-b882-6748c3a2b80f',
  },
  {
    type: 'student',
    mediaType: 'video',
    rating: 5,
    year: 2025,
    name: 'Видео отзыв 2',
    university: '',
    quote: 'Видео отзыв',
    videoId: '4f62966b-40da-4a85-b71d-0b3fac9ae77d',
    imageUrl: 'https://vz-dee97b03-acb.b-cdn.net/4f62966b-40da-4a85-b71d-0b3fac9ae77d/thumbnail_9f300296.jpg',
  },
  {
    type: 'student',
    mediaType: 'video',
    rating: 5,
    year: 2025,
    name: 'Видео отзыв 3',
    university: '',
    quote: 'Видео отзыв',
    videoId: 'ad839010-8dd8-44e3-8433-816904d16751',
  },
  {
    type: 'student',
    mediaType: 'video',
    rating: 5,
    year: 2025,
    name: 'Видео отзыв 4',
    university: '',
    quote: 'Видео отзыв',
    videoId: 'fdcdeff1-8e0a-460c-b3a7-b01620f55e27',
  },
  {
    type: 'student',
    mediaType: 'video',
    rating: 5,
    year: 2025,
    name: 'Видео отзыв 5',
    university: '',
    quote: 'Видео отзыв',
    videoId: '347c379e-28f1-43e4-b940-b98d216bf0dc',
  },
  {
    type: 'student',
    mediaType: 'video',
    rating: 5,
    year: 2025,
    name: 'Видео отзыв 6',
    university: '',
    quote: 'Видео отзыв',
    videoId: '03bdec63-89b0-4331-b092-86f4caaa41bf',
  },
  {
    type: 'student',
    mediaType: 'video',
    rating: 5,
    year: 2025,
    name: 'Видео отзыв 7',
    university: '',
    quote: 'Видео отзыв',
    videoId: 'e8711bd8-de8e-4878-9073-a88bebb0bd9f',
  },
]

const parentReviews: SeedReview[] = []

export async function seedReviews(prisma: PrismaClient) {
  const reviews = [...studentReviews, ...parentReviews]

  for (const review of reviews) {
    const mediaType = review.mediaType || 'text'

    await prisma.universityReview.create({
      data: {
        type: review.type,
        mediaType,
        year: review.year,
        rating: review.rating,
        featured: true,
        avatar: review.avatar,
        videoId: review.videoId,
        imageUrl: review.imageUrl,
        translations: {
          create: {
            locale: 'ru',
            name: review.name,
            quote: review.quote,
            universityName: review.university,
          },
        },
      },
    })
  }
}
