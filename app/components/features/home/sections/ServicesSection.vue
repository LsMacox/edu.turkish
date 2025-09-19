<template>
  <section id="services" class="pt-10 pb-12 md:py-16">
    <div class="container">
      <div class="text-center mb-8 md:mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-4">
          {{ t('home.services.title') }}
        </h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">{{ t('home.services.subtitle') }}</p>
      </div>

      <div class="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        <div
          v-for="(card, i) in cards"
          :key="i"
          class="w-full sm:w-80 md:w-72 lg:w-80 bg-white rounded-2xl shadow-custom p-8 hover:scale-105 transition-transform duration-300"
        >
          <div class="w-16 h-16 rounded-2xl grid place-items-center mb-6" :class="card.bg">
            <Icon :name="card.icon" :class="card.color" class="text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ t(card.title) }}</h3>
          <p class="text-gray-600 leading-relaxed">{{ t(card.text) }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()

const cards = [
  {
    title: 'home.services.card1_title',
    text: 'home.services.card1_text',
    bg: 'bg-blue-100',
    color: 'text-blue-600',
    icon: 'mdi:account',
  },
  {
    title: 'home.services.card2_title',
    text: 'home.services.card2_text',
    bg: 'bg-green-100',
    color: 'text-green-600',
    icon: 'mdi:cog',
  },
  {
    title: 'home.services.card3_title',
    text: 'home.services.card3_text',
    bg: 'bg-purple-100',
    color: 'text-purple-600',
    icon: 'mdi:translate',
  },
  {
    title: 'home.services.card4_title',
    text: 'home.services.card4_text',
    bg: 'bg-green-100',
    color: 'text-green-600',
    icon: 'mdi:chat',
  },
  {
    title: 'home.services.card5_title',
    text: 'home.services.card5_text',
    bg: 'bg-yellow-100',
    color: 'text-yellow-600',
    icon: 'mdi:shield-check',
  },
]
</script>
