<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6 items-start">
    <!-- Search -->
    <div class="md:col-span-2 lg:col-span-2">
      <label class="block text-sm font-medium text-secondary mb-2">{{ $t('universities_page.filters.search_label') }}</label>
      <UiFormsBaseTextField
        v-model="state.q"
        type="text"
        :placeholder="$t('universities_page.filters.search_placeholder')"
        icon="mdi:magnify"
      />
    </div>

    <!-- City -->
    <div class="md:col-span-1 lg:col-span-1">
      <label class="block text-sm font-medium text-secondary mb-2">{{ $t('universities_page.filters.city_label') }}</label>
      <UiFormsBaseSelect v-model="state.city">
        <option value="Все">{{ $t('universities_page.filters.all_cities') }}</option>
        <option v-for="city in availableFilters.cities" :key="city" :value="city">{{ city }}</option>
      </UiFormsBaseSelect>
    </div>

    <!-- Language -->
    <div class="md:col-span-1 lg:col-span-1">
      <label class="block text-sm font-medium text-secondary mb-2">{{ $t('universities_page.filters.language_label') }}</label>
      <div class="space-y-2">
        <UiFormsBaseCheckbox 
          :checked="state.langs.includes('TR')" 
          @update:checked="toggleLang('TR', $event)"
          value="TR"
        >
          {{ $t('universities_page.filters.languages.turkish') }}
        </UiFormsBaseCheckbox>
        <UiFormsBaseCheckbox 
          :checked="state.langs.includes('EN')" 
          @update:checked="toggleLang('EN', $event)"
          value="EN"
        >
          {{ $t('universities_page.filters.languages.english') }}
        </UiFormsBaseCheckbox>
      </div>
    </div>

    <!-- Type -->
    <div class="md:col-span-1 lg:col-span-1">
      <label class="block text-sm font-medium text-secondary mb-2">{{ $t('universities_page.filters.type_label') }}</label>
      <UiFormsBaseSelect v-model="state.type">
        <option value="Все">{{ $t('universities_page.filters.all_types') }}</option>
        <option v-for="t in availableFilters.types" :key="t" :value="t">{{ getTypeLabel(t) }}</option>
      </UiFormsBaseSelect>
    </div>

    <!-- Level -->
    <div class="md:col-span-1 lg:col-span-1">
      <label class="block text-sm font-medium text-secondary mb-2">{{ $t('universities_page.filters.level_label') }}</label>
      <UiFormsBaseSelect v-model="state.level">
        <option value="Все">{{ $t('universities_page.filters.all_levels') }}</option>
        <option>{{ $t('universities_page.filters.levels.bachelor') }}</option>
        <option>{{ $t('universities_page.filters.levels.master') }}</option>
        <option>{{ $t('universities_page.filters.levels.doctorate') }}</option>
      </UiFormsBaseSelect>
    </div>

    <!-- Price Range -->
    <div class="md:col-span-2 lg:col-span-6">
      <UiFormsBaseRangeSlider
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
import { reactive, computed, watch, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUniversitiesStore } from '~/stores/universities'

const emit = defineEmits<{
  (e: 'apply', payload: {
    q: string
    city: string
    langs: string[]
    type: string
    level: string
    price: [number, number]
  }): void
}>()

// Use universities store to get current filters
const universitiesStore = useUniversitiesStore()
const { filters, availableFilters } = storeToRefs(universitiesStore)
const { applyFilters } = universitiesStore

const state = reactive({
  q: '',
  city: 'Все',
  langs: [] as string[],
  type: 'Все',
  level: 'Все'
})

const priceRangeBounds = computed<[number, number]>(() => {
  const range = availableFilters.value.priceRange
  return [range[0], range[1]]
})

const priceRange = ref<[number, number]>([
  priceRangeBounds.value[0],
  priceRangeBounds.value[1]
])

function getTypeLabel(t: string): string {
  switch (t) {
    case 'state':
      return $t('universities_page.filters.types.state') as string
    case 'private':
      return $t('universities_page.filters.types.private') as string
    case 'tech':
      return $t('universities_page.filters.types.tech') as string
    case 'elite':
      return $t('universities_page.filters.types.elite') as string
    default:
      return t
  }
}

// Initialize state from URL filters
const initializeFromFilters = () => {
  state.q = filters.value.q
  state.city = filters.value.city === 'Все города' ? 'Все' : filters.value.city
  state.langs = [...filters.value.langs]
  state.type = filters.value.type
  state.level = filters.value.level
  const price = filters.value.price?.length === 2
    ? filters.value.price
    : priceRangeBounds.value
  priceRange.value = [price[0], price[1]] as [number, number]
}

// Initialize on mount
onMounted(() => {
  initializeFromFilters()
})

// Watch for external filter changes (e.g., from URL)
watch(() => filters.value, () => {
  initializeFromFilters()
}, { deep: true })

watch(priceRangeBounds, ([min, max]) => {
  const [currentMin, currentMax] = priceRange.value
  const boundedMin = Math.min(Math.max(currentMin, min), max)
  const boundedMax = Math.max(Math.min(currentMax, max), min)

  if (boundedMin !== currentMin || boundedMax !== currentMax) {
    priceRange.value = [boundedMin, boundedMax] as [number, number]
  }
})

function toggleLang(lang: string, checked: boolean) {
  if (checked) {
    if (!state.langs.includes(lang)) {
      state.langs.push(lang)
    }
  } else {
    state.langs = state.langs.filter(l => l !== lang)
  }
}

function reset() {
  state.q = ''
  state.city = 'Все'
  state.langs = []
  state.type = 'Все'
  state.level = 'Все'
  priceRange.value = [
    priceRangeBounds.value[0],
    priceRangeBounds.value[1]
  ] as [number, number]
  
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
    price: [priceRange.value[0], priceRange.value[1]] as [number, number]
  })

  // Legacy emit for backwards compatibility
  emit('apply', {
    q: state.q,
    city: state.city,
    langs: state.langs,
    type: state.type,
    level: state.level,
    price: priceRange.value
  })
}
</script>
