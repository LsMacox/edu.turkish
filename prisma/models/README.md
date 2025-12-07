# Prisma Schema Modules

This directory contains the Prisma schema split by domain for better maintainability.

## Structure

| File                   | Domain        | Models                                   |
| ---------------------- | ------------- | ---------------------------------------- |
| `base.prisma`          | Configuration | Generator, datasource, shared enums      |
| `location.prisma`      | Geography     | Country, City + translations             |
| `university.prisma`    | Universities  | University, Programs, Facilities, etc.   |
| `blog.prisma`          | Blog          | BlogArticle, BlogCategory + translations |
| `faq.prisma`           | FAQ           | Faq, FaqCategory + translations          |
| `application.prisma`   | Applications  | Application                              |
| `exchange-rate.prisma` | Currency      | ExchangeRate                             |

## Usage

These files are **reference documentation only**. The actual schema used by Prisma is still `prisma/schema.prisma`.

### Why split files?

1. **Readability** — 800+ lines in one file is hard to navigate
2. **Domain separation** — Clear boundaries between concerns
3. **Documentation** — Each domain is self-contained

### Future: Automated merging

To use split schemas with Prisma, install `prisma-import`:

```bash
pnpm add -D prisma-import
```

Then update `package.json`:

```json
{
  "scripts": {
    "prisma:merge": "prisma-import --schemas 'prisma/models/*.prisma' --output prisma/schema.prisma"
  }
}
```

Run before any Prisma command:

```bash
pnpm prisma:merge && pnpm db:generate
```

## Conventions

1. **One domain per file** — Keep related models together
2. **Enums in base.prisma** — Shared across domains
3. **Comments for imports** — Document cross-domain dependencies
4. **Translations alongside parent** — Keep `*Translation` models with their parent
