# План реализации динамических статистик на странице блога

## Обзор

- **Задача:** Сделать динамичными статистики "150+ полезных статей" и "100+ ответов на вопросы" на странице блога (`app/pages/blog.vue`). Заменить хардкод из i18n на реальные counts из DB (BlogArticle и Faq).
- **Предположения:**
  - "Статьи" = count опубликованных BlogArticle.
  - "Ответы" = count Faq (глобальный total).
  - Отображать как "X+" если X >= threshold (150 для статей, 100 для FAQ).
  - Глобальные counts, независимо от фильтров.
- **Подход:** Минимальные изменения: расширить существующий API блога, обновить фронт через store и computed.

## Шаги backend ✅

1. **Файл:** `server/api/v1/blog/articles/index.get.ts`.
2. **Изменения:**
   - ✅ Добавить импорт `FAQRepository`.
   - ✅ В try: После `result = await repository.findArticles(...)` добавить:
     ```
     const faqRepository = new FAQRepository(prisma);
     const faqResult = await faqRepository.findAll({ limit: 1 }, locale);
     const totalFAQs = faqResult.meta.total;
     ```
   - ✅ В return: Добавить `totalArticles: result.total, totalFAQs`.
3. **Типизация:** ✅ Обновить `BlogArticlesResponse` в types/api.

## Шаги frontend ✅

1. **Файл:** `app/stores/blog.ts`.
2. **Изменения:**
   - ✅ Добавить refs: `totalArticles = ref(0), totalFAQs = ref(0)`.
   - ✅ В `fetchArticles`: После `$fetch` присвоить `totalArticles.value = response.totalArticles ?? 0; totalFAQs.value = response.totalFAQs ?? 0;`.

3. **Файл:** `app/pages/blog.vue`.
4. **Изменения:**
   - ✅ В computed hero: Динамически переопределить stats:
     ```
     const articleCount = totalArticles.value >= 150 ? `${totalArticles.value}+` : totalArticles.value;
     const faqCount = totalFAQs.value >= 100 ? `${totalFAQs.value}+` : totalFAQs.value;
     base.stats[0]!.label = t('blog.hero.stats[0].label', { count: articleCount });
     base.stats[1]!.label = t('blog.hero.stats[1].label', { count: faqCount });
     ```
   - ✅ В i18n (e.g., ru/pages/blog.json): Изменить stats на шаблоны, e.g., "label": "{count} полезных статей".

## Тестирование

- Seed DB, проверить counts в /blog.
- Edge: counts=0, разные локали, с/без фильтров.
- Perf: Если медленно, добавить кэш в API.

Готов реализовать!
