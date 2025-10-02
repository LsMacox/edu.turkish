# План Реализации: Блок Видео и Картинка Отзывов

## Дата создания
2025-10-01

## Цель
Добавить блок с видео и картинка отзывами после блока "Наши достижения в цифрах" на странице `/reviews`, следуя всем стандартам и канонам проекта.

## Контекст

### Текущая структура страницы reviews.vue
```
1. Hero Section (строки 5-69)
2. Review Stats Section - "Наши достижения в цифрах" (строки 72-200)
3. ⭐ НОВЫЙ БЛОК ЗДЕСЬ ⭐
4. Student Stories Section (строка 203)
5. Parent Reviews Section (строка 206)
6. Share Experience Form (строка 209)
7. Next Review CTA (строка 212)
```

### Обнаруженные факты

#### ✅ Компонент VideoReviews.vue уже существует
**Файл:** `/home/lsmacox/projects/edu.turkish/app/components/features/reviews/components/VideoReviews.vue`

**Структура компонента:**
- 288 строк кода
- Использует хардкод данные (Google Storage URLs)
- Имеет модальное окно для воспроизведения видео
- Использует старые стили (не следует стандартам проекта)
- НЕ использует стандартизированные классы проекта
- НЕ подключен к странице reviews.vue

**Проблемы существующего компонента:**
1. ❌ Использует `py-16 md:py-20` вместо стандартного `section-py-lg`
2. ❌ Использует `px-4 lg:px-6` вместо `container-padding-narrow`
3. ❌ Использует `text-4xl lg:text-5xl` вместо `text-section-title`
4. ❌ Использует `text-xl` вместо `text-section-subtitle`
5. ❌ Хардкод URLs изображений и аватаров
6. ❌ Нет интеграции с i18n (используется, но данные хардкод)
7. ❌ Нет загрузки данных из API/БД
8. ❌ Простая модалка вместо профессионального видео плеера

#### ✅ База данных поддерживает видео
**Таблица:** `university_media_assets` (schema.prisma, строки 188-221)
- Поле `kind` типа `MediaKind` (enum: image, video)
- Поле `url` для видео URL
- Поле `thumbnailUrl` для превью
- Поддержка переводов (title, alt, caption)

**Таблица отзывов:** `university_reviews` (schema.prisma, строки 269-306)
- Поддерживает типы: student, parent
- Поле `avatar` для фото
- Поле `featured` для избранных
- НЕТ поля для видео URL

### Стандарты проекта

#### Spacing (из tailwind.config.ts)
```css
.section-py-lg       → py-10 md:py-20
.section-py          → py-8 md:py-16
.section-py-sm       → py-6 md:py-12
.container-padding-narrow → px-4 md:px-6
.card-padding        → p-4 md:p-6
.gap-section         → gap-4 md:gap-6 lg:gap-8
```

#### Typography (из typography.css)
```css
.text-section-title    → text-2xl md:text-3xl lg:text-4xl font-bold
.text-section-subtitle → text-base md:text-lg text-gray-600
.text-card-title       → text-lg md:text-xl font-semibold
.text-card-body        → text-sm md:text-base text-gray-700
```

#### Shadows & Radius
```css
.shadow-custom  → 0 4px 20px rgba(0, 0, 0, 0.08)
rounded-3xl     → 1.5rem (24px)
rounded-2xl     → 1rem (16px)
```

#### Colors
```
primary: #C62828 (красный)
secondary: #1F2937 (темно-серый)
background: #F3F4F6 (светло-серый)
```

## Анализ Требований

### Что нужно реализовать
1. **Блок с видео отзывами**
   - Видео с превью (thumbnail)
   - Кнопка воспроизведения
   - Информация о студенте (имя, университет)
   - Описание отзыва

2. **Блок с картинка отзывами**
   - Фото студента
   - Текстовый отзыв
   - Рейтинг (звезды)
   - Информация о студенте

### Дизайн-решения

#### Вариант 1: Объединенный блок (РЕКОМЕНДУЕТСЯ)
```
┌─────────────────────────────────────────────┐
│  Видео и Фото Отзывы Наших Студентов        │
│  ─────────────────────────────────────────  │
│                                             │
│  [Видео 1] [Видео 2]                       │
│                                             │
│  [Фото отзыв 1] [Фото отзыв 2] [Фото 3]   │
└─────────────────────────────────────────────┘
```

**Преимущества:**
- ✅ Единый блок с общим заголовком
- ✅ Меньше визуального шума
- ✅ Логическая группировка контента
- ✅ Проще навигация для пользователя

#### Вариант 2: Раздельные блоки
```
┌─────────────────────────────────────────────┐
│  Видео Отзывы Наших Студентов               │
│  [Видео 1] [Видео 2]                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Фото Отзывы Наших Студентов                │
│  [Фото 1] [Фото 2] [Фото 3]                │
└─────────────────────────────────────────────┘
```

**Недостатки:**
- ❌ Больше визуального шума
- ❌ Дублирование заголовков
- ❌ Разделение похожего контента

## Технические Решения

### 1. Библиотека для видео плеера

#### ✅ ВЫБРАНО: @cloudgeek/vue3-video-player

**Установка:**
```bash
npm install @cloudgeek/vue3-video-player
```

**Преимущества:**
- ✅ **Легковесная** (~30 KB gzipped)
- ✅ **Поддержка локальных файлов** из `/public/videos/`
- ✅ **Красивые кастомизируемые контролы**
- ✅ **i18n поддержка** (en, zh-CN, pt-BR, jp)
- ✅ **HLS плагин** для будущего стриминга
- ✅ **Множественные инстансы** на одной странице
- ✅ **Задел для YouTube/Vimeo** через расширения

**Использование:**
```vue
<template>
  <vue3-video-player 
    :src="videoSource"
    :view-core="viewCore"
  />
</template>

<script setup>
import Vue3VideoPlayer from '@cloudgeek/vue3-video-player'
import '@cloudgeek/vue3-video-player/dist/vue3-video-player.css'

const videoSource = '/videos/review-student-1.mp4'
</script>
```

**Поддержка форматов:**
- ✅ MP4 (H.264)
- ✅ WebM
- ✅ OGG
- ✅ HLS (через плагин @cloudgeek/playcore-hls)
- ✅ YouTube/Vimeo (через кастомные core)

**Вес:** ~30 KB gzipped

### 2. Библиотека для карусели

#### ✅ ВЫБРАНО: nuxt-swiper (Swiper.js)

**Установка:**
```bash
npm install nuxt-swiper
```

**Конфигурация nuxt.config.ts:**
```ts
export default defineNuxtConfig({
  modules: ['nuxt-swiper'],
  swiper: {
    bundled: true, // Автоматически подключает CSS и модули
    enableComposables: true // Включает useSwiper composable
  }
})
```

**Преимущества:**
- ✅ **Официальный Nuxt модуль**
- ✅ **Auto-imports** компонентов
- ✅ **TypeScript поддержка**
- ✅ **Touch-friendly** для мобильных
- ✅ **Легковесная** (~20 KB gzipped)
- ✅ **Множество эффектов** (slide, fade, cube, coverflow)
- ✅ **Lazy loading** изображений
- ✅ **Responsive breakpoints**

**Использование:**
```vue
<template>
  <ClientOnly>
    <swiper-container
      ref="swiperRef"
      :slides-per-view="slidesPerView"
      :space-between="20"
      :loop="true"
      :autoplay="{ delay: 5000 }"
      :breakpoints="breakpoints"
    >
      <swiper-slide v-for="review in reviews" :key="review.id">
        <MediaReviewCard :review="review" />
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<script setup>
const swiperRef = ref(null)
const swiper = useSwiper(swiperRef)

const breakpoints = {
  320: { slidesPerView: 1, centeredSlides: true },
  768: { slidesPerView: 2 },
  1024: { slidesPerView: 6 }
}
</script>
```

**Вес:** ~20 KB gzipped

### 3. Структура данных

#### ✅ ВЫБРАНО: Расширение схемы БД (Вариант A + Enum)

**Добавить поля в university_reviews:**
```prisma
model UniversityReview {
  id           Int          @id @default(autoincrement())
  universityId Int?         @map("university_id")
  type         ReviewType   // student | parent
  mediaType    MediaReviewType @default(text) @map("media_type") // 🆕
  year         Int?
  rating       Int?         @db.TinyInt
  avatar       String?      @db.VarChar(500)
  featured     Boolean      @default(false)
  
  // 🆕 Медиа поля
  videoUrl     String?      @map("video_url") @db.VarChar(500)
  videoThumb   String?      @map("video_thumb") @db.VarChar(500)
  videoDuration String?     @map("video_duration") @db.VarChar(10) // "3:24"
  imageUrl     String?      @map("image_url") @db.VarChar(500)
  
  createdAt    DateTime     @default(now()) @map("created_at")
  updatedAt    DateTime     @updatedAt @map("updated_at")

  // Relations
  university   University? @relation(fields: [universityId], references: [id], onDelete: SetNull)
  translations UniversityReviewTranslation[]

  @@map("university_reviews")
  @@index([universityId, type], map: "idx_review_university_type")
  @@index([featured], map: "idx_review_featured")
  @@index([rating], map: "idx_review_rating")
  @@index([mediaType], map: "idx_review_media_type") // 🆕
}

// 🆕 Новый enum
enum MediaReviewType {
  text   // Обычный текстовый отзыв
  video  // Видео отзыв
  image  // Фото отзыв
}
```

**Преимущества:**
- ✅ **Динамическое управление** контентом через БД
- ✅ **Единая таблица** для всех типов отзывов
- ✅ **Фильтрация по типу медиа** (text/video/image)
- ✅ **Поддержка локальных видео** (`/videos/review-1.mp4`)
- ✅ **Задел для YouTube** (сохранять YouTube ID в videoUrl)
- ✅ **Легко расширяемо** для будущих типов медиа

**Структура videoUrl:**
```
Локальное видео: "/videos/reviews/student-1.mp4"
YouTube: "youtube:dQw4w9WgXcQ"
Vimeo: "vimeo:123456789"
```

**Миграция:**
```sql
-- Добавить enum
ALTER TABLE `university_reviews` 
  ADD COLUMN `media_type` ENUM('text', 'video', 'image') DEFAULT 'text' AFTER `type`;

-- Добавить медиа поля
ALTER TABLE `university_reviews`
  ADD COLUMN `video_url` VARCHAR(500) NULL AFTER `featured`,
  ADD COLUMN `video_thumb` VARCHAR(500) NULL AFTER `video_url`,
  ADD COLUMN `video_duration` VARCHAR(10) NULL AFTER `video_thumb`,
  ADD COLUMN `image_url` VARCHAR(500) NULL AFTER `video_duration`;

-- Добавить индекс
ALTER TABLE `university_reviews`
  ADD INDEX `idx_review_media_type` (`media_type`);
```

### 4. Структура компонентов

#### Предлагаемая архитектура

```
app/components/features/reviews/
├── sections/
│   ├── StudentStoriesSection.vue (существует)
│   ├── ParentReviewsSection.vue (существует)
│   └── MediaReviewsSection.vue (НОВЫЙ) ← Карусель с видео+фото
├── components/
│   ├── MediaReviewCard.vue (НОВЫЙ) ← Универсальная карточка
│   ├── VideoPlayerModal.vue (НОВЫЙ) ← Модалка с vue3-video-player
│   └── VideoReviews.vue (УДАЛИТЬ)
```

#### Компонент MediaReviewsSection.vue (с каруселью)
```vue
<template>
  <section id="media-reviews" class="section-py-lg bg-white">
    <div class="container mx-auto container-padding-narrow">
      <!-- Заголовок -->
      <div class="text-center mb-8 md:mb-12">
        <h2 class="text-section-title mb-6">
          {{ $t('reviews.mediaReviews.title') }}
          <span class="text-primary">{{ $t('reviews.mediaReviews.titleAccent') }}</span>
        </h2>
        <p class="text-section-subtitle max-w-3xl mx-auto">
          {{ $t('reviews.mediaReviews.description') }}
        </p>
      </div>

      <!-- Карусель с отзывами -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500">{{ $t('common.loading') }}</p>
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500">{{ $t('reviews.mediaReviews.error') }}</p>
      </div>

      <ClientOnly v-else>
        <swiper-container
          ref="swiperRef"
          :slides-per-view="1"
          :space-between="20"
          :loop="true"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
          :breakpoints="swiperBreakpoints"
          :pagination="{ clickable: true }"
          :navigation="true"
        >
          <swiper-slide v-for="review in mediaReviews" :key="review.id">
            <MediaReviewCard
              :review="review"
              @play-video="openVideoModal"
            />
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </div>

    <!-- Модальное окно для видео -->
    <VideoPlayerModal
      v-if="activeVideo"
      :video="activeVideo"
      @close="closeVideoModal"
    />
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const swiperRef = ref(null)
const swiper = useSwiper(swiperRef)
const activeVideo = ref(null)

// Responsive breakpoints
const swiperBreakpoints = {
  // Mobile: 1 слайд по центру
  320: {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 16
  },
  // Tablet: 2 слайда
  768: {
    slidesPerView: 2,
    centeredSlides: false,
    spaceBetween: 20
  },
  // Desktop: 6 слайдов
  1024: {
    slidesPerView: 6,
    centeredSlides: false,
    spaceBetween: 24
  }
}

// Загрузка медиа отзывов из API
const {
  data: mediaReviews,
  pending: loading,
  error,
  refresh
} = await useFetch('/api/v1/reviews/media', {
  query: computed(() => ({
    featured: true,
    limit: 12,
    lang: locale.value
  })),
  headers: computed(() => ({
    'Accept-Language': locale.value
  }))
})

// Обновление при смене языка
watch(() => locale.value, () => {
  refresh()
})

// Открыть видео в модалке
function openVideoModal(video) {
  activeVideo.value = video
}

// Закрыть модалку
function closeVideoModal() {
  activeVideo.value = null
}
</script>
```

## План Реализации (Обновленный)

### Этап 1: Установка зависимостей (15 мин) ✅

#### 1.1 Установить npm пакеты ✅
```bash
npm install @cloudgeek/vue3-video-player nuxt-swiper
```

#### 1.2 Обновить nuxt.config.ts ✅
**Файл:** `/home/lsmacox/projects/edu.turkish/nuxt.config.ts`

**Добавить:**
```ts
export default defineNuxtConfig({
  modules: [
    // ... существующие модули
    'nuxt-swiper'
  ],
  
  swiper: {
    bundled: true,
    enableComposables: true
  }
})
```

### Этап 2: Миграция БД (30 мин) ✅

#### 2.1 Обновить schema.prisma ✅
**Файл:** `/home/lsmacox/projects/edu.turkish/prisma/schema.prisma`

**Изменения:**
```prisma
model UniversityReview {
  id           Int          @id @default(autoincrement())
  universityId Int?         @map("university_id")
  type         ReviewType
  mediaType    MediaReviewType @default(text) @map("media_type") // 🆕
  year         Int?
  rating       Int?         @db.TinyInt
  avatar       String?      @db.VarChar(500)
  featured     Boolean      @default(false)
  
  // 🆕 Медиа поля
  videoUrl     String?      @map("video_url") @db.VarChar(500)
  videoThumb   String?      @map("video_thumb") @db.VarChar(500)
  videoDuration String?     @map("video_duration") @db.VarChar(10)
  imageUrl     String?      @map("image_url") @db.VarChar(500)
  
  createdAt    DateTime     @default(now()) @map("created_at")
  updatedAt    DateTime     @updatedAt @map("updated_at")

  university   University? @relation(fields: [universityId], references: [id], onDelete: SetNull)
  translations UniversityReviewTranslation[]

  @@map("university_reviews")
  @@index([universityId, type], map: "idx_review_university_type")
  @@index([featured], map: "idx_review_featured")
  @@index([rating], map: "idx_review_rating")
  @@index([mediaType], map: "idx_review_media_type") // 🆕
}

// 🆕 Добавить в конец файла
enum MediaReviewType {
  text
  video
  image
}
```

#### 2.2 Создать миграцию
```bash
npm run db:migrate
# Имя миграции: add_media_fields_to_reviews
```

#### 2.3 Применить миграцию
```bash
npm run db:push
```

### Этап 3: API Endpoints (1 час) ✅

#### 3.1 Создать новый endpoint ✅
**Файл:** `/home/lsmacox/projects/edu.turkish/server/api/v1/reviews/media.get.ts`

**Содержание:**
```ts
import { ReviewRepository } from '~/server/repositories/ReviewRepository'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const lang = getHeader(event, 'Accept-Language') || 'ru'
  
  const {
    featured = 'true',
    limit = '12',
    type, // 'video' | 'image' | undefined (все)
  } = query

  try {
    const repository = new ReviewRepository()
    const reviews = await repository.getMediaReviews({
      featured: featured === 'true',
      limit: parseInt(limit as string),
      mediaType: type as 'video' | 'image' | undefined,
      locale: lang as string
    })

    return {
      data: reviews,
      meta: {
        total: reviews.length,
        locale: lang
      }
    }
  } catch (error) {
    console.error('Error fetching media reviews:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch media reviews'
    })
  }
})
```

#### 3.2 Расширить ReviewRepository
**Файл:** `/home/lsmacox/projects/edu.turkish/server/repositories/ReviewRepository.ts`

**Добавить метод:**
```ts
async getMediaReviews(options: {
  featured?: boolean
  limit?: number
  mediaType?: 'video' | 'image'
  locale: string
}) {
  const { featured, limit = 12, mediaType, locale } = options

  const where: any = {
    featured: featured ?? true,
    mediaType: mediaType ? mediaType : { in: ['video', 'image'] }
  }

  const reviews = await prisma.universityReview.findMany({
    where,
    take: limit,
    include: {
      translations: {
        where: { locale }
      },
      university: {
        include: {
          translations: {
            where: { locale }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return reviews.map(review => ({
    id: review.id,
    type: review.type,
    mediaType: review.mediaType,
    name: review.translations[0]?.name || '',
    quote: review.translations[0]?.quote || '',
    university: review.university?.translations[0]?.title || review.translations[0]?.universityName || '',
    rating: review.rating,
    year: review.year,
    avatar: review.avatar,
    videoUrl: review.videoUrl,
    videoThumb: review.videoThumb,
    videoDuration: review.videoDuration,
    imageUrl: review.imageUrl
  }))
}
```

### Этап 4: Создание компонентов (2.5 часа) ✅

#### 4.1 MediaReviewCard.vue (30 мин) ✅
**Файл:** `/home/lsmacox/projects/edu.turkish/app/components/features/reviews/components/VideoReviewCard.vue`

**Функционал:**
- Отображение thumbnail
- Кнопка Play с иконкой
- Информация о студенте
- Hover эффекты
- Emit события @play

**Стили:**
- `shadow-custom`
- `rounded-3xl`
- `card-padding`
- `hover-lift` (из tailwind.css)

#### 2.2 ImageReviewCard.vue (30 мин)
**Файл:** `/home/lsmacox/projects/edu.turkish/app/components/features/reviews/components/ImageReviewCard.vue`

**Функционал:**
- Фото студента
- Рейтинг (звезды)
- Текст отзыва
- Информация о студенте
- Градиентный фон (как в ParentReviewsSection)

**Стили:**
- `shadow-custom`
- `rounded-3xl`
- `card-padding`
- Градиенты: `bg-gradient-to-br from-blue-50 to-purple-50`

#### 2.3 VideoModal.vue (30 мин)
**Файл:** `/home/lsmacox/projects/edu.turkish/app/components/features/reviews/components/VideoModal.vue`

**Функционал:**
- Полноэкранная модалка
- YouTube iframe с autoplay
- Кнопка закрытия
- Закрытие по клику вне
- Закрытие по ESC
- Блокировка скролла body

**Стили:**
- `fixed inset-0 z-50`
- `bg-black bg-opacity-75`
- Анимация появления

#### 2.4 MediaReviewsSection.vue (30 мин)
**Файл:** `/home/lsmacox/projects/edu.turkish/app/components/features/reviews/sections/MediaReviewsSection.vue`

**Функционал:**
- Заголовок секции
- Grid для видео (2 колонки)
- Grid для фото (3 колонки)
- Управление модальным окном
- Загрузка данных из i18n

**Стили:**
- `section-py-lg`
- `container-padding-narrow`
- `gap-section`

### Этап 5: Интеграция (30 мин) ✅

#### 5.1 Обновить reviews.vue ✅
**Файл:** `/home/lsmacox/projects/edu.turkish/app/pages/reviews.vue`

**Изменения:**
```vue
<template>
  <div>
    <!-- Hero Section -->
    <section id="hero">...</section>

    <!-- Review Stats Section -->
    <section id="achievements">...</section>

    <!-- 🆕 Media Reviews Section -->
    <MediaReviewsSection />

    <!-- Student Stories -->
    <StudentStoriesSection />

    <!-- Parent Reviews -->
    <ParentReviewsSection />

    <!-- Share Experience Form -->
    <ShareExperience />

    <!-- Next Review CTA -->
    <NextReviewCTA />
  </div>
</template>

<script setup lang="ts">
// Импорт нового компонента
</script>
```

#### 3.2 Обновить index.ts
**Файл:** `/home/lsmacox/projects/edu.turkish/app/components/features/reviews/index.ts`

**Добавить экспорты:**
```ts
export { default as MediaReviewsSection } from './sections/MediaReviewsSection.vue'
export { default as VideoReviewCard } from './components/VideoReviewCard.vue'
export { default as ImageReviewCard } from './components/ImageReviewCard.vue'
export { default as VideoModal } from './components/VideoModal.vue'
```

#### 3.3 Удалить старый VideoReviews.vue (ОПЦИОНАЛЬНО)
**Файл:** `/home/lsmacox/projects/edu.turkish/app/components/features/reviews/components/VideoReviews.vue`

**Действие:** Удалить или переименовать в `VideoReviews.vue.backup`

### Этап 4: Тестирование (30 мин)

#### 4.1 Функциональное тестирование
- ✅ Видео открывается в модальном окне
- ✅ Видео воспроизводится автоматически
- ✅ Модалка закрывается по клику вне
- ✅ Модалка закрывается по ESC
- ✅ Скролл блокируется при открытой модалке
- ✅ Все переводы работают
- ✅ Адаптивность на мобильных

#### 4.2 Визуальное тестирование
- ✅ Соответствие дизайну
- ✅ Правильные отступы
- ✅ Правильные шрифты
- ✅ Правильные цвета
- ✅ Hover эффекты работают
- ✅ Анимации плавные

#### 4.3 Производительность
- ✅ Lighthouse Score > 90
- ✅ Нет layout shift
- ✅ Изображения оптимизированы
- ✅ Lazy loading работает

### Этап 5: Документация (15 мин)

#### 5.1 Обновить README компонента
**Файл:** `/home/lsmacox/projects/edu.turkish/app/components/features/reviews/README.md` (создать если нет)

**Содержание:**
```markdown
# Reviews Components

## MediaReviewsSection
Блок с видео и фото отзывами студентов.

### Props
Нет (данные из i18n)

### Events
Нет

### Usage
```vue
<MediaReviewsSection />
```

## VideoReviewCard
Карточка видео отзыва.

### Props
- `video` (Object) - данные видео

### Events
- `@play` - клик на кнопку воспроизведения
```

## Альтернативные Решения

### Если нужна динамическая загрузка из БД

#### Вариант 1: Расширить API reviews
**Файл:** `/home/lsmacox/projects/edu.turkish/server/api/v1/reviews/index.get.ts`

**Добавить query параметр:**
```ts
const { type, featured, limit, lang, mediaType } = query

// mediaType: 'video' | 'image' | 'all'
```

**Изменить схему БД:**
```prisma
model UniversityReview {
  // ... существующие поля
  mediaType    MediaType?   @map("media_type")
  videoUrl     String?      @map("video_url") @db.VarChar(500)
  videoThumb   String?      @map("video_thumb") @db.VarChar(500)
}

enum MediaType {
  text
  video
  image
}
```

**Миграция:**
```bash
npm run db:migrate
```

#### Вариант 2: Использовать university_media_assets
**Связать отзывы с медиа:**
```prisma
model UniversityReview {
  // ... существующие поля
  mediaAssetId Int?         @map("media_asset_id")
  mediaAsset   UniversityMediaAsset? @relation(fields: [mediaAssetId], references: [id])
}
```

**Преимущества:**
- ✅ Переиспользование существующей таблицы
- ✅ Поддержка видео и изображений

**Недостатки:**
- ❌ Сложнее запросы
- ❌ Требует рефакторинга

## Риски и Митигация

### Риск 1: Большой размер видео файлов
**Вероятность:** Высокая
**Влияние:** Медленная загрузка страницы

**Митигация:**
- ✅ Использовать YouTube/Vimeo для хостинга
- ✅ Lazy loading для видео
- ✅ Оптимизированные thumbnails

### Риск 2: Отсутствие видео контента
**Вероятность:** Средняя
**Влияние:** Пустой блок на странице

**Митигация:**
- ✅ Скрывать блок если нет видео
- ✅ Показывать только фото отзывы
- ✅ Placeholder контент для демо

### Риск 3: Проблемы с YouTube API
**Вероятность:** Низкая
**Влияние:** Видео не воспроизводится

**Митигация:**
- ✅ Fallback на прямую ссылку
- ✅ Обработка ошибок
- ✅ Альтернативный плеер (Vimeo)

## Метрики Успеха

### Технические метрики
- ✅ Lighthouse Performance > 90
- ✅ Lighthouse Accessibility > 95
- ✅ Bundle size увеличение < 10 KB
- ✅ Время загрузки страницы < 2 сек

### Бизнес метрики
- ✅ Увеличение времени на странице > 20%
- ✅ Увеличение конверсии в заявки > 10%
- ✅ Снижение bounce rate > 15%

## Временные Оценки

### Быстрая реализация (MVP)
- **Подготовка данных:** 30 мин
- **Создание компонентов:** 2 часа
- **Интеграция:** 30 мин
- **Тестирование:** 30 мин
- **Документация:** 15 мин
- **ИТОГО:** 3.5 часа

### Полная реализация (с БД)
- **Миграция БД:** 1 час
- **API endpoints:** 1 час
- **Компоненты:** 2 часа
- **Интеграция:** 1 час
- **Тестирование:** 1 час
- **Документация:** 30 мин
- **ИТОГО:** 6.5 часов

## Следующие Шаги

### После реализации MVP
1. Собрать реальные видео отзывы студентов
2. Загрузить видео на YouTube канал
3. Добавить аналитику просмотров
4. A/B тестирование позиции блока
5. Оптимизация конверсии

### Будущие улучшения
1. Интеграция с CMS для управления контентом
2. Автоматическая генерация thumbnails
3. Поддержка субтитров для видео
4. Фильтрация по университетам
5. Поиск по отзывам

## Вопросы для Обсуждения

1. **Позиция блока:** Согласны ли вы с размещением после "Наши достижения в цифрах"?
2. **Структура:** Объединенный блок или раздельные блоки?
3. **Библиотека:** YouTube iframe или нативный HTML5 video?
4. **Данные:** Хардкод в i18n или загрузка из БД?
5. **Количество:** Сколько видео и фото отзывов показывать?

## Приложения

### A. Примеры похожих реализаций
- [Coursera Reviews](https://www.coursera.org/reviews)
- [Udemy Testimonials](https://www.udemy.com/testimonials)
- [Study.eu Reviews](https://www.study.eu/reviews)

### B. Референсы дизайна
- Figma: [ссылка на макет если есть]
- Dribbble: [примеры карточек отзывов]

### C. Технические спецификации
- YouTube iframe API: https://developers.google.com/youtube/iframe_api_reference
- Vimeo Player API: https://developer.vimeo.com/player/sdk
- HTML5 Video: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
