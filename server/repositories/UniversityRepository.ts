// @ts-nocheck
import { PrismaClient } from '@prisma/client'
import type { DegreeType, UniversityType } from '../../app/types/domain'
import type { University, UniversityQueryParams, UniversityDetail } from '../types/api'

export class UniversityRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Выбор лучшего перевода с fallback логикой
   * 1. Точное совпадение с запрошенным языком
   * 2. Fallback на русский
   * 3. Любой доступный перевод
   */
  private selectBestTranslation<T extends { locale: string }>(
    translations: T[], 
    requestedLocale: string
  ): T | null {
    // 1. Ищем точное совпадение
    let translation = translations.find(t => t.locale === requestedLocale)
    if (translation) return translation
    
    // 2. Fallback на русский
    translation = translations.find(t => t.locale === 'ru')
    if (translation) return translation
    
    // 3. Берем любой доступный
    return translations.length > 0 ? translations[0] : null
  }

  /**
   * Получение slug из переводов (fallback: ru -> любой)
   */
  private getSlugForLocaleFromTranslations(translations: Array<{ locale: string; slug: string }>, locale: string): string {
    const exact = translations.find(t => t.locale === locale)
    if (exact?.slug) return exact.slug
    const ru = translations.find(t => t.locale === 'ru')
    if (ru?.slug) return ru.slug
    return translations[0]?.slug || ''
  }

  /**
   * Find all universities with filtering, sorting, and pagination
   */
  async findAll(params: UniversityQueryParams, locale: string = 'ru'): Promise<{
    data: University[]
    total: number
    filters: {
      cities: string[]
      types: string[]
      levels: string[]
      priceRange: [number, number]
    }
  }> {
    const {
      q,
      city,
      langs = [],
      type,
      level,
      price_min = 0,
      price_max = 20000,
      sort = 'pop',
      page = 1,
      limit = 12
    } = params

    // Build where clause
    const where: any = {}

    // Price filter based on normalized fields
    if (price_min !== undefined || price_max !== undefined) {
      const min = price_min
      const max = price_max
      where.AND = (where.AND || [])
      where.AND.push({
        OR: [
          { tuitionMin: { gte: min, lte: max } },
          { tuitionMax: { gte: min, lte: max } }
        ]
      })
    }

    // Search by title/description translations and city name translations
    if (q) {
      where.AND = (where.AND || [])
      where.AND.push({
        OR: [
          {
            translations: {
              some: {
                locale,
                OR: [
                  { title: { contains: q, mode: 'insensitive' } },
                  { description: { contains: q, mode: 'insensitive' } }
                ]
              }
            }
          },
          {
            translations: {
              some: {
                locale: 'ru',
                OR: [
                  { title: { contains: q, mode: 'insensitive' } },
                  { description: { contains: q, mode: 'insensitive' } }
                ]
              }
            }
          },
          {
            city: {
              translations: {
                some: { locale, name: { contains: q, mode: 'insensitive' } }
              }
            }
          },
          {
            city: {
              translations: {
                some: { locale: 'ru', name: { contains: q, mode: 'insensitive' } }
              }
            }
          }
        ]
      })
    }

    // City filter using normalized City -> CityTranslation
    if (city && city !== 'Все города' && city !== 'All cities') {
      where.AND = (where.AND || [])
      where.AND.push({
        OR: [
          { city: { translations: { some: { locale, name: city } } } },
          { city: { translations: { some: { locale: 'ru', name: city } } } }
        ]
      })
    }

    // Apply type filter
    if (type && type !== 'Все' && type !== 'All') {
      const typeMap: Record<string, string> = {
        'Государственный': 'state',
        'Частный': 'private',
        'State': 'state',
        'Private': 'private',
        'Technical': 'tech',
        'Elite': 'elite'
      }
      const mappedType = typeMap[type] || type
      where.type = mappedType
    }

    // Apply level filter (bachelor/master/phd) against related academic programs
    if (level && level !== 'Все' && level !== 'All') {
      const levelMap: Record<string, string> = {
        'Бакалавриат': 'bachelor',
        'Магистратура': 'master',
        'Докторантура': 'phd',
        'Bachelor': 'bachelor',
        'Master': 'master',
        'PhD': 'phd'
      }
      const mappedLevel = (levelMap[level] || level) as DegreeType
      where.academicPrograms = {
        some: {
          degreeType: mappedLevel
        }
      }
    }

    // Apply language filter via AcademicProgram.languageCode
    if (langs.length > 0) {
      where.AND = (where.AND || [])
      where.AND.push({
        academicPrograms: {
          some: {
            languageCode: {
              in: langs
            }
          }
        }
      })
    }

    // Build order by clause
    let orderBy: any = { id: 'asc' } // default

    switch (sort) {
      case 'price_asc':
        orderBy = { tuitionMin: 'asc' }
        break
      case 'price_desc':
        orderBy = { tuitionMax: 'desc' }
        break
      case 'alpha':
        // We'll sort in-memory by localized title after fetch
        orderBy = { id: 'asc' }
        break
      case 'lang_en':
        // Post-process priority for EN after fetch; keep DB order stable
        orderBy = { id: 'asc' }
        break
      default:
        orderBy = { id: 'asc' }
        break
    }

    // Execute queries - получаем все переводы для fallback логики
    const [universities, total] = await this.prisma.$transaction([
      this.prisma.university.findMany({
        where,
        include: {
          translations: true,
          academicPrograms: true,
          city: { include: { translations: true } }
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.university.count({ where })
    ])

    // Get filter options
    const [allUniversities] = await this.prisma.$transaction([
      this.prisma.university.findMany({
        include: {
          city: { include: { translations: true } },
          translations: true,
          academicPrograms: true
        }
      })
    ])

    // Extract cities with fallback logic
    const availableCities = [...new Set(
      allUniversities
        .map(u => {
          const ct = (u.city?.translations || []) as Array<{ locale: string; name: string }>
          const best = this.selectBestTranslation(ct, locale)
          return best?.name
        })
        .filter(Boolean)
    )].sort()

    const availableTypes = ['state', 'private', 'tech', 'elite']
    const availableLevels = ['bachelor', 'master', 'phd']
    const allAny = allUniversities as any[]
    const priceCandidates: number[] = allAny.map(u => Number(u.tuitionMin || u.tuitionMax || 0)).filter(v => !Number.isNaN(v))
    const priceRange: [number, number] = [
      priceCandidates.length ? Math.min(...priceCandidates) : 0,
      priceCandidates.length ? Math.max(...priceCandidates) : 50000
    ]

    // Transform to API format with normalized structure
    const transformedUniversities: University[] = (universities as any[]).map((uni: any) => {
      const translation = this.selectBestTranslation(uni.translations, locale)
      const languageCodes = (uni.academicPrograms || []).map((p: any) => p.languageCode).filter(Boolean)
      const cityTr = this.selectBestTranslation((uni.city?.translations || []) as any[], locale)

      return {
        id: uni.id,
        title: (translation as any)?.title || '',
        description: (translation as any)?.description || '',
        city: (cityTr as any)?.name || '',
        foundedYear: uni.foundedYear || 0,
        type: uni.type as UniversityType,
        
        // Нормализованная стоимость
        tuitionRange: {
          min: Number(uni.tuitionMin || 0),
          max: Number(uni.tuitionMax || 0),
          currency: uni.currency || 'USD'
        },
        
        // Нормализованные данные о студентах  
        totalStudents: uni.totalStudents || 0,
        internationalStudents: uni.internationalStudents || 0,
        
        // Нормализованный рейтинг (только текст из keyInfoTexts если есть)
        ranking: {
          text: (translation as any)?.keyInfoTexts?.ranking_text || undefined
        },
        
        // Нормализованное проживание
        hasAccommodation: uni.hasAccommodation || false,
        
        // Мета данные
        languages: Array.from(new Set(languageCodes)),
        slug: this.getSlugForLocaleFromTranslations(uni.translations as any[], locale),
        image: uni.image || '',
        heroImage: uni.heroImage || uni.image,
        // Use lite badge that doesn't rely on unloaded relations
        badge: this.generateBadgeLite(uni, locale)
      }
    })

    // Post-process sorting for 'lang_en': prioritize universities where languages include 'en'
    let prioritized = transformedUniversities
    if (sort === 'lang_en') {
      prioritized = [...transformedUniversities].sort((a, b) => {
        const aHasEn = a.languages.includes('en') ? 1 : 0
        const bHasEn = b.languages.includes('en') ? 1 : 0
        if (aHasEn !== bHasEn) return bHasEn - aHasEn
        return a.title.localeCompare(b.title)
      })
    } else if (sort === 'alpha') {
      prioritized = [...transformedUniversities].sort((a, b) => a.title.localeCompare(b.title))
    }

    return {
      data: prioritized,
      total,
      filters: {
        cities: availableCities,
        types: availableTypes,
        levels: availableLevels,
        priceRange
      }
    }
  }

  /**
   * Find university by ID with full details
   */
  async findById(id: number, locale: string = 'ru'): Promise<UniversityDetail | null> {
    const university = await this.prisma.university.findUnique({
      where: { id },
      include: {
        translations: true,
        academicPrograms: { include: { translations: true } },
        campusFacilities: { include: { translations: true } },
        admissionRequirements: { include: { translations: true } },
        requiredDocuments: { include: { translations: true } },
        importantDates: { include: { translations: true } },
        scholarships: { include: { translations: true } },
        universityDirections: { include: { direction: { include: { translations: true } } } },
        media: { include: { translations: true } },
        country: { include: { translations: true } },
        city: { include: { translations: true } }
      } as any
    })

    if (!university) return null

    const translation = this.selectBestTranslation(university.translations, locale)

    // About and strong programs now come from translation JSON fields
    const aboutLocalized: any = (translation as any)?.about || {}
    const strongProgramsLocalized: any = (translation as any)?.strongPrograms || []

    // Transform to detailed university format with normalized structure
    const cityTr = this.selectBestTranslation((university.city?.translations || []) as any[], locale)
    const languagesUnique = Array.from(new Set((university.academicPrograms || []).map((p: any) => p.languageCode).filter(Boolean)))
    const keyInfo: any = {
      city: (cityTr as any)?.name || '',
      foundedYear: university.foundedYear || 0,
      tuitionRange: {
        min: Number(university.tuitionMin || 0),
        max: Number(university.tuitionMax || 0),
        currency: university.currency || 'USD'
      },
      languages: languagesUnique,
      totalStudents: university.totalStudents || 0,
      internationalStudents: university.internationalStudents || 0,
      hasAccommodation: university.hasAccommodation || false,
      ranking: {
        text: (translation as any)?.keyInfoTexts?.ranking_text || undefined
      },
      texts: (translation as any)?.keyInfoTexts || undefined
    }

    return {
      // Базовые поля University интерфейса
      id: university.id,
      title: translation?.title || '',
      description: translation?.description || '',
      city: keyInfo.city,
      foundedYear: keyInfo.foundedYear,
      type: university.type as UniversityType,
      tuitionRange: keyInfo.tuitionRange,
      totalStudents: keyInfo.totalStudents,
      internationalStudents: keyInfo.internationalStudents,
      ranking: keyInfo.ranking,
      hasAccommodation: keyInfo.hasAccommodation,
      languages: keyInfo.languages,
      slug: this.getSlugForLocaleFromTranslations(university.translations as any[], locale),
      image: university.image || '',
      heroImage: university.heroImage || university.image,
      badge: this.generateBadge(university, locale),
      keyInfo: keyInfo,
      about: {
        history: aboutLocalized?.history || (() => {
          const localizedTitle = (translation as any)?.title || university.title || ''
          return localizedTitle
            ? `Университет ${localizedTitle} имеет богатую историю образования.`
            : 'Университет имеет богатую историю образования.'
        })(),
        mission: aboutLocalized?.mission || aboutLocalized?.campus || 'Миссия университета - предоставление качественного образования.',
        campus_features: [],
        strong_programs: Array.isArray(strongProgramsLocalized) ? (strongProgramsLocalized as any[]).map((sp: any) => sp?.category || '') : [],
        advantages: Array.isArray(aboutLocalized?.advantages) 
          ? (aboutLocalized.advantages as any[]).map((adv: any) => ({
              title: typeof adv === 'string' ? adv : (adv?.title || ''),
              description: typeof adv === 'object' ? (adv?.description || '') : ''
            }))
          : [
              { title: 'Качественное образование', description: 'Высокие стандарты преподавания' },
              { title: 'Международное признание', description: 'Дипломы признаются по всему миру' }
            ]
      },
      
      campus_life: {
        facilities: university.campusFacilities
          .filter(f => f.isActive !== false)
          .map(f => {
            const facilityTranslation = this.selectBestTranslation(f.translations as any[], locale)
            return {
              id: f.id,
              name: (facilityTranslation as any)?.name || '',
              description: (facilityTranslation as any)?.description || '',
              image: f.image,
              // Тип в БД не хранится — используем общий тип для UI
              type: 'support' as const,
              isActive: f.isActive !== false
            }
          }),
        gallery: (university.media || [])
          .filter(m => m.kind === 'image')
          .map(m => {
            const mt = this.selectBestTranslation((m.translations || []) as any[], locale)
            return {
              url: m.url,
              alt: (mt as any)?.alt || '',
              title: (mt as any)?.title || ''
            }
          }),
        activities: ['Студенческие клубы', 'Культурные мероприятия', 'Спортивные соревнования']
      },
      
      strong_programs: Array.isArray(strongProgramsLocalized) ? strongProgramsLocalized : [],
      
      directions: university.universityDirections.map(ud => {
        const directionTranslation = this.selectBestTranslation(ud.direction.translations as any[], locale)
        return {
          id: ud.direction.id,
          name: (directionTranslation as any)?.name || '',
          description: (directionTranslation as any)?.description || '',
          slug: (directionTranslation as any)?.slug || '',
          languages: [],
          duration_years: ud.durationYears || undefined,
          cost_per_year: ud.costPerYear != null ? Number(ud.costPerYear) : undefined
        }
      }),
      
      admission: {
        requirements: university.admissionRequirements.map(r => {
          const reqTranslation = this.selectBestTranslation(r.translations as any[], locale)
          return {
            id: r.id,
            category: (reqTranslation as any)?.category || '',
            requirement: (reqTranslation as any)?.requirement || '',
            is_mandatory: false,
            details: (reqTranslation as any)?.details || undefined
          }
        }),
        documents: university.requiredDocuments.map(d => {
          const docTranslation = this.selectBestTranslation(d.translations as any[], locale)
          const fmt = (docTranslation as any)?.formatRequirements
          return {
            id: d.id,
            name: (docTranslation as any)?.name || '',
            description: (docTranslation as any)?.description || '',
            is_mandatory: false,
            format_requirements: Array.isArray(fmt) ? (fmt as string[]) : []
          }
        }),
        deadlines: university.importantDates.map(date => {
          const dateTranslation = this.selectBestTranslation(date.translations as any[], locale)
          return {
            id: date.id,
            event: (dateTranslation as any)?.event || '',
            date: date.date.toISOString().split('T')[0],
            deadline_type: date.type as 'application' | 'document' | 'exam' | 'notification'
          }
        }),
        scholarships: university.scholarships.map(s => {
          const scholarshipTranslation = this.selectBestTranslation(s.translations as any[], locale)
          const criteria = (scholarshipTranslation as any)?.eligibilityCriteria
          return {
            id: s.id,
            name: (scholarshipTranslation as any)?.name || '',
            type: s.type as 'government' | 'university' | 'private',
            coverage_percentage: s.coveragePercentage,
            eligibility_criteria: Array.isArray(criteria) ? (criteria as string[]) : [],
            application_deadline: s.applicationDeadline ? s.applicationDeadline.toISOString().split('T')[0] : undefined
          }
        })
      },
      
      programs: university.academicPrograms.map(p => {
        const progTranslation = this.selectBestTranslation(p.translations as any[], locale)
        return {
          id: p.id,
          name: (progTranslation as any)?.name || '',
          degree_type: p.degreeType as 'bachelor' | 'master' | 'phd',
          language: p.languageCode,
          duration_years: p.durationYears,
          tuition_per_year: Number(p.tuitionPerYear),
          description: (progTranslation as any)?.description || ''
        }
      })
    }
  }

  /**
   * Find university by slug with multilingual support
   */
  async findBySlug(slug: string, locale: string = 'ru'): Promise<UniversityDetail | null> {
    // Ищем перевод по слагу и получаем universityId
    const translation = await (this.prisma as any).universityTranslation.findFirst({
      where: { slug }
    })
    if (!translation) return null
    return this.findById(translation.universityId, locale)
  }

  /**
   * Generate badge for university
   */
  private generateBadge(university: any, locale: string): { label?: string; labelKey?: string; color: string } | undefined {
    // Prefer returning i18n keys; keep label for backward compatibility
    if (university.scholarships?.length > 0) {
      return { labelKey: 'universities_page.card.badges.scholarships', color: 'green' }
    }

    // Numeric ranking removed

    if (university.type === 'tech') {
      return { labelKey: 'universities_page.card.badges.technical', color: 'purple' }
    }

    return undefined
  }

  /**
   * Generate lightweight badge without relying on relations that may not be loaded (e.g., scholarships)
   */
  private generateBadgeLite(
    university: { type?: string },
    locale: string
  ): { label?: string; labelKey?: string; color: string } | undefined {
    // Numeric ranking removed

    if (university.type === 'tech') {
      return { labelKey: 'universities_page.card.badges.technical', color: 'purple' }
    }

    return undefined
  }

  /**
   * Find universities by direction
   */
  async findByDirection(directionSlug: string, locale: string = 'ru') {
    const universities = await this.prisma.university.findMany({
      where: {
        universityDirections: {
          some: {
            direction: {
              translations: {
                some: { slug: directionSlug }
              }
            }
          }
        }
      },
      include: {
        translations: true,
        academicPrograms: true,
        city: { include: { translations: true } },
        universityDirections: {
          include: {
            direction: {
              include: { translations: true }
            }
          }
        }
      }
    })

    return universities.map(uni => {
      const translation = this.selectBestTranslation(uni.translations as any[], locale)
      const languageCodes = (uni.academicPrograms || []).map((p: any) => p.languageCode)
      const cityTr = this.selectBestTranslation((uni.city?.translations || []) as any[], locale)

      return {
        id: uni.id,
        title: (translation as any)?.title || '',
        description: (translation as any)?.description || '',
        city: (cityTr as any)?.name || '',
        languages: Array.from(new Set(languageCodes)),
        // Use lite badge for list query
        badge: this.generateBadgeLite(uni as any, locale),
        image: uni.image || '',
        type: uni.type as UniversityType,
        slug: this.getSlugForLocaleFromTranslations(uni.translations as any[], locale),
        foundedYear: uni.foundedYear || 0
      }
    })
  }

  /**
   * Get all study directions
   */
  async getAllDirections(locale: string = 'ru') {
    const directions = await (this.prisma as any).studyDirection.findMany({
      include: {
        translations: true,
        universityDirections: true
      }
    })

    return directions.map((direction: any) => {
      const translation = this.selectBestTranslation(direction.translations, locale)
      return {
        id: direction.id,
        name: (translation as any)?.name || '',
        description: (translation as any)?.description || '',
        slug: (translation as any)?.slug || '',
        universities_count: direction.universityDirections.length
      }
    })
  }
}
