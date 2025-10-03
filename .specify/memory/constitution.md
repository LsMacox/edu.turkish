<!--
Sync Impact Report
Version change: N/A → 1.0.0 (initial adoption)
Modified principles: (initial set)
Added sections: Core Principles; Additional Constraints & Infrastructure; Development Workflow & Quality Gates; Governance
Removed sections: none
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ updated
  - .specify/templates/spec-template.md ✅ no changes
  - .specify/templates/tasks-template.md ✅ updated
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
  - Feature-specific components in `app/components/features/`; global/UI components in `components/` (globally available per `nuxt.config.ts`)
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
- Components MUST be split into page-specific feature components under `app/components/features/` and global/UI components under `components/`.
  Rationale: Consistent look & feel, maintainable components, and stable builds.

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

**Version**: 1.0.0 | **Ratified**: 2025-10-02 | **Last Amended**: 2025-10-02
