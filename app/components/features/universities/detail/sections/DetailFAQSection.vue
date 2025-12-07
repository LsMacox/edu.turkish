<template>
  <UiDisplayFAQ
    class="py-16"
    :items="faqs"
    :title="t('universityDetail.faq.title')"
    :subtitle="t('universityDetail.faq.subtitle')"
  />
</template>

<script setup lang="ts">
const { t, getFaqItems } = useI18nHelpers()

const faqs = computed(() => getFaqItems('universityDetail.faq', { indexed: true, count: 9 }))

useFAQSchema(faqs)
</script>
