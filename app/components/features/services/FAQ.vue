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
  title: string
  subtitle?: string
  items: any[] // We really should import FaqApiItem or similar if available, using any for now to avoid specific type churn unless easy.
               // Actually, let's use the type inferred or define a simple one.
               // Looking at useI18nHelpers, it returns FaqItem.
}>()

// Schema handling likely needs a computed ref
const faqs = computed(() => props.items)
useFaqSchema(faqs)
</script>
