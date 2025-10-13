# API Contracts for Enhanced Service Pages

This directory contains TypeScript interfaces and schemas that define the contracts for the enhanced service pages feature.

## Files

### `types.ts`

Core TypeScript interfaces for data structures:

- `ProcessStep` - Single step in "How It Works" workflow
- `TrustFactor` - Single credibility factor in "Why Choose Us" section
- `TrustIndicator` - Decorative trust badge
- Helper interfaces for component sections
- Type guards for runtime validation

**Usage**: Add these types to `app/types/services.ts` in the main codebase.

### `component-props.ts`

Vue component prop interfaces:

- Props for all new components (HowItWorksSection, ProcessStep, etc.)
- Props for modified components (SubServiceCard, ServicePageLayout)
- Emits interfaces for event handling
- Slots interfaces for layout components

**Usage**: Import and use with `defineProps<T>()` in Vue components.

### `i18n-schema.json`

JSON Schema for i18n content validation:

- Validates structure of service page translations
- Ensures all required fields are present
- Defines max lengths and patterns for content
- Includes example data structure

**Usage**: Reference for content editors, optionally use for automated validation.

## Integration Instructions

1. **Copy types to codebase**:

   ```bash
   # Merge types.ts content into:
   cp contracts/types.ts ../../../app/types/services-enhanced.ts
   # Or manually copy interface definitions into existing app/types/services.ts
   ```

2. **Reference component props**:

   ```typescript
   // In your Vue component
   import type { HowItWorksSectionProps } from '@/types/services'

   interface Props extends HowItWorksSectionProps {}
   const props = defineProps<Props>()
   ```

3. **Validate i18n content**:
   ```bash
   # Use i18n-schema.json with JSON schema validators
   # Or reference manually when creating translation files
   ```

## Type Safety

All interfaces are designed for full TypeScript type safety:

- Required fields are enforced at compile time
- Optional fields are explicitly marked with `?`
- Generic types support flexible usage patterns
- Type guards enable runtime validation when needed

## Maintenance

When adding new features to service pages:

1. Update interfaces in this directory first
2. Document changes in this README
3. Copy updated types to codebase
4. Update schema if i18n structure changes
5. Run `pnpm typecheck` to verify no breaking changes

## Version

**Created**: 2025-10-12  
**Feature**: Enhanced Service Pages (011-)  
**Last Updated**: 2025-10-12
