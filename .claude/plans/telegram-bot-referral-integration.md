# Telegram Bot Referral Integration Implementation Plan

## Overview

This plan outlines the steps to replace the current personal Telegram links with links to a Telegram bot. The bot links will incorporate referral codes via the 'start' parameter. Upon clicking these links, a minimal lead will be automatically created in Bitrix CRM, in addition to logging the messenger event. This ensures better tracking and automation without requiring full application submission.

The goal is to improve user engagement through the bot while maintaining analytics and CRM integration.

## Current State Analysis

- **Telegram Integration**: The app currently uses personal Telegram links (e.g., https://t.me/Hakim7292) routed through `/go/telegram` for event logging before redirection. A Telegram bot (`https://t.me/eduturkish_bot`) exists but is not the primary channel. Referral codes are appended to bot links as `?start=referral` in some composables.

- **Referral System**: Referrals are managed via cookies and middleware. Codes are used in link generation and event logging.

- **Bitrix Integration**: Messenger events are logged as activities via `crm.activity.add`. Full leads are created only on application submission via `crm.lead.add`. No automatic lead creation on messenger clicks currently.

Key Files:

- `lib/contact/channels.ts`: Defines contact channels including 'telegramPersonal' and 'telegramBot'.
- `app/composables/useContactChannels.ts`: Builds hrefs for channels, handles referrals.
- `server/routes/go/telegram.ts`: Handles logging and redirection for personal TG.
- `server/services/BitrixService.ts`: Manages Bitrix API calls, including `createLead` and `logMessengerEvent`.
- `server/api/v1/messenger-events.post.ts`: API endpoint for logging events.
- UI components like `HomeHeroSection.vue`, `SiteFooter.vue`, etc., that use telegramPersonal.

Key Discoveries:

- Bot links are direct and don't go through a server route for logging, unlike personal TG (see 13:38:server/routes/go/telegram.ts).
- Referrals are already handled for bot in composables (83:84:app/composables/useContactChannels.ts).
- Bitrix `createLead` expects ApplicationRequest-like data, but we can adapt for minimal leads.

## Desired End State

- All Telegram links in the UI point to the bot with referral parameters.
- Clicking a bot link routes through a server endpoint that:
  - Logs the messenger event as before.
  - Creates a minimal lead in Bitrix (e.g., with title like 'Bot Click Lead', referral code, channel, UTM).
- Verification: Leads appear in Bitrix automatically on clicks, with correct referral data.

### Key Discoveries:

- Existing bot definition in channels.ts (21:28:lib/contact/channels.ts).
- Referral middleware sets cookie (3:28:server/middleware/referral.ts).
- Bitrix activity logging in messenger-events.post.ts (75:127:server/api/v1/messenger-events.post.ts).

## What We're NOT Doing

- Not implementing full bot logic (assume bot is already set up in Telegram).
- Not changing other channels (WhatsApp, Instagram).
- Not handling cases where referral code is missing (use default or skip lead creation).
- Not migrating existing data or historical logs.

## Implementation Approach

Use a phased approach: Start with backend changes for lead creation, add redirection route, update composables and config to prioritize bot, then adjust UI. Focus on minimal leads with essential fields (title, source, referral, comments with UTM/session).

## Phase 1: Extend BitrixService for Minimal Lead Creation

### Overview

Add a method to BitrixService for creating leads from messenger events with minimal data.

### Changes Required:

#### 1. server/services/BitrixService.ts

**Changes**: Add new method `createMinimalLeadFromEvent`.

```typescript
// ... existing BitrixService class ...

async createMinimalLeadFromEvent(payload: MessengerEventPayload): Promise<{ id: number; success: boolean; error?: string }> {
  try {
    const lead: BitrixLead = {
      TITLE: `Lead from ${payload.channel} click`,
      SOURCE_ID: 'WEB',
      SOURCE_DESCRIPTION: `Referral: ${payload.referralCode}`,
      COMMENTS: JSON.stringify({ utm: payload.utm, session: payload.session, metadata: payload.metadata }),
      UF_CRM_REFERRAL_CODE: payload.referralCode,
    };
    const url = getBitrixApiUrl('crm.lead.add');
    // ... similar to createLead implementation ...
    // Return result
  } catch (error: any) {
    // Handle error
  }
}

// ... existing code ...
```

### Success Criteria:

#### Automated Verification:

- [ ] Unit tests for new method pass: `npm run test server/services/BitrixService.test.ts`
- [ ] Type checking passes: `npm run typecheck`
- [ ] Linting passes: `npm run lint`

#### Manual Verification:

- [ ] Manually call method and verify lead created in Bitrix dashboard.

---

## Phase 2: Create Redirection Route for Bot

### Overview

Add `/go/telegram-bot` route that logs event, creates minimal lead, and redirects to bot with ?start=ref.

### Changes Required:

#### 1. server/routes/go/telegram-bot.ts (new file)

**Changes**: Create new file with similar logic to telegram.ts, but for bot.

```typescript
import { getRequestURL } from 'h3'
import { contactChannels } from '~~/lib/contact/channels'
import { BitrixService } from '../../services/BitrixService'
import { getBitrixConfig } from '../../utils/bitrix-config'

const extractUtmParams = (query: Record<string, any>): Record<string, string> => {
  return Object.entries(query).reduce<Record<string, string>>((acc, [key, value]) => {
    if (key.startsWith('utm_') && typeof value === 'string' && value.length > 0) {
      acc[key] = value
    }
    return acc
  }, {})
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const referralCode = typeof query.referral_code === 'string' ? query.referral_code : ''
  const hasReferralCode = referralCode.length > 0

  const sessionId =
    typeof query.session === 'string' && query.session.length > 0 ? query.session : undefined
  const utmParams = extractUtmParams(query as Record<string, any>)

  if (hasReferralCode) {
    const requestUrl = getRequestURL(event)
    try {
      // Log messenger event (activity)
      await $fetch('/api/v1/messenger-events', {
        method: 'POST',
        body: {
          channel: 'telegramBot',
          referral_code: referralCode,
          session: sessionId,
          utm: utmParams,
        },
        baseURL: requestUrl.origin,
      })

      // Create minimal lead
      const bitrix = new BitrixService(getBitrixConfig())
      await bitrix.createMinimalLeadFromEvent({
        channel: 'telegramBot',
        referralCode,
        session: sessionId,
        utm: utmParams,
      })
    } catch (error) {
      console.error('[go/telegram-bot] Failed to process messenger event and create lead', error)
    }
  }

  const botUrl =
    contactChannels.telegramBot.baseUrl +
    (referralCode ? `?start=${encodeURIComponent(referralCode)}` : '')

  const html = `<!DOCTYPE html>
  <html lang="ru">
    <head>
      <meta charset="utf-8" />
      <title>Переходим в Telegram бота...</title>
    </head>
    <body>
      <script>
        window.location.replace(${JSON.stringify(botUrl)});
      </script>
      <p>Перенаправляем вас в Telegram бота...</p>
    </body>
  </html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
})
```

### Success Criteria:

#### Automated Verification:

- [ ] Route exists and responds 200.
- [ ] Tests pass: `npm run test server/routes/go/telegram-bot.spec.ts`

#### Manual Verification:

- [ ] Access /go/telegram-bot?referral_code=test and verify redirect and lead in Bitrix.

---

## Phase 3: Update Composables and Config to Use Bot

### Overview

Modify useContactChannels to build href for bot using /go/telegram-bot instead of direct link.

### Changes Required:

#### 1. app/composables/useContactChannels.ts

**Changes**: Update href building for telegramBot to use /go/telegram-bot.

```typescript
// ... existing code ...
} else if (typedKey === 'telegramBot' && referral) {
  const query = { referral_code: referral };
  // Add session, utm if needed
  href = withQuery('/go/telegram-bot', query);
}
// ... existing code ...
```

#### 2. lib/contact/channels.ts

**Changes**: Set telegramBot as primary or update keys if needed.

```typescript
// Optionally rename keys or set default
export const primaryTelegramKey = 'telegramBot'
```

### Success Criteria:

#### Automated Verification:

- [ ] Composables tests pass.

#### Manual Verification:

- [ ] Computed channels have correct href starting with /go/telegram-bot.

---

## Phase 4: Update UI Components

### Overview

Replace telegramPersonal with telegramBot in all UI components.

### Changes Required:

#### 1. app/components/features/home/sections/HomeHeroSection.vue (and others)

**Changes**: Update :href to channels?.telegramBot?.href and icon/label if needed.

```vue
// ... existing code ... :href="channels?.telegramBot?.href" aria-label="Telegram Bot" // ...
existing code ...
```

Update all relevant components: MobileNavDrawer.vue, SiteFooter.vue, etc.

### Success Criteria:

#### Automated Verification:

- [ ] No compilation errors.
- [ ] Snapshot tests pass.

#### Manual Verification:

- [ ] Links in UI point to bot and create leads on click.

---

## Testing Strategy

### Unit Tests:

- Test new Bitrix method with various payloads.
- Test route handler for redirection and API calls.

### Integration Tests:

- End-to-end: Simulate click, verify lead in mock Bitrix.

### Manual Testing Steps:

1. Load page with referral cookie.
2. Click TG link, verify redirect to bot with ?start=ref.
3. Check Bitrix for new lead.

## Performance Considerations

- Route should be fast; no heavy ops.

## Migration Notes

- No data migration needed.
- Monitor old personal links if not removed.

## References

- Existing: server/routes/go/telegram.ts (13:61)
- Docs: docs/MESSENGER_EVENTS.md
- Similar: server/api/v1/applications/index.post.ts for lead creation
