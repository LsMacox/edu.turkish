# Admin Guide - Service Management

**Feature**: Migrate Service Cards to Database with Translations and Dynamic Currency  
**Date**: 2025-01-14  
**Audience**: System administrators and content managers

## Overview

This guide explains how to manage service categories and sub-services via database operations. Currently, all service management is done through Prisma Studio or direct database queries. A web-based admin UI may be added in the future.

---

## Prerequisites

- Access to the production database or Prisma Studio
- Basic understanding of database operations
- Familiarity with the service data model

---

## Accessing the Database

### Development Environment

```bash
# Open Prisma Studio (web-based database GUI)
npm run db:studio

# This will open http://localhost:5555 in your browser
```

### Production Environment

```bash
# Connect to production database via Prisma Studio
DATABASE_URL="postgresql://..." npm run db:studio

# Or use direct SQL client
psql $DATABASE_URL
```

---

## Managing Sub-Services

### Adding a New Sub-Service

**Via Prisma Studio:**

1. Open Prisma Studio: `npm run db:studio`
2. Navigate to the `SubService` model
3. Click "Add record"
4. Fill in the fields:
   - `serviceCategoryId`: Select the parent category (e.g., 5 for "turkish-english-course")
   - `slug`: URL-friendly identifier (e.g., "language-turkish-advanced")
   - `priceUsd`: Price in USD (e.g., 500.00)
   - `deliveryTimeDays`: Optional delivery time (e.g., null for courses)
   - `order`: Display order (e.g., 3 for third position)
   - `isActive`: true
5. Click "Save 1 change"
6. Navigate to `SubServiceTranslation` model
7. Add translations for all 4 locales (en, ru, kk, tr):
   - `subServiceId`: The ID of the sub-service you just created
   - `locale`: en, ru, kk, or tr
   - `name`: Service name in that language
   - `description`: Service description in that language
8. Repeat step 7 for each locale

**Via SQL:**

```sql
-- 1. Insert sub-service
INSERT INTO sub_services (
  service_category_id,
  slug,
  price_usd,
  delivery_time_days,
  "order",
  is_active,
  created_at,
  updated_at
) VALUES (
  5,                              -- turkish-english-course category
  'language-turkish-advanced',    -- slug
  500.00,                         -- price in USD
  NULL,                           -- no delivery time
  3,                              -- display order
  true,                           -- active
  NOW(),
  NOW()
) RETURNING id;

-- 2. Insert translations (use the returned ID from step 1)
INSERT INTO sub_service_translations (
  sub_service_id,
  locale,
  name,
  description
) VALUES
  (21, 'en', 'Advanced Turkish', 'Master Turkish at an advanced level with native speakers'),
  (21, 'ru', 'Турецкий продвинутый уровень', 'Освойте турецкий на продвинутом уровне с носителями языка'),
  (21, 'kk', 'Жоғары деңгейдегі түрік тілі', 'Түрік тілін жоғары деңгейде меңгеріңіз'),
  (21, 'tr', 'İleri Seviye Türkçe', 'Anadili Türkçe olan öğretmenlerle Türkçeyi ileri seviyede öğrenin');
```

**Via Programmatic API (Future):**

```typescript
// This will be available in future versions
const repository = new ServiceRepository(prisma)

await repository.createSubService({
  serviceCategoryId: 5,
  slug: 'language-turkish-advanced',
  priceUsd: 500.0,
  order: 3,
  translations: [
    { locale: 'en', name: 'Advanced Turkish', description: '...' },
    { locale: 'ru', name: 'Турецкий продвинутый', description: '...' },
    { locale: 'kk', name: 'Жоғары түрік', description: '...' },
    { locale: 'tr', name: 'İleri Türkçe', description: '...' },
  ],
})
```

---

### Updating a Sub-Service

**Updating Price:**

```sql
UPDATE sub_services
SET price_usd = 550.00,
    updated_at = NOW()
WHERE slug = 'language-turkish-advanced'
  AND service_category_id = 5;
```

**Updating Delivery Time:**

```sql
UPDATE sub_services
SET delivery_time_days = 7,
    updated_at = NOW()
WHERE slug = 'translation-diploma';
```

**Updating Display Order:**

```sql
-- Reorder sub-services within a category
UPDATE sub_services
SET "order" = CASE slug
  WHEN 'language-turkish-beginner' THEN 1
  WHEN 'language-turkish-intermediate' THEN 2
  WHEN 'language-turkish-advanced' THEN 3
  WHEN 'language-english-beginner' THEN 4
  ELSE "order"
END,
updated_at = NOW()
WHERE service_category_id = 5;
```

**Updating Translations:**

```sql
UPDATE sub_service_translations
SET name = 'Новое название',
    description = 'Новое описание',
WHERE sub_service_id = 21
  AND locale = 'ru';
```

---

### Deactivating a Sub-Service

**Soft Delete (Recommended):**

```sql
-- Hide service from public view without deleting data
UPDATE sub_services
SET is_active = false,
    updated_at = NOW()
WHERE slug = 'language-turkish-advanced';
```

**Hard Delete (Use with Caution):**

```sql
-- This will cascade delete all translations
DELETE FROM sub_services
WHERE slug = 'language-turkish-advanced'
  AND service_category_id = 5;
```

---

## Managing Service Categories

### Adding a New Category

⚠️ **Warning**: Adding new categories requires code changes (new page routes). This is not recommended unless you're adding a new service page.

**Steps:**

1. Create new page route: `app/pages/services/[new-category].vue`
2. Add category to database:

```sql
INSERT INTO service_categories (slug, "order", is_active, created_at, updated_at)
VALUES ('new-category', 6, true, NOW(), NOW())
RETURNING id;

-- Add translations for all locales
INSERT INTO service_category_translations (
  service_category_id,
  locale,
  title,
  subtitle,
  slug,
  metadata
) VALUES
  (6, 'en', 'New Category', 'Category subtitle', 'new-category', NULL),
  (6, 'ru', 'Новая категория', 'Подзаголовок', 'novaya-kategoriya', NULL),
  (6, 'kk', 'Жаңа санат', 'Қосымша тақырып', 'zhana-sanat', NULL),
  (6, 'tr', 'Yeni Kategori', 'Alt başlık', 'yeni-kategori', NULL);
```

### Updating Category Metadata

Category metadata stores page-specific content (FAQ, features, etc.) as JSON.

```sql
UPDATE service_category_translations
SET metadata = '{
  "levelProgression": {
    "title": "Ваш прогресс по уровням",
    "levels": [
      {
        "from": "A1",
        "to": "A2",
        "outcome": "Базовые разговоры, повседневные задачи"
      }
    ]
  },
  "formatSchedule": {
    "title": "Формат обучения",
    "groupSize": "До 8 студентов в группе"
  }
}'::jsonb
WHERE service_category_id = 5
  AND locale = 'ru';
```

---

## Managing Exchange Rates

Exchange rates are automatically fetched from exchangerate-api.io every hour. Manual updates are rarely needed.

### Viewing Current Rates

```sql
SELECT target_currency, rate, fetched_at, expires_at
FROM exchange_rates
WHERE base_currency = 'USD'
  AND expires_at > NOW()
ORDER BY target_currency;
```

### Manually Updating Rates

```sql
-- Update a specific rate
UPDATE exchange_rates
SET rate = 455.00,
    fetched_at = NOW(),
    expires_at = NOW() + INTERVAL '1 hour'
WHERE base_currency = 'USD'
  AND target_currency = 'KZT';

-- Or insert if not exists
INSERT INTO exchange_rates (base_currency, target_currency, rate, fetched_at, expires_at)
VALUES ('USD', 'KZT', 455.00, NOW(), NOW() + INTERVAL '1 hour')
ON CONFLICT (base_currency, target_currency)
DO UPDATE SET
  rate = EXCLUDED.rate,
  fetched_at = EXCLUDED.fetched_at,
  expires_at = EXCLUDED.expires_at;
```

### Fallback Rates

If the external API fails, the system uses these fallback rates:

```typescript
{
  KZT: 450.0,
  TRY: 32.0,
  RUB: 90.0,
  USD: 1.0
}
```

To update fallback rates, edit `server/repositories/ExchangeRateRepository.ts`.

---

## Common Tasks

### Bulk Price Update

```sql
-- Increase all prices by 10%
UPDATE sub_services
SET price_usd = price_usd * 1.10,
    updated_at = NOW()
WHERE service_category_id = 5;
```

### Reorder All Sub-Services

```sql
-- Reset order based on current price (cheapest first)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY service_category_id ORDER BY price_usd) - 1 AS new_order
  FROM sub_services
  WHERE service_category_id = 5
)
UPDATE sub_services
SET "order" = ranked.new_order,
    updated_at = NOW()
FROM ranked
WHERE sub_services.id = ranked.id;
```

### Find Missing Translations

```sql
-- Find sub-services missing translations
SELECT ss.id, ss.slug, COUNT(sst.id) AS translation_count
FROM sub_services ss
LEFT JOIN sub_service_translations sst ON ss.id = sst.sub_service_id
GROUP BY ss.id, ss.slug
HAVING COUNT(sst.id) < 4;
```

---

## Validation Rules

### Sub-Service Constraints

- `slug`: Must be unique within category, lowercase, alphanumeric + hyphens
- `priceUsd`: Must be >= 0, max 999999.99
- `deliveryTimeDays`: Must be >= 1 if not null, max 365
- `order`: Must be >= 0
- **Translations**: Must have all 4 locales (en, ru, kk, tr)

### Category Constraints

- `slug`: Must be unique globally, must match page route
- `order`: Must be >= 0
- **Translations**: Must have all 4 locales

---

## Troubleshooting

### Service Not Appearing on Website

**Check:**

1. Is `isActive = true`?
2. Does it have translations for all 4 locales?
3. Is the category active?
4. Clear browser cache and refresh

```sql
-- Debug query
SELECT ss.*, sst.locale, sst.name
FROM sub_services ss
LEFT JOIN sub_service_translations sst ON ss.id = sst.sub_service_id
WHERE ss.slug = 'your-service-slug';
```

### Price Not Updating

**Check:**

1. Is the price in USD (not another currency)?
2. Did you clear the cache?
3. Check browser console for errors

```sql
-- Verify price
SELECT slug, price_usd, updated_at
FROM sub_services
WHERE slug = 'your-service-slug';
```

### Exchange Rates Not Refreshing

**Check:**

1. Are rates expired?
2. Is the external API accessible?
3. Check server logs for API errors

```sql
-- Check rate expiry
SELECT target_currency, rate, expires_at,
       CASE WHEN expires_at > NOW() THEN 'Valid' ELSE 'Expired' END AS status
FROM exchange_rates
WHERE base_currency = 'USD';
```

---

## Best Practices

1. **Always use transactions** for multi-step operations
2. **Test in development** before applying to production
3. **Backup database** before bulk updates
4. **Verify translations** for all 4 locales
5. **Use soft deletes** (`isActive = false`) instead of hard deletes
6. **Document changes** in a changelog or admin log
7. **Monitor exchange rates** weekly to ensure accuracy
8. **Keep slugs stable** - changing slugs breaks URLs

---

## Future Enhancements

The following features are planned for future releases:

- **Web-based Admin UI**: Manage services through a web interface
- **Bulk Import/Export**: CSV import/export for services
- **Translation Management**: UI for managing translations
- **Price History**: Track price changes over time
- **Audit Logs**: Track who changed what and when
- **Approval Workflow**: Require approval before changes go live

---

## Support

For questions or issues:

- Check database schema: `prisma/schema.prisma`
- Review API contracts: `specs/013-migrate-service-cards/contracts/`
- Contact development team

---

**Last Updated**: 2025-01-14  
**Version**: 1.0
