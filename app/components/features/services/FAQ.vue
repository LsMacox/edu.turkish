<template>
  <UiDisplayFAQ class="py-8" :items="faqs" :title="title" :subtitle="subtitle" :background="false" />
</template>

<script setup lang="ts">
const props = defineProps<{
  keyPrefix: string
  title?: string
}>()

const { getFaqItemsArray, getFaqMeta } = useFaqI18n()

const meta = computed(() => getFaqMeta(props.keyPrefix))
const title = computed(() => props.title || meta.value.title)
const subtitle = computed(() => meta.value.subtitle)

const faqs = computed(() => getFaqItemsArray(props.keyPrefix))

useFAQSchema(faqs)
</script>
