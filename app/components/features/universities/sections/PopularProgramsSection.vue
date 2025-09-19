<template>
  <section id="featured-programs" class="py-16">
    <div class="container">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-4">{{ $t('universities_page.popular_programs.title') }}</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">{{ $t('universities_page.popular_programs.subtitle') }}</p>
      </div>
      
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-2 text-gray-600">{{ t('universities_page.popular_programs.loading') }}</p>
      </div>
      
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
          <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:laptop" class="text-blue-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ $t('universities_page.popular_programs.programs.it.title') }}</h3>
          <p class="text-gray-600 mb-4">{{ $t('universities_page.popular_programs.programs.it.description') }}</p>
          <div class="flex items-center justify-between text-sm mt-auto pt-2">
            <span class="text-gray-500">{{ dynamicData?.it ? formatUniversitiesCount(dynamicData.it.universities_count) : $t('universities_page.popular_programs.programs.it.universities_count') }}</span>
            <span class="text-primary font-medium">{{ dynamicData?.it ? formatPrice(dynamicData.it.price_from) : $t('universities_page.popular_programs.programs.it.price_from') }}</span>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
          <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:medical-bag" class="text-green-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ $t('universities_page.popular_programs.programs.medicine.title') }}</h3>
          <p class="text-gray-600 mb-4">{{ $t('universities_page.popular_programs.programs.medicine.description') }}</p>
          <div class="flex items-center justify-between text-sm mt-auto pt-2">
            <span class="text-gray-500">{{ dynamicData?.medicine ? formatUniversitiesCount(dynamicData.medicine.universities_count) : $t('universities_page.popular_programs.programs.medicine.universities_count') }}</span>
            <span class="text-primary font-medium">{{ dynamicData?.medicine ? formatPrice(dynamicData.medicine.price_from) : $t('universities_page.popular_programs.programs.medicine.price_from') }}</span>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
          <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:cog" class="text-purple-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ $t('universities_page.popular_programs.programs.engineering.title') }}</h3>
          <p class="text-gray-600 mb-4">{{ $t('universities_page.popular_programs.programs.engineering.description') }}</p>
          <div class="flex items-center justify-between text-sm mt-auto pt-2">
            <span class="text-gray-500">{{ dynamicData?.engineering ? formatUniversitiesCount(dynamicData.engineering.universities_count) : $t('universities_page.popular_programs.programs.engineering.universities_count') }}</span>
            <span class="text-primary font-medium">{{ dynamicData?.engineering ? formatPrice(dynamicData.engineering.price_from) : $t('universities_page.popular_programs.programs.engineering.price_from') }}</span>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
          <div class="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:chart-line" class="text-orange-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ $t('universities_page.popular_programs.programs.business.title') }}</h3>
          <p class="text-gray-600 mb-4">{{ $t('universities_page.popular_programs.programs.business.description') }}</p>
          <div class="flex items-center justify-between text-sm mt-auto pt-2">
            <span class="text-gray-500">{{ dynamicData?.business ? formatUniversitiesCount(dynamicData.business.universities_count) : $t('universities_page.popular_programs.programs.business.universities_count') }}</span>
            <span class="text-primary font-medium">{{ dynamicData?.business ? formatPrice(dynamicData.business.price_from) : $t('universities_page.popular_programs.programs.business.price_from') }}</span>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
          <div class="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:palette" class="text-teal-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ $t('universities_page.popular_programs.programs.design.title') }}</h3>
          <p class="text-gray-600 mb-4">{{ $t('universities_page.popular_programs.programs.design.description') }}</p>
          <div class="flex items-center justify-between text-sm mt-auto pt-2">
            <span class="text-gray-500">{{ dynamicData?.design ? formatUniversitiesCount(dynamicData.design.universities_count) : $t('universities_page.popular_programs.programs.design.universities_count') }}</span>
            <span class="text-primary font-medium">{{ dynamicData?.design ? formatPrice(dynamicData.design.price_from) : $t('universities_page.popular_programs.programs.design.price_from') }}</span>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col h-full">
          <div class="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:earth" class="text-pink-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ $t('universities_page.popular_programs.programs.international.title') }}</h3>
          <p class="text-gray-600 mb-4">{{ $t('universities_page.popular_programs.programs.international.description') }}</p>
          <div class="flex items-center justify-between text-sm mt-auto pt-2">
            <span class="text-gray-500">{{ dynamicData?.international ? formatUniversitiesCount(dynamicData.international.universities_count) : $t('universities_page.popular_programs.programs.international.universities_count') }}</span>
            <span class="text-primary font-medium">{{ dynamicData?.international ? formatPrice(dynamicData.international.price_from) : $t('universities_page.popular_programs.programs.international.price_from') }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
interface ProgramStats {
  universities_count: number
  price_from: number
  actual_universities: number
  direction_slugs: string[]
}

interface PopularProgramsResponse {
  success: boolean
  data: {
    it: ProgramStats
    medicine: ProgramStats
    engineering: ProgramStats
    business: ProgramStats
    design: ProgramStats
    international: ProgramStats
  }
}

const loading = ref(true)
const dynamicData = ref<PopularProgramsResponse['data'] | null>(null)
const { t, locale } = useI18n()

const pluralRules = computed(() => new Intl.PluralRules(locale.value))
const currencyFormatter = computed(
  () =>
    new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
)

const formatUniversitiesCount = (count: number) => {
  const baseKey = 'universities_page.popular_programs.dynamic.universities_count'
  const pluralCategory = pluralRules.value.select(count)
  const translationKey = `${baseKey}.${pluralCategory}`
  const translated = t(translationKey, { count })

  if (translated === translationKey) {
    return t(`${baseKey}.other`, { count })
  }

  return translated
}

const formatPrice = (price: number) => {
  const formattedPrice = currencyFormatter.value.format(price)
  return t('universities_page.popular_programs.dynamic.price_from', { price: formattedPrice })
}

onMounted(async () => {
  try {
    const response = await $fetch<PopularProgramsResponse>('/api/v1/universities/popular-programs', {
      query: { locale: locale.value }
    })
    
    if (response.success) {
      dynamicData.value = response.data
    }
  } catch (error) {
    console.error('Ошибка загрузки статистики популярных направлений:', error)
    // Используем статичные данные из локализации как fallback
  } finally {
    loading.value = false
  }
})
</script>
