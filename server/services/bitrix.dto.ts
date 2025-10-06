import { z } from 'zod'
import type { UtmParams } from '~~/server/types/utm'

const createStringSanitizer = (maxLength: number) =>
  z.any().transform((value) => {
    if (typeof value !== 'string') {
      return undefined
    }

    const trimmed = value.trim()

    if (trimmed.length === 0 || trimmed.length > maxLength) {
      return undefined
    }

    return trimmed
  })

const createRequiredString = (maxLength: number) =>
  createStringSanitizer(maxLength).pipe(z.string())
const createOptionalString = (maxLength: number) =>
  createStringSanitizer(maxLength).pipe(z.string().optional())

export interface MessengerEventMetadata {
  page?: string
  section?: string
  component?: string
  campaign?: string
  referrer?: string
  notes?: string
}

const messengerEventMetadataSchemaBase = z
  .object({
    page: createOptionalString(200),
    section: createOptionalString(200),
    component: createOptionalString(200),
    campaign: createOptionalString(200),
    referrer: createOptionalString(200),
    notes: createOptionalString(500),
  })
  .strip()

export const messengerEventMetadataSchema = messengerEventMetadataSchemaBase.transform((value) => {
  const metadata: MessengerEventMetadata = {}

  if (value.page) {
    metadata.page = value.page
  }
  if (value.section) {
    metadata.section = value.section
  }
  if (value.component) {
    metadata.component = value.component
  }
  if (value.campaign) {
    metadata.campaign = value.campaign
  }
  if (value.referrer) {
    metadata.referrer = value.referrer
  }
  if (value.notes) {
    metadata.notes = value.notes
  }

  return metadata
})

export type MessengerEventUtm = UtmParams

const messengerEventUtmSchemaBase = z
  .object({
    utm_source: createOptionalString(200),
    utm_medium: createOptionalString(200),
    utm_campaign: createOptionalString(200),
    utm_content: createOptionalString(200),
    utm_term: createOptionalString(200),
  })
  .strip()

export const messengerEventUtmSchema = messengerEventUtmSchemaBase.transform((value) => {
  const utm: MessengerEventUtm = {}

  if (value.utm_source) {
    utm.utm_source = value.utm_source
  }
  if (value.utm_medium) {
    utm.utm_medium = value.utm_medium
  }
  if (value.utm_campaign) {
    utm.utm_campaign = value.utm_campaign
  }
  if (value.utm_content) {
    utm.utm_content = value.utm_content
  }
  if (value.utm_term) {
    utm.utm_term = value.utm_term
  }

  return utm
})

const messengerEventPayloadSchemaBase = z
  .object({
    channel: createRequiredString(120),
    referralCode: createRequiredString(120),
    session: createOptionalString(200),
    utm: messengerEventUtmSchema.optional(),
    metadata: messengerEventMetadataSchema.optional(),
  })
  .strip()

export const messengerEventPayloadSchema = messengerEventPayloadSchemaBase.transform((value) => ({
  channel: value.channel,
  referralCode: value.referralCode,
  session: value.session,
  utm: value.utm,
  metadata: value.metadata,
}))

export type MessengerEventPayload = z.input<typeof messengerEventPayloadSchema>
export type SanitizedMessengerEventPayload = z.output<typeof messengerEventPayloadSchema>
