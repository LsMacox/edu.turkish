# Настройка Яндекс.Метрики

## Установка

1. **Добавьте переменную окружения**:
   ```bash
   # В файл .env или .env.local
   NUXT_PUBLIC_YANDEX_METRIKA_ID=104136312
   ```

2. **Для production** убедитесь, что переменная установлена в системе:
   ```bash
   export NUXT_PUBLIC_YANDEX_METRIKA_ID=104136312
   ```

## Использование

### Автоматическое отслеживание
- **Просмотры страниц** - отслеживаются автоматически при навигации
- **noscript fallback** - работает для пользователей без JavaScript

### Ручное отслеживание целей

#### Через composable (рекомендуется)
```typescript
// В любом компоненте
const { trackGoal, trackEvent } = useYandexMetrika()

// Отслеживание целей
trackGoal('button_click', { button: 'cta' })
trackGoal('form_submit', { form: 'contact' })

// Отслеживание событий
trackEvent('video_play', { video_id: '123' })
```

#### Прямой вызов (в stores/plugins)
```typescript
// Если composable недоступен
if (process.client && (window as any).ym) {
  const config = useRuntimeConfig()
  ;(window as any).ym(config.public.yandexMetrikaId, 'reachGoal', 'goal_name', { param: 'value' })
}
```

### Примеры готовых целей
- `modal_open` - открытие модальных окон
- `application_submitted` - отправка заявки на обучение
- `university_view` - просмотр университета
- `program_select` - выбор программы

## Настройки счетчика

Текущие настройки (в `app/plugins/yandex-metrika.client.ts`):
- `ssr: true` - поддержка SSR
- `webvisor: true` - запись сессий пользователей
- `clickmap: true` - карта кликов
- `accurateTrackBounce: true` - точный показатель отказов
- `trackLinks: true` - отслеживание внешних ссылок
- `ecommerce: 'dataLayer'` - электронная торговля

## Безопасность и производительность

- Скрипт загружается асинхронно
- В development режиме отключается без ID
- Обработка ошибок для стабильности
- Минимальное влияние на производительность

## Соответствие требованиям

⚠️ **Важно**: С 2024 года в России требуется уведомлять пользователей о сборе персональных данных. 
Рекомендуется добавить:
1. Cookie баннер с согласием
2. Обновить политику конфиденциальности
3. Упомянуть использование Яндекс.Метрики

## Проверка работы

1. Откройте сайт в браузере
2. В DevTools → Network проверьте загрузку `mc.yandex.ru/metrika/tag.js`
3. В консоли не должно быть ошибок
4. В интерфейсе Яндекс.Метрики → "Посетители в реальном времени" должны отображаться визиты
