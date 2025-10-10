import type { PrismaClient, Prisma } from '@prisma/client'

type TranslationContent = {
  locale: string
  slug: string
  title: string
  excerpt: string
  readingTime: string
  heroKicker?: string
  heroSubtitle?: string
  heroLocation?: string
  imageAlt?: string
  heroImageAlt?: string
  seoDescription?: string
  quickFacts?: Array<{
    title: string
    value: string
    icon?: string
  }>
  highlights?: string[]
  tags?: string[]
  content: Prisma.JsonValue
}

type SeedArticle = {
  categoryCode: string
  isFeatured?: boolean
  publishedAt: string
  coverImage: string
  heroImage?: string
  readingTimeMinutes?: number
  translations: TranslationContent[]
}

const categories = [
  {
    code: 'visas',
    order: 1,
    translations: [{ locale: 'ru', title: 'Визы' }],
  },
  {
    code: 'applications',
    order: 2,
    translations: [{ locale: 'ru', title: 'Заявки' }],
  },
  {
    code: 'scholarships',
    order: 3,
    translations: [{ locale: 'ru', title: 'Стипендии' }],
  },
  {
    code: 'cost',
    order: 4,
    translations: [{ locale: 'ru', title: 'Стоимость' }],
  },
  {
    code: 'life',
    order: 5,
    translations: [{ locale: 'ru', title: 'Жизнь в Турции' }],
  },
  {
    code: 'exams',
    order: 6,
    translations: [{ locale: 'ru', title: 'Экзамены' }],
  },
]

const sharedImages = {
  visa: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/4d45d15c4c-2f7df3cd5c6d26f67f4d.png',
  exams:
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/e66dae170a-2ce9fb303ed0b339b596.png',
  applications:
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/0dd499ea10-24904ac07ef05238b5a7.png',
  scholarships:
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/e3901b0bf7-9a8ad8119465cdbbdbe0.png',
  cost: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/af90cf6ff7-bebc6b59bbc09cfdceda.png',
  life: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/87e795516e-e01ab643ecae05c53996.png',
  rankings:
    'https://storage.googleapis.com/uxpilot-auth.appspot.com/57489031df-a0c5d805a5c769e79e85.png',
}

const articles: SeedArticle[] = [
  {
    categoryCode: 'visas',
    isFeatured: true,
    publishedAt: '2025-01-15T08:00:00Z',
    coverImage: sharedImages.visa,
    heroImage: 'https://storage.googleapis.com/edu-turkish/article-hero-visa.jpg',
    readingTimeMinutes: 8,
    translations: [
      {
        locale: 'ru',
        slug: 'kak-poluchit-studencheskuyu-vizu-v-turtsiyu',
        title: 'Как получить студенческую визу в Турцию: пошаговый гайд',
        excerpt:
          'Разбираем, какие документы нужны для студенческой визы в Турцию, как записаться в консульство и что делать после прилёта.',
        readingTime: '8 мин чтения',
        heroKicker: 'Пошаговый план',
        heroSubtitle:
          'Полное руководство по оформлению студенческой визы: от первой записи в консульство до регистрации вида на жительство.',
        heroLocation: 'Турция',
        imageAlt: 'Папка с документами для студенческой визы и паспорт гражданина',
        heroImageAlt: 'Студент готовит документы для визового собеседования в консульстве',
        seoDescription:
          'Пошаговый гайд по оформлению студенческой визы в Турцию в 2025 году. Список документов, сроки, советы экспертов.',
        quickFacts: [
          {
            title: 'Тип визы',
            value: 'Öğrenci Vizesi (студенческая)',
            icon: 'mdi:passport',
          },
          {
            title: 'Срок рассмотрения',
            value: '4–6 недель',
            icon: 'mdi:calendar-clock',
          },
          {
            title: 'Госпошлина',
            value: '≈ 60 USD',
            icon: 'mdi:cash-multiple',
          },
        ],
        highlights: [
          'Подробный чек-лист документов перед подачей',
          'Пояснения к записи на приём в консульство',
          'Памятка действий после прилёта в Турцию',
        ],
        tags: ['виза', 'документы', 'Турция'],
        content: [
          { type: 'heading', level: 2, text: 'Основные этапы оформления' },
          {
            type: 'paragraph',
            text: 'Студенческая виза оформляется в консульстве Турции по месту проживания. Начните с онлайн-записи и подготовьте комплект документов: приглашение из университета, заполненную анкету, финансовые гарантии и медицинскую страховку.',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Запишитесь на подачу документов на сайте консульства и оплатите консульский сбор.',
              'Соберите пакет документов: приглашение, паспорт, фотографии, выписку из банка и страховку.',
              'После получения визы прилетайте в Турцию и в течение 30 дней подайте на вид на жительство.',
            ],
          },
          {
            type: 'quote',
            text: 'Лучше подготовить оригиналы и переводы заранее: консульство не принимает неполные пакеты документов.',
            author: 'Айнур Мурадова, визовый консультант',
          },
          {
            type: 'paragraph',
            text: 'После прилёта оформите налоговый номер и откройте банковский счёт. Эти документы понадобятся для аренды жилья и подачи на вид на жительство.',
          },
        ],
      },
    ],
  },
  {
    categoryCode: 'applications',
    publishedAt: '2025-01-12T08:00:00Z',
    coverImage: sharedImages.applications,
    heroImage: 'https://storage.googleapis.com/edu-turkish/article-hero-application.jpg',
    readingTimeMinutes: 7,
    translations: [
      {
        locale: 'ru',
        slug: 'check-list-dokumentov-dlya-podachi',
        title: 'Чек-лист документов для подачи в турецкий университет',
        excerpt:
          'Какие документы нужно подготовить к подаче, как заверить переводы и что проверить перед загрузкой анкеты.',
        readingTime: '7 мин чтения',
        heroKicker: 'Практика',
        heroSubtitle:
          'Пошаговый чек-лист, который помогает абитуриентам не забыть важные документы и отправить заявку без ошибок.',
        heroLocation: 'Онлайн-подача',
        imageAlt: 'Студентка проверяет список документов перед подачей заявки',
        heroImageAlt: 'Абитуриентка фотографирует документы перед загрузкой в систему',
        seoDescription:
          'Подробный чек-лист документов для поступления в турецкий университет. Какие справки нужны и как их подготовить.',
        quickFacts: [
          {
            title: 'Формат подачи',
            value: 'Онлайн-кабинет университета',
            icon: 'mdi:laptop-check',
          },
          {
            title: 'Переводы',
            value: 'Нотариально заверенные копии',
            icon: 'mdi:certificate-outline',
          },
          {
            title: 'Совет эксперта',
            value: 'Проверяйте сканы перед загрузкой',
            icon: 'mdi:magnify-scan',
          },
        ],
        highlights: [
          'Готовый чек-лист для заявок в университеты',
          'Рекомендации по именованию файлов и проверке сроков',
          'Напоминание о невозможности редактирования анкеты после отправки',
        ],
        tags: ['поступление', 'документы', 'чек-лист'],
        content: [
          { type: 'heading', level: 2, text: 'Перед началом' },
          {
            type: 'paragraph',
            text: 'Соберите базовый пакет: паспорт, аттестат или диплом, приложение к диплому, мотивационное письмо и рекомендательные письма. Все документы нужно перевести на английский или турецкий язык и заверить нотариально.',
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Отсканируйте документы в хорошем качестве (300 dpi и выше).',
              'Переименуйте файлы по шаблону: фамилия_тип_документа.pdf.',
              'Проверьте сроки действия паспорта — он должен быть валиден минимум 6 месяцев после начала обучения.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Перед отправкой заявки сделайте копию формы и проверьте заполнение полей. Многие университеты не позволяют редактировать данные после отправки.',
          },
        ],
      },
    ],
  },
  {
    categoryCode: 'scholarships',
    publishedAt: '2025-01-10T08:00:00Z',
    coverImage: sharedImages.scholarships,
    heroImage: 'https://storage.googleapis.com/edu-turkish/article-hero-scholarship.jpg',
    readingTimeMinutes: 9,
    translations: [
      {
        locale: 'ru',
        slug: 'kak-poluchit-stipendiyu-v-turtsii',
        title: 'Как получить стипендию 100% в Турции',
        excerpt:
          'Условия государственных и университетских программ, дедлайны и советы по мотивационным письмам.',
        readingTime: '9 мин чтения',
        heroKicker: 'Финансы',
        heroSubtitle:
          'Показываем, как выбрать подходящую стипендию и подготовить сильный пакет документов для комиссии.',
        heroLocation: 'Turkey Scholarships',
        imageAlt: 'Студенты получают стипендиальные сертификаты на сцене',
        heroImageAlt: 'Студент принимает поздравления после получения стипендии',
        seoDescription:
          'Руководство по получению полной стипендии в Турции. Советы для победителей программы Türkiye Bursları.',
        quickFacts: [
          {
            title: 'Основная программа',
            value: 'Türkiye Bursları',
            icon: 'mdi:school-outline',
          },
          {
            title: 'Конкурс',
            value: 'До 1 000 заявок на место',
            icon: 'mdi:account-group',
          },
          {
            title: 'Финансирование',
            value: 'Покрытие обучения и проживания',
            icon: 'mdi:hand-coin',
          },
        ],
        highlights: [
          'Описание государственных и университетских стипендий',
          'Советы по сильному мотивационному письму',
          'Напоминание следить за дедлайнами программ',
        ],
        tags: ['стипендии', 'финансы', 'советы'],
        content: [
          { type: 'heading', level: 2, text: 'Какие программы доступны' },
          {
            type: 'paragraph',
            text: 'В Турции есть государственные стипендии Türkiye Bursları и десятки внутренних программ университетов. Условия отличаются: где-то покрывают проживание, где-то только обучение.',
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Подайте заявку минимум на две программы — конкуренция высокая.',
              'Уделите внимание мотивационному письму: в нём должна читаться ваша связь с выбранной программой.',
              'Соберите рекомендации от преподавателей, которые знают вас лично.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Следите за дедлайнами: государственные программы закрываются в феврале, а университетские — в разное время. Заводите календарь напоминаний.',
          },
        ],
      },
    ],
  },
  {
    categoryCode: 'cost',
    publishedAt: '2025-01-08T08:00:00Z',
    coverImage: sharedImages.cost,
    heroImage: 'https://storage.googleapis.com/edu-turkish/article-hero-cost.jpg',
    readingTimeMinutes: 6,
    translations: [
      {
        locale: 'ru',
        slug: 'skolko-stoit-uchyoba-v-stambule',
        title: 'Сколько стоит учёба и жизнь в Стамбуле',
        excerpt:
          'Подсчитываем бюджет студента: проживание, транспорт, питание и скрытые расходы на обучение.',
        readingTime: '6 мин чтения',
        heroKicker: 'Финансы',
        heroSubtitle: 'Реальные цифры расходов студента в 2025 году и советы по экономии бюджета.',
        heroLocation: 'Стамбул',
        imageAlt: 'Турецкие лиры и калькулятор на столе студента',
        heroImageAlt: 'Студент планирует бюджет за ноутбуком в кафе',
        seoDescription:
          'Расчёт стоимости обучения и проживания в Стамбуле: жильё, транспорт, питание, страховка.',
        quickFacts: [
          {
            title: 'Обучение',
            value: '4 000–6 000 USD в год',
            icon: 'mdi:currency-usd',
          },
          {
            title: 'Проживание',
            value: 'Общежитие 150–250 USD/мес',
            icon: 'mdi:home-city-outline',
          },
          {
            title: 'Транспорт',
            value: 'Istanbulkart 25–30 USD/мес',
            icon: 'mdi:bus',
          },
        ],
        highlights: [
          'Расчёт бюджета на обучение и жизнь в Стамбуле',
          'Советы по экономии на транспорте и питании',
          'Напоминание заложить резерв на учебные материалы',
        ],
        tags: ['бюджет', 'Стамбул', 'стоимость'],
        content: [
          { type: 'heading', level: 2, text: 'Основные статьи расходов' },
          {
            type: 'paragraph',
            text: 'Средняя стоимость обучения в частных университетах — 4 000–6 000 USD в год. Общежитие стоит 150–250 USD в месяц, аренда квартиры — от 400 USD.',
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Транспорт с Istanbulkart: 25–30 USD в месяц при активном использовании.',
              'Питание в столовой университета — 3–4 USD за обед.',
              'Мобильная связь и интернет — около 12 USD в месяц.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Заложите резерв на учебные материалы и медицинскую страховку. Университеты часто предлагают льготные тарифы для студентов.',
          },
        ],
      },
    ],
  },
  {
    categoryCode: 'life',
    publishedAt: '2025-01-05T08:00:00Z',
    coverImage: sharedImages.life,
    heroImage: 'https://storage.googleapis.com/edu-turkish/article-hero-life.jpg',
    readingTimeMinutes: 8,
    translations: [
      {
        locale: 'ru',
        slug: 'kak-adaptiruytsya-k-zhizni-v-turtsii',
        title: 'Как адаптироваться к жизни в Турции',
        excerpt:
          'Советы по культурной адаптации, полезные привычки и места, которые стоит посетить в первые месяцы.',
        readingTime: '8 мин чтения',
        heroKicker: 'Студенческая жизнь',
        heroSubtitle:
          'Рассказываем, как выстроить быт, найти друзей и чувствовать себя уверенно в новой стране.',
        heroLocation: 'Стамбул, Анкара, Измир',
        imageAlt: 'Студенты гуляют по набережной Босфора вечером',
        heroImageAlt: 'Группа международных студентов обсуждает планы в кампусе',
        seoDescription:
          'Гид по адаптации к жизни в Турции: культура, язык, студенческие сообщества и полезные сервисы.',
        quickFacts: [
          {
            title: 'Первые шаги',
            value: 'Ориентация и Buddy-программы',
            icon: 'mdi:account-group-outline',
          },
          {
            title: 'Полезные сервисы',
            value: 'BiTaksi, Marti, Yemeksepeti',
            icon: 'mdi:cellphone-information',
          },
          {
            title: 'Главный совет',
            value: 'Спрашивайте помощь у старшекурсников',
            icon: 'mdi:chat-question',
          },
        ],
        highlights: [
          'План адаптации на первые недели обучения',
          'Рекомендации по изучению турецкого языка',
          'Список приложений для повседневных задач',
        ],
        tags: ['студенческая жизнь', 'адаптация', 'советы'],
        content: [
          { type: 'heading', level: 2, text: 'Первые недели' },
          {
            type: 'paragraph',
            text: 'Посетите ориентационные встречи, вступите в Telegram-чаты университета и найдите Buddy-программу. Это ускорит адаптацию и поможет найти друзей.',
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Начните изучать базовые фразы турецкого языка — местные это ценят.',
              'Исследуйте районы вокруг кампуса: выбирайте любимые кафе и места для учёбы.',
              'Используйте приложения BiTaksi, Marti и Yemeksepeti для повседневных задач.',
            ],
          },
          {
            type: 'quote',
            text: 'Самое важное — не бояться спрашивать совет у старшекурсников. Они всегда подскажут, где купить учебники и как оформить проездной.',
            author: 'Элиф Кая, координатор Buddy-программы',
          },
        ],
      },
    ],
  },
  {
    categoryCode: 'exams',
    publishedAt: '2024-12-28T08:00:00Z',
    coverImage: sharedImages.exams,
    heroImage: 'https://storage.googleapis.com/edu-turkish/article-hero-exam.jpg',
    readingTimeMinutes: 5,
    translations: [
      {
        locale: 'ru',
        slug: 'toefl-ili-ielts-dlya-turtsii',
        title: 'TOEFL или IELTS: что выбрать для Турции',
        excerpt:
          'Сравниваем требования университетов, уровни сложности экзаменов и сколько баллов нужно набрать.',
        readingTime: '5 мин чтения',
        heroKicker: 'Экзамены',
        heroSubtitle:
          'Разбираемся, какой экзамен выбрать в 2025 году и как подготовиться к каждому формату.',
        heroLocation: 'Online / Test center',
        imageAlt: 'Учебные материалы TOEFL и IELTS на столе студента',
        heroImageAlt: 'Студент готовится к международному языковому экзамену',
        seoDescription:
          'Сравнение TOEFL и IELTS для поступления в Турции. Минимальные баллы и советы по подготовке.',
        content: [
          { type: 'heading', level: 2, text: 'Что требуют университеты' },
          {
            type: 'paragraph',
            text: 'Большинство программ в Турции принимают оба экзамена. Для бакалавриата нужен минимум IELTS 6.0 или TOEFL iBT 72, для магистратуры — выше.',
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Выберите экзамен с форматом, который вам комфортнее: компьютерный TOEFL или бумажный IELTS.',
              'Проверьте срок действия сертификата — 2 года с даты сдачи.',
              'Используйте официальные пробные тесты для тренировки тайминга.',
            ],
          },
          {
            type: 'paragraph',
            text: 'Некоторые университеты принимают внутренние экзамены YÖS или SAT. Уточняйте требования на сайте факультета.',
          },
        ],
      },
    ],
  },
  {
    categoryCode: 'applications',
    publishedAt: '2024-12-20T08:00:00Z',
    coverImage: sharedImages.rankings,
    heroImage: 'https://storage.googleapis.com/edu-turkish/article-hero-deadlines.jpg',
    readingTimeMinutes: 4,
    translations: [
      {
        locale: 'ru',
        slug: 'kalendar-podachi-na-2025',
        title: 'Календарь подачи документов на 2025 год',
        excerpt:
          'Собрали основные дедлайны университетов и государственных стипендий на один семестр вперёд.',
        readingTime: '4 мин чтения',
        heroKicker: 'Дедлайны',
        heroSubtitle:
          'Университетские и стипендиальные дедлайны по месяцам, чтобы ничего не пропустить.',
        heroLocation: '2025/26 учебный год',
        imageAlt: 'Календарь с отмеченными датами подачи документов',
        heroImageAlt: 'Студент планирует дедлайны на планшете',
        seoDescription:
          'Основные дедлайны подачи документов в турецкие университеты и на стипендии в 2025 году.',
        quickFacts: [
          {
            title: 'Старт кампаний',
            value: 'Январь — Türkiye Bursları',
            icon: 'mdi:calendar-start',
          },
          {
            title: 'Пик дедлайнов',
            value: 'Март–апрель у частных вузов',
            icon: 'mdi:calendar-alert',
          },
          {
            title: 'Формат контроля',
            value: 'Личный календарь с напоминаниями',
            icon: 'mdi:calendar-check',
          },
        ],
        highlights: [
          'Хронология дедлайнов по месяцам',
          'Сравнение государственных и частных программ',
          'Совет подготовить документы заранее',
        ],
        tags: ['дедлайны', 'приём 2025', 'календарь'],
        content: [
          { type: 'heading', level: 2, text: 'Дедлайны по месяцам' },
          {
            type: 'paragraph',
            text: 'Январь — старт подачи Türkiye Bursları, март — дедлайны частных университетов, июнь — приём документов в государственные вузы. Планируйте подготовку заранее.',
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Январь–февраль: государственные стипендии и программы обмена.',
              'Март–апрель: большинство частных университетов закрывают набор.',
              'Май–июнь: приём документов в государственные университеты.',
            ],
          },
        ],
      },
    ],
  },
]

export async function seedBlog(prisma: PrismaClient) {
  console.log('📝 Seeding blog categories and articles...')

  // Clear existing blog data to ensure clean seeding
  await prisma.$transaction([
    prisma.blogArticleTranslation.deleteMany(),
    prisma.blogArticle.deleteMany(),
    prisma.blogCategoryTranslation.deleteMany(),
    prisma.blogCategory.deleteMany(),
  ])

  const categoryMap = new Map<string, number>()

  for (const category of categories) {
    const cat = await prisma.blogCategory.upsert({
      where: { code: category.code },
      update: { order: category.order },
      create: { code: category.code, order: category.order },
    })

    for (const trans of category.translations) {
      await prisma.blogCategoryTranslation.upsert({
        where: {
          categoryId_locale: {
            categoryId: cat.id,
            locale: trans.locale,
          },
        },
        update: { title: trans.title },
        create: {
          categoryId: cat.id,
          locale: trans.locale,
          title: trans.title,
        },
      })
    }

    categoryMap.set(category.code, cat.id)
  }
  await prisma.blogArticle.deleteMany({})
  for (const article of articles) {
    const categoryId = categoryMap.get(article.categoryCode)
    if (!categoryId) {
      console.warn(`⚠️ Category ${article.categoryCode} not found for blog article seed.`)
      continue
    }

    await prisma.blogArticle.create({
      data: {
        categoryId,
        status: 'published',
        isFeatured: article.isFeatured ?? false,
        publishedAt: new Date(article.publishedAt),
        coverImage: article.coverImage,
        heroImage: article.heroImage ?? article.coverImage,
        readingTimeMinutes: article.readingTimeMinutes ?? null,
        translations: {
          create: article.translations.map((translation) => ({
            locale: translation.locale,
            slug: translation.slug,
            title: translation.title,
            excerpt: translation.excerpt,
            content: translation.content as Prisma.InputJsonValue,
            readingTime: translation.readingTime,
            heroKicker: translation.heroKicker,
            heroSubtitle: translation.heroSubtitle,
            heroLocation: translation.heroLocation,
            imageAlt: translation.imageAlt,
            heroImageAlt: translation.heroImageAlt ?? translation.imageAlt,
            seoDescription: translation.seoDescription,
            quickFacts: translation.quickFacts
              ? (translation.quickFacts as Prisma.InputJsonValue)
              : undefined,
            highlights: translation.highlights
              ? (translation.highlights as Prisma.InputJsonValue)
              : undefined,
            tags: translation.tags
              ? (translation.tags as Prisma.InputJsonValue)
              : undefined,
          })),
        },
      },
    })
  }

  console.log('✅ Blog content seeded')
}
