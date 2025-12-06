<template>
  <section id="featured-programs" class="section-py">
    <div class="container">
      <BaseSectionHeader
        :title="$t('universities_page.popular_programs.title')"
        :subtitle="$t('universities_page.popular_programs.subtitle')"
        align="center"
        margin-bottom="lg"
      />

      <div v-if="loading" class="text-center py-8">
        <div
          class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"
        />
        <p class="mt-2 text-gray-600">{{ t('universities_page.popular_programs.loading') }}</p>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="program in PROGRAM_STYLES"
          :key="program.key"
          class="bg-white rounded-2xl shadow-lg card-padding-lg hover:shadow-xl transition-shadow flex flex-col h-full"
        >
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            :class="program.bgColor"
          >
            <Icon :name="program.icon" class="text-2xl" :class="program.iconColor" />
          </div>
          <h3 class="text-card-title mb-4">
            {{ $t(`universities_page.popular_programs.programs.${program.key}.title`) }}
          </h3>
          <p class="text-gray-600 mb-4">
            {{ $t(`universities_page.popular_programs.programs.${program.key}.description`) }}
          </p>
          <div class="flex items-center justify-between text-sm mt-auto pt-2">
            <span class="text-gray-500">
              {{ getUniversitiesCount(program.key) }}
            </span>
            <span class="text-primary font-medium">
              {{ getPriceFrom(program.key) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PROGRAM_STYLES, type ProgramKey } from '../../utils/styles'
import { useUniversityFormatters } from '../../composables/useUniversityFormatters'

interface ProgramStats {
  universities_count: number
  price_from: number
  direction_slugs: string[]
}

type PopularProgramsData = Record<ProgramKey, ProgramStats>

const loading = ref(true)
const dynamicData = ref<PopularProgramsData | null>(null)
const { t, locale } = useI18n()
const { formatCurrency } = useUniversityFormatters()

const pluralRules = computed(() => new Intl.PluralRules(locale.value))

const formatUniversitiesCount = (count: number) => {
  const baseKey = 'universities_page.popular_programs.dynamic.universities_count'
  const category = pluralRules.value.select(count)
  const translated = t(`${baseKey}.${category}`, { count })
  return translated.includes(baseKey) ? t(`${baseKey}.other`, { count }) : translated
}

const formatPrice = (price: number) =>
  t('universities_page.popular_programs.dynamic.price_from', {
    price: formatCurrency(price),
  })

const getUniversitiesCount = (key: ProgramKey) => {
  const stats = dynamicData.value?.[key]
  return stats
    ? formatUniversitiesCount(stats.universities_count)
    : t(`universities_page.popular_programs.programs.${key}.universities_count`)
}

const getPriceFrom = (key: ProgramKey) => {
  const stats = dynamicData.value?.[key]
  return stats
    ? formatPrice(stats.price_from)
    : t(`universities_page.popular_programs.programs.${key}.price_from`)
}

onMounted(async () => {
  try {
    const response = await $fetch<{ success: boolean; data: PopularProgramsData }>(
      '/api/v1/universities/popular-programs',
      { query: { lang: locale.value } },
    )
    if (response.success) {
      dynamicData.value = response.data
    }
  } catch (error) {
    console.error('Ошибка загрузки статистики популярных направлений:', error)
  } finally {
    loading.value = false
  }
})
</script>
