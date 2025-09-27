# Тестирование

Этот проект использует Vitest + jsdom для компонентных и серверных тестов.

## Запуск

```bash
npm test            # однократный запуск
npm run test:watch  # режим наблюдения
```

Vitest сконфигурирован в `vitest.config.ts`:

- Алиасы путей: `~` и `@` → `app/`
- Среда: `jsdom`
- `setupFiles`: `tests/setup.ts`

## Где лежат тесты

- Компоненты: `tests/components/*.test.ts`
- Хранилища: `tests/stores/*.spec.ts`
- Компосаблы: `tests/composables/*.test.ts`
- Серверные обработчики/API: `tests/server/api/**.spec.ts`
- Репозитории/сервисы: `tests/server/**/*.spec.ts`

## Паттерны

### Компоненты Vue

Используем `@testing-library/vue`:

```ts
import { render, screen } from '@testing-library/vue'
import BlogHeroSection from '@/components/features/blog/sections/BlogHeroSection.vue'

test('renders hero title', () => {
  render(BlogHeroSection, {
    props: {
      hero: {
        title: 'Blog &',
        titleAccent: 'FAQ',
        description: 'Desc',
        searchPlaceholder: 'Search…',
        imageAlt: 'Alt',
        highlight: { title: 'Tip', subtitle: 'Sub' },
        stats: [],
      },
      heroImage: '/img.png',
      modelValue: '',
    },
  })
  expect(screen.getByText('Blog &')).toBeInTheDocument()
})
```

### Pinia-хранилища

Активируем Pinia в тесте и мокируем `$fetch`:

```ts
import { setActivePinia, createPinia } from 'pinia'
import { useBlogStore } from '@/stores/blog'

beforeEach(() => {
  setActivePinia(createPinia())
  // @ts-expect-error inject global
  global.$fetch = vi.fn(async () => ({
    data: [],
    meta: { totalPages: 1 },
    totalArticles: 0,
    totalFAQs: 0,
  }))
})

test('fetchArticles sets pagination', async () => {
  const store = useBlogStore()
  const res = await store.fetchArticles({ page: 1 })
  expect(res).not.toBeNull()
  expect(store.pagination?.totalPages).toBe(1)
})
```

### Серверные API (Nitro handlers)

Тестируем чистые функции/репозитории отдельно. Для хендлеров — мок `prisma` и вызов функции:

```ts
import handler from '@/server/api/v1/blog/articles/index.get'

vi.mock('@/lib/prisma', () => ({ prisma: {} }))

function mockEvent(query: Record<string, any> = {}) {
  return { context: { locale: 'en' } } as any
}

test('returns articles payload', async () => {
  // мок репозитория и его результата
  // ...
  const result = await handler(mockEvent({ page: 1 }))
  expect(result).toHaveProperty('data')
})
```

## Линт и форматирование

Перед пушем запускайте:

```bash
npm run lint
npm run format:check
```

## Полезное

- Используйте `vi.useFakeTimers()` для дебаунсов/таймеров
- Старайтесь мокировать сетевые вызовы и внешние SDK
- Проверяйте i18n-ключи через `t()`/`tm()` в компонентах
