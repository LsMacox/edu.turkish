<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon name="mdi:school" class="w-4 h-4 text-primary" />
      </div>
      <p class="text-sm text-gray-600">
        {{ t('universities_page.sort.showing_text') }}
        <span class="font-semibold text-secondary">{{ displayed }}</span>
        {{ t('universities_page.sort.of_text') }}
        <span class="font-semibold text-secondary">{{ total }}</span>
        {{ t('universities_page.sort.universities_text') }}
      </p>
    </div>

    <div class="flex items-center gap-2">
      <label :for="sortFieldId" class="text-xs font-medium text-gray-500 whitespace-nowrap">
        {{ t('universities_page.sort.sort_label') }}
      </label>
      <BaseSelect :id="sortFieldId" :model-value="sort" class="min-w-[160px]" @update:model-value="onUpdateSort">
        <option value="pop">{{ t('universities_page.sort.options.popularity') }}</option>
        <option value="price_asc">{{ t('universities_page.sort.options.price_asc') }}</option>
        <option value="price_desc">{{ t('universities_page.sort.options.price_desc') }}</option>
        <option value="alpha">{{ t('universities_page.sort.options.alphabetical') }}</option>
        <option value="lang_en">{{ t('universities_page.sort.options.english_first') }}</option>
      </BaseSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SortOption } from '~/stores/universities'
import { SORT_OPTIONS } from '~/stores/universities'

defineProps<{ total: number; displayed: number; sort: SortOption }>()
const emit = defineEmits<{ (e: 'update:sort', value: SortOption): void }>()
const { t } = useI18n()

const sortFieldId = useId()

const onUpdateSort = (value: string) => {
  if ((SORT_OPTIONS as readonly string[]).includes(value)) {
    emit('update:sort', value as SortOption)
  }
}
</script>
