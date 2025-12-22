<template>
  <div class="my-16">
    <BaseSectionHeader
      :title="t(ns('title'))"
      title-tag="h3"
      align="left"
      margin-bottom="lg"
      max-width="full"
    >
      <template #action>
        <NuxtLink :to="localePath('/universities')" class="text-primary font-medium hover:underline">
          {{ t(ns('view_all')) }} →
        </NuxtLink>
      </template>
    </BaseSectionHeader>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-3 gap-component-lg">
      <div v-for="i in 3" :key="i" class="h-[400px] gradient-placeholder rounded-card-lg animate-pulse" />
    </div>

    <div v-else-if="universities.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-component-lg">
      <UniversitiesListCard
        v-for="u in universities"
        :key="u.id"
        :title="u.title"
        :city="u.city"
        :languages="u.languages"
        :tuition="u.tuitionMin"
        :badge="u.badge"
        :image="u.image"
        :type="u.type"
        :slug="u.slug"
        compact
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'

const ns = namespace('blog.powerPage.universities')
const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data, pending } = await useAsyncData('content-widget-universities', () =>
  $fetch('/api/v1/universities', {
    query: {
      limit: 3,
      lang: locale.value,
      sort: 'rank',
    },
  }),
)

const universities = computed(() => data.value?.data ?? [])
</script>
