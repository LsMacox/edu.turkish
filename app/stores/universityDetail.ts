import { defineStore } from 'pinia'
import type { UniversityDetail } from '~~/server/types/api/universities'

export const useUniversityDetailStore = defineStore('universityDetail', () => {
  const university = ref<UniversityDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { locale } = useI18n()

  const load = async (slug: string) => {
    loading.value = true
    error.value = null

    try {
      const res = await $fetch<UniversityDetail>(`/api/v1/universities/${slug}`, {
        headers: { 'Accept-Language': locale.value },
      })
      university.value = res ?? null
      if (!res) error.value = 'University not found'
    } catch (e: unknown) {
      console.error('Failed to load university:', e)
      error.value = e instanceof Error ? e.message : 'Failed to load university'
      university.value = null
    } finally {
      loading.value = false
    }
  }

  const isLoaded = (slug: string): boolean => {
    if (!university.value) return false
    const alt = university.value.alternates
    return university.value.slug === slug || (alt ? Object.values(alt).includes(slug) : false)
  }

  const clear = () => {
    university.value = null
    error.value = null
  }

  return {
    university,
    loading,
    error,
    load,
    isLoaded,
    clear,
    // Aliases for backwards compat
    currentUniversity: university,
    loadUniversityBySlug: load,
    isUniversityLoaded: isLoaded,
    clearCurrentUniversity: clear,
  }
})
