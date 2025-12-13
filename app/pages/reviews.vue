<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <!-- Achievements Section - Наши достижения в цифрах -->
    <section id="achievements" class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-violet-50/30" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div class="relative container mx-auto container-padding-narrow pt-6 md:pt-8 pb-4">
        <div class="text-center max-w-2xl mx-auto mb-6">
          <h1 class="text-section-title mb-2">
            {{ t(achievementsNs('title')) }}
            <span class="text-primary">{{ t(achievementsNs('titleAccent')) }}</span>
          </h1>
          <p class="text-section-subtitle">
            {{ t(achievementsNs('description')) }}
          </p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-4 text-center">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-red-600 flex items-center justify-center mx-auto mb-2">
              <Icon name="mdi:account-group" class="text-lg text-white" />
            </div>
            <div class="text-xl md:text-2xl font-bold text-primary">500+</div>
            <p class="text-xs text-gray-600">{{ t(statsNs('students.title')) }}</p>
          </div>

          <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-4 text-center">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-2">
              <Icon name="mdi:check-circle" class="text-lg text-white" />
            </div>
            <div class="text-xl md:text-2xl font-bold text-emerald-500">98%</div>
            <p class="text-xs text-gray-600">{{ t(statsNs('success.title')) }}</p>
          </div>

          <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-4 text-center">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-2">
              <Icon name="mdi:school" class="text-lg text-white" />
            </div>
            <div class="text-xl md:text-2xl font-bold text-blue-500">20+</div>
            <p class="text-xs text-gray-600">{{ t(statsNs('universities.title')) }}</p>
          </div>

          <div class="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-4 text-center">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-2">
              <Icon name="mdi:star" class="text-lg text-white" />
            </div>
            <div class="text-xl md:text-2xl font-bold text-orange-500">4.9</div>
            <p class="text-xs text-gray-600">{{ t(achievementsNs('overallRating.title')) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Media Reviews Section -->
    <LazyReviewsMediaSection />

    <!-- Share Experience Form -->
    <LazyReviewsShareExperienceForm />
  </div>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'

const achievementsNs = namespace('reviews.achievements')
const statsNs = namespace('reviews.achievements.stats')
const { t } = useI18n()

// Reviews page meta
definePageMeta({
  title: 'Отзывы студентов - Edu.turkish',
  description:
    'Реальные отзывы студентов и родителей о поступлении в турецкие университеты через Edu.turkish',
  name: 'ReviewsPage',
})
</script>

