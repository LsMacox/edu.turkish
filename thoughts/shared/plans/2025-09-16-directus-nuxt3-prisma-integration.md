# Directus integration for Nuxt 3 + Prisma + MySQL

## Overview

Integrate Directus (headless CMS) to manage:
- Reviews and FAQ using existing MySQL tables
- Homepage content with translations
- Future blog (posts, categories, tags)

Admin UI must be attractive, with roles/permissions and media uploads. Nuxt frontend consumes Directus REST/GraphQL API.

## Current State Analysis

- Nuxt 4 app with `@nuxtjs/i18n` (ru, kk, en, tr). Routes are prefixed, content JSON under `i18n/locales`.
- MySQL via Prisma models exist for `Review`, `ReviewTranslation`, `FaqItem`, `FaqTranslation`, `FaqCategory`, `FaqCategoryTranslation`, plus university domain.
- Public API routes already provide `/api/v1/reviews`, `/api/v1/content/faq` etc. Content currently sourced from DB via Prisma and/or JSON translations.
- Docker Compose provides MySQL + Adminer. No Directus yet.

## Desired End State

- Directus runs alongside app (dockerized). Uses the SAME MySQL database/schema.
- Collections map to existing tables using Directus relational collections and translations pattern.
- Editors manage Reviews, FAQ, Homepage content (hero, sections, CTAs) with localized fields.
- Media uploaded via Directus Files; URLs used by Nuxt Image.
- Roles: Admin, Editor (content), Viewer (read-only API). Login via email/password initially.
- Frontend reads via Directus SDK/REST from a public, read-only role with restricted fields.

### Key Discoveries
- Prisma models already normalized for translations (locale-specific tables). This aligns well with Directus multilingual via relational collections per-locale.
- Homepage content is currently in i18n JSON files; we’ll migrate Home page dynamic blocks to Directus while keeping UI keys for static UI copy.

## What We're NOT Doing
- Replacing all JSON UI translations with CMS. Only dynamic homepage content moves.
- Building custom Directus extensions beyond simple display presets.
- SSO integration (can be added later).

## Implementation Approach

Use Directus self-hosted container connected to existing MySQL. Create collections that map to existing tables (`reviews`, `review_translations`, `faq_items`, `faq_translations`, `faq_categories`, `faq_category_translations`) and define relations. Add new collections for homepage blocks and for future blog (posts/categories/tags) with translated fields. Configure roles/permissions to enable public read for specific endpoints and authenticated write for editors. Update Nuxt data layer to read from Directus instead of internal Prisma for the content areas.

## Phase 1: Directus bootstrap & infrastructure

### Overview
Provision Directus locally with Docker, connect to existing DB, and initialize base configuration.

### Changes Required

#### 1. Docker Compose
**File**: `docker-compose.yml`
**Changes**: Add a `directus` service; mount uploads; configure env; depend on mysql.

```yaml
services:
  directus:
    image: directus/directus:latest
    container_name: edu_turkish_directus
    restart: unless-stopped
    ports:
      - "8055:8055"
    environment:
      KEY: ${DIRECTUS_KEY:-insecure_local_key}
      SECRET: ${DIRECTUS_SECRET:-insecure_local_secret}
      DB_CLIENT: mysql
      DB_HOST: mysql
      DB_PORT: 3306
      DB_DATABASE: ${DB_NAME:-edu_turkish}
      DB_USER: ${DB_USER:-edu_turkish_user}
      DB_PASSWORD: ${DB_PASSWORD:-secure_password_123}
      WEBSOCKETS_ENABLED: "true"
      ADMIN_EMAIL: ${DIRECTUS_ADMIN_EMAIL:-admin@example.com}
      ADMIN_PASSWORD: ${DIRECTUS_ADMIN_PASSWORD:-ChangeMe123!}
      CORS_ENABLED: "true"
      CORS_ORIGIN: "http://localhost:3000"
      PUBLIC_URL: ${DIRECTUS_PUBLIC_URL:-http://localhost:8055}
      STORAGE_LOCATIONS: local
    volumes:
      - ./uploads:/directus/uploads
    depends_on:
      - mysql
    networks:
      - edu_turkish_network
```

#### 2. Env
**File**: `.env.example`
**Changes**: Add Directus secrets and public URL.

```bash
DIRECTUS_KEY=
DIRECTUS_SECRET=
DIRECTUS_PUBLIC_URL=http://localhost:8055
DIRECTUS_ADMIN_EMAIL=admin@example.com
DIRECTUS_ADMIN_PASSWORD=ChangeMe123!
```

#### 3. Directus schema management (optional)
Add a `directus/` folder to store snapshot/config exports for CI/CD reproducibility.

### Success Criteria

#### Automated Verification
- [x] `docker-compose up -d directus | cat` starts Directus and health-check passes
- [x] Directus responds: `curl -sSf http://localhost:8055/server/health`

Note: Switched uploads to a named Docker volume `directus_uploads` to avoid host bind permission issues under WSL2.

#### Manual Verification
- [ ] Admin UI opens at http://localhost:8055 and first admin user created
- [ ] Can upload a file and see it in Files library

---

## Phase 2: Map existing tables to Directus collections

### Overview
Expose existing Prisma tables as Directus collections with proper relations and translations.

### Changes Required

#### 1. Create Collections (no DB changes)
- reviews -> `reviews`
- review_translations -> `review_translations`
- faq_items -> `faq_items`
- faq_translations -> `faq_translations`
- faq_categories -> `faq_categories`
- faq_category_translations -> `faq_category_translations`

Use “Existing Table” option in Directus to link. Ensure primary keys/foreign keys recognized. Add fields display names and interfaces.

#### 2. Relations
- `review_translations.review_id` → M2O to `reviews.id`
- `faq_translations.faq_id` → M2O to `faq_items.id`
- `faq_items.category_id` → M2O to `faq_categories.id`
- `faq_category_translations.category_id` → M2O to `faq_categories.id`

#### 3. Localization pattern
Use `locale` string field as a filterable attribute. Create a composite “Translations” display via Relational display presets, or Collections with “translation per locale” views.

#### 4. Admin UI
Configure layouts, default filters (e.g., locale = ru), and field interfaces (textarea, WYSIWYG for `quote`/`answer`).

### Success Criteria

#### Automated Verification
- [ ] Directus `/items/reviews?limit=1` returns data
- [ ] Directus `/items/faq_items?limit=1&fields=*,translations.*` returns joined data

#### Manual Verification
- [ ] Editors can create/edit review+translation records
- [ ] Editors can manage FAQ categories and items with translations

---

## Phase 3: Homepage content model with translations

### Overview
Move dynamic homepage content blocks to Directus while keeping static UI copy in i18n JSON.

### Changes Required

#### 1. Collections
- `home_pages` (singleton = true): per-locale records or a base singleton
- `home_sections` (repeater): keyed blocks with order and visibility
- `home_translations`: if using normalized translations table with `locale`

Suggested schema (normalized):
- `home_page` (id, created_at, updated_at)
- `home_translation` (id, home_id, locale, hero_title, hero_subtitle, hero_cta_text, sections_json)
- Alternatively, use Directus “Translations” field set pattern within a single collection.

#### 2. Media
Use Directus Files field for hero image, gallery, and icons. Store file ids and render via `@nuxt/image` using `directus.files.getAssetUrl`.

#### 3. Migration of content
Seed initial values by importing from existing `i18n/locales/*/pages/home.json` into Directus via a small script or manual copy.

### Success Criteria

#### Automated Verification
- [ ] `/items/home_translation?filter[locale][_eq]=ru` returns expected fields

#### Manual Verification
- [ ] Homepage renders correctly across locales using Directus data

---

## Phase 4: Roles & permissions, public API hardening

### Overview
Define roles: Admin, Editor; restrict write access; define Public role with read-only to selected collections/fields.

### Changes Required

- Configure Public role: allow `read` for `reviews`, `review_translations`, `faq_*`, `home_*` with field-level restrictions (no internal metadata).
- Disable create/update/delete for Public.
- Create `Editor` role with full CRUD on these collections and Files.
- Optional: enable rate-limits/revisions; configure flows for publish status (add `status` field and use `status=published`).

### Success Criteria

#### Automated Verification
- [ ] Public GET to `/items/reviews` works without auth and respects field whitelist

#### Manual Verification
- [ ] Editor cannot change system settings; Admin can

---

## Phase 5: Nuxt data fetching via Directus API

### Overview
Replace Prisma-based fetchers for Reviews/FAQ/Homepage with Directus client in server routes/composables.

### Changes Required

#### 1. Install SDK
`npm i @directus/sdk`  ✅ done

#### 2. Runtime config
Add envs for Directus URL and optional static token for server-side requests.

- `NUXT_PUBLIC_DIRECTUS_URL` ✅ wired
- `DIRECTUS_STATIC_TOKEN` (server-only) ✅ wired

#### 3. Server utilities
Create `server/utils/directus.ts` factory to create SDK clients for server (token) and public (no token). ✅ created

#### 4. Update API handlers
- `server/api/v1/reviews.get.ts`: fetch from `/items/reviews` joined with translations by locale.
- `server/api/v1/content/faq.get.ts`: fetch `faq_categories` + `faq_items` with translations filtered by locale.
- `app/pages/index.vue` data/composables: read homepage blocks via server route or directly from SDK on server.
Note: Left the endpoints on Prisma until Phase 2 maps Directus collections.

#### 5. Caching
Leverage Nuxt `routeRules` headers and Nitro caching for Directus responses.

### Success Criteria

#### Automated Verification
- [ ] Typecheck passes: `npm run typecheck` (or `tsc --noEmit`)
- [ ] Lint passes: `npm run lint`
- [ ] Reviews API returns same shape as before
- [ ] FAQ API returns same shape as before

#### Manual Verification
- [ ] No visual regressions on Reviews/FAQ pages
- [ ] Home renders with CMS-managed content

---

## Phase 6: Blog (posts, categories, tags) for future launch

### Overview
Introduce blog collections with translations and status workflow.

### Changes Required

Collections:
- `blog_categories`, `blog_category_translations`
- `blog_tags`, `blog_tag_translations`
- `blog_posts`, `blog_post_translations`, `blog_post_tags` (M2M)

Key fields:
- posts: slug (per-locale), title, excerpt, body (Markdown/WYSIWYG), cover_image (file), published_at, status

### Success Criteria

#### Automated Verification
- [ ] `/items/blog_posts?filter[status][_eq]=published` works

#### Manual Verification
- [ ] Editor can create localized post with media; appears on the site when published

---

## Testing Strategy

### Unit Tests
- Transform functions mapping Directus payloads to existing API response shapes
- Locale filtering and fallback logic

### Integration Tests
- Endpoints `/api/v1/reviews`, `/api/v1/content/faq` against a seeded Directus dataset

### Manual Testing Steps
1. Create a review + translation in Directus and verify on `/ru/reviews`
2. Create FAQ category and item with translations; verify `/ru/faq`
3. Update homepage hero text in Directus; verify landing

## Performance Considerations
- Use `fields` param to limit payload
- Use `filter` + `deep` to constrain joined data
- Cache at Nitro layer; enable CDN caching for assets

## Migration Notes
- No DB schema changes required for Reviews/FAQ
- New tables for homepage/blog are additive; create Prisma models later or keep CMS-managed only
- Provide one-time content migration script for homepage JSON -> Directus

## References
- Directus Docs: `https://docs.directus.io/`
- Nuxt + Directus SDK: `https://docs.directus.io/reference/sdk/`
