<template>
  <div class="my-16">
    <div class="flex items-center justify-between mb-8">
      <h3 class="text-2xl font-bold text-secondary">
        {{ t('power_page.universities.title') }}
      </h3>
      <NuxtLink :to="localePath('/universities')" class="text-primary font-medium hover:underline">
        {{ t('power_page.universities.view_all') }} →
      </NuxtLink>
    </div>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="h-[400px] bg-gray-100 rounded-3xl animate-pulse" />
    </div>

    <div v-else-if="universities.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UniversitiesUniversityCard
        v-for="u in universities"
        :key="u.id"
        :title="u.title"
        :city="u.city"
        :languages="u.languages"
        :tuition="u.tuitionRange?.min"
        :badge="u.badge"
        :image="u.image"
        :type="u.type"
        :slug="u.slug"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data, pending } = await useAsyncData('power-page-universities', () =>
  $fetch('/api/v1/universities', {
    query: {
      limit: 3,
      lang: locale.value,
      sort: 'rank' // Assuming rank sort gives best unis
    }
  })
)

const universities = computed(() => (data.value as any)?.data || [])
</script>

