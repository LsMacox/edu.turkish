<template>
  <div class="mt-16">
    <BaseSectionHeader :title="title" />

    <div class="mt-8">
      <div
        :class="[
          layout === 'carousel'
            ? 'flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory'
            : 'grid gap-6 md:grid-cols-2 lg:grid-cols-3',
        ]"
      >
        <div
          v-for="(sample, index) in samples"
          :key="index"
          :class="[
            'bg-white rounded-lg shadow-md overflow-hidden',
            layout === 'carousel' ? 'flex-shrink-0 w-80 snap-start' : '',
          ]"
        >
          <div class="aspect-[3/4] bg-gray-100 relative overflow-hidden">
            <NuxtImg
              :src="sample.image"
              :alt="sample.type"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div class="p-4">
            <h4 class="font-semibold text-gray-900">{{ sample.type }}</h4>
          </div>
        </div>
      </div>

      <!-- Note about privacy -->
      <div class="mt-6 text-sm text-gray-600 text-center">
        <Icon name="mdi:information" class="inline w-4 h-4 mr-1" />
        {{ t('services.common.sampleDocumentsNote') || 'All samples are anonymized for privacy' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SampleDocumentsSectionProps } from '@/types/services'

const props = withDefaults(defineProps<SampleDocumentsSectionProps>(), {
  title: '',
  layout: 'grid',
})

const { t, tm } = useI18n()

// Computed title with i18n fallback
const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

// Load samples
const samples = computed(() => {
  const raw = (tm(`${props.keyPrefix}.samples`) || []) as unknown[]
  return raw.map((_, index) => ({
    type: t(`${props.keyPrefix}.samples.${index}.type`) as string,
    image: t(`${props.keyPrefix}.samples.${index}.image`) as string,
  }))
})
</script>
