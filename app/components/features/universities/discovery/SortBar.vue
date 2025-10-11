<template>
  <div class="flex flex-col md:flex-row justify-between items-center gap-4">
    <p class="text-secondary font-medium">
      {{ $t('universities_page.sort.showing_text') }}
      <span class="text-primary font-bold">{{ displayed }}</span>
      {{ $t('universities_page.sort.of_text') }}
      <span class="text-primary font-bold">{{ total }}</span>
      {{ $t('universities_page.sort.universities_text') }}
    </p>

    <div class="flex items-center gap-4">
      <label :for="sortFieldId" class="text-sm font-medium text-secondary">{{
        $t('universities_page.sort.sort_label')
      }}</label>
      <BaseSelect
        :id="sortFieldId"
        :model-value="sort"
        @update:model-value="onUpdateSort"
      >
        <option value="pop">{{ $t('universities_page.sort.options.popularity') }}</option>
        <option value="price_asc">{{ $t('universities_page.sort.options.price_asc') }}</option>
        <option value="price_desc">{{ $t('universities_page.sort.options.price_desc') }}</option>
        <option value="alpha">{{ $t('universities_page.sort.options.alphabetical') }}</option>
        <option value="lang_en">{{ $t('universities_page.sort.options.english_first') }}</option>
      </BaseSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SortOption } from '~/stores/universities'
import { SORT_OPTIONS } from '~/stores/universities'

defineProps<{ total: number; displayed: number; sort: SortOption }>()
const emit = defineEmits<{ (e: 'update:sort', value: SortOption): void }>()

const sortFieldId = useId()

const onUpdateSort = (value: string) => {
  if ((SORT_OPTIONS as readonly string[]).includes(value)) {
    emit('update:sort', value as SortOption)
  }
}
</script>
