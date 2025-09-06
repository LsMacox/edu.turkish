<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <!-- Hero Section -->
    <section id="hero" class="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16 md:py-20">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="space-y-6">
              <h1 class="text-4xl lg:text-5xl font-bold text-secondary leading-tight">
                {{ $t('reviews.hero.title') }}
                <span class="text-primary">{{ $t('reviews.hero.titleAccent') }}</span>
              </h1>
              <p class="text-xl text-gray-600 leading-relaxed">
                {{ $t('reviews.hero.description') }}
              </p>
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4 md:gap-6">
              <div class="text-center">
                <div class="text-3xl font-bold text-primary mb-2">500+</div>
                <p class="text-sm text-gray-600">{{ $t('reviews.hero.stats.students') }}</p>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary mb-2">4.9/5</div>
                <p class="text-sm text-gray-600">{{ $t('reviews.hero.stats.rating') }}</p>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold text-primary mb-2">98%</div>
                <p class="text-sm text-gray-600">{{ $t('reviews.hero.stats.success') }}</p>
              </div>
            </div>
          </div>
          
          <!-- Hero Image -->
          <div class="relative">
            <div class="bg-white rounded-3xl shadow-custom p-8">
              <img
                class="w-full h-96 object-cover rounded-2xl"
                :src="reviewHero"
                alt="happy diverse students celebrating university acceptance letters, group photo with Turkish university campus background, bright natural lighting"
                loading="lazy"
                decoding="async"
              />
            </div>
            <!-- Floating Review Card (avatar removed) -->
            <div class="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 max-w-xs">
              <div class="mb-2">
                <p class="text-sm font-semibold text-secondary">{{ $t('reviews.hero.testimonial.name') }}</p>
                <div class="flex text-yellow-400">
                  <Icon name="mdi:star" class="text-xs" />
                  <Icon name="mdi:star" class="text-xs" />
                  <Icon name="mdi:star" class="text-xs" />
                  <Icon name="mdi:star" class="text-xs" />
                  <Icon name="mdi:star" class="text-xs" />
                </div>
              </div>
              <p class="text-xs text-gray-600">{{ $t('reviews.hero.testimonial.text') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Review Stats Section - Наши достижения в цифрах -->
    <section id="achievements" class="py-16 md:py-20 bg-background">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-secondary mb-6">
            {{ $t('reviews.achievements.title') }} <span class="text-primary">{{ $t('reviews.achievements.titleAccent') }}</span>
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {{ $t('reviews.achievements.description') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          <!-- Students count -->
          <div class="bg-white rounded-2xl shadow-custom p-4 md:p-6 text-center">
            <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mdi:account-group" class="text-2xl text-white" />
            </div>
            <div class="text-3xl font-bold text-primary mb-2">500+</div>
            <h3 class="font-bold text-secondary mb-1">{{ $t('reviews.achievements.stats.students.title') }}</h3>
            <p class="text-sm text-gray-600">{{ $t('reviews.achievements.stats.students.description') }}</p>
          </div>

          <!-- Success Rate -->
          <div class="bg-white rounded-2xl shadow-custom p-4 md:p-6 text-center">
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mdi:check-circle" class="text-2xl text-white" />
            </div>
            <div class="text-3xl font-bold text-green-500 mb-2">98%</div>
            <h3 class="font-bold text-secondary mb-1">{{ $t('reviews.achievements.stats.success.title') }}</h3>
            <p class="text-sm text-gray-600">{{ $t('reviews.achievements.stats.success.description') }}</p>
          </div>

          <!-- Universities -->
          <div class="bg-white rounded-2xl shadow-custom p-4 md:p-6 text-center">
            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mdi:school" class="text-2xl text-white" />
            </div>
            <div class="text-3xl font-bold text-blue-500 mb-2">20+</div>
            <h3 class="font-bold text-secondary mb-1">{{ $t('reviews.achievements.stats.universities.title') }}</h3>
            <p class="text-sm text-gray-600">{{ $t('reviews.achievements.stats.universities.description') }}</p>
          </div>

          <!-- Experience -->
          <div class="bg-white rounded-2xl shadow-custom p-4 md:p-6 text-center">
            <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mdi:trophy" class="text-2xl text-white" />
            </div>
            <div class="text-3xl font-bold text-purple-500 mb-2">6</div>
            <h3 class="font-bold text-secondary mb-1">{{ $t('reviews.achievements.stats.experience.title') }}</h3>
            <p class="text-sm text-gray-600">{{ $t('reviews.achievements.stats.experience.description') }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
          <!-- Overall Rating -->
          <div class="bg-white rounded-2xl shadow-custom p-6 md:p-8 text-center">
            <div class="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl font-bold text-white">4.9</span>
            </div>
            <h3 class="text-2xl font-bold text-secondary mb-2">{{ $t('reviews.achievements.overallRating.title') }}</h3>
            <div class="flex justify-center mb-4">
              <Icon name="mdi:star" class="text-yellow-400 text-xl" />
              <Icon name="mdi:star" class="text-yellow-400 text-xl" />
              <Icon name="mdi:star" class="text-yellow-400 text-xl" />
              <Icon name="mdi:star" class="text-yellow-400 text-xl" />
              <Icon name="mdi:star" class="text-yellow-400 text-xl" />
            </div>
            <p class="text-gray-600">{{ $t('reviews.achievements.overallRating.description') }}</p>
          </div>
          
          <!-- Support -->
          <div class="bg-white rounded-2xl shadow-custom p-6 md:p-8 text-center">
            <div class="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mdi:headset" class="text-3xl text-white" />
            </div>
            <h3 class="text-2xl font-bold text-secondary mb-2">{{ $t('reviews.achievements.support.title') }}</h3>
            <div class="text-4xl font-bold text-orange-500 mb-2">100%</div>
            <p class="text-gray-600">{{ $t('reviews.achievements.support.description') }}</p>
          </div>
          
          <!-- Recommendation Rate -->
          <div class="bg-white rounded-2xl shadow-custom p-6 md:p-8 text-center">
            <div class="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="mdi:thumb-up" class="text-3xl text-white" />
            </div>
            <h3 class="text-2xl font-bold text-secondary mb-2">{{ $t('reviews.achievements.recommendation.title') }}</h3>
            <div class="text-4xl font-bold text-blue-500 mb-2">100%</div>
            <p class="text-gray-600">{{ $t('reviews.achievements.recommendation.description') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Student Stories -->
    <StudentStoriesSection />

    <!-- Parent Reviews -->
    <ParentReviewsSection />

    <!-- Share Experience Form -->
    <ShareExperience />

    <!-- Next Review CTA -->
    <NextReviewCTA />
  </div>
</template>

<script setup lang="ts">
import reviewHero from '@/assets/images/review-hero.png'
const { locale } = useI18n()

// Reviews page meta
definePageMeta({
  title: 'Отзывы студентов - Edu.turkish',
  description: 'Реальные отзывы студентов и родителей о поступлении в турецкие университеты через Edu.turkish',
  name: 'ReviewsPage'
})
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
