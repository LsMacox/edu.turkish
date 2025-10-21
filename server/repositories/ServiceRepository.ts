import type { PrismaClient } from '@prisma/client'
import type {
  ServiceCategoryListItem,
  ServiceCategoryDetail,
  SubServiceDetail,
  CreateSubServiceInput,
  UpdateSubServiceInput,
} from '../types/api/services'
import { SUPPORTED_LOCALES, type SupportedLocale } from '~~/lib/locales'

export class ServiceRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get all active service categories with translations
   * Falls back to English if translation missing
   */
  async findAllCategories(locale: SupportedLocale): Promise<ServiceCategoryListItem[]> {
    const categories = await this.prisma.serviceCategory.findMany({
      where: { isActive: true },
      include: {
        translations: {
          where: {
            OR: [{ locale }, { locale: 'en' }],
          },
        },
      },
      orderBy: { order: 'asc' },
    })

    return categories.map((category) => {
      const translation =
        category.translations.find((t) => t.locale === locale) ||
        category.translations.find((t) => t.locale === 'en')

      return {
        id: category.id,
        slug: category.slug,
        title: translation?.title || 'Untitled',
        subtitle: translation?.subtitle || null,
        localizedSlug: translation?.slug || category.slug,
        order: category.order,
      }
    })
  }

  /**
   * Get category details with sub-services by slug
   * Returns null if category not found or inactive
   */
  async findCategoryBySlug(
    slug: string,
    locale: SupportedLocale,
  ): Promise<ServiceCategoryDetail | null> {
    const category = await this.prisma.serviceCategory.findUnique({
      where: { slug },
      include: {
        translations: {
          where: {
            OR: [{ locale }, { locale: 'en' }],
          },
        },
        subServices: {
          where: { isActive: true },
          include: {
            translations: {
              where: {
                OR: [{ locale }, { locale: 'en' }],
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!category || !category.isActive) {
      return null
    }

    const categoryTranslation =
      category.translations.find((t) => t.locale === locale) ||
      category.translations.find((t) => t.locale === 'en')

    // Separate calculator entries (type = 'calculator') from regular offerings
    const calculatorEntries = category.subServices.filter((sub: any) => sub.type === 'calculator')

    const offeringEntries = category.subServices.filter((sub: any) => sub.type !== 'calculator')

    const subServices: SubServiceDetail[] = offeringEntries.map((sub) => {
      const tryExact = sub.translations.find((t: any) => t.locale === locale)
      const tryEn = sub.translations.find((t: any) => t.locale === 'en')
      const tryAny = sub.translations[0] as any | undefined

      const resolved = tryExact || tryEn || tryAny

      const name = resolved?.name || tryEn?.name || tryAny?.name || sub.slug
      const description =
        resolved?.description || tryEn?.description || tryAny?.description || sub.slug

      return {
        id: sub.id,
        slug: sub.slug,
        name,
        description,
        priceUsd: sub.priceUsd.toNumber(),
        deliveryTimeDays: sub.deliveryTimeDays,
        order: sub.order,
      }
    })

    // Map calculator pricing from dedicated sub-services by slug
    const standardCalc = calculatorEntries.find((s) => s.slug === 'calculator-standard')
    const expressCalc = calculatorEntries.find((s) => s.slug === 'calculator-express')
    const rushCalc = calculatorEntries.find((s) => s.slug === 'calculator-rush')

    const calculator = standardCalc
      ? {
          standardUsd: standardCalc.priceUsd.toNumber(),
          ...(expressCalc ? { expressUsd: expressCalc.priceUsd.toNumber() } : {}),
          ...(rushCalc ? { rushUsd: rushCalc.priceUsd.toNumber() } : {}),
        }
      : undefined

    // Urgency multipliers from category (Decimal -> number)
    const expressMultiplier = (category as any).expressMultiplier
    const rushMultiplier = (category as any).rushMultiplier

    const urgencyMultipliers =
      expressMultiplier && rushMultiplier
        ? {
            express:
              typeof expressMultiplier.toNumber === 'function'
                ? expressMultiplier.toNumber()
                : Number(expressMultiplier),
            rush:
              typeof rushMultiplier.toNumber === 'function'
                ? rushMultiplier.toNumber()
                : Number(rushMultiplier),
          }
        : undefined

    return {
      id: category.id,
      slug: category.slug,
      title: categoryTranslation?.title || 'Untitled',
      subtitle: categoryTranslation?.subtitle || null,
      localizedSlug: categoryTranslation?.slug || category.slug,
      metadata: categoryTranslation?.metadata as Record<string, unknown> | null,
      subServices,
      calculator,
      urgencyMultipliers,
    }
  }

  /**
   * Create a new sub-service with translations (Admin only - Future)
   */
  async createSubService(input: CreateSubServiceInput): Promise<{ id: number; slug: string }> {
    // Validate slug uniqueness within category
    const existing = await this.prisma.subService.findUnique({
      where: {
        serviceCategoryId_slug: {
          serviceCategoryId: input.serviceCategoryId,
          slug: input.slug,
        },
      },
    })

    if (existing) {
      throw new Error('Slug already exists in this category')
    }

    // Validate all 4 locales have translations
    const locales = input.translations.map((t) => t.locale)
    const missingLocales = SUPPORTED_LOCALES.filter((l) => !locales.includes(l))

    if (missingLocales.length > 0) {
      throw new Error(`Missing translations for locales: ${missingLocales.join(', ')}`)
    }

    // Validate priceUsd >= 0
    if (input.priceUsd < 0) {
      throw new Error('Price must be non-negative')
    }

    // Create sub-service and translations in transaction
    const subService = await this.prisma.$transaction(async (tx) => {
      const created = await tx.subService.create({
        data: {
          serviceCategoryId: input.serviceCategoryId,
          slug: input.slug,
          priceUsd: input.priceUsd,
          deliveryTimeDays: input.deliveryTimeDays,
          order: input.order ?? 0,
        },
      })

      await tx.subServiceTranslation.createMany({
        data: input.translations.map((t) => ({
          subServiceId: created.id,
          locale: t.locale,
          name: t.name,
          description: t.description,
        })),
      })

      return created
    })

    return {
      id: subService.id,
      slug: subService.slug,
    }
  }

  /**
   * Update sub-service details (Admin only - Future)
   */
  async updateSubService(id: number, input: UpdateSubServiceInput): Promise<{ id: number }> {
    // Validate priceUsd >= 0 if provided
    if (input.priceUsd !== undefined && input.priceUsd < 0) {
      throw new Error('Price must be non-negative')
    }

    const updated = await this.prisma.subService.update({
      where: { id },
      data: {
        ...(input.priceUsd !== undefined && { priceUsd: input.priceUsd }),
        ...(input.deliveryTimeDays !== undefined && {
          deliveryTimeDays: input.deliveryTimeDays,
        }),
        ...(input.order !== undefined && { order: input.order }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    })

    return { id: updated.id }
  }
}
