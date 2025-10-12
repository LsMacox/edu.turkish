import { Prisma } from '@prisma/client'

export const universityListInclude = Prisma.validator<Prisma.UniversityDefaultArgs>()({
  include: {
    translations: true,
    academicPrograms: true,
    city: { include: { translations: true } },
  },
})

export type UniversityListItem = Prisma.UniversityGetPayload<typeof universityListInclude>

export const featuredProgramInclude =
  Prisma.validator<Prisma.UniversityFeaturedProgramDefaultArgs>()({
    include: {
      program: { include: { translations: true } },
    },
  })

export type FeaturedProgramWithRelations = Prisma.UniversityFeaturedProgramGetPayload<
  typeof featuredProgramInclude
>

export const universityDetailInclude = Prisma.validator<Prisma.UniversityDefaultArgs>()({
  include: {
    translations: true,
    academicPrograms: { include: { translations: true } },
    featuredPrograms: {
      include: {
        program: { include: { translations: true } },
      },
    },
    campusFacilities: { include: { translations: true } },
    admissionRequirements: { include: { translations: true } },
    requiredDocuments: { include: { translations: true } },
    importantDates: { include: { translations: true } },
    scholarships: { include: { translations: true } },
    universityDirections: {
      include: {
        direction: { include: { translations: true } },
      },
    },
    media: { include: { translations: true } },
    country: { include: { translations: true } },
    city: { include: { translations: true } },
  },
})

export type UniversityDetailWithRelations = Prisma.UniversityGetPayload<
  typeof universityDetailInclude
>

export const studyDirectionListSelect = Prisma.validator<Prisma.StudyDirectionDefaultArgs>()({
  select: {
    id: true,
    translations: {
      orderBy: { locale: 'asc' },
      select: {
        locale: true,
        name: true,
        slug: true,
      },
    },
    _count: {
      select: { universityDirections: true },
    },
  },
})
