# Feature 008: Service Pages with Multi-Currency Support

## Overview

Service category pages with sub-services, multi-currency pricing (KZT, TRY, RUB, USD), and enhanced application modal to show which sub-service user is applying for.

## Status

**Current Phase**: Tasks Generated ✅  
**Next Step**: Begin implementation (35 tasks ready)

## Key Files

- **[spec.md](./spec.md)**: Feature specification with requirements
- **[plan.md](./plan.md)**: Implementation plan (this phase)
- **[research.md](./research.md)**: Research decisions and rationale
- **[data-model.md](./data-model.md)**: Data structures and types
- **[quickstart.md](./quickstart.md)**: Validation scenarios
- **[tasks.md](./tasks.md)**: 35 implementation tasks (ready to execute)
- **contracts/**: Component and i18n contracts

## Architecture Summary

### Pages (5 total)

- `/services/relocation-in-turkey`
- `/services/tr-yos-courses`
- `/services/sat-courses`
- `/services/turkish-english-course`
- `/services/document-translations`

### New Components

- `ServicePageLayout.vue` - Shared layout for all service pages
- `SubServiceCard.vue` - Display sub-service with pricing and apply button
- `CurrencyPrice.vue` - Reactive price display with currency symbol

### Enhanced Components

- `SiteHeader.vue` - Add currency selector dropdown
- `ApplicationModal.vue` - Show sub-service context when applying

### State Management

- `stores/currency.ts` - Pinia store for currency selection
- `composables/useCurrency.ts` - Currency utilities and formatting
- `composables/useApplicationModal.ts` - Enhanced for sub-service context

### i18n Structure

```
i18n/locales/{en,ru,kk,tr}/services.json
{
  "services": {
    "{category-id}": {
      "title": "...",
      "subtitle": "...",
      "subServices": {
        "{sub-service-id}": {
          "name": "...",
          "description": "...",
          "pricing": {
            "KZT": "...",
            "TRY": "...",
            "RUB": "...",
            "USD": "..."
          }
        }
      }
    }
  },
  "currency": { ... },
  "modal": { ... }
}
```

## Constitutional Compliance

✅ **Full Compliance** - No violations

- Architecture: Proper directory structure (app/, i18n/, tests/)
- i18n: All 4 locales (en, ru, kk, tr)
- Components: Nuxt auto-import, proper organization
- State: Pinia store pattern
- No database changes
- No new dependencies
- Existing modal reused

## Implementation Estimate

**Complexity**: Medium  
**Estimated Tasks**: 30-35  
**Key Risks**: Modal enhancement (mitigated by thorough testing)

### Task Breakdown

1. Foundation (types, store, composables): ~5 tasks
2. i18n content (4 locales): ~4 tasks
3. Components (new + enhancements): ~8 tasks
4. Pages (5 service pages): ~5 tasks
5. Integration & testing: ~8 tasks
6. Validation: ~5 tasks

## Next Steps

1. ✅ ~~Run `/tasks` command to generate tasks.md~~
2. ✅ ~~Review and approve task list~~ (35 tasks generated)
3. **Begin implementation following TDD approach** ← YOU ARE HERE
   - Start with T001-T003 (foundation)
   - Then T004-T011 (i18n content)
   - Follow TDD for components (tests first)
4. Execute quickstart validation scenarios (T034)
5. Merge to main after all checks pass

## Notes

- **Sub-services per category**: ~3-5 each (total ~15-20)
- **Currency persistence**: localStorage (client-side only)
- **Modal backward compatibility**: Maintained (works with/without sub-service context)
- **Performance target**: <200ms page load, instant currency switching
