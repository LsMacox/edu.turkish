<template>
  <div>
    <ClientOnly>
      <UniversitiesDetailView v-if="university" :university="university" />
      <template #fallback>
        <div class="bg-white" />
      </template>
    </ClientOnly>

    <ClientOnly>
      <div v-if="loading" class="min-h-screen bg-white flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4" />
          <h1 class="text-xl font-semibold text-secondary">{{ t(key('loading')) }}</h1>
        </div>
      </div>
      <div
        v-else-if="(!university && !loading) || error"
        class="min-h-screen bg-white flex items-center justify-center"
      >
        <div class="text-center">
          <h1 class="text-4xl font-bold text-secondary mb-4">{{ t(key('errors.universityNotFound')) }}</h1>
          <p class="text-gray-600 mb-8">{{ t(key('errors.universityNotFoundDescription')) }}</p>
          <NuxtLink
            :to="localePath('/universities')"
            class="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            {{ t(key('backToUniversities')) }}
          </NuxtLink>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useUniversityDetailStore } from '~/stores/universityDetail'
import { key } from '~~/lib/i18n'
const localePath = useLocalePath()

const route = useRoute()
const universityDetailStore = useUniversityDetailStore()
const { locale, t } = useI18n()
const setI18nParams = useSetI18nParams()

const slug = computed(() => route.params.slug as string)

await callOnce(async () => {
  if (!universityDetailStore.isUniversityLoaded(slug.value)) {
    await universityDetailStore.loadUniversityBySlug(slug.value)
  }
})

if (import.meta.client) {
  watch(
    () => slug.value,
    async (newSlug, oldSlug) => {
      if (!newSlug || newSlug === oldSlug) return
      universityDetailStore.clearCurrentUniversity()
      await universityDetailStore.loadUniversityBySlug(newSlug)
    },
  )

  watch(
    () => locale.value,
    async (newLocale, oldLocale) => {
      if (!newLocale || newLocale === oldLocale) return
      if (slug.value) {
        await universityDetailStore.loadUniversityBySlug(slug.value)
      }
    },
  )
}

const university = computed(() => universityDetailStore.currentUniversity)
const loading = computed(() => universityDetailStore.loading)
const error = computed(() => universityDetailStore.error)

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

const headData = computed(() => {
  if (university.value && university.value.title) {
    const defaultTitle = `${university.value.title} - Edu.turkish`
    const metaTitleFromI18n = t(key('universities.detail.metaTitleTemplate'), {
      name: university.value.title,
    })
    const metaTitle =
      metaTitleFromI18n && metaTitleFromI18n !== 'universities.detail.metaTitleTemplate'
        ? metaTitleFromI18n
        : defaultTitle

    return {
      title: metaTitle,
      meta: [
        {
          name: 'description',
          content: university.value.description || t(key('universityInformation')),
        },
        {
          property: 'og:title',
          content: metaTitle,
        },
        {
          property: 'og:description',
          content: university.value.description || t(key('universityInformation')),
        },
        {
          property: 'og:image',
          content: university.value.heroImage || '',
        },
      ],
    }
  } else {
    return {
      title: `${t(key('errors.universityNotFound'))} - Edu.turkish`,
      meta: [
        {
          name: 'description',
          content: t(key('errors.universityNotFoundDescription')),
        },
      ],
    }
  }
})

watchEffect(() => {
  if (headData.value) {
    useHead(headData.value)
  }
})
</script>
