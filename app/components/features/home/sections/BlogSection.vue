<template>
  <UiDisplayFAQ :items="faqs" />
</template>

<script setup lang="ts">
// Blog and FAQ section with accordion functionality
const { t } = useI18n()

const faqs = computed(() => [
  {
    question: t('home.faq.question1'),
    answer: t('home.faq.answer1')
  },
  {
    question: t('home.faq.question2'),
    answer: t('home.faq.answer2')
  },
  {
    question: t('home.faq.question3'),
    answer: t('home.faq.answer3')
  },
  {
    question: t('home.faq.question4'),
    answer: t('home.faq.answer4')
  },
  {
    question: t('home.faq.question5'),
    answer: t('home.faq.answer5')
  },
  {
    question: t('home.faq.question6'),
    answer: t('home.faq.answer6')
  }
])
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
</style>
