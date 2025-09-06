<template>
  <section id="reviews" class="py-16 bg-background">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-4">{{ t('home.reviews.title') }}</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">{{ t('home.reviews.subtitle') }}</p>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div class="bg-white rounded-2xl shadow-custom p-8">
          <div class="flex items-center mb-6">
            <div class="ml-0">
              <h3 class="font-semibold text-secondary">{{ t('home.reviews.review1_name') }}</h3>
              <p class="text-sm text-gray-500">{{ t('home.reviews.review1_university') }}</p>
            </div>
          </div>
          <div class="flex mb-4">
            <Icon name="mdi:star" class="text-yellow-400" />
            <Icon name="mdi:star" class="text-yellow-400" />
            <Icon name="mdi:star" class="text-yellow-400" />
            <Icon name="mdi:star" class="text-yellow-400" />
            <Icon name="mdi:star" class="text-yellow-400" />
          </div>
          <p class="text-gray-600 leading-relaxed">
            {{ t('home.reviews.review1_text') }}
          </p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-custom p-8">
          <div class="flex items-center mb-6">
            <div class="ml-0">
              <h3 class="font-semibold text-secondary">{{ t('home.reviews.review2_name') }}</h3>
              <p class="text-sm text-gray-500">{{ t('home.reviews.review2_university') }}</p>
            </div>
          </div>
          <div class="flex mb-4">
            <Icon name="mdi:star" class="text-yellow-400" />
            <Icon name="mdi:star" class="text-yellow-400" />
            <Icon name="mdi:star" class="text-yellow-400" />
            <Icon name="mdi:star" class="text-yellow-400" />
            <Icon name="mdi:star" class="text-yellow-400" />
          </div>
          <p class="text-gray-600 leading-relaxed">
            {{ t('home.reviews.review2_text') }}
          </p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-custom p-8">
          <div class="flex items-center mb-6">
            <div class="ml-0">
              <h3 class="font-semibold text-secondary">{{ t('home.reviews.review3_name') }}</h3>
              <p class="text-sm text-gray-500">{{ t('home.reviews.review3_role') }}</p>
            </div>
          </div>
          <div class="flex mb-4">
            <Icon name="mdi:star" class="text-yellow-400" />
            <Icon name="mdi:star" class="text-yellow-400" />
            <Icon name="mdi:star" class="text-yellow-400" />
            <Icon name="mdi:star" class="text-yellow-400" />
            <Icon name="mdi:star" class="text-yellow-400" />
          </div>
          <p class="text-gray-600 leading-relaxed">
            {{ t('home.reviews.review3_text') }}
          </p>
        </div>
      </div>
      
      <div class="text-center">
        <NuxtLink 
          :to="localePath('/reviews')" 
          class="inline-block bg-white border-2 border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all"
        >
          {{ t('home.reviews.read_more') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Reviews section with student testimonials
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
