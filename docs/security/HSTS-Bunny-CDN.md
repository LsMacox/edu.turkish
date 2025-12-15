# Security Headers Strategy for Bunny CDN + Origin Architecture

## Оптимальная стратегия

В архитектуре **Bunny CDN + Origin Server** рекомендуется **централизованное управление security headers на уровне Caddy**.

## Почему именно Caddy?

### ✅ Преимущества Caddy для security headers:

1. **Универсальность**: Headers добавляются ко всем ответам (HTML, CSS, JS, изображения)
2. **Гарантированность**: Работает независимо от состояния Nuxt приложения
3. **Производительность**: Не нагружает Node.js процесс
4. **Простота**: Одно место для управления всеми headers
5. **Надежность**: Работает даже если приложение упало

### ❌ Проблемы дублирования:

- Лишняя нагрузка на приложение
- Возможные конфликты headers
- Сложность поддержки
- Дублирование конфигурации

## Финальная конфигурация

### Caddy (`contrib/Caddyfile`) - ОСНОВНОЙ источник headers

```caddy
# Origin server for Bunny CDN (HTTP only)
http://{$APP_DOMAIN:origin.edu-turkish.com} {
    encode zstd gzip

    # Security headers для всех ответов
    header {
        # HSTS header for responses going through Bunny CDN
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        # Additional security headers
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
        -Server
    }

    # Остальная конфигурация...
}
```

### Nuxt Middleware (`server/middleware/security.ts`) - МИНИМАЛЬНЫЙ

```typescript
export default defineEventHandler(async (event) => {
  // Security headers handled by Caddy reverse proxy
  // This middleware only for application-specific security logic

  if (event.node.req.method === 'GET') {
    const url = getRequestURL(event)

    // Only add CSP for specific dynamic content if needed
    if (url.pathname.startsWith('/api/') || url.pathname.includes('dynamic')) {
      setHeader(event, 'Content-Security-Policy', '...')
    }
  }
})
```

### Nuxt Config (`nuxt.config.ts`) - БЕЗ security headers

```typescript
nitro: {
  compressPublicAssets: true,
  // Security headers handled by Caddy reverse proxy
},
```

## Когда использовать каждый уровень

### 🔧 Caddy - для базовых security headers:

- HSTS
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Удаление Server header

### 🎯 Nuxt Middleware - для специфичной логики:

- Динамический CSP в зависимости от контента
- Rate limiting
- Authentication headers
- Application-specific security logic

### 📦 Nuxt Config - НЕ используем для headers:

- Оставляем только для других Nitro настроек
- Избегаем дублирования с Caddy

## Преимущества такого подхода

1. **Четкое разделение ответственности**
2. **Отсутствие дублирования**
3. **Лучшая производительность**
4. **Простота отладки**
5. **Единое место управления базовыми headers**

## Тестирование

```bash
# Проверить что headers приходят от Caddy
curl -I http://origin.edu-turkish.com

# Должны увидеть все security headers
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# и т.д.
```
