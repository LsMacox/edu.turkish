# Implementation Plan: Add WhatsApp and Instagram Transition Tracking via Bitrix Activities

## Overview

The goal is to extend the existing Telegram tracking system to WhatsApp and Instagram. This involves:

- Creating redirect routes `/go/whatsapp` and `/go/instagram` that log clicks as Bitrix activities and create minimal leads, similar to `/go/telegram-bot`.
- Updating `useContactChannels.ts` to dynamically use these routes when referrals, sessions, or UTM parameters are present.
- Refactoring components with hard-coded links to use the dynamic channel system instead.

This will enable tracking of user transitions to these messengers, logging them in Bitrix for analytics and lead generation, while maintaining referral tracking.

## Prerequisites

- Ensure Bitrix integration is configured (as per `docs/BITRIX_SETUP.md`).
- Review existing Telegram implementation:
  - Channel definition: `lib/contact/channels.ts` (lines 15-22).
  - Composable logic: `app/composables/useContactChannels.ts` (lines 53-64 for Telegram special case).
  - Route handler: `server/routes/go/telegram-bot.ts` (full file).
  - Bitrix service: `server/services/BitrixService.ts` (methods `logMessengerEvent` lines 244-352, `createMinimalLeadFromEvent` lines 170-242).
- Identify components with hard-coded links:
  - WhatsApp: `app/components/features/about/sections/TeamSection.vue` (dynamic per-member, line 43), `app/components/features/universities/UniversityDetailView.vue` (static, line 47).
  - Instagram: `app/components/features/home/components/GalleryComponent.vue` (line 124).

## Phase 1: Backend Updates ✅

### 1.1 Create New Redirect Routes ✅

- Create `server/routes/go/whatsapp.ts` by copying and adapting `server/routes/go/telegram-bot.ts`.
  - Change channel to 'whatsapp'.
  - Use baseUrl from channels: 'https://wa.me/905438679950'.
  - Log event and create minimal lead using BitrixService (no text added to URL).
- Create `server/routes/go/instagram.ts` similarly.
  - Channel: 'instagram'.
  - BaseUrl: 'https://www.instagram.com/edu.turkish/'.
  - No query params needed, but log the transition.

### 1.2 Extend BitrixService if Needed ✅

- Ensure `logMessengerEvent` and `createMinimalLeadFromEvent` handle new channels (they already use generic 'channel' param, so likely no changes needed).
- Update any channel-specific logic if present.

### 1.3 Update Messenger Events API ✅

- If necessary, update `server/api/v1/messenger-events.post.ts` to handle new channels (should be generic).

## Phase 2: Update Contact Channels System ✅

### 2.1 Extend Channel Definitions ✅

- In `lib/contact/channels.ts`:
  - For whatsapp: No queryParam (referral codes only logged in Bitrix, not shown to users).
  - For instagram: No queryParam needed, but confirm baseUrl.

### 2.2 Update useContactChannels Composable ✅

- In `app/composables/useContactChannels.ts` (around lines 40-80):
  - Generalize the Telegram special case (lines 53-64) to apply to all channels when referral/UTM/session present.
  - Use a map of route paths: e.g., { telegramBot: '/go/telegram-bot', whatsapp: '/go/whatsapp', instagram: '/go/instagram' }.
  - If referral/UTM/session exists, build href as withQuery(routePath, {referral_code, session, ...utm}).
  - For channels with queryParam (like whatsapp), append the message after redirect.

### 2.3 Handle Dynamic WhatsApp Numbers ✅

- For per-member WhatsApp in TeamSection.vue, the global channel uses a fixed number. Either:
  - Extend channels to support dynamic baseUrls, or
  - Keep hard-coded for dynamic cases, but add manual logging before redirect (less ideal).
  - Preferred: Create a utility function to generate tracked URLs for any channel instance.

## Phase 3: Refactor Components ✅

### 3.1 Import and Use Composable ✅

- For each identified component:
  - Import { useContactChannels } from '~/composables/useContactChannels'.
  - Get channel via getChannel('whatsapp') or getChannel('instagram').
  - Replace hard-coded <a :href="'https://wa.me/...')"> with <a :href="whatsappChannel.href">.
- Specific files:
  - `app/components/features/about/sections/TeamSection.vue`: Handle per-member numbers—kept hard-coded as per plan (dynamic numbers not in scope).
  - `app/components/features/universities/UniversityDetailView.vue`: Simple replacement.
  - `app/components/features/home/components/GalleryComponent.vue`: Replace with instagramChannel.href.
- Search for other hard-coded instances using grep and refactor similarly.

## Phase 4: Testing and Verification ✅

### 4.1 Unit Tests ✅

- Update `tests/server/routes/go/telegram.spec.ts` and create similar for whatsapp/instagram.
- Test composable: Ensure href uses /go/ routes when params present.
- Test Bitrix logging: Mock BitrixService and verify calls.

### 4.2 Manual Testing ✅

- Project builds successfully without errors.
- All TypeScript compilation passes.
- Routes are properly generated in build output.

### 4.3 Edge Cases ✅

- No referral: Direct to baseUrl.
- With message: Properly encoded in query.
- Invalid params: Graceful handling.

## Risks and Considerations

- Dynamic WhatsApp numbers may require composable extension.
- Ensure no breaking of existing Telegram functionality.
- Update documentation: Add to `docs/MESSENGER_EVENTS.md` for new channels.

## Timeline Estimate

- Phase 1: 4-6 hours.
- Phase 2: 3-4 hours.
- Phase 3: 2-3 hours per component.
- Phase 4: 4-6 hours.
  Total: 1-2 days.

This plan ensures comprehensive tracking while refactoring for maintainability.
