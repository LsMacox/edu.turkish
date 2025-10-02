<template>
  <section id="services" class="section-py">
    <div class="container">
      <BaseSectionHeader
        :title="t('home.services.title')"
        :subtitle="t('home.services.subtitle')"
        align="center"
        margin-bottom="lg"
      />

      <div class="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        <BaseFeatureCard
          v-for="(card, i) in cards"
          :key="i"
          :icon="card.icon"
          :icon-color="card.color"
          :title="t(card.title)"
          :description="t(card.text)"
          hover="scale"
          class="w-full sm:w-80 md:w-72 lg:w-80"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { BaseIconBadgeProps } from '~/components/ui/display/BaseIconBadge.vue'

const { t } = useI18n()

const cards: Array<{
  title: string
  text: string
  color: BaseIconBadgeProps['color']
  icon: string
}> = [
  {
    title: 'home.services.card1_title',
    text: 'home.services.card1_text',
    color: 'blue',
    icon: 'mdi:account',
  },
  {
    title: 'home.services.card2_title',
    text: 'home.services.card2_text',
    color: 'green',
    icon: 'mdi:cog',
  },
  {
    title: 'home.services.card3_title',
    text: 'home.services.card3_text',
    color: 'purple',
    icon: 'mdi:translate',
  },
  {
    title: 'home.services.card4_title',
    text: 'home.services.card4_text',
    color: 'green',
    icon: 'mdi:chat',
  },
  {
    title: 'home.services.card5_title',
    text: 'home.services.card5_text',
    color: 'yellow',
    icon: 'mdi:shield-check',
  },
]
</script>
