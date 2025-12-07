<template>
  <UiDisplayFAQ
    class="py-8"
    :items="faqs"
    :title="title"
    :subtitle="subtitle"
    :background="false"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  keyPrefix: string
  title?: string
}>()

const { getFaqItems, getFaqMeta } = useI18nHelpers()

const meta = computed(() => getFaqMeta(props.keyPrefix))
const title = computed(() => props.title || meta.value.title)
const subtitle = computed(() => meta.value.subtitle)

const faqs = computed(() => getFaqItems(props.keyPrefix))

useFAQSchema(faqs)
</script>
