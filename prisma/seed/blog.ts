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
  tags?: string[]
  content: Prisma.JsonValue
}

type SeedArticle = {
  categoryCode: string
  isFeatured?: boolean
  isPowerPage?: boolean
  isProgram?: boolean
  publishedAt: string
  coverImage: string
  heroImage?: string
  readingTimeMinutes?: number
  translations: TranslationContent[]
}

type CategorySeed = {
  code: string
  order: number
  isProgram?: boolean
  translations: Array<{ locale: string; title: string }>
}

const categories: CategorySeed[] = [
  // Blog categories
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
  // Program categories (isProgram: true)
  {
    code: 'medical',
    order: 10,
    isProgram: true,
    translations: [
      { locale: 'ru', title: 'Медицинские специальности' },
      { locale: 'en', title: 'Medical Specialties' },
      { locale: 'kk', title: 'Медициналық мамандықтар' },
      { locale: 'tr', title: 'Tıp Bölümleri' },
    ],
  },
  {
    code: 'business',
    order: 11,
    isProgram: true,
    translations: [
      { locale: 'ru', title: 'Бизнес специальности' },
      { locale: 'en', title: 'Business Specialties' },
      { locale: 'kk', title: 'Бизнес мамандықтары' },
      { locale: 'tr', title: 'İşletme Bölümleri' },
    ],
  },
  {
    code: 'engineering',
    order: 12,
    isProgram: true,
    translations: [
      { locale: 'ru', title: 'Инженерные специальности' },
      { locale: 'en', title: 'Engineering Specialties' },
      { locale: 'kk', title: 'Инженерлік мамандықтар' },
      { locale: 'tr', title: 'Mühendislik Bölümleri' },
    ],
  },
  {
    code: 'social',
    order: 13,
    isProgram: true,
    translations: [
      { locale: 'ru', title: 'Социальные науки' },
      { locale: 'en', title: 'Social Sciences' },
      { locale: 'kk', title: 'Әлеуметтік ғылымдар' },
      { locale: 'tr', title: 'Sosyal Bilimler' },
    ],
  },
  {
    code: 'creative',
    order: 14,
    isProgram: true,
    translations: [
      { locale: 'ru', title: 'Творческие специальности' },
      { locale: 'en', title: 'Creative Specialties' },
      { locale: 'kk', title: 'Шығармашылық мамандықтар' },
      { locale: 'tr', title: 'Yaratıcı Bölümler' },
    ],
  },
  {
    code: 'aviation',
    order: 15,
    isProgram: true,
    translations: [
      { locale: 'ru', title: 'Лётные специальности' },
      { locale: 'en', title: 'Aviation Specialties' },
      { locale: 'kk', title: 'Ұшу мамандықтары' },
      { locale: 'tr', title: 'Havacılık Bölümleri' },
    ],
  },
  {
    code: 'applied',
    order: 16,
    isProgram: true,
    translations: [
      { locale: 'ru', title: 'Прикладные специальности' },
      { locale: 'en', title: 'Applied Specialties' },
      { locale: 'kk', title: 'Қолданбалы мамандықтар' },
      { locale: 'tr', title: 'Uygulamalı Bölümler' },
    ],
  },
]

const sharedImages = {
  visa: 'f5f5af68-1fa8-470f-b9db-12531649dc04.png',
  exams: '36f63960-1f6d-41d0-9fde-02fc2df6c1f2.png',
  applications: '324bcce7-e79d-45f7-a633-b0e1a7eedbf6.png',
  scholarships: '3e53786b-5ff0-4804-9634-34f8962ffdcb.png',
  cost: '4ddc34d2-9398-4899-a8ba-f6a54900fdae.png',
  life: '1b6fcd79-1a7f-42a8-b66e-ae31a2501ced.png',
  rankings: 'bdb607d2-5777-49ef-859f-04be43a14ea8.png',
}

const articles: SeedArticle[] = [
  {
    categoryCode: 'visas',
    isFeatured: true,
    publishedAt: '2025-01-15T08:00:00Z',
    coverImage: sharedImages.visa,
    heroImage: sharedImages.visa,
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
    heroImage: sharedImages.applications,
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
    heroImage: sharedImages.scholarships,
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
    heroImage: sharedImages.cost,
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
    heroImage: sharedImages.life,
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
    heroImage: sharedImages.exams,
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
    heroImage: sharedImages.rankings,
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
  {
    categoryCode: 'applications',
    isFeatured: false,
    isPowerPage: true,
    publishedAt: '2025-02-01T08:00:00Z',
    coverImage: '5892f78f-db3e-4316-b057-08656499e6c5.webp',
    heroImage: '5892f78f-db3e-4316-b057-08656499e6c5.webp',
    readingTimeMinutes: 5,
    translations: [
      {
        locale: 'ru',
        slug: 'postuplenie-bez-ent-2025',
        title: 'Как поступить в университеты Турции без ЕНТ в 2025 году? Гарантия зачисления.',
        excerpt:
          'Набрали мало баллов? Не прошли на грант? В Турции результаты ЕНТ не нужны. Мы зачислим вас официально по аттестату.',
        readingTime: '5 мин чтения',
        heroKicker: 'Поступление 2025',
        heroSubtitle:
          'Официальное зачисление в престижные вузы Стамбула без экзаменов. Только аттестат.',
        heroLocation: 'Стамбул, Турция',
        imageAlt: 'Студенты в кампусе турецкого университета',
        heroImageAlt: 'Счастливые студенты после зачисления',
        seoDescription:
          'Поступление в Турцию без ЕНТ и экзаменов. Гарантированное зачисление, цены от $2500, европейский диплом.',
        tags: ['без ЕНТ', 'поступление', 'Турция'],
        content: [
          {
            type: 'paragraph',
            text: 'Многие думают, что низкие баллы ЕНТ — это конец мечтам о высшем образовании. Но в Турции другая система. Здесь результаты ЕНТ не нужны для поступления в частные университеты.',
          },
          { type: 'heading', level: 2, text: 'Почему не нужен ЕНТ?' },
          {
            type: 'paragraph',
            text: 'Согласно закону YÖK (Совет по высшему образованию Турции), частные университеты имеют право принимать иностранных студентов на основе аттестата о среднем образовании. Это не "лазейка", а официальная государственная политика по привлечению международных талантов.',
          },
          { type: 'heading', level: 2, text: 'Цена вопроса' },
          {
            type: 'paragraph',
            text: 'Обучение в Турции сопоставимо по стоимости с платным отделением в Казахстане, но вы получаете диплом международного образца и жизнь в мегаполисе.',
          },
          {
            type: 'paragraph',
            text: '{{WIDGET:PRICE}} Стоимость обучения начинается от $2,500 в год. Это фиксированная цена для наших студентов.',
          },
          { type: 'heading', level: 2, text: 'Выберите свой университет' },
          {
            type: 'paragraph',
            text: 'Мы работаем с лучшими частными вузами Стамбула. Вот некоторые из них:',
          },
          { type: 'paragraph', text: '{{WIDGET:UNIVERSITIES}}' },
          {
            type: 'quote',
            text: 'Я боялся, что не сдам ЕНТ и останусь без диплома. А теперь я учусь на втором курсе в Стамбуле, и никто даже не спросил мои баллы.',
            author: 'Алихан, студент Medipol University',
          },
        ],
      },
    ],
  },
  {
    categoryCode: 'applications',
    isFeatured: false,
    isPowerPage: true,
    publishedAt: '2025-02-15T10:00:00Z',
    coverImage: '276feac7-1a8a-436c-94d5-527b601792a1.webp',
    heroImage: '276feac7-1a8a-436c-94d5-527b601792a1.webp',
    readingTimeMinutes: 7,
    translations: [
      {
        locale: 'ru',
        slug: 'priznanie-diploma-v-turcii-denklik-2025',
        title: 'Признание диплома в Турции (Denklik): Полный гайд 2025',
        excerpt:
          'Как легализовать свой диплом в Турции? Пошаговая инструкция по получению Denklik, список документов и сроки.',
        readingTime: '7 мин',
        heroKicker: 'ЛЕГАЛИЗАЦИЯ',
        heroSubtitle:
          'Без этого документа ваш диплом — просто бумага. Узнайте, как получить признание образования за 4 шага.',
        heroLocation: 'Стамбул / Анкара',
        imageAlt: 'Студент с дипломом на фоне Босфора',
        heroImageAlt: 'Здание YÖK в Анкаре',
        quickFacts: [
          { title: 'Срок', value: '2-6 мес.' },
          { title: 'Пошлина', value: '~$50' },
          { title: 'Гарантия', value: '100%' },
          { title: 'Подача', value: 'Online' },
        ],
        seoDescription:
          'Полная инструкция по получению Denklik (признание диплома) в Турции. Документы, сроки, стоимость и советы экспертов.',
        tags: ['Denklik', 'Признание диплома', 'Работа в Турции', 'Магистратура'],
        content: [
          {
            type: 'paragraph',
            text: 'Вы закончили университет на родине и мечтаете работать или продолжить обучение в Турции? Первое, с чем вы столкнетесь — это требование <b>Denklik</b>. Без него для турецкого государства вы — человек без высшего образования.',
          },
          { type: 'heading', level: 2, text: 'Что такое Denklik и кому он нужен?' },
          {
            type: 'paragraph',
            text: '<b>Denklik Belgesi</b> — это официальный документ, подтверждающий, что ваш зарубежный диплом эквивалентен турецкому. Его выдает YÖK (Совет по высшему образованию).',
          },
          {
            type: 'quote',
            text: 'Важно: Для поступления в магистратуру в частные вузы Denklik часто НЕ НУЖЕН. Достаточно простого признания (Okul Tanıma). Но для работы врачом, инженером или учителем он обязателен.',
            author: 'Эксперт Edu.Turkish',
          },
          { type: 'heading', level: 2, text: 'Необходимые документы' },
          {
            type: 'paragraph',
            text: 'Соберите этот пакет документов перед началом процесса. Ошибка в одной бумажке может затянуть процесс на месяцы.',
          },
          {
            type: 'list',
            ordered: false,
            style: 'checklist',
            items: [
              'Оригинал диплома + копия',
              'Приложение к диплому (транскрипт) с оценками',
              'Нотариальный перевод диплома и транскрипта на турецкий',
              'Копия паспорта (заверенная)',
              'Распечатанная анкета с сайта E-Devlet',
              'Согласие на обработку данных (Rıza Beyanı)',
            ],
          },
          { type: 'heading', level: 2, text: 'Процесс получения: Пошагово' },
          {
            type: 'paragraph',
            text: 'Процесс перешел в онлайн, но физическая подача документов все еще требуется на финальном этапе.',
          },
          {
            type: 'list',
            ordered: true,
            style: 'steps',
            items: [
              '<b>Онлайн-заявка</b><br>Зарегистрируйтесь на сайте E-Devlet или YÖK Sis. Загрузите сканы всех документов в PDF.',
              '<b>Запись на прием</b><br>После проверки заявки (1-2 недели) вам назначат дату для подачи оригиналов.',
              '<b>Подача документов</b><br>Лично привезите оригиналы в Анкару (YÖK) или сдайте в Турецкое консульство в вашей стране.',
              '<b>Ожидание и получение</b><br>Отслеживайте статус онлайн. Готовый документ придет по почте или вы заберете его в E-Devlet.',
            ],
          },
          { type: 'heading', level: 2, text: 'Сложности и решения' },
          {
            type: 'paragraph',
            text: 'Самая частая проблема — несоответствие программ. Если YÖK решит, что ваша программа была "слабее" турецкой, вам могут назначить экзамен (Seviye Tespit Sınavı).',
          },
          {
            type: 'paragraph',
            text: '{{WIDGET:PRICE}} Мы поможем проверить ваш диплом заранее и оценить шансы на получение Denklik без экзаменов.',
          },
        ],
      },
    ],
  },
  {
    categoryCode: 'applications',
    isFeatured: false,
    isPowerPage: true,
    publishedAt: '2025-02-20T10:00:00Z',
    coverImage: '4c4cae13-7cbd-43a6-8e26-b0dc588532bf.png',
    heroImage: '4c4cae13-7cbd-43a6-8e26-b0dc588532bf.png',
    readingTimeMinutes: 9,
    translations: [
      {
        locale: 'ru',
        slug: 'medicina-v-turcii-obuchenie-na-vracha',
        title: 'Медицина в Турции: Как стать врачом международного уровня',
        excerpt:
          'Полный гид по поступлению на медицинские факультеты Турции. Стоимость, экзамены и перспективы.',
        readingTime: '9 мин',
        heroKicker: 'МЕДИЦИНА',
        heroSubtitle:
          'Обучение в клиниках с аккредитацией JCI, дипломы признаваемые в Европе и США. Ваш путь к карьере врача начинается здесь.',
        heroLocation: 'Стамбул / Анкара',
        imageAlt: 'Студенты-медики в современной лаборатории',
        heroImageAlt: 'Университетская клиника в Стамбуле',
        quickFacts: [
          { title: 'Срок', value: '6 лет', icon: 'mdi:calendar-clock' },
          { title: 'Язык', value: 'EN / TR', icon: 'mdi:translate' },
          { title: 'Практика', value: 'JCI', icon: 'mdi:hospital-building' },
          { title: 'Диплом', value: 'Global', icon: 'mdi:certificate' },
        ],
        seoDescription:
          'Поступление на медицину в Турции. Стоимость обучения, необходимые экзамены (YÖS, SAT), лучшие университеты и перспективы трудоустройства.',
        tags: ['Медицина', 'Поступление', 'Врач', 'Стоматология'],
        content: [
          {
            type: 'paragraph',
            text: 'Турция — это не только туризм, но и передовая медицина. Страна занимает <b>второе место в мире</b> по количеству больниц с аккредитацией JCI (Gold Standard в медицине). Учиться здесь — значит работать на оборудовании, которое есть не во всех клиниках Европы.',
          },
          { type: 'heading', level: 2, text: 'Почему будущие врачи выбирают Турцию?' },
          {
            type: 'list',
            ordered: false,
            style: 'checklist',
            items: [
              '<b>Международное признание:</b> Дипломы котируются в Европе и дают право сдавать USMLE (США).',
              '<b>Практика с 1 курса:</b> Обучение проходит на базе огромных университетских госпиталей.',
              '<b>Оснащение:</b> Роботизированная хирургия Da Vinci, CyberKnife и современные лаборатории доступны студентам.',
              '<b>Доступная цена:</b> В 2-3 раза дешевле, чем в Европе, при сопоставимом качестве.',
            ],
          },
          { type: 'heading', level: 2, text: 'Сколько стоит обучение?' },
          {
            type: 'paragraph',
            text: 'Медицина — самое дорогое и престижное направление. Но даже здесь есть варианты для разного бюджета.',
          },
          {
            type: 'paragraph',
            text: '{{WIDGET:PRICE}} Стоимость в частных вузах варьируется от $10,000 до $25,000 в год. В государственных — дешевле, но поступить сложнее.',
          },
          { type: 'heading', level: 2, text: 'Путь поступления: Пошагово' },
          {
            type: 'paragraph',
            text: 'Конкурс на медицину всегда высокий. Готовиться нужно заранее.',
          },
          {
            type: 'list',
            ordered: true,
            style: 'steps',
            items: [
              '<b>Выбор языка</b><br>Решите, на каком языке учиться. Английский дороже и требует сертификат TOEFL/IELTS. Турецкий дешевле, но нужен TÖMER.',
              '<b>Сдача экзаменов</b><br>Для топ-вузов нужны высокие баллы: SAT (1200+) или TR-YÖS. В некоторые частные вузы можно поступить по аттестату (но средний балл должен быть >90%).',
              '<b>Подача документов</b><br>Сбор пакета документов, переводы, апостиль. Мы помогаем оформить всё без ошибок.',
              '<b>Получение визы</b><br>После зачисления оформляется студенческая виза и ВНЖ.',
            ],
          },
          { type: 'heading', level: 2, text: 'Где учиться?' },
          {
            type: 'paragraph',
            text: 'Мы рекомендуем университеты с сильной научно-технической базой и собственными клиниками:',
          },
          { type: 'paragraph', text: '{{WIDGET:UNIVERSITIES}}' },
          {
            type: 'quote',
            text: 'Учеба сложная, но невероятно интересная. На третьем курсе я уже ассистировал на операциях. В моей стране студенты видят пациентов только на 5 курсе.',
            author: 'Ахмет, студент Medipol University',
          },
          { type: 'heading', level: 2, text: 'Частые вопросы' },
          {
            type: 'faq',
            items: [
              {
                question: 'Нужно ли знать турецкий язык?',
                answer:
                  'Не обязательно. Во многих частных вузах обучение идет полностью на английском языке. Но для общения с пациентами на старших курсах базовый турецкий всё же понадобится.',
              },
              {
                question: 'Признается ли диплом в Европе?',
                answer:
                  'Да, Турция входит в Болонский процесс. Дипломы аккредитованных вузов признаются в ЕС и США (после сдачи USMLE).',
              },
              {
                question: 'Сложно ли поступить?',
                answer:
                  'В государственные вузы — сложно (высокий конкурс). В частные — реально, если у вас хороший средний балл аттестата и есть бюджет на обучение.',
              },
            ],
          },
        ],
      },
    ],
  },
  // Program articles (isProgram: true) - разнообразные статьи с полным форматированием
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. МЕДИЦИНСКИЕ СПЕЦИАЛЬНОСТИ
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryCode: 'medical',
    isProgram: true,
    publishedAt: '2025-03-01T08:00:00Z',
    coverImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    heroImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    readingTimeMinutes: 12,
    translations: [
      {
        locale: 'ru',
        slug: 'medicinskie-specialnosti',
        title: 'Медицинские специальности в Турции',
        excerpt:
          'Полный гид по медицинскому образованию: от поступления до карьеры врача с международным дипломом.',
        readingTime: '12 мин чтения',
        heroKicker: 'Медицина',
        heroSubtitle:
          'Станьте врачом с дипломом международного образца. Практика в клиниках с аккредитацией JCI с первого курса.',
        heroLocation: 'Стамбул, Анкара, Измир',
        quickFacts: [
          { title: 'Срок обучения', value: '6 лет', icon: 'mdi:calendar' },
          { title: 'Язык', value: 'EN / TR', icon: 'mdi:translate' },
          { title: 'Стоимость', value: 'от $8,000/год', icon: 'mdi:currency-usd' },
          { title: 'Аккредитация', value: 'JCI, WFME', icon: 'mdi:certificate' },
        ],
        tags: ['медицина', 'врач', 'стоматология', 'фармация', 'JCI'],
        content: [
          {
            type: 'paragraph',
            text: 'Турция входит в <b>топ-5 стран мира</b> по количеству больниц с аккредитацией JCI — золотым стандартом качества медицины. Студенты-медики здесь учатся на оборудовании, которое есть далеко не в каждой европейской клинике.',
          },
          {
            type: 'image',
            url: 'https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
            alt: 'Современная университетская клиника в Стамбуле',
            caption: 'Университетский госпиталь — один из крупнейших учебных медицинских центров',
            width: 'wide',
          },
          { type: 'heading', level: 2, text: 'Почему медицина в Турции?' },
          {
            type: 'list',
            ordered: false,
            style: 'checklist',
            items: [
              '<b>Международное признание:</b> Дипломы котируются в ЕС и дают право сдавать USMLE',
              '<b>Практика с 1 курса:</b> Обучение на базе госпиталей на 1000+ коек',
              '<b>Современное оснащение:</b> Da Vinci, CyberKnife, 3D-печать органов',
              '<b>Доступная цена:</b> В 2-3 раза дешевле Европы',
            ],
          },
          { type: 'divider' },
          { type: 'heading', level: 2, text: 'Доступные программы' },
          {
            type: 'list',
            ordered: false,
            items: [
              '<b>Общая медицина</b> — 6 лет',
              '<b>Стоматология</b> — 5 лет',
              '<b>Фармация</b> — 5 лет',
              '<b>Сестринское дело</b> — 4 года',
              '<b>Физиотерапия</b> — 4 года',
            ],
          },
          { type: 'heading', level: 2, text: 'Стоимость обучения' },
          {
            type: 'paragraph',
            text: '{{WIDGET:PRICE}} Частные вузы: $10,000–25,000/год. Государственные: $1,000–5,000/год.',
          },
          { type: 'heading', level: 2, text: 'Путь поступления' },
          {
            type: 'list',
            ordered: true,
            style: 'steps',
            items: [
              '<b>Выбор языка</b><br>Английский требует TOEFL/IELTS. Турецкий — TÖMER.',
              '<b>Экзамены</b><br>SAT (1200+) или TR-YÖS для топ-вузов.',
              '<b>Документы</b><br>Аттестат с апостилем, паспорт, мотивационное письмо.',
              '<b>Виза</b><br>Студенческая виза и ВНЖ на весь срок обучения.',
            ],
          },
          { type: 'heading', level: 2, text: 'Кому подойдёт?' },
          {
            type: 'paragraph',
            text: '{{WIDGET:PROSCONS:{"title":"Медицина в Турции для вас, если:","pros":[{"title":"Готовы к интенсивной учёбе","description":"6 лет с практикой в клиниках и ночными дежурствами."},{"title":"Хотите международную карьеру","description":"Диплом признаётся в ЕС, можно сдать USMLE."},{"title":"Цените практический опыт","description":"Работа с пациентами с первых курсов."}],"cons":[{"title":"Высокая нагрузка","description":"40+ часов учёбы в неделю."},{"title":"Длительное обучение","description":"6 лет + резидентура."}]}}',
          },
          { type: 'heading', level: 2, text: 'Где учиться?' },
          { type: 'paragraph', text: '{{WIDGET:UNIVERSITIES}}' },
          {
            type: 'quote',
            text: 'На третьем курсе я уже ассистировал на операциях с роботом Da Vinci. В моей стране студенты видят операционную только на 5-6 курсе.',
            author: 'Ахмет К., студент Medipol University',
          },
          { type: 'heading', level: 2, text: 'FAQ' },
          {
            type: 'faq',
            items: [
              {
                question: 'Признаётся ли диплом в России и СНГ?',
                answer: 'Да, после нострификации. Турция входит в Болонский процесс.',
              },
              {
                question: 'Какой уровень английского нужен?',
                answer: 'IELTS 6.0+ или TOEFL 80+.',
              },
              {
                question: 'Есть ли стипендии?',
                answer: 'Türkiye Bursları покрывает 100%. Также скидки 25-75% от университетов.',
              },
            ],
          },
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 2. БИЗНЕС СПЕЦИАЛЬНОСТИ
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryCode: 'business',
    isProgram: true,
    publishedAt: '2025-03-02T08:00:00Z',
    coverImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    heroImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    readingTimeMinutes: 10,
    translations: [
      {
        locale: 'ru',
        slug: 'biznes-specialnosti',
        title: 'Бизнес-образование в Турции',
        excerpt:
          'MBA, менеджмент, маркетинг и финансы в бизнес-школах на стыке Европы и Азии. Стажировки в Fortune 500.',
        readingTime: '10 мин чтения',
        heroKicker: 'Бизнес',
        heroSubtitle:
          'Стамбул — крупнейший бизнес-хаб региона с офисами Google, Microsoft и сотен международных компаний.',
        heroLocation: 'Стамбул',
        quickFacts: [
          { title: 'Срок обучения', value: '4 года', icon: 'mdi:calendar' },
          { title: 'Язык', value: '100% English', icon: 'mdi:translate' },
          { title: 'Стоимость', value: 'от $4,000/год', icon: 'mdi:currency-usd' },
          { title: 'Стажировки', value: 'Обязательные', icon: 'mdi:briefcase' },
        ],
        tags: ['бизнес', 'MBA', 'менеджмент', 'маркетинг', 'финансы'],
        content: [
          {
            type: 'paragraph',
            text: 'Стамбул — <b>экономический мост между Европой и Азией</b>. Здесь региональные офисы Google, Microsoft, Amazon и сотен международных компаний. Учиться бизнесу здесь — значит быть в центре событий.',
          },
          {
            type: 'image',
            url: 'https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
            alt: 'Бизнес-район Стамбула',
            caption: 'Деловой район Levent — финансовое сердце Турции',
            width: 'full',
          },
          { type: 'heading', level: 2, text: 'Почему бизнес в Турции?' },
          {
            type: 'list',
            ordered: false,
            style: 'checklist',
            items: [
              '<b>Стратегическое расположение:</b> Доступ к рынкам ЕС, СНГ и Ближнего Востока',
              '<b>Аккредитации:</b> AACSB, EQUIS, AMBA у ведущих школ',
              '<b>Обязательные стажировки:</b> Практика в компаниях входит в план',
              '<b>Нетворкинг:</b> Студенты из 100+ стран',
            ],
          },
          { type: 'divider' },
          { type: 'heading', level: 2, text: 'Популярные программы' },
          {
            type: 'list',
            ordered: false,
            items: [
              '<b>International Business</b> — международная торговля',
              '<b>Marketing</b> — цифровой и традиционный маркетинг',
              '<b>Finance & Banking</b> — финансы, инвестиции',
              '<b>Management</b> — стратегический менеджмент',
              '<b>Entrepreneurship</b> — стартапы и предпринимательство',
            ],
          },
          { type: 'heading', level: 2, text: 'Стоимость и окупаемость' },
          {
            type: 'paragraph',
            text: '{{WIDGET:PRICE}} Бизнес-программы: $4,000–15,000/год. Средняя зарплата выпускника: $25,000–40,000/год.',
          },
          { type: 'heading', level: 2, text: 'Подходит ли вам?' },
          {
            type: 'paragraph',
            text: '{{WIDGET:PROSCONS:{"title":"Бизнес-образование для вас, если:","pros":[{"title":"Амбициозны","description":"Готовы к конкуренции и международной карьере."},{"title":"Коммуникабельны","description":"Любите работать в команде и строить связи."},{"title":"Хотите свой бизнес","description":"Планируете запустить стартап."}],"cons":[{"title":"Высокая конкуренция","description":"Много выпускников, нужно выделяться."},{"title":"Требуется английский","description":"Все программы на английском, B2+."}]}}',
          },
          { type: 'heading', level: 2, text: 'Где учиться?' },
          { type: 'paragraph', text: '{{WIDGET:UNIVERSITIES}}' },
          {
            type: 'quote',
            text: 'После выпуска получил офферы от трёх компаний из Fortune 500. Нетворк за 4 года в Стамбуле бесценен.',
            author: 'Дмитрий С., выпускник Koç University',
          },
          { type: 'heading', level: 2, text: 'FAQ' },
          {
            type: 'faq',
            items: [
              {
                question: 'Нужен ли опыт работы?',
                answer: 'Для бакалавриата — нет. Для MBA — 2-3 года опыта.',
              },
              {
                question: 'Можно ли работать во время учёбы?',
                answer: 'Да, до 24 часов в неделю по студенческой визе.',
              },
            ],
          },
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 3. ИНЖЕНЕРНЫЕ СПЕЦИАЛЬНОСТИ
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryCode: 'engineering',
    isProgram: true,
    publishedAt: '2025-03-03T08:00:00Z',
    coverImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    heroImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    readingTimeMinutes: 11,
    translations: [
      {
        locale: 'ru',
        slug: 'inzhenernye-specialnosti',
        title: 'Инженерные специальности в Турции',
        excerpt:
          'IT, робототехника, машиностроение, электротехника. Лаборатории Industry 4.0 и партнёрства с tech-гигантами.',
        readingTime: '11 мин чтения',
        heroKicker: 'Инженерия',
        heroSubtitle:
          'Турция — промышленный гигант с развитым автопромом, авиастроением и IT-сектором.',
        heroLocation: 'Стамбул, Анкара, Измир',
        quickFacts: [
          { title: 'Срок обучения', value: '4 года', icon: 'mdi:calendar' },
          { title: 'Язык', value: 'EN / TR', icon: 'mdi:translate' },
          { title: 'Стоимость', value: 'от $3,500/год', icon: 'mdi:currency-usd' },
          { title: 'Лаборатории', value: 'Industry 4.0', icon: 'mdi:robot-industrial' },
        ],
        tags: ['инженерия', 'IT', 'программирование', 'робототехника', 'AI'],
        content: [
          {
            type: 'paragraph',
            text: 'Турция — <b>17-я экономика мира</b> с мощным промышленным сектором. Здесь производят автомобили (Ford, Toyota), самолёты (Turkish Aerospace), бытовую технику (Beko). Инженеры — на вес золота.',
          },
          {
            type: 'paragraph',
            text: '{{WIDGET:GALLERY:{"title":"Инженерные лаборатории","images":[{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg","caption":"Робототехника"},{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg","caption":"3D-печать"},{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg","caption":"IoT лаборатория"},{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg","caption":"AI центр"}]}}',
          },
          { type: 'heading', level: 2, text: 'Направления инженерии' },
          {
            type: 'list',
            ordered: false,
            items: [
              '<b>Computer Engineering</b> — разработка ПО, AI, машинное обучение',
              '<b>Software Engineering</b> — архитектура систем',
              '<b>Electrical & Electronics</b> — микроэлектроника, телеком',
              '<b>Mechanical Engineering</b> — машиностроение, автоматизация',
              '<b>Civil Engineering</b> — строительство, инфраструктура',
              '<b>Industrial Engineering</b> — оптимизация производства',
            ],
          },
          { type: 'divider' },
          { type: 'heading', level: 2, text: 'Почему инженерия в Турции?' },
          {
            type: 'list',
            ordered: false,
            style: 'checklist',
            items: [
              '<b>Современные лаборатории:</b> Industry 4.0, IoT, робототехника, 3D-печать',
              '<b>Партнёрства с индустрией:</b> Проекты с Boeing, Siemens, Microsoft',
              '<b>Высокий спрос:</b> Дефицит инженеров в Турции и регионе',
              '<b>Стартап-культура:</b> Технопарки при университетах',
            ],
          },
          { type: 'heading', level: 2, text: 'Computer Engineering — топ направление' },
          {
            type: 'paragraph',
            text: '{{WIDGET:PROSCONS:{"title":"IT подойдёт, если вы:","pros":[{"title":"Любите решать задачи","description":"Программирование — это логические головоломки."},{"title":"Интересуетесь технологиями","description":"Следите за AI, блокчейном, кибербезопасностью."},{"title":"Хотите высокую зарплату","description":"IT-специалисты — одни из самых высокооплачиваемых."}],"cons":[{"title":"Сидячая работа","description":"8+ часов за компьютером."},{"title":"Быстрое устаревание знаний","description":"Технологии меняются каждый год."}]}}',
          },
          { type: 'heading', level: 2, text: 'Стоимость обучения' },
          {
            type: 'paragraph',
            text: '{{WIDGET:PRICE}} Инженерные программы: $3,500–12,000/год в частных вузах.',
          },
          { type: 'heading', level: 2, text: 'Путь к карьере' },
          {
            type: 'list',
            ordered: true,
            style: 'steps',
            items: [
              '<b>Выбор специализации</b><br>Software, hardware или междисциплинарное направление.',
              '<b>Подготовка</b><br>Математика и физика — ключевые. SAT Math 600+ для топ-вузов.',
              '<b>Портфолио</b><br>Начните программировать до поступления — это плюс.',
              '<b>Стажировки</b><br>Со 2-3 курса ищите практику в tech-компаниях.',
            ],
          },
          { type: 'heading', level: 2, text: 'Где учиться?' },
          { type: 'paragraph', text: '{{WIDGET:UNIVERSITIES}}' },
          {
            type: 'quote',
            text: 'На втором курсе работал над проектом для Siemens через университетский технопарк. К выпуску — 3 стажировки и оффер от международной компании.',
            author: 'Алексей М., выпускник Bilkent University',
          },
          { type: 'heading', level: 2, text: 'FAQ' },
          {
            type: 'faq',
            items: [
              {
                question: 'Нужно ли уметь программировать до поступления?',
                answer: 'Не обязательно, но базовые знания Python или C++ дадут преимущество.',
              },
              {
                question: 'Какой язык обучения выбрать?',
                answer: 'Для IT — английский. Вся документация и сообщество на английском.',
              },
              {
                question: 'Можно ли работать удалённо после выпуска?',
                answer:
                  'Да, IT — идеальная сфера для удалёнки. Многие работают на международные компании.',
              },
            ],
          },
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 4. СОЦИАЛЬНЫЕ НАУКИ
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryCode: 'social',
    isProgram: true,
    publishedAt: '2025-03-04T08:00:00Z',
    coverImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    heroImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    readingTimeMinutes: 9,
    translations: [
      {
        locale: 'ru',
        slug: 'socialnye-nauki',
        title: 'Социальные науки в Турции',
        excerpt:
          'Психология, международные отношения, политология, право. Изучайте общество на перекрёстке цивилизаций.',
        readingTime: '9 мин чтения',
        heroKicker: 'Социальные науки',
        heroSubtitle:
          'Турция — уникальная лаборатория для изучения политики, культуры и международных отношений.',
        heroLocation: 'Стамбул, Анкара',
        quickFacts: [
          { title: 'Срок обучения', value: '4 года', icon: 'mdi:calendar' },
          { title: 'Язык', value: 'English', icon: 'mdi:translate' },
          { title: 'Стоимость', value: 'от $3,000/год', icon: 'mdi:currency-usd' },
          { title: 'Стажировки', value: 'NGO, ООН', icon: 'mdi:earth' },
        ],
        tags: ['психология', 'политология', 'международные отношения', 'право'],
        content: [
          {
            type: 'paragraph',
            text: 'Турция — страна на <b>стыке Европы, Азии и Ближнего Востока</b>. Здесь пересекаются культуры, религии и политические системы. Идеальное место для изучения международных отношений и политологии.',
          },
          {
            type: 'image',
            url: 'https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
            alt: 'Студенты на лекции по международным отношениям',
            caption: 'Дискуссия на семинаре по ближневосточной политике',
            width: 'standard',
          },
          { type: 'heading', level: 2, text: 'Почему социальные науки в Турции?' },
          {
            type: 'list',
            ordered: false,
            style: 'checklist',
            items: [
              '<b>Живая лаборатория:</b> Изучайте миграцию, конфликты, демократизацию на реальных примерах',
              '<b>Мультикультурная среда:</b> Студенты из 150+ стран с разным бэкграундом',
              '<b>Доступ к организациям:</b> Стажировки в ООН, ОБСЕ, международных NGO',
              '<b>Исследовательские центры:</b> Ведущие think tanks по Ближнему Востоку',
            ],
          },
          { type: 'divider' },
          { type: 'heading', level: 2, text: 'Доступные программы' },
          {
            type: 'list',
            ordered: false,
            items: [
              '<b>Psychology</b> — клиническая, организационная, детская',
              '<b>International Relations</b> — дипломатия, геополитика',
              '<b>Political Science</b> — политические системы, выборы',
              '<b>Sociology</b> — социальные структуры, миграция',
              '<b>Law</b> — международное, коммерческое право',
              '<b>Economics</b> — макро/микроэкономика',
            ],
          },
          { type: 'heading', level: 2, text: 'Психология — популярное направление' },
          {
            type: 'paragraph',
            text: '{{WIDGET:PROSCONS:{"title":"Психология подойдёт, если вы:","pros":[{"title":"Интересуетесь людьми","description":"Хотите понять, почему люди думают и ведут себя определённым образом."},{"title":"Эмпатичны","description":"Умеете слушать и сопереживать, хотите помогать."},{"title":"Любите исследования","description":"Готовы проводить эксперименты и анализировать данные."}],"cons":[{"title":"Долгий путь к практике","description":"Для работы психологом нужна магистратура + сертификация."},{"title":"Эмоциональная нагрузка","description":"Работа с чужими проблемами может быть тяжёлой."}]}}',
          },
          { type: 'spacer', size: 'md' },
          { type: 'heading', level: 2, text: 'Стоимость обучения' },
          {
            type: 'paragraph',
            text: '{{WIDGET:PRICE}} Социальные науки — одно из самых доступных направлений: $3,000–8,000/год.',
          },
          { type: 'heading', level: 2, text: 'Карьерные перспективы' },
          {
            type: 'list',
            ordered: false,
            items: [
              '<b>Дипломатия:</b> МИД, посольства, международные организации',
              '<b>Консалтинг:</b> Политический, стратегический, HR',
              '<b>NGO сектор:</b> Гуманитарные организации, правозащита',
              '<b>Медиа:</b> Аналитика, журналистика, PR',
              '<b>Академия:</b> Исследования, преподавание',
            ],
          },
          { type: 'heading', level: 2, text: 'Где учиться?' },
          { type: 'paragraph', text: '{{WIDGET:UNIVERSITIES}}' },
          {
            type: 'quote',
            text: 'Стажировка в офисе ООН в Стамбуле открыла мне двери в международную карьеру. Такие возможности есть только здесь.',
            author: 'Мария Л., выпускница Sabancı University',
          },
          { type: 'heading', level: 2, text: 'FAQ' },
          {
            type: 'faq',
            items: [
              {
                question: 'Нужно ли знать турецкий язык?',
                answer:
                  'Нет, многие программы полностью на английском. Турецкий можно изучить бесплатно при университете.',
              },
              {
                question: 'Какие документы нужны?',
                answer: 'Аттестат/диплом, паспорт, мотивационное письмо. IELTS/TOEFL от 5.5-6.0.',
              },
              {
                question: 'Есть ли стипендии?',
                answer: 'Türkiye Bursları (100%) и внутренние стипендии университетов (25-100%).',
              },
            ],
          },
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 5. ТВОРЧЕСКИЕ СПЕЦИАЛЬНОСТИ
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryCode: 'creative',
    isProgram: true,
    publishedAt: '2025-03-05T08:00:00Z',
    coverImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    heroImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    readingTimeMinutes: 8,
    translations: [
      {
        locale: 'ru',
        slug: 'tvorcheskie-specialnosti',
        title: 'Творческие специальности в Турции',
        excerpt:
          'Дизайн, архитектура, кино, музыка. Развивайте талант в стране с богатым культурным наследием.',
        readingTime: '8 мин чтения',
        heroKicker: 'Творчество',
        heroSubtitle:
          'Стамбул — культурная столица региона с музеями мирового уровня, галереями и кинофестивалями.',
        heroLocation: 'Стамбул',
        quickFacts: [
          { title: 'Срок обучения', value: '4-5 лет', icon: 'mdi:calendar' },
          { title: 'Язык', value: 'EN / TR', icon: 'mdi:translate' },
          { title: 'Стоимость', value: 'от $4,000/год', icon: 'mdi:currency-usd' },
          { title: 'Портфолио', value: 'Требуется', icon: 'mdi:palette' },
        ],
        tags: ['дизайн', 'архитектура', 'кино', 'музыка', 'искусство'],
        content: [
          {
            type: 'paragraph',
            text: 'Стамбул — <b>культурный перекрёсток мира</b>. Здесь византийское наследие встречается с современным искусством, а традиционные ремёсла — с цифровым дизайном. Идеальное место для творческого развития.',
          },
          {
            type: 'paragraph',
            text: '{{WIDGET:GALLERY:{"title":"Творческие пространства Стамбула","images":[{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg","caption":"Istanbul Modern"},{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg","caption":"Дизайн-студия"},{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg","caption":"Архитектурная мастерская"},{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg","caption":"Киностудия"}]}}',
          },
          { type: 'heading', level: 2, text: 'Направления' },
          {
            type: 'list',
            ordered: false,
            items: [
              '<b>Graphic Design</b> — визуальные коммуникации, брендинг',
              '<b>Architecture</b> — 5 лет, аккредитация UIA',
              '<b>Film & TV</b> — режиссура, операторское мастерство',
              '<b>Music</b> — исполнительство, композиция, продюсирование',
              '<b>Fine Arts</b> — живопись, скульптура, инсталляции',
              '<b>Fashion Design</b> — мода и текстиль',
            ],
          },
          { type: 'divider' },
          { type: 'heading', level: 2, text: 'Почему творчество в Турции?' },
          {
            type: 'list',
            ordered: false,
            style: 'checklist',
            items: [
              '<b>Культурное разнообразие:</b> Вдохновение от Востока и Запада',
              '<b>Современные студии:</b> Оборудование для кино, музыки, дизайна',
              '<b>Арт-сцена:</b> Биеннале, фестивали, галереи мирового уровня',
              '<b>Доступная жизнь:</b> Дешевле Европы при высоком качестве',
            ],
          },
          { type: 'heading', level: 2, text: 'Архитектура — особое направление' },
          {
            type: 'paragraph',
            text: '{{WIDGET:PROSCONS:{"title":"Архитектура подойдёт, если вы:","pros":[{"title":"Визуально мыслите","description":"Легко представляете пространства и формы в 3D."},{"title":"Любите и технику, и искусство","description":"Архитектура — на стыке инженерии и дизайна."},{"title":"Терпеливы","description":"Проекты требуют месяцев работы."}],"cons":[{"title":"Долгое обучение","description":"5 лет бакалавриата + практика для лицензии."},{"title":"Высокая нагрузка","description":"Ночные макеты и дедлайны — норма."}]}}',
          },
          { type: 'heading', level: 2, text: 'Стоимость обучения' },
          {
            type: 'paragraph',
            text: '{{WIDGET:PRICE}} Творческие программы: $4,000–12,000/год. Архитектура дороже из-за 5-летнего срока.',
          },
          { type: 'heading', level: 2, text: 'Где учиться?' },
          { type: 'paragraph', text: '{{WIDGET:UNIVERSITIES}}' },
          {
            type: 'quote',
            text: 'Мой дипломный фильм показали на Стамбульском кинофестивале. В Европе такие возможности для студентов — редкость.',
            author: 'Анна К., выпускница Kadir Has University',
          },
          { type: 'heading', level: 2, text: 'FAQ' },
          {
            type: 'faq',
            items: [
              {
                question: 'Нужно ли портфолио для поступления?',
                answer: 'Да, для большинства творческих программ требуется портфолио работ.',
              },
              {
                question: 'Признаётся ли диплом архитектора?',
                answer:
                  'Да, программы аккредитованы UIA. Нужна нострификация для работы в других странах.',
              },
            ],
          },
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 6. ЛЁТНЫЕ СПЕЦИАЛЬНОСТИ
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryCode: 'aviation',
    isProgram: true,
    publishedAt: '2025-03-06T08:00:00Z',
    coverImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    heroImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    readingTimeMinutes: 10,
    translations: [
      {
        locale: 'ru',
        slug: 'lyotnye-specialnosti',
        title: 'Лётные специальности в Турции',
        excerpt:
          'Станьте пилотом или авиационным инженером. Turkish Airlines — партнёр ведущих авиационных академий.',
        readingTime: '10 мин чтения',
        heroKicker: 'Авиация',
        heroSubtitle:
          'Turkish Airlines летает в 340+ направлений. Турция готовит пилотов для одной из крупнейших авиакомпаний мира.',
        heroLocation: 'Стамбул',
        quickFacts: [
          { title: 'Срок обучения', value: '4 года', icon: 'mdi:calendar' },
          { title: 'Язык', value: '100% English', icon: 'mdi:translate' },
          { title: 'Стоимость', value: 'от $15,000/год', icon: 'mdi:currency-usd' },
          { title: 'Лицензия', value: 'EASA/FAA', icon: 'mdi:airplane' },
        ],
        tags: ['авиация', 'пилот', 'Turkish Airlines', 'EASA', 'авиаинженер'],
        content: [
          {
            type: 'paragraph',
            text: 'Turkish Airlines — <b>авиакомпания №1 в Европе</b> по количеству направлений. Новый аэропорт Стамбула — крупнейший хаб региона. Турция активно инвестирует в подготовку авиационных кадров.',
          },
          {
            type: 'image',
            url: 'https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
            alt: 'Тренажёр Boeing 737 в авиационной академии',
            caption: 'Симулятор полного движения — студенты тренируются на реальном оборудовании',
            width: 'wide',
          },
          { type: 'heading', level: 2, text: 'Программы' },
          {
            type: 'list',
            ordered: false,
            items: [
              '<b>Pilotage (CPL/ATPL)</b> — коммерческий и линейный пилот',
              '<b>Aviation Management</b> — управление авиакомпаниями и аэропортами',
              '<b>Aircraft Maintenance</b> — техническое обслуживание (EASA Part-66)',
              '<b>Air Traffic Control</b> — управление воздушным движением',
              '<b>Cabin Crew</b> — бортпроводники',
            ],
          },
          { type: 'divider' },
          { type: 'heading', level: 2, text: 'Почему авиация в Турции?' },
          {
            type: 'list',
            ordered: false,
            style: 'checklist',
            items: [
              '<b>Партнёрство с Turkish Airlines:</b> Стажировки и трудоустройство',
              '<b>Современные тренажёры:</b> Симуляторы Boeing и Airbus',
              '<b>Международные лицензии:</b> EASA, FAA — работа по всему миру',
              '<b>Хорошая погода:</b> 300+ лётных дней в году',
            ],
          },
          { type: 'heading', level: 2, text: 'Путь к лицензии пилота' },
          {
            type: 'list',
            ordered: true,
            style: 'steps',
            items: [
              '<b>Медкомиссия</b><br>Класс 1 — строгие требования к здоровью и зрению.',
              '<b>Теоретический курс</b><br>14 предметов: навигация, метеорология, аэродинамика...',
              '<b>Лётная практика</b><br>200+ часов налёта для CPL, 1500+ для ATPL.',
              '<b>Type Rating</b><br>Допуск на конкретный тип самолёта (Boeing 737, Airbus A320).',
            ],
          },
          { type: 'heading', level: 2, text: 'Подходит ли вам?' },
          {
            type: 'paragraph',
            text: '{{WIDGET:PROSCONS:{"title":"Карьера пилота для вас, если:","pros":[{"title":"Мечтаете о небе","description":"Авиация — это призвание, а не просто работа."},{"title":"Стрессоустойчивы","description":"Способны принимать решения в критических ситуациях."},{"title":"Здоровы","description":"Отличное зрение, слух, нет хронических заболеваний."}],"cons":[{"title":"Высокая стоимость","description":"Обучение на пилота — одно из самых дорогих."},{"title":"Нестабильный график","description":"Ночные рейсы, смена часовых поясов."},{"title":"Строгие требования","description":"Регулярные медкомиссии и проверки."}]}}',
          },
          { type: 'heading', level: 2, text: 'Стоимость обучения' },
          {
            type: 'paragraph',
            text: '{{WIDGET:PRICE}} Пилотаж: $60,000–100,000 за весь курс (включая налёт). Авиаменеджмент: $15,000–25,000/год.',
          },
          { type: 'heading', level: 2, text: 'Где учиться?' },
          { type: 'paragraph', text: '{{WIDGET:UNIVERSITIES}}' },
          {
            type: 'quote',
            text: 'После выпуска сразу получил оффер от Turkish Airlines. Качество подготовки здесь не уступает европейским академиям, а стоимость значительно ниже.',
            author: 'Сергей В., пилот Boeing 737, выпускник Özyeğin University',
          },
          { type: 'heading', level: 2, text: 'FAQ' },
          {
            type: 'faq',
            items: [
              {
                question: 'Какие требования к здоровью?',
                answer:
                  'Медкомиссия Class 1: зрение, слух, сердечно-сосудистая система. Детали — в EASA Part-MED.',
              },
              {
                question: 'Можно ли работать в Европе с турецкой лицензией?',
                answer: 'Да, лицензии EASA признаются во всех странах ЕС без конвертации.',
              },
              {
                question: 'Сколько зарабатывают пилоты?',
                answer:
                  'Начинающий пилот: $30,000–50,000/год. Капитан на дальних рейсах: $100,000+.',
              },
            ],
          },
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // 7. ПРИКЛАДНЫЕ СПЕЦИАЛЬНОСТИ
  // ═══════════════════════════════════════════════════════════════════════════
  {
    categoryCode: 'applied',
    isProgram: true,
    publishedAt: '2025-03-07T08:00:00Z',
    coverImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    heroImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    readingTimeMinutes: 9,
    translations: [
      {
        locale: 'ru',
        slug: 'prikladnye-specialnosti',
        title: 'Прикладные специальности в Турции',
        excerpt:
          'Туризм, гастрономия, спорт, физиотерапия. Практика в 5-звёздочных отелях и ресторанах с первого курса.',
        readingTime: '9 мин чтения',
        heroKicker: 'Прикладные науки',
        heroSubtitle:
          'Турция — топ-6 в мире по туризму. Практико-ориентированные программы с гарантированными стажировками.',
        heroLocation: 'Стамбул, Анталья, Бодрум',
        quickFacts: [
          { title: 'Срок обучения', value: '4 года', icon: 'mdi:calendar' },
          { title: 'Язык', value: 'EN / TR', icon: 'mdi:translate' },
          { title: 'Стоимость', value: 'от $3,000/год', icon: 'mdi:currency-usd' },
          { title: 'Практика', value: '50% учёбы', icon: 'mdi:briefcase-check' },
        ],
        tags: ['туризм', 'гастрономия', 'спорт', 'физиотерапия', 'отельный бизнес'],
        content: [
          {
            type: 'paragraph',
            text: 'Турция — <b>6-я страна в мире по туризму</b> (50+ млн туристов в год). Здесь тысячи 5-звёздочных отелей, ресторанов мирового уровня и спортивных объектов. Идеальное место для практико-ориентированного образования.',
          },
          {
            type: 'paragraph',
            text: '{{WIDGET:GALLERY:{"title":"Места практики студентов","images":[{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg","caption":"5-звёздочный отель"},{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg","caption":"Ресторан высокой кухни"},{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg","caption":"Спортивный комплекс"},{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg","caption":"Реабилитационный центр"}]}}',
          },
          { type: 'heading', level: 2, text: 'Направления' },
          {
            type: 'list',
            ordered: false,
            items: [
              '<b>Tourism & Hotel Management</b> — управление отелями и турфирмами',
              '<b>Gastronomy & Culinary Arts</b> — шеф-повар, ресторатор',
              '<b>Sports Management</b> — спортивный менеджмент и маркетинг',
              '<b>Physiotherapy</b> — физиотерапия и реабилитация',
              '<b>Nutrition & Dietetics</b> — диетология',
              '<b>Recreation Management</b> — организация досуга',
            ],
          },
          { type: 'divider' },
          { type: 'heading', level: 2, text: 'Почему прикладные науки в Турции?' },
          {
            type: 'list',
            ordered: false,
            style: 'checklist',
            items: [
              '<b>Практика с 1 курса:</b> 50% учебного времени — стажировки',
              '<b>Партнёрства с индустрией:</b> Marriott, Hilton, Four Seasons',
              '<b>Реальный опыт:</b> Работа с гостями и клиентами',
              '<b>Трудоустройство:</b> 90%+ выпускников находят работу за 3 месяца',
            ],
          },
          { type: 'heading', level: 2, text: 'Гастрономия — популярное направление' },
          {
            type: 'paragraph',
            text: '{{WIDGET:PROSCONS:{"title":"Гастрономия подойдёт, если вы:","pros":[{"title":"Любите готовить","description":"Кулинария — ваша страсть, а не просто хобби."},{"title":"Креативны","description":"Любите экспериментировать с вкусами и подачей."},{"title":"Стрессоустойчивы","description":"Кухня — это темп и давление."}],"cons":[{"title":"Физически тяжело","description":"Работа на ногах 10-12 часов."},{"title":"Нестандартный график","description":"Вечера, выходные, праздники — рабочие дни."},{"title":"Долгий карьерный путь","description":"От помощника до шеф-повара — годы практики."}]}}',
          },
          { type: 'heading', level: 2, text: 'Стоимость обучения' },
          {
            type: 'paragraph',
            text: '{{WIDGET:PRICE}} Прикладные программы — одни из самых доступных: $3,000–8,000/год. Гастрономия чуть дороже из-за расходных материалов.',
          },
          { type: 'heading', level: 2, text: 'Карьерные перспективы' },
          {
            type: 'list',
            ordered: false,
            items: [
              '<b>Отельный бизнес:</b> Менеджер отеля, директор по продажам',
              '<b>Рестораны:</b> Шеф-повар, ресторатор, сомелье',
              '<b>Спорт:</b> Менеджер клуба, спортивный агент, тренер',
              '<b>Здоровье:</b> Физиотерапевт, диетолог, wellness-консультант',
              '<b>Свой бизнес:</b> Ресторан, турагентство, фитнес-студия',
            ],
          },
          { type: 'heading', level: 2, text: 'Где учиться?' },
          { type: 'paragraph', text: '{{WIDGET:UNIVERSITIES}}' },
          {
            type: 'quote',
            text: 'На втором курсе стажировался в Four Seasons Bosphorus. После выпуска получил оффер от них же. Практика решает всё.',
            author: 'Тимур А., менеджер ресторана, выпускник Bilgi University',
          },
          { type: 'heading', level: 2, text: 'FAQ' },
          {
            type: 'faq',
            items: [
              {
                question: 'Оплачиваются ли стажировки?',
                answer:
                  'Часто да. Многие отели и рестораны платят стажёрам минимальную зарплату + питание + проживание.',
              },
              {
                question: 'Можно ли работать за границей?',
                answer:
                  'Да, международные сети (Marriott, Hilton) часто предлагают позиции в других странах.',
              },
              {
                question: 'Нужен ли турецкий язык?',
                answer:
                  'Для работы в Турции — желателен. Для международной карьеры — достаточно английского.',
              },
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
      update: { order: category.order, isProgram: category.isProgram ?? false },
      create: {
        code: category.code,
        order: category.order,
        isProgram: category.isProgram ?? false,
      },
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
        isPowerPage: article.isPowerPage ?? false,
        isProgram: article.isProgram ?? false,
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
            tags: translation.tags ? (translation.tags as Prisma.InputJsonValue) : undefined,
          })),
        },
      },
    })
  }

  console.log('✅ Blog content seeded')
}
