<template>
  <div>
    <BaseSectionHeader :title="title" />

    <ul class="space-y-4 max-w-3xl mx-auto">
      <li v-for="(item, index) in items" :key="index" class="flex items-start gap-3 text-lg">
        <Icon name="mdi:check-decagram" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
        <span>{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { I18nKeyPrefix } from '~/types/services'

interface Props extends I18nKeyPrefix {
  title?: string
}

const props = withDefaults(defineProps<Props>(), {})

const { t, tm } = useI18n()

const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

const items = computed<string[]>(() => {
  const raw = tm(`${props.keyPrefix}.items`) as unknown

  if (Array.isArray(raw)) {
    return (raw as unknown[]).map(
      (_: unknown, index: number) => t(`${props.keyPrefix}.items.${index}`) as string,
    )
  }

  if (raw && typeof raw === 'object') {
    const keys = Object.keys(raw as Record<string, unknown>)
    return keys.map((key: string) => t(`${props.keyPrefix}.items.${key}`) as string)
  }

  return [] as string[]
})

// duration selection removed
</script>
