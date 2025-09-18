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
    translations: [
      { locale: 'ru', title: 'Визы' },
      { locale: 'en', title: 'Visas' }
    ]
  },
  {
    code: 'applications',
    order: 2,
    translations: [
      { locale: 'ru', title: 'Заявки' },
      { locale: 'en', title: 'Applications' }
    ]
  },
  {
    code: 'scholarships',
    order: 3,
    translations: [
      { locale: 'ru', title: 'Стипендии' },
      { locale: 'en', title: 'Scholarships' }
    ]
  },
  {
    code: 'cost',
    order: 4,
    translations: [
      { locale: 'ru', title: 'Стоимость' },
      { locale: 'en', title: 'Costs' }
    ]
  },
  {
    code: 'life',
    order: 5,
    translations: [
      { locale: 'ru', title: 'Жизнь в Турции' },
      { locale: 'en', title: 'Student Life' }
    ]
  },
  {
    code: 'exams',
    order: 6,
    translations: [
      { locale: 'ru', title: 'Экзамены' },
      { locale: 'en', title: 'Exams' }
    ]
  }
]

const sharedImages = {
  visa: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/4d45d15c4c-2f7df3cd5c6d26f67f4d.png',
  exams: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e66dae170a-2ce9fb303ed0b339b596.png',
  applications: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/0dd499ea10-24904ac07ef05238b5a7.png',
  scholarships: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e3901b0bf7-9a8ad8119465cdbbdbe0.png',
  cost: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/af90cf6ff7-bebc6b59bbc09cfdceda.png',
  life: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/87e795516e-e01ab643ecae05c53996.png',
  rankings: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/57489031df-a0c5d805a5c769e79e85.png'
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
        content: [
          { type: 'heading', level: 2, text: 'Основные этапы оформления' },
          {
            type: 'paragraph',
            text:
              'Студенческая виза оформляется в консульстве Турции по месту проживания. Начните с онлайн-записи и подготовьте комплект документов: приглашение из университета, заполненную анкету, финансовые гарантии и медицинскую страховку.'
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Запишитесь на подачу документов на сайте консульства и оплатите консульский сбор.',
              'Соберите пакет документов: приглашение, паспорт, фотографии, выписку из банка и страховку.',
              'После получения визы прилетайте в Турцию и в течение 30 дней подайте на вид на жительство.'
            ]
          },
          {
            type: 'quote',
            text:
              'Лучше подготовить оригиналы и переводы заранее: консульство не принимает неполные пакеты документов.',
            author: 'Айнур Мурадова, визовый консультант'
          },
          {
            type: 'paragraph',
            text:
              'После прилёта оформите налоговый номер и откройте банковский счёт. Эти документы понадобятся для аренды жилья и подачи на вид на жительство.'
          }
        ]
      },
      {
        locale: 'en',
        slug: 'turkey-student-visa-guide',
        title: 'Turkey Student Visa Guide: Step-by-Step Checklist',
        excerpt:
          'Learn which documents you need, how to book a consulate appointment and what to do after arriving in Turkey as an international student.',
        readingTime: '8 min read',
        heroKicker: 'Step-by-step plan',
        heroSubtitle:
          'A complete roadmap for your student visa application: from the first online booking to your residence permit appointment.',
        heroLocation: 'Turkey',
        imageAlt: 'Folder with visa documents and international student passport on a table',
        heroImageAlt: 'International student preparing documents for a visa interview at the Turkish consulate',
        seoDescription:
          'Comprehensive checklist for the Turkish student visa in 2025. Required documents, processing times and practical tips.',
        content: [
          { type: 'heading', level: 2, text: 'Key application steps' },
          {
            type: 'paragraph',
            text:
              'Book your appointment through the official consulate website. Prepare the invitation letter from your university, financial proof, medical insurance and the completed visa form.'
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Reserve a visa appointment online and pay the processing fee.',
              'Collect all documents: acceptance letter, passport, photos, bank statement and insurance.',
              'Arrive in Turkey and apply for the residence permit within 30 days.'
            ]
          },
          {
            type: 'quote',
            text: 'Bring both originals and certified translations — incomplete files are not accepted.',
            author: 'Aynur Muradova, visa consultant'
          },
          {
            type: 'paragraph',
            text:
              'After arrival obtain your tax number and open a bank account. These documents are required for renting accommodation and completing the residence permit application.'
          }
        ]
      }
    ]
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
        content: [
          { type: 'heading', level: 2, text: 'Перед началом' },
          {
            type: 'paragraph',
            text:
              'Соберите базовый пакет: паспорт, аттестат или диплом, приложение к диплому, мотивационное письмо и рекомендательные письма. Все документы нужно перевести на английский или турецкий язык и заверить нотариально.'
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Отсканируйте документы в хорошем качестве (300 dpi и выше).',
              'Переименуйте файлы по шаблону: фамилия_тип_документа.pdf.',
              'Проверьте сроки действия паспорта — он должен быть валиден минимум 6 месяцев после начала обучения.'
            ]
          },
          {
            type: 'paragraph',
            text:
              'Перед отправкой заявки сделайте копию формы и проверьте заполнение полей. Многие университеты не позволяют редактировать данные после отправки.'
          }
        ]
      },
      {
        locale: 'en',
        slug: 'turkey-application-checklist',
        title: 'Application checklist for Turkish universities',
        excerpt:
          'Documents you need before submitting your application, how to certify translations and avoid common upload mistakes.',
        readingTime: '7 min read',
        heroKicker: 'Practice',
        heroSubtitle: 'A step-by-step checklist to help you submit a flawless application.',
        heroLocation: 'Online submission',
        imageAlt: 'International applicant reviewing a document checklist before submitting an application',
        heroImageAlt: 'Applicant taking photos of documents to upload into the system',
        seoDescription:
          'Detailed document checklist for applying to Turkish universities. Required certificates and translation rules.',
        content: [
          { type: 'heading', level: 2, text: 'Before you submit' },
          {
            type: 'paragraph',
            text:
              'Collect your passport, diploma, transcript, motivation letter and recommendation letters. Translate them into Turkish or English and notarise the copies.'
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Scan documents at 300 dpi or higher for better readability.',
              'Rename files using a clear template: lastname_documenttype.pdf.',
              'Check the passport validity — it should be valid for at least six months after the academic year starts.'
            ]
          },
          {
            type: 'paragraph',
            text:
              'Save a copy of your application before you submit. Many universities lock the form after submission, so double-check each field.'
          }
        ]
      }
    ]
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
        content: [
          { type: 'heading', level: 2, text: 'Какие программы доступны' },
          {
            type: 'paragraph',
            text:
              'В Турции есть государственные стипендии Türkiye Bursları и десятки внутренних программ университетов. Условия отличаются: где-то покрывают проживание, где-то только обучение.'
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Подайте заявку минимум на две программы — конкуренция высокая.',
              'Уделите внимание мотивационному письму: в нём должна читаться ваша связь с выбранной программой.',
              'Соберите рекомендации от преподавателей, которые знают вас лично.'
            ]
          },
          {
            type: 'paragraph',
            text:
              'Следите за дедлайнами: государственные программы закрываются в феврале, а университетские — в разное время. Заводите календарь напоминаний.'
          }
        ]
      },
      {
        locale: 'en',
        slug: 'how-to-win-a-turkish-scholarship',
        title: 'How to win a full scholarship in Turkey',
        excerpt:
          'Overview of government and university scholarships, deadlines and strategies for compelling motivation letters.',
        readingTime: '9 min read',
        heroKicker: 'Funding',
        heroSubtitle:
          'Learn how to select the right scholarship and build a strong application package for the selection committee.',
        heroLocation: 'Turkey Scholarships',
        imageAlt: 'Students receiving scholarship certificates on stage',
        heroImageAlt: 'Scholarship award ceremony in a Turkish university',
        seoDescription:
          'Guide to securing a full scholarship in Turkey. Tips for Türkiye Bursları and university grants.',
        content: [
          { type: 'heading', level: 2, text: 'Available programmes' },
          {
            type: 'paragraph',
            text:
              'Turkey offers national scholarships like Türkiye Bursları alongside many institutional awards. Some cover accommodation while others focus on tuition only.'
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Apply to at least two programmes because competition is intense.',
              'Craft a motivation letter that clearly shows your fit with the chosen programme.',
              'Request recommendation letters from professors who know your work personally.'
            ]
          },
          {
            type: 'paragraph',
            text:
              'Keep track of deadlines: national calls usually close in February, while university scholarships have their own schedules. Create reminders so you never miss a date.'
          }
        ]
      }
    ]
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
        content: [
          { type: 'heading', level: 2, text: 'Основные статьи расходов' },
          {
            type: 'paragraph',
            text:
              'Средняя стоимость обучения в частных университетах — 4 000–6 000 USD в год. Общежитие стоит 150–250 USD в месяц, аренда квартиры — от 400 USD.'
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Транспорт с Istanbulkart: 25–30 USD в месяц при активном использовании.',
              'Питание в столовой университета — 3–4 USD за обед.',
              'Мобильная связь и интернет — около 12 USD в месяц.'
            ]
          },
          {
            type: 'paragraph',
            text:
              'Заложите резерв на учебные материалы и медицинскую страховку. Университеты часто предлагают льготные тарифы для студентов.'
          }
        ]
      },
      {
        locale: 'en',
        slug: 'study-costs-in-istanbul',
        title: 'How much does it cost to study and live in Istanbul?',
        excerpt:
          'Budget breakdown for international students: accommodation, transportation, food and hidden academic expenses.',
        readingTime: '6 min read',
        heroKicker: 'Finances',
        heroSubtitle: 'Realistic monthly and annual costs for a student in 2025 with money-saving advice.',
        heroLocation: 'Istanbul',
        imageAlt: 'Turkish lira banknotes and a calculator on a student desk',
        heroImageAlt: 'International student planning a budget with a laptop in a cafe',
        seoDescription:
          'Cost of living and studying in Istanbul: tuition, rent, transportation, food and insurance for 2025.',
        content: [
          { type: 'heading', level: 2, text: 'Key expense categories' },
          {
            type: 'paragraph',
            text:
              'Private universities charge around 4,000–6,000 USD per year. Dormitories range from 150–250 USD, while renting a flat starts at 400 USD per month.'
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Transport with Istanbulkart: 25–30 USD per month for daily commuting.',
              'University cafeteria meals cost 3–4 USD.',
              'Mobile plan with internet averages 12 USD per month.'
            ]
          },
          {
            type: 'paragraph',
            text:
              'Set aside a buffer for textbooks and health insurance. Many universities offer discounted packages for students.'
          }
        ]
      }
    ]
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
        content: [
          { type: 'heading', level: 2, text: 'Первые недели' },
          {
            type: 'paragraph',
            text:
              'Посетите ориентационные встречи, вступите в Telegram-чаты университета и найдите Buddy-программу. Это ускорит адаптацию и поможет найти друзей.'
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Начните изучать базовые фразы турецкого языка — местные это ценят.',
              'Исследуйте районы вокруг кампуса: выбирайте любимые кафе и места для учёбы.',
              'Используйте приложения BiTaksi, Marti и Yemeksepeti для повседневных задач.'
            ]
          },
          {
            type: 'quote',
            text:
              'Самое важное — не бояться спрашивать совет у старшекурсников. Они всегда подскажут, где купить учебники и как оформить проездной.',
            author: 'Элиф Кая, координатор Buddy-программы'
          }
        ]
      },
      {
        locale: 'en',
        slug: 'adapting-to-student-life-in-turkey',
        title: 'How to adapt to student life in Turkey',
        excerpt:
          'Cultural tips, useful routines and must-see places during your first months in the country.',
        readingTime: '8 min read',
        heroKicker: 'Student life',
        heroSubtitle: 'Build a comfortable routine, make friends and feel confident in a new environment.',
        heroLocation: 'Istanbul, Ankara, Izmir',
        imageAlt: 'Students enjoying sunset by the Bosphorus waterfront',
        heroImageAlt: 'Group of international students chatting on campus lawn',
        seoDescription:
          'Adaptation guide for international students in Turkey: culture, language, student communities and must-have apps.',
        content: [
          { type: 'heading', level: 2, text: 'Your first weeks' },
          {
            type: 'paragraph',
            text:
              'Attend orientation sessions, join university Telegram groups and look for buddy programmes. These steps speed up adaptation and help you meet new friends.'
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Learn basic Turkish phrases — locals really appreciate the effort.',
              'Explore neighbourhoods around campus to find study-friendly cafes and parks.',
              'Use apps like BiTaksi, Marti scooters and Yemeksepeti for daily needs.'
            ]
          },
          {
            type: 'quote',
            text:
              'The most helpful thing is to ask senior students for tips. They know where to buy textbooks and how to activate your transport card.',
            author: 'Elif Kaya, buddy programme coordinator'
          }
        ]
      }
    ]
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
            text:
              'Большинство программ в Турции принимают оба экзамена. Для бакалавриата нужен минимум IELTS 6.0 или TOEFL iBT 72, для магистратуры — выше.'
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Выберите экзамен с форматом, который вам комфортнее: компьютерный TOEFL или бумажный IELTS.',
              'Проверьте срок действия сертификата — 2 года с даты сдачи.',
              'Используйте официальные пробные тесты для тренировки тайминга.'
            ]
          },
          {
            type: 'paragraph',
            text:
              'Некоторые университеты принимают внутренние экзамены YÖS или SAT. Уточняйте требования на сайте факультета.'
          }
        ]
      },
      {
        locale: 'en',
        slug: 'toefl-vs-ielts-for-turkey',
        title: 'TOEFL vs IELTS: which exam should you take for Turkey?',
        excerpt:
          'Comparing admission requirements, exam formats and target scores for international applicants.',
        readingTime: '5 min read',
        heroKicker: 'Exams',
        heroSubtitle: 'Find out which exam fits you best in 2025 and how to prepare for each format.',
        heroLocation: 'Online / Test centre',
        imageAlt: 'TOEFL and IELTS preparation materials on a student desk',
        heroImageAlt: 'Student preparing for an international English exam',
        seoDescription:
          'TOEFL vs IELTS for Turkish universities. Minimum required scores and preparation strategies.',
        content: [
          { type: 'heading', level: 2, text: 'University requirements' },
          {
            type: 'paragraph',
            text:
              'Most Turkish programmes accept both exams. Bachelor programmes usually require IELTS 6.0 or TOEFL iBT 72, while graduate schools ask for higher scores.'
          },
          {
            type: 'list',
            ordered: false,
            items: [
              'Pick the exam format you feel comfortable with: computer-based TOEFL or paper-based IELTS.',
              'Remember that both certificates are valid for two years.',
              'Use official practice tests to master time management.'
            ]
          },
          {
            type: 'paragraph',
            text:
              'Some universities also accept YÖS or SAT scores. Always double-check the faculty requirements.'
          }
        ]
      }
    ]
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
        content: [
          { type: 'heading', level: 2, text: 'Дедлайны по месяцам' },
          {
            type: 'paragraph',
            text:
              'Январь — старт подачи Türkiye Bursları, март — дедлайны частных университетов, июнь — приём документов в государственные вузы. Планируйте подготовку заранее.'
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'Январь–февраль: государственные стипендии и программы обмена.',
              'Март–апрель: большинство частных университетов закрывают набор.',
              'Май–июнь: приём документов в государственные университеты.'
            ]
          }
        ]
      },
      {
        locale: 'en',
        slug: 'application-calendar-2025',
        title: 'Application calendar for 2025 intake',
        excerpt:
          'Key deadlines for Turkish universities and national scholarship programmes for the upcoming academic year.',
        readingTime: '4 min read',
        heroKicker: 'Deadlines',
        heroSubtitle: 'University and scholarship deadlines month by month so you never miss a date.',
        heroLocation: '2025/26 academic year',
        imageAlt: 'Calendar with highlighted application deadlines',
        heroImageAlt: 'Student planning deadlines on a tablet',
        seoDescription:
          'Important application deadlines for Turkish universities and scholarships in 2025.',
        content: [
          { type: 'heading', level: 2, text: 'Month-by-month timeline' },
          {
            type: 'paragraph',
            text:
              'January opens Türkiye Bursları, March brings private university deadlines and public universities collect documents in June. Prepare your paperwork in advance.'
          },
          {
            type: 'list',
            ordered: true,
            items: [
              'January–February: national scholarships and exchange programmes.',
              'March–April: most private universities close their intake.',
              'May–June: public universities collect application documents.'
            ]
          }
        ]
      }
    ]
  }
]

export async function seedBlog(prisma: PrismaClient) {
  console.log('📝 Seeding blog categories and articles...')

  const categoryMap = new Map<string, number>()

  for (const category of categories) {
    const created = await prisma.blogCategory.create({
      data: {
        code: category.code,
        order: category.order,
        translations: {
          create: category.translations
        }
      }
    })

    categoryMap.set(category.code, created.id)
  }

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
            ...translation
          }))
        }
      }
    })
  }

  console.log('✅ Blog content seeded')
}

