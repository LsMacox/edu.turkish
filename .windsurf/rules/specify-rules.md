# edu.turkish Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-03

## Active Technologies

- TypeScript 5.9, Node.js (Nuxt 4.1.3) + Nuxt 4, BullMQ 5.61, IORedis 5.8, Telegram Bot API (via fetch) (010-call-activity-espocrm)
- Redis (queue), MySQL (Prisma for audit logs if needed) (010-call-activity-espocrm)

- TypeScript 5.x, Vue 3 (Composition API), Nuxt 3 + Nuxt 3, Vue 3, Tailwind CSS, Pinia, Vitest (008-1-2-3)
- i18n JSON files for content, localStorage/cookies for currency preference (008-1-2-3)

- TypeScript 5.9.3, Vue 3.5.22, Nuxt 4.1.3 + Nuxt Image (@nuxt/image 1.11.0), Nuxt runtime config (007-cdn-replacement-for)
- N/A (CDN external, no local storage) (007-cdn-replacement-for)

- TypeScript (Nuxt 3 / Node.js) + Prisma ORM, Nuxt 3, Zod (validation) (002-remove-hardcoded-directions)
- MySQL database (existing tables: `study_directions`, `study_direction_translations`, `university_pivot_study_directions`) (002-remove-hardcoded-directions)
- TypeScript 5.9.2, Vue 3.5.20 + Nuxt 4.1.0, Vitest 3.2.4, Prisma 6.15.0, Pinia 3.0.3 (003-)
- MySQL (via Prisma ORM) (003-)
- TypeScript 5.9, Vue 3.5.20, Nuxt 4.1.0 + Nuxt 4 (with auto-import), Vitest 3.2.4, vite-tsconfig-paths 5.1.4 (004-standardize-imports-to)
- N/A (refactoring task) (004-standardize-imports-to)
- TypeScript 5.x, Node.js 22 + Nuxt 3, Prisma ORM, Redis (ioredis), EspoCRM (latest stable), Docker, Caddy (005-espocrm-crm-bitrix)
- MySQL 8.0 (existing + new dedicated EspoCRM database), Redis for queue persistence (005-espocrm-crm-bitrix)
- TypeScript 5.9.3, Node.js (via Nuxt 4.1.3) + Vitest 3.2.4, @nuxt/test-utils 3.19.2, @vue/test-utils 2.4.6, Prisma 6.16.3, ioredis 5.8.1, bullmq 5.61.0 (006-vitest-config-ts)
- Mock Prisma Client (test), Mock Redis Client (test) (006-vitest-config-ts)

- TypeScript 5.9+ (Node.js runtime via tsx) + Node.js fs/path modules, glob pattern matching for file discovery (001-i18n)

## Project Structure

```
backend/
frontend/
tests/
```

## Commands

npm test [ONLY COMMANDS FOR ACTIVE TECHNOLOGIES][ONLY COMMANDS FOR ACTIVE TECHNOLOGIES] npm run lint

## Code Style

TypeScript 5.9+ (Node.js runtime via tsx): Follow standard conventions

## Recent Changes

- 010-call-activity-espocrm: Added TypeScript 5.9, Node.js (Nuxt 4.1.3) + Nuxt 4, BullMQ 5.61, IORedis 5.8, Telegram Bot API (via fetch)

- 008-1-2-3: Added TypeScript 5.x, Vue 3 (Composition API), Nuxt 3 + Nuxt 3, Vue 3, Tailwind CSS, Pinia, Vitest

- 007-cdn-replacement-for: Added TypeScript 5.9.3, Vue 3.5.22, Nuxt 4.1.3 + Nuxt Image (@nuxt/image 1.11.0), Nuxt runtime config

- 006-vitest-config-ts: Added TypeScript 5.9.3, Node.js (via Nuxt 4.1.3) + Vitest 3.2.4, @nuxt/test-utils 3.19.2, @vue/test-utils 2.4.6, Prisma 6.16.3, ioredis 5.8.1, bullmq 5.61.0

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
