import { defineStore } from 'pinia'
import type { UniversityDetail, UniversityProgram } from '~~/server/types/api/universities'
import type { DegreeType } from '@prisma/client'

export const useUniversityDetailStore = defineStore('universityDetail', () => {
  const _currentUniversity = ref<UniversityDetail | null>(null)
  const _loading = ref(false)
  const _error = ref<string | null>(null)

  const currentUniversity = computed(() => _currentUniversity.value)
  const loading = computed(() => _loading.value)
  const error = computed(() => _error.value)

  const { locale } = useI18n()

  const getProgramsByLevel = (
    programs: UniversityProgram[],
    level: DegreeType,
  ): UniversityProgram[] => {
    return programs.filter((program) => program.degreeType === level)
  }

  const setCurrentUniversity = (university: UniversityDetail | null) => {
    _currentUniversity.value = university
  }

  const fetchUniversity = async (identifier: string | number) => {
    _loading.value = true
    _error.value = null

    try {
      const response = await $fetch<UniversityDetail>(
        `/api/v1/universities/${identifier}`,
        {
          headers: {
            'Accept-Language': locale.value,
          },
        },
      )

      if (response) {
        _currentUniversity.value = response
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

  const loadUniversityBySlug = async (slug: string) => {
    await fetchUniversity(slug)
  }

  const loadUniversityById = async (id: string | number) => {
    await fetchUniversity(id)
  }

  const isUniversityLoaded = (slug: string): boolean => {
    if (!_currentUniversity.value) return false
    const alternates = _currentUniversity.value.alternates
    return _currentUniversity.value.slug === slug || 
      (alternates ? Object.values(alternates).includes(slug) : false)
  }

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
  }
})
