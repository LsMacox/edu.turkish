# Quickstart: Redesign Translation Documents Service Page

**Branch**: `015-redesign-translation-documents` | **Date**: 2025-01-08

## Prerequisites

- Node.js 18+ and pnpm installed
- Docker and Docker Compose running
- Development environment set up (see main README.md)

## Implementation Checklist

### Phase 1: Database & Seed Updates

- [ ] **1.1 Update seed file metadata structure**
  - File: `prisma/seed/services.ts` (lines 196-294)
  - Replace `priceCalculator` with `calculator` structure
  - Add `serviceCards` array (7 cards)
  - Apply to all 4 locales (en, ru, kk, tr)
  - See: [data-model.md - Seed Data Structure](./data-model.md#seed-data-structure)

- [ ] **1.2 Run seed script**

  ```bash
  pnpm db:seed
  ```

- [ ] **1.3 Verify database metadata**
  ```bash
  # Connect to database and check metadata
  pnpm db:studio
  # Navigate to ServiceCategoryTranslation table
  # Filter by serviceCategoryId for 'document-translations'
  # Verify metadata contains 'calculator' and 'serviceCards' for all locales
  ```

### Phase 2: i18n Updates

- [ ] **2.1 Add document-translations keys to Russian locale**
  - File: `i18n/locales/ru/services.json`
  - Add `services.document-translations.*` keys
  - Include: calculator, howItWorks, whyChooseUs, finalCTA sections
  - See: [data-model.md - i18n Data Structure](./data-model.md#i18n-data-structure)

- [ ] **2.2 Add document-translations keys to English locale**
  - File: `i18n/locales/en/services.json`
  - Translate all keys from Russian

- [ ] **2.3 Add document-translations keys to Kazakh locale**
  - File: `i18n/locales/kk/services.json`
  - Translate all keys from Russian

- [ ] **2.4 Add document-translations keys to Turkish locale**
  - File: `i18n/locales/tr/services.json`
  - Translate all keys from Russian

- [ ] **2.5 Verify i18n keys**
  ```bash
  pnpm i18n:check
  # Should pass with no missing keys
  ```

### Phase 3: Type Definitions

- [ ] **3.1 Add new type definitions**
  - File: `app/types/services.ts` or `server/types/api/services.ts`
  - Add: `DocumentType`, `UrgencyOption`, `ServiceCard`, `CalculatorMetadata`, `ServiceCategoryMetadata`
  - See: [contracts/component-interfaces.md - Type Definitions](./contracts/component-interfaces.md#type-definitions)

- [ ] **3.2 Update PriceCalculatorSectionProps**
  - Support both new and legacy structures
  - Add optional props for backward compatibility

- [ ] **3.3 Run type check**
  ```bash
  pnpm typecheck
  # Should pass with no errors
  ```

### Phase 4: Component Development

- [ ] **4.1 Create ServiceInfoCard component**
  - File: `app/components/features/services/ServiceInfoCard.vue`
  - Props: `title`, `description`, `icon`
  - Styling: White card, shadow, hover effect
  - See: [contracts/component-interfaces.md - ServiceInfoCard](./contracts/component-interfaces.md#serviceinfocard-vue)

- [ ] **4.2 Create FinalCTASection component**
  - File: `app/components/features/services/FinalCTASection.vue`
  - Props: `title`, `buttonText`, `icon`
  - Behavior: Opens ApplicationModal on button click
  - See: [contracts/component-interfaces.md - FinalCTASection](./contracts/component-interfaces.md#finalctasection-vue)

- [ ] **4.3 Modify PriceCalculatorSection component**
  - File: `app/components/features/services/sections/PriceCalculatorSection.vue`
  - Add submit button below price display
  - Support new `DocumentType[]` and `UrgencyOption[]` props
  - Handle `priceUsd: null` edge case (show "По запросу")
  - Emit 'submit' event with calculator context
  - Maintain backward compatibility with legacy props
  - See: [contracts/component-interfaces.md - PriceCalculatorSection](./contracts/component-interfaces.md#pricecalculatorsection-vue-modified)

- [ ] **4.4 Test components in isolation**
  ```bash
  # Create component tests
  pnpm test tests/components/features/ServiceInfoCard.test.ts
  pnpm test tests/components/features/FinalCTASection.test.ts
  pnpm test tests/components/features/PriceCalculatorSection.test.ts
  ```

### Phase 5: Page Component Updates

- [ ] **5.1 Update document-translations.vue**
  - File: `app/pages/services/document-translations.vue`
  - Remove: `SubServiceCard`, `UniversityRequirementsSection`, `SampleDocumentsSection`, `TrustIndicatorBadge`
  - Add: `ServiceInfoCard` rendering from metadata
  - Update: `PriceCalculatorSection` props and submit handler
  - Update: `howItWorksSteps` to read from document-translations i18n keys
  - Update: `whyChooseUsFactors` to read from document-translations i18n keys (5 factors)
  - Add: `FinalCTASection` at bottom
  - See: [contracts/component-interfaces.md - document-translations.vue](./contracts/component-interfaces.md#document-translations-vue-page-component)

- [ ] **5.2 Implement calculator submit handler**

  ```typescript
  const handleCalculatorSubmit = (event: CalculatorSubmitEvent) => {
    const modal = useApplicationModalStore()
    const serviceName = `${event.selectedDocumentType.name} + ${event.selectedUrgency.name}`
    const priceDisplay =
      event.calculatedPriceUsd === null ? 'by_request' : event.calculatedPriceFormatted

    modal.openModal({
      source: 'service_page',
      description: serviceName,
      serviceContext: {
        subServiceName: serviceName,
        source: 'service-page',
        sourceDescription: `Перевод документа: ${event.selectedDocumentType.name}`,
        price: priceDisplay,
      },
    })
  }
  ```

### Phase 6: Testing

- [ ] **6.1 Create contract tests**
  - File: `tests/contract/service-metadata.contract.test.ts`
  - Validate metadata structure matches schema
  - Test all 4 locales have matching structure
  - See: [data-model.md - Data Validation](./data-model.md#data-validation)

- [ ] **6.2 Create unit tests**
  - File: `tests/unit/calculator-price.test.ts`
  - Test price calculations (basePrice + surcharge)
  - Test "Остальное" edge case (priceUsd: null)
  - Test currency conversion

- [ ] **6.3 Create component tests**
  - Files: `tests/components/features/*.test.ts`
  - Test ServiceInfoCard rendering
  - Test PriceCalculatorSection interactions and submit event
  - Test FinalCTASection modal opening

- [ ] **6.4 Run all tests**
  ```bash
  pnpm test
  # All tests should pass
  ```

### Phase 7: Visual QA

- [ ] **7.1 Start development server**

  ```bash
  pnpm dev
  ```

- [ ] **7.2 Verify page in Russian locale**
  - Navigate to: `http://localhost:3000/ru/services/document-translations`
  - Check: Hero section displays new title and subtitle
  - Check: 7 service cards render without prices
  - Check: Calculator shows 6 document types, 2 language pairs, 2 urgency options
  - Check: Calculator updates price in real-time
  - Check: "Остальное" shows "По запросу"
  - Check: Submit button opens modal with correct context
  - Check: 4 process steps display correctly
  - Check: 5 trust factors display correctly
  - Check: Final CTA section appears at bottom

- [ ] **7.3 Verify page in other locales**
  - Test: English (`/en/services/document-translations`)
  - Test: Kazakh (`/kk/services/document-translations`)
  - Test: Turkish (`/tr/services/document-translations`)

- [ ] **7.4 Test responsive design**
  - Mobile (320px, 375px, 425px)
  - Tablet (768px, 1024px)
  - Desktop (1280px, 1440px)

- [ ] **7.5 Test edge cases**
  - Missing metadata.serviceCards (section should not render)
  - Calculator with "Остальное" selected (show "По запросу")
  - Exchange rates not loaded (fallback to USD)

### Phase 8: Code Quality

- [ ] **8.1 Run linter**

  ```bash
  pnpm lint
  # Fix any issues
  pnpm lint:fix
  ```

- [ ] **8.2 Run formatter**

  ```bash
  pnpm format:check
  # Fix any issues
  pnpm format
  ```

- [ ] **8.3 Run type checker**

  ```bash
  pnpm typecheck
  # Should pass with no errors
  ```

- [ ] **8.4 Run tests**

  ```bash
  pnpm test
  # All tests should pass
  ```

- [ ] **8.5 Build application**
  ```bash
  pnpm build
  # Should build successfully
  ```

### Phase 9: Documentation

- [ ] **9.1 Update README if needed**
  - Document any new environment variables
  - Update seed data instructions if changed

- [ ] **9.2 Add migration notes**
  - Document metadata structure change
  - Note backward compatibility for other services

### Phase 10: Pre-Merge Checklist

- [ ] **10.1 Constitution compliance**
  - ✅ Structure & Architecture: Follows repository layout
  - ✅ Data Flow: Components → API → Repository
  - ✅ Imports: Uses ~ and ~~ aliases
  - ✅ i18n: All 4 locales updated
  - ✅ Data Access: Via repositories only
  - ✅ UI & Styling: Unified Tailwind config
  - ✅ Code Quality: ESLint, Prettier, TypeScript pass

- [ ] **10.2 All tests pass**

  ```bash
  pnpm test
  ```

- [ ] **10.3 Build succeeds**

  ```bash
  pnpm build
  ```

- [ ] **10.4 Visual regression tests** (if available)
  - Screenshot comparison for page sections

- [ ] **10.5 Performance check**
  - Page loads in <3s on 3G
  - Calculator updates in <100ms

---

## Quick Commands Reference

```bash
# Setup
pnpm install
pnpm setup:dev

# Database
pnpm db:seed              # Seed database with new metadata
pnpm db:studio            # Open Prisma Studio to verify data

# Development
pnpm dev                  # Start dev server
pnpm typecheck            # Run TypeScript type checking
pnpm lint                 # Run ESLint
pnpm lint:fix             # Fix linting issues
pnpm format               # Format code with Prettier
pnpm format:check         # Check code formatting

# Testing
pnpm test                 # Run all tests
pnpm test:watch           # Run tests in watch mode
pnpm i18n:check           # Verify i18n keys

# Build
pnpm build                # Build for production
```

---

## Troubleshooting

### Issue: Metadata not appearing after seed

**Solution**:

```bash
# 1. Check if seed script ran successfully
pnpm db:seed

# 2. Verify in database
pnpm db:studio
# Navigate to ServiceCategoryTranslation, check metadata field

# 3. If still missing, try resetting database
pnpm db:migrate:reset
pnpm db:seed
```

### Issue: Calculator not showing new structure

**Solution**:

1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Verify API response in Network tab
4. Check component props in Vue DevTools

### Issue: i18n keys missing

**Solution**:

```bash
# Run i18n check
pnpm i18n:check

# Add missing keys to all locales
# Files: i18n/locales/{en,ru,kk,tr}/services.json
```

### Issue: TypeScript errors

**Solution**:

```bash
# Run type check to see all errors
pnpm typecheck

# Common fixes:
# - Add type definitions to app/types/services.ts
# - Import types in component files
# - Check prop types match interface definitions
```

### Issue: Tests failing

**Solution**:

```bash
# Run specific test to see error
pnpm test tests/contract/service-metadata.contract.test.ts

# Common fixes:
# - Update test mocks with new metadata structure
# - Add new props to component test fixtures
# - Verify seed data matches test expectations
```

---

## Development Workflow

1. **Branch**: Create feature branch from main

   ```bash
   git checkout -b 015-redesign-translation-documents
   ```

2. **Implement**: Follow checklist phases 1-9

3. **Test**: Run all quality checks (phase 8)

4. **Commit**: Make atomic commits with clear messages

   ```bash
   git add .
   git commit -m "feat: add ServiceInfoCard component"
   ```

5. **Push**: Push to remote repository

   ```bash
   git push origin 015-redesign-translation-documents
   ```

6. **Review**: Create pull request, ensure all checks pass

7. **Merge**: Merge to main after approval

---

## Success Criteria Validation

Before marking complete, verify all success criteria from spec.md:

- [ ] **SC-001**: Calculator interaction completes in <10 seconds
- [ ] **SC-002**: Submit button opens modal with correct context (100% cases)
- [ ] **SC-003**: All 7 service cards visible on mobile without horizontal scroll
- [ ] **SC-004**: Page loads all sections in <3s on 3G
- [ ] **SC-005**: Calculator price updates in <100ms
- [ ] **SC-006**: All 4 locales fully translated with no missing keys
- [ ] **SC-007**: (Post-deployment) Conversion rate increases by 15%+ within 30 days

---

## Next Steps

After completing implementation:

1. **Deploy to staging**: Test in staging environment
2. **Stakeholder review**: Get approval from product team
3. **Deploy to production**: Follow deployment workflow
4. **Monitor metrics**: Track conversion rate and user engagement
5. **Iterate**: Gather feedback and make adjustments as needed

See **tasks.md** (generated via `/tasks` command) for detailed implementation tasks with dependencies and time estimates.
