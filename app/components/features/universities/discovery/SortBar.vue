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
      <label class="text-sm font-medium text-secondary">{{
        $t('universities_page.sort.sort_label')
      }}</label>
      <BaseSelect :model-value="sort" @update:model-value="$emit('update:sort', $event)">
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
defineProps<{ total: number; displayed: number; sort: string }>()
defineEmits<{ (e: 'update:sort', value: string): void }>()
</script>
