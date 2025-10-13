<template>
  <div>
    <BaseSectionHeader :title="title" />

    <div class="max-w-3xl mx-auto space-y-4">
      <details
        v-for="(item, index) in faqItems"
        :key="index"
        class="bg-white rounded-lg border border-gray-200 overflow-hidden"
        :open="defaultExpanded"
      >
        <summary
          class="cursor-pointer px-6 py-4 font-semibold text-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
        >
          <span>{{ item.question }}</span>
          <Icon name="mdi:chevron-down" class="w-6 h-6 text-gray-400 transition-transform" />
        </summary>
        <div class="px-6 py-4 text-gray-700 border-t border-gray-100">
          {{ item.answer }}
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { I18nKeyPrefix, FAQItem } from '~/types/services'

interface Props extends I18nKeyPrefix {
  title?: string
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpanded: false,
})

const { t, tm } = useI18n()

const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

const faqItems = computed(() => {
  const raw = (tm(`${props.keyPrefix}.items`) || []) as unknown[]
  return raw.map((_, index) => ({
    question: t(`${props.keyPrefix}.items.${index}.question`) as string,
    answer: t(`${props.keyPrefix}.items.${index}.answer`) as string,
  })) as FAQItem[]
})
</script>

<style scoped>
details[open] summary icon {
  transform: rotate(180deg);
}
</style>
