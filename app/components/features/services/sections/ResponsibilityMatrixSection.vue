<template>
  <div>
    <BaseSectionHeader :title="title" />

    <div class="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
      <!-- We Do Column -->
      <div class="bg-primary/5 rounded-lg p-6 border border-primary/20">
        <h3 class="text-xl font-semibold mb-4 text-primary">{{ weDo.title }}</h3>
        <ul class="space-y-3">
          <li v-for="(item, index) in weDo.items" :key="index" class="flex items-start gap-2">
            <Icon name="mdi:account-check" class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <!-- You Do Column -->
      <div class="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">{{ youDo.title }}</h3>
        <ul class="space-y-3">
          <li v-for="(item, index) in youDo.items" :key="index" class="flex items-start gap-2">
            <Icon name="mdi:account" class="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { I18nKeyPrefix, ResponsibilityItem } from '~/types/services'

interface Props extends I18nKeyPrefix {
  title?: string
}

const props = defineProps<Props>()

const { t, tm } = useI18n()

const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

const weDo = computed(() => {
  const raw = (tm(`${props.keyPrefix}.weDo.items`) || []) as unknown[]
  return {
    title: t(`${props.keyPrefix}.weDo.title`) as string,
    items: raw.map((_, index) => t(`${props.keyPrefix}.weDo.items.${index}`) as string),
  } as ResponsibilityItem
})

const youDo = computed(() => {
  const raw = (tm(`${props.keyPrefix}.youDo.items`) || []) as unknown[]
  return {
    title: t(`${props.keyPrefix}.youDo.title`) as string,
    items: raw.map((_, index) => t(`${props.keyPrefix}.youDo.items.${index}`) as string),
  } as ResponsibilityItem
})
</script>
