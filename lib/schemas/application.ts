import { z } from 'zod'

// ==========================================
// Common validation helpers
// ==========================================

const EmailSchema = z.string().email().max(255)
const PhoneSchema = z
  .string()
  .min(5)
  .max(30)
  .regex(/^[+\d\s()-]+$/, {
    message: 'Invalid phone number format',
  })
const OptionalStringSchema = z
  .string()
  .optional()
  .transform((s) => s?.trim() || undefined)

// ==========================================
// API Request schema
// ==========================================

const ApiPersonalInfoSchema = z.object({
  first_name: z
    .string()
    .min(1)
    .max(100)
    .transform((s) => s.trim()),
  last_name: OptionalStringSchema,
  email: EmailSchema.optional()
    .or(z.literal(''))
    .transform((v) => v || undefined),
  phone: PhoneSchema,
  country: OptionalStringSchema,
  city: OptionalStringSchema,
  birth_date: OptionalStringSchema,
})

const ApiPreferencesSchema = z
  .object({
    universities: z.array(z.string()).optional(),
    programs: z.array(z.string()).optional(),
    budget: OptionalStringSchema,
    start_date: OptionalStringSchema,
    scholarship_needed: z.boolean().optional(),
    language_preference: OptionalStringSchema,
  })
  .optional()

const UserPreferencesSchema = z
  .object({
    userType: z.enum(['student', 'parent']).optional(),
    language: z.enum(['turkish', 'english', 'both']).optional(),
    scholarship: z.enum(['yes', 'no']).optional(),
    universityChosen: z.string().optional(),
  })
  .optional()

export const ApplicationRequestSchema = z.object({
  personal_info: ApiPersonalInfoSchema,
  preferences: ApiPreferencesSchema,
  additional_info: OptionalStringSchema,
  source: z
    .string()
    .max(100)
    .default('website')
    .transform((s) => s.trim()),
  source_description: OptionalStringSchema,
  user_preferences: UserPreferencesSchema,
  referral_code: OptionalStringSchema,
})

/** Input type - use for request bodies, tests, and type annotations */
export type ApplicationRequest = z.input<typeof ApplicationRequestSchema>

