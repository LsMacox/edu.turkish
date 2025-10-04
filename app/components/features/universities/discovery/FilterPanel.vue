<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6 items-start">
    <!-- Search -->
    <div class="md:col-span-2 lg:col-span-2">
      <label class="block text-sm font-medium text-secondary mb-2">{{
        $t('universities_page.filters.search_label')
      }}</label>
      <BaseTextField
        v-model="state.q"
        type="text"
        :placeholder="$t('universities_page.filters.search_placeholder')"
        icon="mdi:magnify"
      />
    </div>

    <!-- City -->
    <div class="md:col-span-1 lg:col-span-1">
      <label class="block text-sm font-medium text-secondary mb-2">{{
        $t('universities_page.filters.city_label')
      }}</label>
      <BaseSelect v-model="state.city">
        <option value="Все">{{ $t('universities_page.filters.all_cities') }}</option>
        <option v-for="city in availableFilters.cities" :key="city" :value="city">
          {{ city }}
        </option>
      </BaseSelect>
    </div>

    <!-- Language -->
    <div class="md:col-span-1 lg:col-span-1">
      <label class="block text-sm font-medium text-secondary mb-2">{{
        $t('universities_page.filters.language_label')
      }}</label>
      <div v-if="availableLanguageCodes.length" class="space-y-2">
        <BaseCheckbox
          v-for="lang in availableLanguageCodes"
          :key="lang"
          :checked="state.langs.includes(lang)"
          :value="lang"
          @update:checked="toggleLang(lang, $event)"
        >
          {{ getLanguageLabel(lang) }}
        </BaseCheckbox>
      </div>
    </div>

    <!-- Type -->
    <div class="md:col-span-1 lg:col-span-1">
      <label class="block text-sm font-medium text-secondary mb-2">{{
        $t('universities_page.filters.type_label')
      }}</label>
      <BaseSelect v-model="state.type">
        <option value="Все">{{ $t('universities_page.filters.all_types') }}</option>
        <option v-for="t in availableFilters.types" :key="t" :value="t">
          {{ getTypeLabel(t) }}
        </option>
      </BaseSelect>
    </div>

    <!-- Level -->
    <div class="md:col-span-1 lg:col-span-1">
      <label class="block text-sm font-medium text-secondary mb-2">{{
        $t('universities_page.filters.level_label')
      }}</label>
      <BaseSelect v-model="state.level">
        <option :value="LEVEL_ALL_VALUE">{{ $t('universities_page.filters.all_levels') }}</option>
        <option v-for="level in levelOptions" :key="level.value" :value="level.value">
          {{ level.label }}
        </option>
      </BaseSelect>
    </div>

    <!-- Price Range -->
    <div class="md:col-span-2 lg:col-span-6">
      <BaseRangeSlider
        v-model="priceRange"
        :min="priceRangeBounds[0]"
        :max="priceRangeBounds[1]"
        :step="500"
        :label="$t('universities_page.filters.price_label')"
      />
    </div>

    <!-- Actions -->
    <div class="md:col-span-2 lg:col-span-6 flex flex-col sm:flex-row justify-end gap-3 pt-4">
      <button
        class="bg-gray-100 text-secondary px-6 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 sm:w-auto"
        @click="reset"
      >
        <Icon name="mdi:refresh" class="w-4 h-4" />
        {{ $t('universities_page.filters.reset_button') }}
      </button>
      <button
        class="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 sm:w-auto"
        @click="apply"
      >
        <Icon name="mdi:filter" class="w-4 h-4" />
        {{ $t('universities_page.filters.apply_button') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUniversitiesStore } from '~/stores/universities'

const emit = defineEmits<{
  (
    e: 'apply',
    payload: {
      q: string
      city: string
      langs: string[]
      type: string
      level: string
      price: [number, number]
    },
  ): void
}>()

// Use universities store to get current filters
const universitiesStore = useUniversitiesStore()
const { filters, availableFilters } = storeToRefs(universitiesStore)
const { applyFilters } = universitiesStore
const { t: translate } = useI18n()

const LEVEL_ALL_VALUE = 'all'

const LEVEL_LABEL_MAP: Record<string, string> = {
  bachelor: 'universities_page.filters.levels.bachelor',
  master: 'universities_page.filters.levels.master',
  phd: 'universities_page.filters.levels.doctorate',
}

const levelOptions = computed(() => {
  const levels = availableFilters.value.levels || []
  return levels.map((level) => ({
    value: level,
    label: getLevelLabel(level),
  }))
})

const state = reactive({
  q: '',
  city: 'Все',
  langs: [] as string[],
  type: 'Все',
  level: LEVEL_ALL_VALUE,
})

const availableLanguageCodes = computed<string[]>(() => {
  const languages = availableFilters.value.languages || []
  const normalized = languages
    .map((lang) => (typeof lang === 'string' ? lang.toUpperCase() : ''))
    .filter((lang): lang is string => Boolean(lang))

  return normalized.filter((lang, index) => normalized.indexOf(lang) === index)
})

const priceRangeBounds = computed<[number, number]>(() => {
  const range = availableFilters.value.priceRange
  return [range[0], range[1]]
})

const priceRange = ref<[number, number]>([priceRangeBounds.value[0], priceRangeBounds.value[1]])

function getTypeLabel(typeCode: string): string {
  switch (typeCode) {
    case 'state':
      return translate('universities_page.filters.types.state') as string
    case 'private':
      return translate('universities_page.filters.types.private') as string
    case 'tech':
      return translate('universities_page.filters.types.tech') as string
    case 'elite':
      return translate('universities_page.filters.types.elite') as string
    default:
      return typeCode
  }
}

function getLevelLabel(level: string): string {
  const translationKey = LEVEL_LABEL_MAP[level]
  if (translationKey) {
    return translate(translationKey) as string
  }

  return level
}

// Initialize state from URL filters
const initializeFromFilters = () => {
  state.q = filters.value.q
  state.city = filters.value.city === 'Все города' ? 'Все' : filters.value.city
  const availableSet = new Set(availableLanguageCodes.value)
  const normalizedLangs = filters.value.langs
    .map((lang) => lang.toUpperCase())
    .filter((lang) => (availableSet.size > 0 ? availableSet.has(lang) : true))
  state.langs = normalizedLangs
  state.type = filters.value.type
  state.level = filters.value.level || LEVEL_ALL_VALUE
  const price = filters.value.price?.length === 2 ? filters.value.price : priceRangeBounds.value
  priceRange.value = [price[0], price[1]] as [number, number]
}

function getLanguageLabel(langCode: string): string {
  const normalized = (langCode || '').toUpperCase()
  switch (normalized) {
    case 'EN':
      return translate('universities_page.filters.languages.en') as string
    case 'TR':
      return translate('universities_page.filters.languages.tr') as string
    case 'RU':
      return translate('universities_page.filters.languages.ru') as string
    default:
      return normalized
  }
}

// Initialize on mount
onMounted(() => {
  initializeFromFilters()
})

// Watch for external filter changes (e.g., from URL)
watch(
  () => filters.value,
  () => {
    initializeFromFilters()
  },
  { deep: true },
)

watch(availableLanguageCodes, (codes) => {
  if (codes.length === 0) {
    return
  }

  const filteredLangs = state.langs.filter((lang) => codes.includes(lang.toUpperCase()))
  if (filteredLangs.length !== state.langs.length) {
    state.langs = filteredLangs.map((lang) => lang.toUpperCase())
  }
})

watch(priceRangeBounds, ([min, max]) => {
  const [currentMin, currentMax] = priceRange.value
  const boundedMin = Math.min(Math.max(currentMin, min), max)
  const boundedMax = Math.max(Math.min(currentMax, max), min)

  if (boundedMin !== currentMin || boundedMax !== currentMax) {
    priceRange.value = [boundedMin, boundedMax] as [number, number]
  }
})

function toggleLang(lang: string, checked: boolean) {
  const normalizedLang = lang.toUpperCase()
  if (checked) {
    if (!state.langs.includes(normalizedLang)) {
      state.langs = [...state.langs, normalizedLang]
    }
  } else {
    state.langs = state.langs.filter((l) => l !== normalizedLang)
  }
}

function reset() {
  state.q = ''
  state.city = 'Все'
  state.langs = []
  state.type = 'Все'
  state.level = LEVEL_ALL_VALUE
  priceRange.value = [priceRangeBounds.value[0], priceRangeBounds.value[1]] as [number, number]

  // Apply reset filters to URL immediately
  apply()
}

function apply() {
  const cityValue = state.city === 'Все' ? 'Все города' : state.city

  // Apply filters through composable which updates URL
  applyFilters({
    q: state.q,
    city: cityValue,
    langs: [...state.langs],
    type: state.type,
    level: state.level,
    price: [priceRange.value[0], priceRange.value[1]] as [number, number],
  })

  // Legacy emit for backwards compatibility
  emit('apply', {
    q: state.q,
    city: state.city,
    langs: state.langs,
    type: state.type,
    level: state.level,
    price: priceRange.value,
  })
}
</script>
