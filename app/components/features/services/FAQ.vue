<template>
  <DisplayFAQ
    class="section-py-sm"
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
  items: any[]
}>()

// Schema handling likely needs a computed ref
const faqs = computed(() => props.items)
useFaqSchema(faqs)
</script>
