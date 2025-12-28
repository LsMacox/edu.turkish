<template>
  <div class="bg-white">
    <section v-if="pending" class="py-20">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="rounded-card-lg bg-white p-10 text-center shadow-custom">
          <p class="text-lg font-semibold text-secondary">{{ t(detailNs('loading')) }}</p>
        </div>
      </div>
    </section>

    <section v-else-if="errorMessage" class="py-20">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="space-y-6 rounded-card-lg bg-white p-10 text-center shadow-custom">
          <p class="text-2xl font-semibold text-secondary">{{ errorMessage }}</p>
          <NuxtLink
            :to="localePath('/programs')"
            class="inline-flex items-center gap-component-sm rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-card-hover transition hover:bg-secondary/90"
          >
            {{ t(detailNs('allPrograms')) }}
            <Icon name="mdi:arrow-right" class="text-lg" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <template v-else-if="program">
      <ProgramsDetail :program="program" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ProgramDetailResponse } from '~~/lib/types'
import { namespace } from '~~/lib/i18n'

const programsNs = namespace('programs')
const detailNs = namespace('programs.detail')
const metaNs = namespace('programs.meta')

definePageMeta({ layout: 'default' })

const route = useRoute()
const localePath = useLocalePath()
const { locale, t } = useI18n()
const setI18nParams = useSetI18nParams()

const slug = computed(() => String(route.params.slug ?? ''))

const { data, pending, error } = await useAsyncData(
  `program-detail-${slug.value}-${locale.value}`,
  async () => {
    if (!slug.value) return null

    const response = await $fetch<ProgramDetailResponse>(`/api/v1/programs/${slug.value}`, {
      query: { lang: locale.value },
    })

    const programData = response?.data
    if (!programData) return null

    if (programData.alternates) {
      setI18nParams(
        Object.fromEntries(
          Object.entries(programData.alternates).map(([loc, s]) => [loc, { slug: s }]),
        ),
      )
    }

    return programData
  },
  { watch: [slug, locale] },
)

const program = computed(() => data.value ?? null)

const seoTitle = computed(() => program.value?.title ?? t(programsNs('meta.title')))
const seoDescription = computed(() => {
  if (program.value?.seoDescription) return program.value.seoDescription
  if (program.value?.excerpt) return program.value.excerpt
  return t(detailNs('fallbackDescription'), { title: program.value?.title })
})

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  keywords: computed(() => program.value?.tags?.join(', ')),
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: computed(() => program.value?.heroImage ?? program.value?.image),
  twitterCard: 'summary_large_image',
})

const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl || 'https://edu-turkish.com'

useHead(() => ({
  script: program.value
    ? [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: program.value.title,
            description: program.value.seoDescription || program.value.excerpt,
            image: program.value.heroImage || program.value.image,
            provider: {
              '@type': 'Organization',
              name: 'Edu.turkish',
              sameAs: siteUrl,
            },
          }),
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: t(metaNs('title')),
                item: `${siteUrl}${localePath('/programs')}`,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: program.value.title,
                item: `${siteUrl}${localePath(route.path)}`,
              },
            ],
          }),
        },
      ]
    : [],
}))

const errorMessage = computed(() => {
  if (error.value) {
    const status = (error.value as any).statusCode ?? (error.value as any).status
    return status === 404 ? t(detailNs('notFound')) : t(detailNs('error'))
  }
  return !pending.value && !program.value ? t(detailNs('notFound')) : ''
})
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
