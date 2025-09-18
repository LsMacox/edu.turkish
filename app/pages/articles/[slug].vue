<template>
  <div class="bg-white">
    <!-- Hero -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-20">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="grid items-center gap-12 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
          <div class="space-y-6">
            <span class="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              Истории студентов
            </span>
            <h1 class="text-4xl font-bold leading-tight text-secondary lg:text-5xl">
              Как я поступил в турецкий университет мечты и что узнал по дороге
            </h1>
            <p class="text-lg text-gray-600 lg:text-xl">
              Личный опыт переезда, первые шаги в кампусе, полезные советы и небольшие открытия, которые помогли
              адаптироваться к новой академической среде и жизни в Турции.
            </p>
            <div class="flex flex-wrap gap-4 text-sm text-gray-500">
              <div class="flex items-center gap-2">
                <Icon name="mdi:calendar" class="text-primary" />
                12 марта 2024
              </div>
              <div class="flex items-center gap-2">
                <Icon name="mdi:clock-outline" class="text-primary" />
                9 минут чтения
              </div>
              <div class="flex items-center gap-2">
                <Icon name="mdi:map-marker-radius-outline" class="text-primary" />
                Стамбул, Турция
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="absolute -top-8 -right-6 hidden h-40 w-40 rounded-full bg-primary/10 blur-3xl lg:block" />
            <div class="relative overflow-hidden rounded-3xl shadow-custom">
              <NuxtImg
                src="/images/about-us-bg.png"
                alt="Студент в кампусе турецкого университета"
                class="h-full w-full object-cover"
                format="webp"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Article -->
    <section class="py-16">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="grid gap-12 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
          <article class="space-y-10">
            <section id="campus" class="grid gap-8 rounded-3xl bg-white p-6 shadow-custom lg:p-10">
              <div class="space-y-5">
                <h2 class="text-2xl font-semibold text-secondary lg:text-3xl">
                  Первое знакомство с кампусом
                </h2>
                <p class="leading-relaxed text-gray-600">
                  Когда я только прилетел в Стамбул, всё казалось непохожим на привычную жизнь дома. Кампус, полный
                  студентов со всего света, кипел разговорами, в воздухе ощущалась смесь новых возможностей и лёгкой
                  тревоги. Первым делом я отправился в международный офис, где мне выдали карту кампуса, расписание
                  ориентационных сессий и список ближайших мест, где можно вкусно поесть.
                </p>
                <p class="leading-relaxed text-gray-600">
                  Совет номер один — не бойтесь задавать вопросы. Волонтёры и кураторы помогали буквально на каждом
                  шагу. Они рассказали, где находится библиотека, как работает транспортная карта Istanbulkart и где
                  искать бесплатные кружки по интересам. Даже простая прогулка по кампусу превратилась в маленькое
                  путешествие: новые корпуса, уютные внутренние дворики и множество зелёных зон, где студенты готовят
                  проекты и просто общаются.
                </p>
              </div>

              <div class="grid gap-6 rounded-2xl bg-background p-6 lg:grid-cols-2 lg:p-8">
                <div class="space-y-4">
                  <h3 class="text-xl font-semibold text-secondary">Что меня удивило</h3>
                  <ul class="space-y-3 text-gray-600">
                    <li class="flex gap-3">
                      <Icon name="mdi:check-decagram" class="mt-1 text-primary" />
                      Практически в каждом корпусе есть комнаты для групповой работы с большими экранами и маркерными
                      досками.
                    </li>
                    <li class="flex gap-3">
                      <Icon name="mdi:check-decagram" class="mt-1 text-primary" />
                      У кампуса есть собственное мобильное приложение с расписанием и навигацией по аудиториям.
                    </li>
                    <li class="flex gap-3">
                      <Icon name="mdi:check-decagram" class="mt-1 text-primary" />
                      В столовой большой выбор блюд, а вечером кампус превращается в концертную площадку благодаря
                      студенческим клубам.
                    </li>
                  </ul>
                </div>
                <blockquote class="space-y-3 rounded-2xl bg-white p-6 shadow-inner">
                  <Icon name="mdi:format-quote-open" class="text-3xl text-primary" />
                  <p class="text-lg font-medium text-secondary">
                    «Оказалось, что даже самые простые разговоры на английском быстро переходят на турецкий. Это лучший
                    способ практиковать язык без учебников.»
                  </p>
                  <cite class="block text-sm text-gray-500">Арман Садыков, студент факультета инженерии</cite>
                </blockquote>
              </div>

              <div class="space-y-4">
                <h3 class="text-xl font-semibold text-secondary">Советы будущим студентам</h3>
                <ol class="list-inside list-decimal space-y-3 text-gray-600">
                  <li>Приезжайте минимум за неделю до начала занятий, чтобы оформить документы и привыкнуть к ритму.</li>
                  <li>Скачайте приложения для поиска жилья и транспорта — они значительно экономят время и деньги.</li>
                  <li>Будьте открыты к общению: знакомство с местными студентами помогает быстрее адаптироваться.</li>
                </ol>
              </div>
            </section>

            <section id="studies" class="grid gap-8 rounded-3xl bg-white p-6 shadow-custom lg:p-10">
              <div class="space-y-5">
                <h2 class="text-2xl font-semibold text-secondary lg:text-3xl">
                  Учебный процесс и работа с преподавателями
                </h2>
                <p class="leading-relaxed text-gray-600">
                  Учёба в турецком университете сочетает лекции и практические занятия. На инженерном факультете каждую
                  неделю мы решаем кейсы, которые близки к реальным задачам индустрии. Преподаватели активно вовлекают в
                  дискуссии и поощряют задавать вопросы. Мне особенно понравились лабораторные работы: лаборатории
                  оснащены современным оборудованием, и студенты могут пользоваться ими даже вне расписания.
                </p>
              </div>
              <NuxtImg
                src="https://storage.googleapis.com/edu-turkish/article-classroom.jpg"
                alt="Лаборатория турецкого университета"
                class="h-72 w-full rounded-2xl object-cover"
                format="webp"
              />
              <p class="leading-relaxed text-gray-600">
                Важный момент — система непрерывной оценки. Семестровые проекты, промежуточные тесты и участие в
                семинарах складываются в итоговый балл. Это мотивирует учиться стабильно, а не оставлять всё на сессию.
                Ещё один плюс: преподаватели охотно назначают индивидуальные встречи, если нужно разобраться в теме
                глубже или подготовить научный проект.
              </p>
              <div class="rounded-2xl bg-background p-6">
                <h3 class="mb-4 text-lg font-semibold text-secondary">Полезные ресурсы</h3>
                <ul class="space-y-2 text-gray-600">
                  <li class="flex items-start gap-3">
                    <Icon name="mdi:book-open-page-variant" class="mt-0.5 text-primary" />
                    Платформа с видеозаписями всех лекций — можно пересматривать материалы в любое время.
                  </li>
                  <li class="flex items-start gap-3">
                    <Icon name="mdi:laptop" class="mt-0.5 text-primary" />
                    Виртуальная библиотека с доступом к международным базам данных и научным журналам.
                  </li>
                  <li class="flex items-start gap-3">
                    <Icon name="mdi:account-group" class="mt-0.5 text-primary" />
                    Наставническая программа «Buddy», где старшекурсники помогают первокурсникам освоиться.
                  </li>
                </ul>
              </div>
            </section>

            <section id="life" class="grid gap-8 rounded-3xl bg-white p-6 shadow-custom lg:p-10">
              <h2 class="text-2xl font-semibold text-secondary lg:text-3xl">Баланс учёбы и жизни</h2>
              <p class="leading-relaxed text-gray-600">
                После занятий жизнь не останавливается. По вечерам кампус наполняется клубами: от робототехники до
                музыкальных джемов. Я записался в клуб фотографии, и именно благодаря ему объездил всю провинцию вместе с
                новыми друзьями. Турецкие студенты очень гостеприимны — они приглашают на домашние ужины и рассказывают о
                местных традициях.
              </p>
              <p class="leading-relaxed text-gray-600">
                По выходным можно отправиться исследовать город. Исторические районы, современные арт-пространства и
                уютные кофейни — всё в шаговой доступности благодаря развитому транспорту. Главное — заранее планировать
                бюджет: Стамбул может быть дорогим, но студенческие скидки на музеи и общественный транспорт приятно
                выручают.
              </p>
              <div class="rounded-2xl bg-background p-6">
                <h3 class="mb-4 text-lg font-semibold text-secondary">Мои находки в Стамбуле</h3>
                <div class="grid gap-6 md:grid-cols-2">
                  <div class="space-y-2 text-gray-600">
                    <p class="font-semibold text-secondary">Кафе для учёбы</p>
                    <p>Небольшие кофейни в районе Кадыкёй, где всегда тихо, а розетки есть у каждого столика.</p>
                  </div>
                  <div class="space-y-2 text-gray-600">
                    <p class="font-semibold text-secondary">Лучший вид на Босфор</p>
                    <p>Парк в районе Бешикташ, куда стоит прийти на закате с друзьями после сложной недели.</p>
                  </div>
                  <div class="space-y-2 text-gray-600">
                    <p class="font-semibold text-secondary">Выходные в дороге</p>
                    <p>Поездка в Измир на поезде — отличный способ сменить обстановку и попробовать эгейскую кухню.</p>
                  </div>
                  <div class="space-y-2 text-gray-600">
                    <p class="font-semibold text-secondary">Местные фестивали</p>
                    <p>Каждый месяц проходят бесплатные концерты в кампусе, а летом — фестиваль уличной еды.</p>
                  </div>
                </div>
              </div>
            </section>
          </article>

          <aside class="space-y-8">
            <div class="rounded-3xl bg-white p-6 shadow-custom">
              <h3 class="text-lg font-semibold text-secondary">Оглавление</h3>
              <nav class="mt-4 space-y-2 text-sm text-gray-600">
                <a
                  v-for="section in tableOfContents"
                  :key="section.id"
                  :href="`#${section.id}`"
                  class="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-background hover:text-secondary"
                >
                  <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {{ section.order }}
                  </span>
                  <span>{{ section.title }}</span>
                </a>
              </nav>
            </div>

            <div class="rounded-3xl bg-gradient-to-br from-primary to-secondary p-[1px] shadow-lg">
              <div class="rounded-3xl bg-white p-6">
                <h3 class="text-lg font-semibold text-secondary">Быстрые факты</h3>
                <ul class="mt-4 space-y-3 text-sm text-gray-600">
                  <li v-for="fact in quickFacts" :key="fact.title" class="flex gap-3">
                    <Icon :name="fact.icon" class="mt-0.5 text-primary" />
                    <div>
                      <p class="font-medium text-secondary">{{ fact.title }}</p>
                      <p>{{ fact.value }}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div class="rounded-3xl bg-white p-6 shadow-custom">
              <h3 class="text-lg font-semibold text-secondary">Основные выводы</h3>
              <ul class="mt-4 space-y-3 text-sm text-gray-600">
                <li v-for="highlight in highlights" :key="highlight" class="flex gap-3">
                  <Icon name="mdi:star-circle" class="mt-0.5 text-primary" />
                  <span>{{ highlight }}</span>
                </li>
              </ul>
            </div>

            <div class="rounded-3xl bg-background p-6">
              <h3 class="text-lg font-semibold text-secondary">Поделиться</h3>
              <p class="mt-2 text-sm text-gray-600">
                Расскажите друзьям о статье — возможно, она вдохновит их на поступление.
              </p>
              <div class="mt-4 flex flex-wrap gap-3">
                <button
                  v-for="link in shareLinks"
                  :key="link.label"
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-secondary transition hover:border-primary hover:text-primary"
                >
                  <Icon :name="link.icon" class="text-lg" />
                  {{ link.label }}
                </button>
              </div>
            </div>

            <div class="rounded-3xl bg-white p-6 shadow-custom">
              <h3 class="text-lg font-semibold text-secondary">Теги</h3>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in tags"
                  :key="tag"
                  class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- Related articles -->
    <section class="border-t border-gray-100 bg-background py-16">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 class="text-2xl font-semibold text-secondary lg:text-3xl">Читайте также</h2>
            <p class="mt-2 max-w-2xl text-gray-600">
              Ещё несколько историй студентов, которые делятся опытом учёбы и жизни в Турции.
            </p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-secondary/90"
          >
            Все статьи
            <Icon name="mdi:arrow-right" class="text-lg" />
          </button>
        </div>

        <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="article in relatedArticles"
            :key="article.title"
            class="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-custom transition hover:-translate-y-1"
          >
            <NuxtImg :src="article.image" :alt="article.title" class="h-48 w-full object-cover" format="webp" />
            <div class="flex flex-1 flex-col gap-4 p-6">
              <span class="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {{ article.category }}
              </span>
              <h3 class="text-lg font-semibold text-secondary group-hover:text-primary">{{ article.title }}</h3>
              <p class="flex-1 text-sm text-gray-600">{{ article.excerpt }}</p>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>{{ article.date }}</span>
                <span>{{ article.readingTime }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Как я поступил в турецкий университет мечты',
  description:
    'Личный опыт поступления и учёбы в Турции: советы, впечатления и полезные рекомендации для будущих студентов.'
})

const tableOfContents = [
  { id: 'campus', order: '01', title: 'Первое знакомство с кампусом' },
  { id: 'studies', order: '02', title: 'Учебный процесс и преподаватели' },
  { id: 'life', order: '03', title: 'Баланс учёбы и жизни в Турции' }
]

const quickFacts = [
  { title: 'Университет', value: 'Bogazici University', icon: 'mdi:school-outline' },
  { title: 'Факультет', value: 'Инженерное дело и технологии', icon: 'mdi:cog' },
  { title: 'Стипендия', value: 'Грант Türkiye Bursları', icon: 'mdi:card-account-details-star' },
  { title: 'Любимый предмет', value: 'Умные системы управления', icon: 'mdi:robot-happy-outline' }
]

const highlights = [
  'Первые недели лучше посвятить знакомству с кампусом и инфраструктурой.',
  'Практические занятия помогают быстрее адаптироваться к учебному процессу.',
  'Социальная жизнь и клубы — ключ к новым друзьям и интересным проектам.'
]

const shareLinks = [
  { label: 'Telegram', icon: 'mdi:telegram' },
  { label: 'WhatsApp', icon: 'mdi:whatsapp' },
  { label: 'VK', icon: 'mdi:vk' },
  { label: 'Скопировать ссылку', icon: 'mdi:link-variant' }
]

const tags = ['turkey', 'университет', 'опыт', 'студент', 'адаптация']

const relatedArticles = [
  {
    title: '5 шагов к успешному поступлению в Турцию',
    excerpt: 'Пошаговый план подготовки документов, прохождения собеседований и адаптации к новой стране.',
    date: '7 марта 2024',
    readingTime: '7 минут',
    image: 'https://storage.googleapis.com/edu-turkish/article-steps.jpg',
    category: 'Поступление'
  },
  {
    title: 'Как выбрать факультет, если нравится сразу несколько направлений',
    excerpt: 'Разбираемся в сильных сторонах турецких университетов и подбираем программу под ваши интересы.',
    date: '22 февраля 2024',
    readingTime: '6 минут',
    image: 'https://storage.googleapis.com/edu-turkish/article-major.jpg',
    category: 'Советы'
  },
  {
    title: 'Гид по студенческим скидкам в Стамбуле',
    excerpt: 'Подборка мест, где студенты экономят на транспорте, еде и развлечениях без потери качества.',
    date: '15 января 2024',
    readingTime: '5 минут',
    image: 'https://storage.googleapis.com/edu-turkish/article-discounts.jpg',
    category: 'Жизнь в Турции'
  }
]
</script>
