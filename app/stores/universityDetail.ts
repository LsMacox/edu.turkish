import { defineStore } from 'pinia'
import type { UniversityDetail, UniversityStudyDirection } from '~~/server/types/api/universities'
import type { DegreeType } from '~/types/domain'

// Новые интерфейсы для фронтенда (совместимые со старыми компонентами)
export interface UniversityProgram {
  name: string
  language: 'EN' | 'TR' | 'EN/TR'
  duration: string
  price: number
  level: DegreeType
}

export interface UniversityKeyInfo {
  city: string
  foundedYear: number
  priceFrom: number
  languages: string[]
  studentsCount: number
  accommodation: string
  ranking: string
  internationalStudents: string
}

export interface UniversityDetailFrontend {
  id: string
  name: string
  description: string
  heroImage: string
  type: string
  keyInfo: UniversityKeyInfo
  about: {
    history: string
    campus: string
    advantages: Array<{
      title: string
      description: string
    }>
  }
  strongPrograms: Array<{
    category: string
    programs: string[]
  }>
  academicPrograms: UniversityProgram[]
  slugs: {
    ru: string
    en: string
    kk: string
    tr: string
  }
  // Новые поля
  directions?: UniversityStudyDirection[]
  campus_life?: {
    gallery: Array<{
      url: string
      alt?: string
      title?: string
    }>
    facilities: Array<{
      id: number
      name: string
      description: string
      type: string
      capacity?: number
      area?: number
    }>
  }
  admission?: {
    requirements: Array<{
      id: number
      category: string
      requirement: string
      is_mandatory: boolean
      details?: string
    }>
    documents: Array<{
      id: number
      name: string
      description: string
      is_mandatory: boolean
      format_requirements?: string[]
    }>
    deadlines: Array<{
      id: number
      event: string
      date: string
      deadline_type: 'application' | 'document' | 'exam' | 'notification'
    }>
    scholarships: Array<{
      id: number
      name: string
      type: 'government' | 'university' | 'private'
      coverage_percentage: number
      eligibility_criteria: string[]
      application_deadline?: string
    }>
  }
}

export const useUniversityDetailStore = defineStore('universityDetail', () => {
  // Internal state (mutable)
  const _currentUniversity = ref<UniversityDetailFrontend | null>(null)
  const _loading = ref(false)
  const _error = ref<string | null>(null)

  // Public readonly state
  const currentUniversity = computed(() => _currentUniversity.value)
  const loading = computed(() => _loading.value)
  const error = computed(() => _error.value)

  // Global i18n for formatting inside this store
  const { locale, t } = useI18n()

  // Actions

  const getProgramsByLevel = (
    programs: UniversityProgram[],
    level: DegreeType,
  ): UniversityProgram[] => {
    return programs.filter((program) => program.level === level)
  }

  const setCurrentUniversity = (university: UniversityDetailFrontend | null) => {
    _currentUniversity.value = university
  }

  /**
   * Преобразование API ответа в формат фронтенда
   */
  const transformApiToFrontend = (apiUniversity: UniversityDetail): UniversityDetailFrontend => {
    const formatAccommodation = (has: boolean): string => {
      return has
        ? t('universityDetail.accommodationValue.has')
        : t('universityDetail.accommodationValue.none')
    }

    const formatRanking = (
      rank?: number | null,
      source?: string | null,
      text?: string | null,
    ): string => {
      // Приоритет переводимого текста из БД
      if (text && text.trim().length > 0) {
        return text
      }
      // Затем fallback на текстовый source из БД (не локализуется)
      if (source && source.trim().length > 0) {
        return source
      }
      // Числовой ранг больше не показываем как "Топ-N", скрываем или пишем что не указан
      return t('universityDetail.rankingNotSpecified')
    }

    const formatInternational = (count: number): string => {
      return t('universityDetail.internationalCount', { count })
    }

    return {
      id: apiUniversity.id.toString(),
      name: apiUniversity.title,
      description: apiUniversity.description,
      heroImage: apiUniversity.heroImage || apiUniversity.image,
      type: t(`universityDetail.universityType.${apiUniversity.type}`) || apiUniversity.type,
      keyInfo: {
        city: apiUniversity.keyInfo?.city || apiUniversity.city,
        foundedYear: apiUniversity.keyInfo?.foundedYear || apiUniversity.foundedYear || 0,
        priceFrom: apiUniversity.keyInfo?.tuitionRange?.min || apiUniversity.tuitionRange?.min || 0,
        languages: apiUniversity.keyInfo?.languages || apiUniversity.languages,
        studentsCount: apiUniversity.keyInfo?.totalStudents || apiUniversity.totalStudents || 0,
        accommodation: formatAccommodation(
          Boolean(apiUniversity.keyInfo?.hasAccommodation || apiUniversity.hasAccommodation),
        ),
        ranking: (() => {
          const textsRanking = (apiUniversity.keyInfo as any)?.texts?.ranking as string | undefined
          if (textsRanking && textsRanking.trim().length > 0) return textsRanking
          return formatRanking(
            (apiUniversity.keyInfo as any)?.ranking?.national,
            (apiUniversity.keyInfo as any)?.ranking?.source,
            (apiUniversity.keyInfo as any)?.ranking?.text,
          )
        })(),
        // Если пришли готовые локализованные тексты для ключевой информации — используем их в UI-слое
        // (Компоненты могут читать university.keyInfo.texts.languages и т.п.)
        internationalStudents: formatInternational(
          Number(
            apiUniversity.keyInfo?.internationalStudents ||
              apiUniversity.internationalStudents ||
              0,
          ),
        ),
      },
      about: {
        history: apiUniversity.about.history,
        campus: apiUniversity.about.mission, // используем mission как описание кампуса
        advantages: extractAdvantagesFromApiData(apiUniversity),
      },
      strongPrograms: apiUniversity.strong_programs || [],
      academicPrograms: transformAcademicPrograms(apiUniversity.programs),
      slugs: extractSlugsFromApi(apiUniversity),
      // Новые поля
      directions: apiUniversity.directions || [],
      campus_life: {
        gallery: apiUniversity.campus_life?.gallery || [],
        facilities: apiUniversity.campus_life?.facilities || [],
      },
      admission: apiUniversity.admission || {
        requirements: [],
        documents: [],
        deadlines: [],
        scholarships: [],
      },
    }
  }

  /**
   * Извлечение преимуществ из API данных
   */
  const extractAdvantagesFromApiData = (
    apiUniversity: UniversityDetail,
  ): Array<{ title: string; description: string }> => {
    const advantages = apiUniversity.about.advantages || []

    // Если это уже массив объектов
    if (
      advantages.length > 0 &&
      typeof advantages[0] === 'object' &&
      advantages[0] !== null &&
      'title' in advantages[0]
    ) {
      return advantages as unknown as Array<{ title: string; description: string }>
    }

    // Если это массив строк, преобразуем в объекты
    if (Array.isArray(advantages) && advantages.length > 0 && typeof advantages[0] === 'string') {
      return (advantages as unknown as string[]).map((advantage: string) => ({
        title: advantage,
        description: `Университет предлагает ${advantage.toLowerCase()}`,
      }))
    }

    // Fallback - пустой массив
    return []
  }

  /**
   * Преобразование академических программ
   */
  const transformAcademicPrograms = (apiPrograms: any[]): UniversityProgram[] => {
    return apiPrograms.map((program) => ({
      name: program.name,
      language: program.language as 'EN' | 'TR' | 'EN/TR',
      duration: t('universityDetail.programDuration.durationYears', {
        count: program.duration_years,
      }),
      price: program.tuition_per_year,
      level: program.degree_type as DegreeType,
    }))
  }

  /**
   * Извлечение слагов (пока используем один слаг для всех языков)
   */
  const extractSlugsFromApi = (apiUniversity: UniversityDetail) => {
    return {
      ru: apiUniversity.slug,
      en: apiUniversity.slug,
      kk: apiUniversity.slug,
      tr: apiUniversity.slug,
    }
  }

  /**
   * Получение типа университета на русском
   */
  // Removed unused getUniversityTypeInRussian

  /**
   * Загрузка университета по слагу (новый метод с API)
   */
  const loadUniversityBySlug = async (slug: string) => {
    _loading.value = true
    _error.value = null

    try {
      // Получаем текущую локаль
      // use global locale from store

      // Делаем запрос к API
      const response = await $fetch<UniversityDetail>(`/api/v1/universities/${slug}`, {
        headers: {
          'Accept-Language': locale.value,
        },
      })

      if (response) {
        const frontendUniversity = transformApiToFrontend(response)
        _currentUniversity.value = frontendUniversity
      } else {
        _error.value = 'University not found'
        _currentUniversity.value = null
      }
    } catch (err: any) {
      console.error('Failed to load university:', err)
      _error.value = err.message || 'Failed to load university'
      _currentUniversity.value = null
    } finally {
      _loading.value = false
    }
  }

  /**
   * Загрузка университета по ID
   */
  const loadUniversityById = async (id: string | number) => {
    _loading.value = true
    _error.value = null

    try {
      // use global locale from store

      const response = await $fetch<UniversityDetail>(`/api/v1/universities/${id}`, {
        headers: {
          'Accept-Language': locale.value,
        },
      })

      if (response) {
        const frontendUniversity = transformApiToFrontend(response)
        _currentUniversity.value = frontendUniversity
      } else {
        _error.value = 'University not found'
        _currentUniversity.value = null
      }
    } catch (err: any) {
      console.error('Failed to load university:', err)
      _error.value = err.message || 'Failed to load university'
      _currentUniversity.value = null
    } finally {
      _loading.value = false
    }
  }

  /**
   * Проверка, загружен ли университет с данным слагом
   */
  const isUniversityLoaded = (slug: string): boolean => {
    if (!_currentUniversity.value) return false
    return Object.values(_currentUniversity.value.slugs).includes(slug)
  }

  /**
   * Очистка текущего университета
   */
  const clearCurrentUniversity = () => {
    _currentUniversity.value = null
    _error.value = null
  }

  return {
    // State
    currentUniversity,
    loading,
    error,

    // Actions
    getProgramsByLevel,
    setCurrentUniversity,
    loadUniversityBySlug,
    loadUniversityById,
    isUniversityLoaded,
    clearCurrentUniversity,

    // Utility functions
    transformApiToFrontend,
  }
})
