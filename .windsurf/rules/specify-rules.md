# edu.turkish Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-03

## Active Technologies
- TypeScript (Nuxt 3 / Node.js) + Prisma ORM, Nuxt 3, Zod (validation) (002-remove-hardcoded-directions)
- MySQL database (existing tables: `study_directions`, `study_direction_translations`, `university_pivot_study_directions`) (002-remove-hardcoded-directions)
- TypeScript 5.9.2, Vue 3.5.20 + Nuxt 4.1.0, Vitest 3.2.4, Prisma 6.15.0, Pinia 3.0.3 (003-)
- MySQL (via Prisma ORM) (003-)
- TypeScript 5.9, Vue 3.5.20, Nuxt 4.1.0 + Nuxt 4 (with auto-import), Vitest 3.2.4, vite-tsconfig-paths 5.1.4 (004-standardize-imports-to)
- N/A (refactoring task) (004-standardize-imports-to)

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
- 004-standardize-imports-to: Added TypeScript 5.9, Vue 3.5.20, Nuxt 4.1.0 + Nuxt 4 (with auto-import), Vitest 3.2.4, vite-tsconfig-paths 5.1.4
- 003-: Added TypeScript 5.9.2, Vue 3.5.20 + Nuxt 4.1.0, Vitest 3.2.4, Prisma 6.15.0, Pinia 3.0.3
- 002-remove-hardcoded-directions: Added TypeScript (Nuxt 3 / Node.js) + Prisma ORM, Nuxt 3, Zod (validation)


<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
