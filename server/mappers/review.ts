import type { Prisma, UserType } from '@prisma/client'
import type { Review, MediaReview } from '~~/lib/types'
import { pickTranslation, type NormalizedLocale } from '~~/server/utils/locale'
import { asRecord } from '~~/server/utils/prisma'

// ─────────────────────────────────────────────────────────────────────────────
// Prisma payload types
// ─────────────────────────────────────────────────────────────────────────────

export const reviewInclude = (locale: string) =>
  ({
    translations: { where: { locale } },
    university: { include: { translations: { where: { locale } } } },
  }) satisfies Prisma.UniversityReviewInclude

export const reviewIncludeAll = {
  translations: true,
  university: { include: { translations: true } },
} satisfies Prisma.UniversityReviewInclude

export type ReviewWithRelations = Prisma.UniversityReviewGetPayload<{
  include: typeof reviewIncludeAll
}>

// ─────────────────────────────────────────────────────────────────────────────
// Mappers
// ─────────────────────────────────────────────────────────────────────────────

export function mapReview(r: ReviewWithRelations, locale: NormalizedLocale): Review {
  const t = pickTranslation(r.translations, locale.normalized)
  const u = pickTranslation(r.university?.translations ?? [], locale.normalized)

  return {
    id: r.id,
    type: r.type as UserType,
    name: t?.name ?? '',
    university: t?.universityName ?? u?.title ?? undefined,
    year: r.year ?? undefined,
    quote: t?.quote ?? '',
    rating: r.rating ?? 5,
    avatar: r.avatar ?? '',
    featured: r.featured,
    achievements: parseAchievements(t?.achievements),
  }
}

export function mapMediaReview(r: ReviewWithRelations, locale: NormalizedLocale): MediaReview {
  const t = pickTranslation(r.translations, locale.normalized)
  const u = pickTranslation(r.university?.translations ?? [], locale.normalized)

  return {
    id: r.id,
    type: r.type,
    mediaType: r.mediaType,
    name: t?.name ?? '',
    quote: t?.quote ?? '',
    university: u?.title ?? t?.universityName ?? '',
    rating: r.rating,
    year: r.year,
    avatar: r.avatar,
    videoId: r.videoId,
    imageUrl: r.imageUrl,
  }
}

function parseAchievements(val: Prisma.JsonValue | null | undefined): Review['achievements'] {
  const raw = asRecord(val)
  if (!raw) return undefined

  const str = (k: string) =>
    typeof raw[k] === 'string' && raw[k].trim() ? raw[k].trim() : undefined
  const num = (k: string) => (typeof raw[k] === 'number' ? raw[k] : undefined)
  const arr = Array.isArray(raw.helpful_aspects)
    ? raw.helpful_aspects.filter((x): x is string => typeof x === 'string')
    : undefined

  const result: NonNullable<Review['achievements']> = {}

  if (num('yos_score') !== undefined) result.yos_score = num('yos_score')
  if (num('scholarship_percentage') !== undefined) result.scholarship_percentage = num('scholarship_percentage')
  if (num('sat_score') !== undefined) result.sat_score = num('sat_score')
  if (str('turkish_level')) result.turkish_level = str('turkish_level')
  if (str('english_level')) result.english_level = str('english_level')
  if (arr?.length) result.helpful_aspects = arr
  if (str('recommendation')) result.recommendation = str('recommendation')
  if (str('faculty')) result.faculty = str('faculty')
  if (str('contact')) result.contact = str('contact')

  return Object.keys(result).length ? result : undefined
}
