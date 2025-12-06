<template>
  <UiDisplayFAQ
    class="py-16"
    :items="faqs"
    :title="t('universityDetail.faq.title')"
    :subtitle="t('universityDetail.faq.subtitle')"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
const { getFaqItemsIndexed } = useFaqI18n()

const faqs = computed(() => getFaqItemsIndexed('universityDetail.faq', 9))

useFAQSchema(faqs)
</script>
