<template>
  <section id="how-to-choose" class="section-py bg-background">
    <div class="container">
      <BaseSectionHeader
        :title="$t('universities_page.how_to_choose.title')"
        :subtitle="$t('universities_page.how_to_choose.subtitle')"
        align="center"
        margin-bottom="lg"
      />

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          v-for="tip in tips"
          :key="tip.key"
          class="bg-white rounded-2xl shadow-lg card-padding-lg text-center hover:shadow-xl transition-shadow"
        >
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            :class="tip.bgColor"
          >
            <Icon :name="tip.icon" class="text-2xl" :class="tip.iconColor" />
          </div>
          <h3 class="text-card-title mb-4">
            {{ $t(`universities_page.how_to_choose.tips.${tip.key}.title`) }}
          </h3>
          <p class="text-card-body">
            {{ $t(`universities_page.how_to_choose.tips.${tip.key}.description`) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const tips = [
  { key: 'location', icon: 'mdi:map-marker', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
  { key: 'language', icon: 'mdi:translate', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
  { key: 'dormitory', icon: 'mdi:home', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { key: 'rating', icon: 'mdi:star', bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
] as const
</script>
