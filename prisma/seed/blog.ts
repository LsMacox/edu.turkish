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
  exams:
    '36f63960-1f6d-41d0-9fde-02fc2df6c1f2.png',
  applications:
    '324bcce7-e79d-45f7-a633-b0e1a7eedbf6.png',
  scholarships:
    '3e53786b-5ff0-4804-9634-34f8962ffdcb.png',
  cost: '4ddc34d2-9398-4899-a8ba-f6a54900fdae.png',
  life: '1b6fcd79-1a7f-42a8-b66e-ae31a2501ced.png',
  rankings:
    'bdb607d2-5777-49ef-859f-04be43a14ea8.png',
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
        excerpt: 'Как легализовать свой диплом в Турции? Пошаговая инструкция по получению Denklik, список документов и сроки.',
        readingTime: '7 мин',
        heroKicker: 'ЛЕГАЛИЗАЦИЯ',
        heroSubtitle: 'Без этого документа ваш диплом — просто бумага. Узнайте, как получить признание образования за 4 шага.',
        heroLocation: 'Стамбул / Анкара',
        imageAlt: 'Студент с дипломом на фоне Босфора',
        heroImageAlt: 'Здание YÖK в Анкаре',
        quickFacts: [
          { title: 'Срок', value: '2-6 мес.' },
          { title: 'Пошлина', value: '~$50' },
          { title: 'Гарантия', value: '100%' },
          { title: 'Подача', value: 'Online' },
        ],
        seoDescription: 'Полная инструкция по получению Denklik (признание диплома) в Турции. Документы, сроки, стоимость и советы экспертов.',
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
              'Согласие на обработку данных (Rıza Beyanı)'
            ]
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
              '<b>Ожидание и получение</b><br>Отслеживайте статус онлайн. Готовый документ придет по почте или вы заберете его в E-Devlet.'
            ]
          },
          { type: 'heading', level: 2, text: 'Сложности и решения' },
          {
            type: 'paragraph',
            text: 'Самая частая проблема — несоответствие программ. Если YÖK решит, что ваша программа была "слабее" турецкой, вам могут назначить экзамен (Seviye Tespit Sınavı).',
          },
          {
            type: 'paragraph',
            text: '{{WIDGET:PRICE}} Мы поможем проверить ваш диплом заранее и оценить шансы на получение Denklik без экзаменов.'
          }
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
        excerpt: 'Полный гид по поступлению на медицинские факультеты Турции. Стоимость, экзамены и перспективы.',
        readingTime: '9 мин',
        heroKicker: 'МЕДИЦИНА',
        heroSubtitle: 'Обучение в клиниках с аккредитацией JCI, дипломы признаваемые в Европе и США. Ваш путь к карьере врача начинается здесь.',
        heroLocation: 'Стамбул / Анкара',
        imageAlt: 'Студенты-медики в современной лаборатории',
        heroImageAlt: 'Университетская клиника в Стамбуле',
        quickFacts: [
          { title: 'Срок', value: '6 лет', icon: 'mdi:calendar-clock' },
          { title: 'Язык', value: 'EN / TR', icon: 'mdi:translate' },
          { title: 'Практика', value: 'JCI', icon: 'mdi:hospital-building' },
          { title: 'Диплом', value: 'Global', icon: 'mdi:certificate' },
        ],
        seoDescription: 'Поступление на медицину в Турции. Стоимость обучения, необходимые экзамены (YÖS, SAT), лучшие университеты и перспективы трудоустройства.',
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
              '<b>Доступная цена:</b> В 2-3 раза дешевле, чем в Европе, при сопоставимом качестве.'
            ]
          },
          { type: 'heading', level: 2, text: 'Сколько стоит обучение?' },
          {
            type: 'paragraph',
            text: 'Медицина — самое дорогое и престижное направление. Но даже здесь есть варианты для разного бюджета.',
          },
          {
            type: 'paragraph',
            text: '{{WIDGET:PRICE}} Стоимость в частных вузах варьируется от $10,000 до $25,000 в год. В государственных — дешевле, но поступить сложнее.'
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
              '<b>Получение визы</b><br>После зачисления оформляется студенческая виза и ВНЖ.'
            ]
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
                answer: 'Не обязательно. Во многих частных вузах обучение идет полностью на английском языке. Но для общения с пациентами на старших курсах базовый турецкий всё же понадобится.'
              },
              {
                question: 'Признается ли диплом в Европе?',
                answer: 'Да, Турция входит в Болонский процесс. Дипломы аккредитованных вузов признаются в ЕС и США (после сдачи USMLE).'
              },
              {
                question: 'Сложно ли поступить?',
                answer: 'В государственные вузы — сложно (высокий конкурс). В частные — реально, если у вас хороший средний балл аттестата и есть бюджет на обучение.'
              }
            ]
          }
        ],
      },
    ],
  },
  // Program articles (isProgram: true)
  {
    categoryCode: 'medical',
    isProgram: true,
    publishedAt: '2025-03-01T08:00:00Z',
    coverImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    heroImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    readingTimeMinutes: 10,
    translations: [
      {
        locale: 'ru',
        slug: 'medicinskie-specialnosti',
        title: 'Медицинские специальности в Турции',
        excerpt: 'Полный обзор медицинских программ в турецких университетах: медицина, стоматология, фармация и сестринское дело.',
        readingTime: '10 мин чтения',
        heroKicker: 'Медицина',
        heroSubtitle: 'Станьте врачом с дипломом международного образца в одном из лучших медицинских вузов Турции.',
        heroLocation: 'Стамбул, Анкара',
        quickFacts: [
          { title: 'Срок обучения', value: '6 лет (медицина)', icon: 'mdi:calendar' },
          { title: 'Язык', value: 'Английский / Турецкий', icon: 'mdi:translate' },
          { title: 'Стоимость', value: 'от $8,000/год', icon: 'mdi:currency-usd' },
        ],
        tags: ['медицина', 'врач', 'стоматология'],
        content: [
          { type: 'heading', level: 2, text: 'Почему медицина в Турции?' },
          { type: 'paragraph', text: 'Турция — один из мировых лидеров в области медицинского туризма и образования. Университеты оснащены современными симуляционными центрами и клиниками.' },
          { type: 'heading', level: 2, text: 'Доступные программы' },
          { type: 'list', ordered: false, items: ['Общая медицина (6 лет)', 'Стоматология (5 лет)', 'Фармация (5 лет)', 'Сестринское дело (4 года)'] },
        ],
      },
    ],
  },
  {
    categoryCode: 'business',
    isProgram: true,
    publishedAt: '2025-03-02T08:00:00Z',
    coverImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    heroImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    readingTimeMinutes: 8,
    translations: [
      {
        locale: 'ru',
        slug: 'biznes-specialnosti',
        title: 'Бизнес специальности в Турции',
        excerpt: 'MBA, менеджмент, маркетинг, финансы и международный бизнес в ведущих бизнес-школах Турции.',
        readingTime: '8 мин чтения',
        heroKicker: 'Бизнес',
        heroSubtitle: 'Получите бизнес-образование международного уровня в динамичной экономике на стыке Европы и Азии.',
        heroLocation: 'Стамбул',
        quickFacts: [
          { title: 'Срок обучения', value: '4 года', icon: 'mdi:calendar' },
          { title: 'Язык', value: 'Английский', icon: 'mdi:translate' },
          { title: 'Стоимость', value: 'от $4,000/год', icon: 'mdi:currency-usd' },
        ],
        tags: ['бизнес', 'MBA', 'менеджмент'],
        content: [
          { type: 'heading', level: 2, text: 'Бизнес-образование в Турции' },
          { type: 'paragraph', text: 'Стамбул — крупнейший бизнес-хаб региона. Здесь расположены штаб-квартиры международных компаний и стартап-экосистема.' },
          { type: 'heading', level: 2, text: 'Популярные программы' },
          { type: 'list', ordered: false, items: ['Международный бизнес', 'Маркетинг', 'Финансы и банковское дело', 'Управление человеческими ресурсами'] },
        ],
      },
    ],
  },
  {
    categoryCode: 'engineering',
    isProgram: true,
    publishedAt: '2025-03-03T08:00:00Z',
    coverImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    heroImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    readingTimeMinutes: 9,
    translations: [
      {
        locale: 'ru',
        slug: 'inzhenernye-specialnosti',
        title: 'Инженерные специальности в Турции',
        excerpt: 'IT, машиностроение, электротехника, строительство и другие инженерные направления в технических вузах Турции.',
        readingTime: '9 мин чтения',
        heroKicker: 'Инженерия',
        heroSubtitle: 'Освойте востребованную инженерную профессию в стране с развитой промышленностью.',
        heroLocation: 'Стамбул, Анкара, Измир',
        quickFacts: [
          { title: 'Срок обучения', value: '4 года', icon: 'mdi:calendar' },
          { title: 'Язык', value: 'Английский / Турецкий', icon: 'mdi:translate' },
          { title: 'Стоимость', value: 'от $3,500/год', icon: 'mdi:currency-usd' },
        ],
        tags: ['инженерия', 'IT', 'программирование'],
        content: [
          { type: 'heading', level: 2, text: 'Инженерное образование' },
          { type: 'paragraph', text: 'Турецкие инженерные вузы сотрудничают с мировыми технологическими компаниями и предлагают современные лаборатории.' },
          { type: 'heading', level: 2, text: 'Направления' },
          { type: 'list', ordered: false, items: ['Компьютерные науки и IT', 'Машиностроение', 'Электротехника', 'Гражданское строительство', 'Промышленная инженерия'] },
        ],
      },
    ],
  },
  {
    categoryCode: 'social',
    isProgram: true,
    publishedAt: '2025-03-04T08:00:00Z',
    coverImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    heroImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    readingTimeMinutes: 7,
    translations: [
      {
        locale: 'ru',
        slug: 'socialnye-nauki',
        title: 'Социальные науки в Турции',
        excerpt: 'Психология, социология, политология, международные отношения и право в университетах Турции.',
        readingTime: '7 мин чтения',
        heroKicker: 'Социальные науки',
        heroSubtitle: 'Изучайте общество и человеческое поведение в многокультурной среде на перекрёстке цивилизаций.',
        heroLocation: 'Стамбул, Анкара',
        quickFacts: [
          { title: 'Срок обучения', value: '4 года', icon: 'mdi:calendar' },
          { title: 'Язык', value: 'Английский', icon: 'mdi:translate' },
          { title: 'Стоимость', value: 'от $3,000/год', icon: 'mdi:currency-usd' },
        ],
        tags: ['психология', 'социология', 'право'],
        content: [
          { type: 'heading', level: 2, text: 'Почему социальные науки в Турции?' },
          { type: 'paragraph', text: '{{WIDGET:GALLERY:{"title":"Недостатки образования в Нидерландах","images":[{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg"},{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg"},{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg"},{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg"},{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg"},{"url":"https://cdn.edu-turkish.com/43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg"}]}}}' },
          { type: 'paragraph', text: 'Уникальное географическое положение Турции на стыке Европы и Азии делает её идеальным местом для изучения международных отношений, культурологии и политических процессов. Здесь пересекаются различные культуры, религии и политические системы.' },
          { type: 'list', ordered: false, style: 'checklist', items: [
            '<b>Международное признание:</b> Дипломы турецких вузов признаются в Европе и СНГ.',
            '<b>Мультикультурная среда:</b> Студенты из 150+ стран мира.',
            '<b>Практика:</b> Стажировки в международных организациях и НКО.',
            '<b>Доступная цена:</b> От $3,000 в год за качественное образование.'
          ]},
          { type: 'heading', level: 2, text: 'Доступные программы' },
          { type: 'list', ordered: false, items: ['Психология', 'Социология', 'Политология', 'Международные отношения', 'Право', 'Государственное управление', 'Экономика'] },
          { type: 'heading', level: 2, text: 'Государственное управление' },
          { type: 'paragraph', text: '{{WIDGET:PROSCONS:{"title":"Специальность Государственное управление подойдёт если Вы:","pros":[{"title":"Увлечены государственной политикой","description":"Имеете большой интерес к работе на благо общества и улучшению социальных показателей."},{"title":"Обладаете аналитическим мышлением","description":"Преуспеваете в предметах, требующих аналитического и критического мышления."},{"title":"Ориентированы на детали","description":"Обращаете пристальное внимание на детали, что очень важно для разработки и реализации эффективной государственной политики."},{"title":"Любите решать проблемы","description":"Умеете находить решения сложных задач в области государственного управления."}],"cons":[{"title":"Бюрократия","description":"Работа в государственных структурах часто связана с медленными процессами и большим количеством документации."},{"title":"Политическое давление","description":"Решения могут зависеть от политической конъюнктуры, а не только от профессиональных соображений."},{"title":"Ограниченная гибкость","description":"Государственные структуры менее гибкие по сравнению с частным сектором."}]}}}' },
          { type: 'heading', level: 2, text: 'Что изучают студенты' },
          { type: 'paragraph', text: 'Студенты изучают основы государственного управления, публичную политику, административное право, экономику общественного сектора и методы анализа политических решений.' },
          { type: 'heading', level: 2, text: 'Карьерные перспективы' },
          { type: 'list', ordered: false, items: [
            'Государственная служба и дипломатия',
            'Международные организации (ООН, ОБСЕ, ЕС)',
            'Аналитические центры и think tanks',
            'HR и управление персоналом',
            'Юридические фирмы и консалтинг'
          ]},
          { type: 'heading', level: 2, text: 'Часто задаваемые вопросы' },
          { type: 'faq', items: [
            { question: 'Нужно ли знать турецкий язык?', answer: 'Нет, многие программы преподаются полностью на английском языке. Турецкий можно изучить параллельно на бесплатных курсах при университете.' },
            { question: 'Какие документы нужны для поступления?', answer: 'Аттестат/диплом, паспорт, мотивационное письмо. Для англоязычных программ — сертификат IELTS/TOEFL (от 5.5-6.0).' },
            { question: 'Есть ли стипендии?', answer: 'Да, доступны стипендии Türkiye Bursları (полное покрытие) и внутренние стипендии университетов (скидки 25-100%).' }
          ]},
        ],
      },
    ],
  },
  {
    categoryCode: 'creative',
    isProgram: true,
    publishedAt: '2025-03-05T08:00:00Z',
    coverImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    heroImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    readingTimeMinutes: 7,
    translations: [
      {
        locale: 'ru',
        slug: 'tvorcheskie-specialnosti',
        title: 'Творческие специальности в Турции',
        excerpt: 'Дизайн, архитектура, кино, музыка и изобразительное искусство в творческих вузах Турции.',
        readingTime: '7 мин чтения',
        heroKicker: 'Творчество',
        heroSubtitle: 'Развивайте свой талант в стране с богатым культурным наследием и современной арт-сценой.',
        heroLocation: 'Стамбул',
        quickFacts: [
          { title: 'Срок обучения', value: '4 года', icon: 'mdi:calendar' },
          { title: 'Язык', value: 'Английский / Турецкий', icon: 'mdi:translate' },
          { title: 'Стоимость', value: 'от $4,000/год', icon: 'mdi:currency-usd' },
        ],
        tags: ['дизайн', 'архитектура', 'искусство'],
        content: [
          { type: 'heading', level: 2, text: 'Творческое образование' },
          { type: 'paragraph', text: 'Стамбул — культурная столица региона с музеями мирового уровня, галереями и кинофестивалями.' },
          { type: 'heading', level: 2, text: 'Направления' },
          { type: 'list', ordered: false, items: ['Графический дизайн', 'Архитектура', 'Кино и телевидение', 'Музыка', 'Изобразительное искусство'] },
        ],
      },
    ],
  },
  {
    categoryCode: 'aviation',
    isProgram: true,
    publishedAt: '2025-03-06T08:00:00Z',
    coverImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    heroImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    readingTimeMinutes: 8,
    translations: [
      {
        locale: 'ru',
        slug: 'lyotnye-specialnosti',
        title: 'Лётные специальности в Турции',
        excerpt: 'Пилотирование, авиационный менеджмент и техническое обслуживание воздушных судов в авиационных академиях Турции.',
        readingTime: '8 мин чтения',
        heroKicker: 'Авиация',
        heroSubtitle: 'Станьте пилотом или авиационным специалистом в стране с одной из крупнейших авиакомпаний мира.',
        heroLocation: 'Стамбул',
        quickFacts: [
          { title: 'Срок обучения', value: '4 года', icon: 'mdi:calendar' },
          { title: 'Язык', value: 'Английский', icon: 'mdi:translate' },
          { title: 'Стоимость', value: 'от $15,000/год', icon: 'mdi:currency-usd' },
        ],
        tags: ['авиация', 'пилот', 'Turkish Airlines'],
        content: [
          { type: 'heading', level: 2, text: 'Авиационное образование' },
          { type: 'paragraph', text: 'Turkish Airlines — одна из крупнейших авиакомпаний мира, и Турция активно готовит кадры для авиационной отрасли.' },
          { type: 'heading', level: 2, text: 'Программы' },
          { type: 'list', ordered: false, items: ['Пилотирование (CPL/ATPL)', 'Авиационный менеджмент', 'Техническое обслуживание воздушных судов', 'Управление воздушным движением'] },
        ],
      },
    ],
  },
  {
    categoryCode: 'applied',
    isProgram: true,
    publishedAt: '2025-03-07T08:00:00Z',
    coverImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    heroImage: '43bc5d74-c679-4cd3-9336-a129fbb620e7.jpg',
    readingTimeMinutes: 7,
    translations: [
      {
        locale: 'ru',
        slug: 'prikladnye-specialnosti',
        title: 'Прикладные специальности в Турции',
        excerpt: 'Туризм, гастрономия, спортивный менеджмент и другие практико-ориентированные программы.',
        readingTime: '7 мин чтения',
        heroKicker: 'Прикладные науки',
        heroSubtitle: 'Получите практические навыки в быстрорастущих отраслях турецкой экономики.',
        heroLocation: 'Стамбул, Анталья',
        quickFacts: [
          { title: 'Срок обучения', value: '4 года', icon: 'mdi:calendar' },
          { title: 'Язык', value: 'Английский / Турецкий', icon: 'mdi:translate' },
          { title: 'Стоимость', value: 'от $3,000/год', icon: 'mdi:currency-usd' },
        ],
        tags: ['туризм', 'гастрономия', 'спорт'],
        content: [
          { type: 'heading', level: 2, text: 'Прикладное образование' },
          { type: 'paragraph', text: 'Турция — мировой лидер в туризме и гастрономии. Практико-ориентированные программы включают стажировки в отелях и ресторанах.' },
          { type: 'heading', level: 2, text: 'Направления' },
          { type: 'list', ordered: false, items: ['Туризм и гостиничный бизнес', 'Гастрономия и кулинарное искусство', 'Спортивный менеджмент', 'Физиотерапия и реабилитация'] },
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
      create: { code: category.code, order: category.order, isProgram: category.isProgram ?? false },
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
