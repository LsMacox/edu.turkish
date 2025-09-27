<template>
  <UiDisplayFAQ
    :items="faqs"
    :title="t('home.faq.title')"
    :subtitle="t('home.faq.subtitle')"
    :show-cta="true"
    variant="home"
    cta-icon-name="ph:question"
    cta-title="Не нашли ответ на свой вопрос?"
    cta-subtitle="Наши консультанты готовы помочь вам с любыми вопросами о поступлении"
    cta-button-label="Получить консультацию"
    :whatsapp-href="channels?.whatsapp?.href"
    whatsapp-label="Написать в WhatsApp"
    @consult="handleConsult"
    :telegram-href="channels?.telegramBot?.href"
    telegram-label="Связаться в Telegram"
  />
</template>

<script setup lang="ts">
import { useContactChannels } from '~/composables/useContactChannels'
import { useApplicationModalStore } from '~/stores/applicationModal'

const { t } = useI18n()
const applicationModalStore = useApplicationModalStore()
const { openModal: openApplicationModal } = applicationModalStore
const { channels } = useContactChannels()

const handleConsult = () => {
  openApplicationModal({
    source: 'home_faq',
    description: 'Заявка из блока FAQ на главной странице',
  })
}

const faqs = computed(() => [
  {
    question: t('home.faq.home.q1'),
    answer: t('home.faq.home.a1'),
  },
  {
    question: t('home.faq.home.q2'),
    answer: t('home.faq.home.a2'),
  },
  {
    question: t('home.faq.home.q3'),
    answer: t('home.faq.home.a3'),
  },
  {
    question: t('home.faq.home.q4'),
    answer: t('home.faq.home.a4'),
  },
  {
    question: t('home.faq.home.q5'),
    answer: t('home.faq.home.a5'),
  },
])
</script>
