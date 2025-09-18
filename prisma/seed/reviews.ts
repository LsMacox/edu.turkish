import type { PrismaClient, ReviewType } from '@prisma/client'

type SeedReview = {
  type: ReviewType
  rating: number
  year?: number
  name: string
  university: string
  quote: string
}

const studentReviews: SeedReview[] = [
  {
    type: 'student',
    rating: 5,
    year: 2024,
    name: 'Айгерим Нурланова',
    university: 'Istanbul University — Факультет медицины',
    quote:
      'Edu.turkish помогли подготовить документы и подать заявку в выбранные университеты. Уже на первом курсе получаю стипендию и учусь мечте вопреки страхам.'
  },
  {
    type: 'student',
    rating: 5,
    year: 2023,
    name: 'Арман Токтарбек',
    university: 'Middle East Technical University — Инженерия',
    quote:
      'Команда помогла с выбором программы, подготовкой к SAT и подачей документов. Без их поддержки не решился бы поступать в Турцию.'
  },
  {
    type: 'student',
    rating: 5,
    year: 2024,
    name: 'Динара Смагулова',
    university: 'Boğaziçi University — Бизнес-администрирование',
    quote:
      'Сопровождение на каждом шаге: от перевода документов до адаптации в кампусе. Сейчас учусь на английском и участвую в международных проектах.'
  }
]

const parentReviews: SeedReview[] = [
  {
    type: 'parent',
    rating: 5,
    year: 2024,
    name: 'Галина Петровна',
    university: 'Istanbul University',
    quote:
      'Специалисты Edu.turkish всегда были на связи, помогали дочери и нам разбираться с оформлением. Поступление прошло спокойно и без неожиданностей.'
  },
  {
    type: 'parent',
    rating: 5,
    year: 2023,
    name: 'Нуржан Токтарбеков',
    university: 'Middle East Technical University',
    quote:
      'Ценю прозрачность работы команды: мы знали о каждом этапе, все сроки соблюдались. Сын получил приглашение и стипендию.'
  },
  {
    type: 'parent',
    rating: 5,
    year: 2023,
    name: 'Алмагуль Смагулова',
    university: 'Boğaziçi University',
    quote:
      'У Edu.turkish человеческий подход. Помогли дочери с адаптацией и поддерживали нас даже после заселения в общежитие.'
  }
]

export async function seedReviews(prisma: PrismaClient) {
  const reviews = [...studentReviews, ...parentReviews]

  for (const review of reviews) {
    await prisma.review.create({
      data: {
        type: review.type,
        year: review.year,
        rating: review.rating,
        featured: true,
        translations: {
          create: {
            locale: 'ru',
            name: review.name,
            quote: review.quote,
            universityName: review.university
          }
        }
      }
    })
  }
}
