/**
 * Server-specific types
 * Types used only on the server side (API routes, services, etc.)
 */

// Telegram notification types
export type {
    TelegramNotificationJob,
    TelegramSendMessageRequest,
    TelegramAPIResponse,
    TelegramMessage,
    TelegramNotificationResult,
} from './telegram'

// Webhook types
export type { EspoCRMLead } from './webhook'

// CRM types
export type {
    CrmProviderConfig,
    CrmFieldMappingConfig,
    CrmResult,
    LeadData,
    LeadDataOutput,
} from './crm'
