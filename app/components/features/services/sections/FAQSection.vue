<template>
  <UiDisplayFAQ :items="faqs" :title="title" :subtitle="subtitleText" :background="false" />
</template>

<script setup lang="ts">
import type { I18nKeyPrefix } from '~/types/services'

interface Props extends I18nKeyPrefix {
  title?: string
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpanded: false,
})

const { t, tm, te } = useI18n()

const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

const subtitleText = computed(() => {
  const key = `${props.keyPrefix}.subtitle`
  return te(key) ? (t(key) as unknown as string) : ''
})

type FaqAnswer = string | { title?: string; items?: string[]; ordered?: boolean }

const resolveAnswer = (path: string): FaqAnswer => {
  const message = tm(path)
  if (typeof message === 'string') return message
  if (message && typeof message === 'object') {
    const record = message as Record<string, unknown>
    const items = Array.isArray(record.items)
      ? record.items.filter((item): item is string => typeof item === 'string')
      : undefined
    const title = typeof record.title === 'string' ? record.title : undefined
    const ordered = typeof record.ordered === 'boolean' ? record.ordered : undefined
    if (title || (items && items.length > 0)) {
      return { title, items, ordered }
    }
  }
  return t(path)
}

const faqs = computed(() => {
  const raw = tm(`${props.keyPrefix}.items`) as unknown
  if (!Array.isArray(raw)) return []
  return raw.map((_: unknown, index: number) => ({
    question: t(`${props.keyPrefix}.items.${index}.question`) as string,
    answer: resolveAnswer(`${props.keyPrefix}.items.${index}.answer`),
  })) as Array<{ question: string; answer: FaqAnswer }>
})
</script>
