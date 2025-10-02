# Краткий План: Блок Видео и Фото Отзывов

## 📋 Решения (Утверждено)

### 1. Позиция блока
✅ После блока "Наши достижения в цифрах" на странице `/reviews`

### 2. Структура
✅ **Объединенный блок** - видео + фото вместе в одной карусели

### 3. Видео плеер
✅ **@cloudgeek/vue3-video-player** (~30 KB)
- Поддержка локальных файлов из `/public/videos/`
- Красивые кастомизируемые контролы
- Задел для YouTube/Vimeo в будущем

### 4. Карусель
✅ **nuxt-swiper** (~20 KB)
- Desktop: 6 слайдов
- Tablet: 2 слайда
- Mobile: 1 слайд по центру (свайп)

### 5. Данные
✅ **Интеграция с БД**
- Расширение таблицы `university_reviews`
- Новый enum `MediaReviewType` (text/video/image)
- API endpoint `/api/v1/reviews/media`

### 6. Количество отзывов
✅ **~12 отзывов** в ленте (6 видео + 6 фото)

## 🎯 Технический Стек

```
Библиотеки:
├── @cloudgeek/vue3-video-player (видео плеер)
├── nuxt-swiper (карусель)
└── Общий вес: ~50 KB gzipped

База данных:
├── Новые поля в university_reviews:
│   ├── media_type (enum)
│   ├── video_url (локальный путь или YouTube ID)
│   ├── video_thumb (превью)
│   ├── video_duration (длительность)
│   └── image_url (фото отзыва)

API:
└── GET /api/v1/reviews/media
    ├── Query: ?featured=true&limit=12&type=video|image
    └── Response: { data: [...], meta: {...} }

Компоненты:
├── MediaReviewsSection.vue (главный с каруселью)
├── MediaReviewCard.vue (универсальная карточка)
└── VideoPlayerModal.vue (модалка с плеером)
```

## ⏱️ Временные Оценки

| Этап | Время | Описание |
|------|-------|----------|
| 1. Установка зависимостей | 15 мин | npm install + nuxt.config |
| 2. Миграция БД | 30 мин | schema.prisma + миграция |
| 3. API Endpoints | 1 час | media.get.ts + ReviewRepository |
| 4. Компоненты | 2.5 часа | 3 компонента + стили |
| 5. Переводы | 30 мин | i18n для 4 языков |
| 6. Интеграция | 30 мин | Подключение к reviews.vue |
| 7. Тестирование | 1 час | Функционал + адаптив |
| **ИТОГО** | **6 часов** | Полная реализация |

## 📁 Структура Файлов

```
Новые файлы:
├── server/api/v1/reviews/media.get.ts (API endpoint)
├── app/components/features/reviews/
│   ├── sections/MediaReviewsSection.vue (карусель)
│   └── components/
│       ├── MediaReviewCard.vue (карточка)
│       └── VideoPlayerModal.vue (модалка)
├── public/videos/reviews/ (папка для видео)
│   ├── student-1.mp4
│   ├── student-2.mp4
│   └── ...

Изменяемые файлы:
├── prisma/schema.prisma (добавить поля)
├── server/repositories/ReviewRepository.ts (новый метод)
├── app/pages/reviews.vue (подключить компонент)
├── nuxt.config.ts (добавить nuxt-swiper)
└── i18n/locales/*/pages/reviews.json (переводы)
```

## 🎨 Дизайн Спецификация

### Responsive Breakpoints
```typescript
{
  320: {  // Mobile
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 16
  },
  768: {  // Tablet
    slidesPerView: 2,
    centeredSlides: false,
    spaceBetween: 20
  },
  1024: { // Desktop
    slidesPerView: 6,
    centeredSlides: false,
    spaceBetween: 24
  }
}
```

### Стили (следуем стандартам проекта)
```css
/* Секция */
.section-py-lg           /* py-10 md:py-20 */
.container-padding-narrow /* px-4 md:px-6 */

/* Типография */
.text-section-title      /* text-2xl md:text-3xl lg:text-4xl */
.text-section-subtitle   /* text-base md:text-lg */
.text-card-title         /* text-lg md:text-xl */
.text-card-body          /* text-sm md:text-base */

/* Компоненты */
.shadow-custom           /* 0 4px 20px rgba(0,0,0,0.08) */
.rounded-3xl             /* 1.5rem (24px) */
.gap-section             /* gap-4 md:gap-6 lg:gap-8 */
```

## 🔄 Формат videoUrl

```typescript
// Локальное видео
videoUrl: "/videos/reviews/student-1.mp4"

// YouTube (будущее)
videoUrl: "youtube:dQw4w9WgXcQ"

// Vimeo (будущее)
videoUrl: "vimeo:123456789"
```

## 📝 Пример данных в БД

```sql
INSERT INTO university_reviews (
  type, 
  media_type, 
  featured, 
  rating,
  video_url,
  video_thumb,
  video_duration
) VALUES (
  'student',
  'video',
  true,
  5,
  '/videos/reviews/aigerim-istanbul.mp4',
  '/images/reviews/thumbs/aigerim.jpg',
  '3:24'
);
```

## ✅ Чеклист Реализации

### Этап 1: Подготовка
- [ ] Установить @cloudgeek/vue3-video-player
- [ ] Установить nuxt-swiper
- [ ] Обновить nuxt.config.ts

### Этап 2: База данных
- [ ] Обновить schema.prisma
- [ ] Создать миграцию
- [ ] Применить миграцию
- [ ] Добавить тестовые данные

### Этап 3: Backend
- [ ] Создать /api/v1/reviews/media.get.ts
- [ ] Расширить ReviewRepository
- [ ] Протестировать API endpoint

### Этап 4: Frontend
- [ ] Создать MediaReviewsSection.vue
- [ ] Создать MediaReviewCard.vue
- [ ] Создать VideoPlayerModal.vue
- [ ] Добавить переводы (ru, en, kk, tr)

### Этап 5: Интеграция
- [ ] Подключить к reviews.vue
- [ ] Обновить index.ts exports
- [ ] Удалить старый VideoReviews.vue

### Этап 6: Тестирование
- [ ] Проверить карусель на desktop (6 слайдов)
- [ ] Проверить карусель на tablet (2 слайда)
- [ ] Проверить карусель на mobile (1 слайд, свайп)
- [ ] Проверить воспроизведение видео
- [ ] Проверить модальное окно
- [ ] Проверить переводы
- [ ] Проверить адаптивность
- [ ] Lighthouse Score > 90

## 🚀 Команды для Запуска

```bash
# 1. Установка зависимостей
npm install @cloudgeek/vue3-video-player nuxt-swiper

# 2. Создание миграции
npm run db:migrate
# Имя: add_media_fields_to_reviews

# 3. Применение миграции
npm run db:push

# 4. Генерация Prisma Client
npm run db:generate

# 5. Запуск dev сервера
npm run dev

# 6. Тестирование
npm run test
```

## 📊 Метрики Успеха

### Технические
- ✅ Bundle size < +60 KB
- ✅ Lighthouse Performance > 90
- ✅ Lighthouse Accessibility > 95
- ✅ Время загрузки < 2 сек

### UX
- ✅ Плавная прокрутка карусели
- ✅ Touch-friendly на мобильных
- ✅ Видео воспроизводится без задержек
- ✅ Модалка закрывается по ESC и клику вне

## 🔗 Полезные Ссылки

- [Полный план реализации](/home/lsmacox/projects/edu.turkish/thoughts/plans/video-image-reviews-implementation.md)
- [vue3-video-player Docs](https://core-player.github.io/vue-core-video-player/)
- [nuxt-swiper Docs](https://nuxt.com/modules/swiper)
- [Swiper API](https://swiperjs.com/swiper-api)

## 💡 Следующие Шаги После Реализации

1. Собрать реальные видео отзывы студентов
2. Оптимизировать видео (сжатие, кодирование)
3. Добавить субтитры для видео
4. A/B тестирование позиции блока
5. Интеграция с YouTube для будущих видео
6. Добавить фильтрацию по университетам
7. Аналитика просмотров видео
