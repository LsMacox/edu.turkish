<template>
  <BaseSection id="universities" bg="gray">
      <BaseSectionHeader
        :title="t(ns('title'))"
        :subtitle="t(ns('subtitle'))"
        align="center"
        margin-bottom="lg"
      />

      <div class="flex flex-wrap justify-center gap-component-md mb-component-lg">
        <BaseButton
          variant="chip"
          size="md"
          :data-active="selectedCity === 'ALL_CITIES' ? 'true' : undefined"
          @click="selectCity('ALL_CITIES')"
        >
          {{ t(ns('all_cities')) }}
        </BaseButton>
        <BaseButton
          v-for="city in mainCities"
          :key="city.code"
          variant="chip"
          size="md"
          :data-active="selectedCity === city.label ? 'true' : undefined"
          @click="selectCity(city.label)"
        >
          {{ city.label }}
        </BaseButton>
        <BaseButton
          variant="chip"
          size="md"
          :data-active="englishOnly ? 'true' : undefined"
          @click="toggleEnglishFilter"
        >
          {{ t(ns('english_language')) }}
        </BaseButton>
        <BaseButton
          variant="chip"
          size="md"
          :data-active="budgetOnly ? 'true' : undefined"
          @click="toggleBudgetFilter"
        >
          {{ t(ns('budget_filter')) }}
        </BaseButton>
      </div>

      <BaseGrid :md="2" :lg="3" gap="lg">
        <UniversitiesListCard
          v-for="university in displayedUniversities"
          :key="university.id"
          :title="university.title"
          :city="university.city"
          :languages="university.languages"
          :tuition="university.tuitionMin"
          :badge="university.badge"
          :image="university.image"
          :type="university.type"
          :slug="university.slug"
        />
      </BaseGrid>

      <div class="text-center mt-component-lg">
        <BaseButton
          variant="outline"
          size="lg"
          :to="localePath('/universities')"
        >
          {{ t(ns('view_all')) }}
        </BaseButton>
      </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUniversitiesStore } from '~/stores/universities'
import { namespace } from '~~/lib/i18n'

const universitiesStore = useUniversitiesStore()
const { universities } = storeToRefs(universitiesStore)
const { t, locale } = useI18n()
const localePath = useLocalePath()
const ns = namespace('home.universities')
const citiesNs = namespace('universities.list.filters.cities')

if (import.meta.server) {
  await universitiesStore.initializeFilters({ limit: 6, ssr: true })
}

onMounted(async () => {
  if (!universities.value || universities.value.length === 0) {
    await universitiesStore.fetchUniversities({ limit: 6, overrides: {} })
  }
})

const selectedCity = ref('ALL_CITIES')
const englishOnly = ref(false)
const budgetOnly = ref(false)

const mainCities = computed(() => [
  { code: 'istanbul' as const, label: t(citiesNs('istanbul')) },
  { code: 'ankara' as const, label: t(citiesNs('ankara')) },
  { code: 'izmir' as const, label: t(citiesNs('izmir')) },
])

const displayedUniversities = computed(() => {
  return universities.value.slice(0, 6)
})

function buildOverrides() {
  const overrides: any = {}
  if (selectedCity.value && selectedCity.value !== 'ALL_CITIES') {
    overrides.city = selectedCity.value
  }
  if (englishOnly.value) {
    overrides.langs = ['en']
  }
  if (budgetOnly.value) {
    overrides.price = [0, 5000]
  }
  return overrides
}

watch([selectedCity, englishOnly, budgetOnly], async () => {
  await universitiesStore.fetchUniversities({ limit: 6, overrides: buildOverrides() })
})

watch(
  () => locale.value,
  async () => {
    if (selectedCity.value && selectedCity.value !== 'ALL_CITIES') {
      const currentCity = mainCities.value.find((c) => c.label === selectedCity.value)
      if (currentCity) {
        selectedCity.value = currentCity.label
      }
    }
    await universitiesStore.fetchUniversities({ limit: 6, overrides: buildOverrides() })
  },
)

const selectCity = (city: string) => {
  selectedCity.value = city
}

const toggleEnglishFilter = () => {
  englishOnly.value = !englishOnly.value
}

const toggleBudgetFilter = () => {
  budgetOnly.value = !budgetOnly.value
}
</script>
