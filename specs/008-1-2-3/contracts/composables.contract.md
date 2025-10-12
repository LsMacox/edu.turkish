# Composables Contracts

## useCurrency.ts

**Purpose**: Composable for currency management and formatting

**Exports**:

```typescript
interface UseCurrencyReturn {
  // Current selected currency (reactive)
  currency: Readonly<Ref<Currency>>

  // Change currency and persist to localStorage
  setCurrency: (newCurrency: Currency) => void

  // Get currency symbol (e.g., '$', '₸', '₺', '₽')
  getCurrencySymbol: (currency?: Currency) => string

  // Get localized currency label (e.g., 'Dollar', 'Tenge')
  getCurrencyLabel: (currency?: Currency) => string

  // Format price with currency symbol
  formatPrice: (pricing: Record<Currency, string>, currency?: Currency) => string

  // All available currencies
  currencies: readonly Currency[]
}

export function useCurrency(): UseCurrencyReturn
```

**Behavior**:

- Wraps `useCurrencyStore()` for convenient access
- Provides formatting utilities
- Auto-initializes from localStorage on first use
- Falls back to USD if invalid currency in storage

**Usage**:

```typescript
const { currency, setCurrency, formatPrice } = useCurrency()

// Get current currency
console.log(currency.value) // 'USD'

// Change currency
setCurrency('KZT')

// Format price
const price = formatPrice({ KZT: '250,000', TRY: '8,500', RUB: '50,000', USD: '500' })
// Returns: "₸250,000" (if KZT selected)
```

---

## useApplicationModal.ts (Enhancement)

**Existing Composable - Changes Required**:

**Enhanced Interface**:

```typescript
interface UseApplicationModalReturn {
  // Existing
  isOpen: Readonly<Ref<boolean>>
  openModal: (preferences?: ApplicationPreferences) => void
  closeModal: () => void

  // NEW: Open modal with sub-service context
  openModalForSubService: (subServiceId: SubServiceId, subServiceName: string) => void
}
```

**New Method Implementation**:

```typescript
function openModalForSubService(subServiceId: SubServiceId, subServiceName: string) {
  const context: ServiceApplicationContext = {
    subServiceId,
    subServiceName,
    source: 'service-page',
    sourceDescription: subServiceName,
  }

  openModal({
    serviceContext: context,
  })
}
```

**Behavior**:

- Backward compatible with existing `openModal()`
- New method specifically for service pages
- Automatically sets source and sourceDescription for CRM

**Usage**:

```typescript
const modal = useApplicationModal()

// Existing usage (still works)
modal.openModal()

// New usage from service pages
modal.openModalForSubService(
  'tr-yos-basic-preparation',
  t('services.trYos.subServices.trYosBasicPreparation.name'),
)
```

---

## Contract Test Requirements

All composables must:

1. Return stable references (use `readonly()` for reactive values)
2. Handle edge cases (invalid inputs, missing localStorage, etc.)
3. Be SSR-safe (check `import.meta.client` before browser APIs)
4. Provide TypeScript types for all exports
5. Be testable in isolation (no hard dependencies on global state)
6. Follow Nuxt composable conventions (auto-import, no manual imports needed)
