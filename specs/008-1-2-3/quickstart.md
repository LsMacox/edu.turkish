# Quickstart: Service Pages Feature Validation

## Prerequisites

- Development server running (`npm run dev`)
- All 4 locales available (en, ru, kk, tr)
- Browser with localStorage enabled

## Validation Steps

### 1. Navigation Dropdown

**Test**: Service dropdown displays all categories

```
1. Open http://localhost:3000 (any locale)
2. Hover over "Services" in header navigation
3. Verify dropdown appears with 5 items:
   - Relocation in Turkey
   - TR-YÖS Courses
   - SAT Courses
   - Turkish & English Course
   - Document Translations
4. Click "TR-YÖS Courses"
5. Verify navigation to /services/tr-yos-courses
6. Verify "Services" dropdown highlights "TR-YÖS Courses" as active
```

**Expected**: ✅ All 5 services visible, navigation works, active state correct

---

### 2. Service Page Structure

**Test**: Service page displays sub-services correctly

```
1. Navigate to /services/tr-yos-courses
2. Verify page shows:
   - Title: "TR-YÖS Courses"
   - Subtitle describing the service
   - Multiple sub-service cards (at least 3)
3. For each sub-service card, verify:
   - Sub-service name visible
   - Description text visible
   - Price displayed with currency symbol
   - "Apply" button present
```

**Expected**: ✅ Minimalist layout, all sub-services visible, consistent structure

---

### 3. Currency Selector

**Test**: Currency selection and persistence

```
1. Locate currency selector in header (near language selector)
2. Note current price on a sub-service (e.g., "$500")
3. Click currency selector
4. Verify dropdown shows: KZT, TRY, RUB, USD
5. Select "KZT (Tenge)"
6. Verify:
   - Price updates to "₸250,000" (or similar)
   - Currency selector shows "KZT"
7. Navigate to different service page (/services/sat-courses)
8. Verify prices still display in KZT
9. Refresh page
10. Verify currency selection persisted (still KZT)
```

**Expected**: ✅ Currency switches instantly, persists across navigation and refresh

---

### 4. Multi-Locale Support

**Test**: All content available in 4 languages

```
1. Start on /en/services/tr-yos-courses
2. Verify all text in English
3. Switch to Russian (RU)
4. Verify URL changes to /ru/services/tr-yos-courses
5. Verify all text translated to Russian:
   - Page title and subtitle
   - All sub-service names and descriptions
   - Currency labels
   - "Apply" button text
6. Repeat for Kazakh (KK) and Turkish (TR)
7. Verify currency selection persists across language changes
```

**Expected**: ✅ Complete translations in all 4 locales, no missing keys

---

### 5. Application Modal - Sub-Service Context

**Test**: Modal displays selected sub-service

```
1. Navigate to /services/tr-yos-courses
2. Select currency "USD"
3. Click "Apply" on "Basic TR-YÖS Preparation" sub-service
4. Verify modal opens
5. Verify modal displays:
   - Standard form fields (name, phone, email, message)
   - NEW: Blue info box showing "Applying for: Basic TR-YÖS Preparation"
   - Agreement checkbox
   - Submit button
6. Fill out form and submit
7. Verify network request includes:
   - source: "service-page"
   - source_description: "Basic TR-YÖS Preparation"
```

**Expected**: ✅ Modal shows sub-service context, CRM receives correct data

---

### 6. Responsive Design

**Test**: Mobile, tablet, desktop layouts

```
1. Open /services/tr-yos-courses
2. Resize browser to mobile width (375px)
3. Verify:
   - Sub-service cards stack vertically
   - Currency selector accessible
   - "Apply" buttons visible and tappable
4. Resize to tablet width (768px)
5. Verify sub-services in 2-column grid
6. Resize to desktop width (1280px)
7. Verify sub-services in 3-column grid
```

**Expected**: ✅ Responsive layout, no horizontal scroll, touch-friendly

---

### 7. Cross-Service Consistency

**Test**: All 5 service pages follow same structure

```
For each service page:
  - /services/relocation-in-turkey
  - /services/tr-yos-courses
  - /services/sat-courses
  - /services/turkish-english-course
  - /services/document-translations

Verify:
1. Same layout structure
2. Title + subtitle pattern
3. Sub-services in grid
4. Pricing with currency
5. "Apply" buttons
6. Modal integration
```

**Expected**: ✅ Consistent structure across all pages, no outliers

---

### 8. Edge Cases

**Test**: Handle edge cases gracefully

```
1. Invalid currency in localStorage:
   - Set localStorage.setItem('preferred-currency', 'INVALID')
   - Refresh page
   - Verify fallback to USD

2. Missing i18n key:
   - Check browser console for i18n warnings
   - Verify no "[missing key]" text visible

3. Modal without sub-service context:
   - Open modal from homepage (existing flow)
   - Verify modal works without sub-service section
   - Verify backward compatibility

4. Direct URL access:
   - Navigate directly to /services/tr-yos-courses
   - Verify page loads correctly (not just via dropdown)
```

**Expected**: ✅ Graceful degradation, no errors, backward compatible

---

## Performance Validation

**Test**: Page load and interaction performance

```
1. Open DevTools Network tab
2. Navigate to /services/tr-yos-courses
3. Verify:
   - Page loads in <200ms (after initial bundle)
   - No unnecessary API calls
   - i18n loaded lazily per locale

4. Click currency selector
5. Verify:
   - Price updates in <16ms (single frame)
   - No layout shift
   - Smooth dropdown animation

6. Open application modal
7. Verify:
   - Modal opens in <100ms
   - No jank or stuttering
```

**Expected**: ✅ Fast page loads, instant currency switching, smooth interactions

---

## Accessibility Validation

**Test**: Keyboard navigation and screen readers

```
1. Tab through service page
2. Verify:
   - All "Apply" buttons reachable via keyboard
   - Currency selector keyboard-accessible
   - Modal can be closed with Escape key

3. Use screen reader (VoiceOver/NVDA)
4. Verify:
   - Service names announced
   - Prices announced with currency
   - "Apply" buttons have clear labels
```

**Expected**: ✅ Fully keyboard-navigable, screen reader friendly

---

## Success Criteria

All validation steps must pass:

- ✅ Navigation dropdown works
- ✅ Service pages display correctly
- ✅ Currency selector functional and persistent
- ✅ All 4 locales complete
- ✅ Modal shows sub-service context
- ✅ Responsive on all devices
- ✅ Consistent across all 5 pages
- ✅ Edge cases handled
- ✅ Performance targets met
- ✅ Accessible

## Rollback Plan

If critical issues found:

1. Revert feature branch
2. Restore original SiteHeader.vue
3. Restore original ApplicationModal.vue
4. Remove service pages
5. Remove i18n/locales/\*/services.json files
6. Clear localStorage currency preference

No database rollback needed (no schema changes).
