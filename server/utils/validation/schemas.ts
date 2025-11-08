import { z } from 'zod'

export const ApplicationSchema = z.object({
  personal_info: z.object({
    first_name: z.string().min(2, 'min_length').max(50, 'max_length'),
    last_name: z.string().max(50, 'max_length').optional(),
    email: z.string().email('invalid_email').max(255, 'max_length').optional().or(z.literal('')),
    phone: z
      .string()
      .min(1, 'required')
      .refine(
        (val) => {
          const digits = val.replace(/\D/g, '')
          return digits.length >= 10
        },
        { message: 'invalid_phone' },
      ),
  }),
  preferences: z
    .object({
      universities: z.array(z.string()).optional(),
      programs: z.array(z.string()).optional(),
      budget: z.string().optional(),
      start_date: z.string().optional(),
    })
    .optional(),
  additional_info: z.string().max(500, 'max_length').optional(),
  source: z.string().optional(),
  source_description: z.string().optional(),
  ref: z.string().optional(),
  user_preferences: z.any().optional(),
})

export type ApplicationInput = z.infer<typeof ApplicationSchema>

export const ReviewSchema = z.object({
  name: z.string().min(2, 'min_length').max(100, 'max_length'),
  university: z.string().min(1, 'required').max(200, 'max_length'),
  faculty: z.string().max(200, 'max_length').optional(),
  year: z
    .string()
    .regex(/^\d{4}$/, 'invalid_year')
    .optional()
    .or(z.literal('')),
  rating: z.number().min(1, 'min_value').max(5, 'max_value'),
  contact: z.string().max(200, 'max_length').optional(),
  review: z.string().min(10, 'min_length').max(2000, 'max_length'),
  helpfulAspects: z.array(z.string()).optional(),
  recommendation: z.string().max(500, 'max_length').optional(),
  type: z.enum(['student', 'parent']).optional(),
})

export type ReviewInput = z.infer<typeof ReviewSchema>
