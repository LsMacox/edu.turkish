import { z } from 'zod'

// ==========================================
// University types
// ==========================================

const UniversityTypeSchema = z.enum(['state', 'private', 'tech', 'elite'])

export type UniversityType = z.infer<typeof UniversityTypeSchema>

const DegreeTypeSchema = z.enum(['bachelor', 'master', 'phd'])

export type DegreeType = z.infer<typeof DegreeTypeSchema>

// ==========================================
// Validation helpers
// ==========================================

export function isValidUniversityType(value: string): value is UniversityType {
  return UniversityTypeSchema.safeParse(value).success
}

export function isValidDegreeType(value: string): value is DegreeType {
  return DegreeTypeSchema.safeParse(value).success
}
