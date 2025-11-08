<!--
Sync Impact Report
Version change: 1.2.0 → 1.3.0 (minor)
Modified principles: none
Added sections: VIII. Code Style & Minimalism
Removed sections: none
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no changes required
  - .specify/templates/spec-template.md ✅ no changes required
  - .specify/templates/tasks-template.md ✅ no changes required
Follow-up TODOs: none
-->

# edu.turkish Constitution

## Core Principles

### I. Structure & Architecture Discipline

- Code MUST follow the repository layout described in `README.md`:
  - UI/app code in `app/`
  - Server logic in `server/`
  - Prisma schema and migrations in `prisma/`
  - Locales in `i18n/locales/`
  - Shared types in `server/types/` and `server/types/api/`
  - Feature-specific components in `app/components/features/`; global/UI components under `app/components/**` as configured in `nuxt.config.ts`
- Data flow MUST be: frontend → Pinia store → fetch API (server endpoints). Components MUST NOT call repositories directly.
- Imports MUST use aliases defined in `tsconfig.json`.
- Ad-hoc folders and bypassing the structure above are NOT allowed.
  Rationale: Predictable structure reduces coupling, speeds onboarding, and simplifies testing/reviews.

### II. Content & Localization (i18n)

- Supported locales: `en`, `ru`, `kk`, `tr`. All user-facing strings (UI texts, validation messages, errors) MUST be translated for all supported locales.
- Static/UI strings MUST live in `i18n/locales/{locale}`; hard-coded literals in source are NOT allowed (except developer-only logs).
- Dynamic content MUST come from Directus. Multilingual fields MUST use `*_translations` tables (e.g., blog posts, reviews, universities and related entities).
- Any PR introducing texts MUST include keys for all locales and updates to validation messages.
  Rationale: Consistent multilingual UX and content integrity across markets.

### III. Data Access & Migrations (Prisma + Repository)

- Database access MUST go through repositories in `server/repositories/` using Prisma ORM. Direct SQL or ad-hoc data access is NOT allowed unless a justified exception is documented and reviewed.
- Any change to `prisma/schema.prisma` MUST produce a migration and be applied locally via `npm run db:migrate` (dev) and deployed via `npm run db:deploy` (prod).
- Repositories MUST expose typed APIs aligned with `server/types/api/`.
  Rationale: Controlled data layer, reproducible schema evolution, and type-safe contracts.

### IV. Partner Attribution & CRM (Bitrix)

- Visiting with `?ref=PARTNER` MUST set a cookie with the partner code for 30 days.
- Applications and messenger redirects MUST forward the partner code to Bitrix.
- Messenger redirects MUST go through `/routes/go/{telegram|instagram|whatsapp}` and MUST emit Bitrix events with the partner code before redirecting.
  Rationale: Accurate attribution for partners and reliable CRM analytics.

### V. UI, Styling, and Code Quality

- Styling MUST be unified via `app/assets/css` and `tailwind.config.ts`. Design tokens/utilities belong in these locations; no duplicate, page-local Tailwind config.
- ESLint and Prettier MUST pass on every PR. TypeScript type checks MUST pass. CI MUST run tests (Vitest) for changed areas at minimum.
- Components MUST be split into page-specific feature components under `app/components/features/` and global/UI components under `app/components/**`.
  Rationale: Consistent look & feel, maintainable components, and stable builds.

### VI. Imports & Aliases (Nuxt Auto-Import)

- Vue components MUST NOT be imported manually in SFCs. Nuxt auto-imports components from directories configured in `nuxt.config.ts -> components`.
- Directory conventions (enforced by configuration):
  - `app/components/layout`, `app/components/modals`, `app/components/shared` → global components (`global: true`)
  - `app/components/ui/*` → auto-imported with `Ui` prefix (e.g., `<UiButton />`)
  - `app/components/features/*` → no prefix (`pathPrefix: false`)
- Aliases (must match `tsconfig.json` and tests in `tests/config/*alias*.test.ts`):
  - `~/*` → `./app/*`
  - `~~/*` → `./*`
- Auto-import scope includes:
  - Composables from `~/composables/*`
  - Components from configured directories above
  - Nuxt internals like `NuxtPage`, `NuxtLayout`
- Explicit imports are REQUIRED only for:
  - External libraries and Pinia stores (e.g., `storeToRefs` from `pinia`, `useBlogStore`)
  - Type-only imports (TypeScript)
  - Server modules and utilities under `~~/server/*`
  - Dynamic/async components via `defineAsyncComponent` or `() => import('~/components/...')`
    Rationale: Auto-import reduces boilerplate and enforces consistent naming; explicit imports remain for external deps, types, server code, and lazy components.

### VII. Runtime Configuration & Environment Variables

- Variables accessed through `useRuntimeConfig()` MUST be explicitly declared in the `runtimeConfig` object in `nuxt.config.ts`.
- Setting environment variables with the `NUXT_*` prefix (e.g., `NUXT_VARIABLE_NAME`) does NOT automatically make them available in the application unless they are declared in `runtimeConfig`.
- Configuration structure:
  - Server-only variables: declared at the root level of `runtimeConfig` (accessible only in server-side code)
  - Public variables: declared under `runtimeConfig.public` (accessible in both client and server)
- Environment variable mapping:
  - Variables declared in `runtimeConfig` can be overridden by corresponding `NUXT_*` environment variables
  - Naming convention: `NUXT_VARIABLE_NAME` maps to `runtimeConfig.variableName`, `NUXT_PUBLIC_API_URL` maps to `runtimeConfig.public.apiUrl`
- All runtime configuration MUST have sensible defaults or empty strings in `nuxt.config.ts` to document what variables are expected.
  Rationale: Explicit configuration declaration prevents runtime errors from missing variables, provides self-documentation of required environment variables, and enforces a clear distinction between public and server-only configuration.

### VIII. Code Style & Minimalism

- Comments MUST be minimal. Code should be self-documenting through clear naming. Comments are allowed only for non-obvious business logic, complex algorithms, or external API quirks.
- Security validations and input checks MUST be minimal and pragmatic. Implement only essential validations required by the business logic. Avoid defensive programming patterns that add unnecessary complexity.
- Dependencies MUST be kept to a minimum. Before adding a new package, consider if the functionality can be implemented with existing dependencies or standard library features.
- Code MUST be concise and direct. Prefer straightforward implementations over abstraction layers unless the abstraction solves a concrete, recurring problem.
  Rationale: Minimal code is easier to read, maintain, and debug. Excessive comments become stale; unnecessary validations slow development; bloated dependencies increase bundle size and security surface.

## Additional Constraints & Infrastructure

- CMS: Directus is the single source of truth for dynamic content (blog, reviews, universities, etc.). Service access MUST use the configured `NUXT_PUBLIC_DIRECTUS_URL` and service tokens where needed.
- Scripts: Import/delete of universities and related entities from JSON, and translation propagation from `_translations` tables, MUST be maintained alongside schema changes.
- Infrastructure: Docker configs and infra logic live in `contrib/`. Application logic lives in `app/`. Reverse proxy (Caddy) settings reside in `contrib/Caddyfile` with domains from `.env`.
- Environment: `.env` MUST configure DB, Directus, Bitrix, and analytics as documented in `README.md` (see "🔒 Переменные окружения"). Secrets MUST NOT be hard-coded.
- API: Public endpoints live under `server/api/` (Nuxt Server API). Only these endpoints are called from the frontend; repositories are backend-only.

## Development Workflow & Quality Gates

- Before merging:
  - Lint, format, type-check, build, and tests MUST pass.
  - If DB schema changed → a Prisma migration MUST be included and verified locally.
  - If UI strings changed/added → i18n keys MUST be added for `en`, `ru`, `kk`, `tr`.
  - If features involve content → ensure Directus collections/flows and `*_translations` are updated.
  - If partner or messenger flows changed → ensure `/routes/go/*` endpoints emit Bitrix events and respect the `ref` cookie.
- Repository usage: Components/composables MUST call stores; stores MUST call server APIs; only server code calls repositories.
- Documentation: Update `README.md` or `/docs/*` when behavior, env vars, or external dependencies change.

## Governance

- This Constitution supersedes ad-hoc practices. All PRs and reviews MUST verify compliance with the Core Principles and Quality Gates.
- Amendment procedure:
  - Open a PR titled "Constitution Update: <summary>" with a change log and migration notes (if any).
  - Versioning policy: Semantic Versioning
    - MAJOR: Backward-incompatible governance/principle removals or redefinitions
    - MINOR: New principle/section added or materially expanded guidance
    - PATCH: Clarifications or non-semantic wording fixes
  - Upon merge, update dependent templates in `.specify/templates/*` for consistency.
- Compliance reviews are expected at planning (/plan), tasks (/tasks), and PR stages.

**Version**: 1.3.0 | **Ratified**: 2025-10-02 | **Last Amended**: 2025-11-08
