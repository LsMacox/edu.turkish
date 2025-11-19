<template>
  <div>
    <!-- University details (Client-only to fully avoid SSR hydration mismatch) -->
    <ClientOnly>
      <UniversitiesUniversityDetailView v-if="university" :university="university" />
      <template #fallback>
        <div class="bg-white" />
      </template>
    </ClientOnly>

    <!-- Loading/Not found (Client-only to avoid SSR hydration mismatch) -->
    <ClientOnly>
      <div v-if="loading" class="min-h-screen bg-white flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4" />
          <h1 class="text-xl font-semibold text-secondary">{{ t('loading') }}</h1>
        </div>
      </div>
      <div
        v-else-if="(!university && !loading) || error"
        class="min-h-screen bg-white flex items-center justify-center"
      >
        <div class="text-center">
          <h1 class="text-4xl font-bold text-secondary mb-4">{{ t('universityNotFound') }}</h1>
          <p class="text-gray-600 mb-8">{{ t('universityNotFoundDescription') }}</p>
          <NuxtLink
            :to="localePath('/universities')"
            class="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            {{ t('backToUniversities') }}
          </NuxtLink>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useUniversityDetailStore } from '~/stores/universityDetail'
const localePath = useLocalePath()

const route = useRoute()
const universityDetailStore = useUniversityDetailStore()
const { locale, t } = useI18n()
const setI18nParams = useSetI18nParams()

// Get university by slug from API (reactive)
const slug = computed(() => route.params.slug as string)

// Load on server for SSR hydration
await callOnce(async () => {
  if (!universityDetailStore.isUniversityLoaded(slug.value)) {
    await universityDetailStore.loadUniversityBySlug(slug.value)
  }
})

// Client-side: react to slug changes during navigation and refetch
if (import.meta.client) {
  // Force load on client if not loaded (fallback for SSR issues)
  onMounted(async () => {
    if (!universityDetailStore.isUniversityLoaded(slug.value) && !universityDetailStore.loading) {
      await universityDetailStore.loadUniversityBySlug(slug.value)
    }
  })

  watch(
    () => slug.value,
    async (newSlug, oldSlug) => {
      if (!newSlug || newSlug === oldSlug) return
      universityDetailStore.clearCurrentUniversity()
      await universityDetailStore.loadUniversityBySlug(newSlug)
    },
  )

  // Watch for locale changes and reload university data
  watch(
    () => locale.value,
    async (newLocale, oldLocale) => {
      if (!newLocale || newLocale === oldLocale) return
      // Reload university data with new locale
      if (slug.value && universityDetailStore.isUniversityLoaded(slug.value)) {
        await universityDetailStore.loadUniversityBySlug(slug.value)
      }
    },
  )
}

const university = computed(() => universityDetailStore.currentUniversity)
const loading = computed(() => universityDetailStore.loading)
const error = computed(() => universityDetailStore.error)

// Set i18n params for alternate routes
watch(
  university,
  (newVal) => {
    const alternates = (newVal as any)?.alternates as Record<string, string> | undefined
    if (!alternates) return

    const params: Record<string, { slug: string }> = {}
    for (const [altLocale, altSlug] of Object.entries(alternates)) {
      params[altLocale] = { slug: String(altSlug) }
    }
    setI18nParams(params)
  },
  { immediate: true },
)

// Debug information in development
// dev logging removed

// SEO and meta tags setup
const headData = computed(() => {
  if (university.value && university.value.name) {
    const defaultTitle = `${university.value.name} - Edu.turkish`
    const metaTitleFromI18n = t('universityDetail.metaTitleTemplate', {
      name: university.value.name,
    })
    const metaTitle =
      metaTitleFromI18n && metaTitleFromI18n !== 'universityDetail.metaTitleTemplate'
        ? metaTitleFromI18n
        : defaultTitle

    return {
      title: metaTitle,
      meta: [
        {
          name: 'description',
          content: university.value.description || t('universityInformation'),
        },
        {
          property: 'og:title',
          content: metaTitle,
        },
        {
          property: 'og:description',
          content: university.value.description || t('universityInformation'),
        },
        {
          property: 'og:image',
          content: university.value.heroImage || '',
        },
      ],
    }
  } else {
    return {
      title: `${t('universityNotFound')} - Edu.turkish`,
      meta: [
        {
          name: 'description',
          content: t('universityNotFoundDescription'),
        },
      ],
    }
  }
})

// Safe head usage with null check
watchEffect(() => {
  if (headData.value) {
    useHead(headData.value)
  }
})
</script>
