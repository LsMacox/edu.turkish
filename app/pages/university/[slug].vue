<template>
  <div>
    <UniversitiesDetailView v-if="university" :university="university" />

    <!-- SSR fallback h1 when university data not yet available -->
    <h1 v-else-if="!university" class="sr-only">{{ slug }}</h1>

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
            class="bg-primary text-white px-6 py-3 rounded-button font-semibold hover:bg-red-600 transition-colors"
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
    const metaTitle = t(key('universities.detail.metaTitleTemplate'), {
      name: university.value.title,
    })

    return {
      title: metaTitle,
      meta: [
        {
          name: 'description',
          content:
            university.value.description ||
            t(key('universities.detail.fallbackDescription'), { name: university.value.title }),
        },
        {
          property: 'og:title',
          content: metaTitle,
        },
        {
          property: 'og:description',
          content:
            university.value.description ||
            t(key('universities.detail.fallbackDescription'), { name: university.value.title }),
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
    const runtimeConfig = useRuntimeConfig()
    const siteUrl = runtimeConfig.public.siteUrl || 'https://edu-turkish.com'

    const scripts = []

    if (university.value) {
      scripts.push({
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'EducationalOrganization',
          name: university.value.title,
          description: university.value.description,
          image: university.value.heroImage,
          url: `${siteUrl}${localePath(route.path)}`,
          address: university.value.city
            ? {
                '@type': 'PostalAddress',
                addressLocality: university.value.city,
              }
            : undefined,
        }),
      })

      scripts.push({
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: t(key('breadcrumbs.universities')),
              item: `${siteUrl}${localePath('/universities')}`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: university.value.title,
              item: `${siteUrl}${localePath(route.path)}`,
            },
          ],
        }),
      })
    }

    useHead({
      ...headData.value,
      script: scripts,
    })
  }
})
</script>
