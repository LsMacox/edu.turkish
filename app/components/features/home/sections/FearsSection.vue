<template>
  <section id="breaking-fears" class="py-16 bg-gray-50">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-4">{{ t('home.fears.title') }}</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">{{ t('home.fears.subtitle') }}</p>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="bg-white rounded-2xl shadow-custom p-8">
          <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:alert-circle" class="text-red-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ t('home.fears.fear1_title') }}</h3>
          <div class="space-y-3">
            <p class="text-gray-600">{{ t('home.fears.fear_label') }}</p>
            <p class="text-sm text-gray-500 italic">{{ t('home.fears.fear1_quote') }}</p>
            <div class="border-t pt-3">
              <p class="text-green-600 font-medium">{{ t('home.fears.fear1_solution1') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear1_solution2') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear1_solution3') }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-custom p-8">
          <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:translate" class="text-blue-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ t('home.fears.fear2_title') }}</h3>
          <div class="space-y-3">
            <p class="text-gray-600">{{ t('home.fears.fear_label') }}</p>
            <p class="text-sm text-gray-500 italic">{{ t('home.fears.fear2_quote') }}</p>
            <div class="border-t pt-3">
              <p class="text-green-600 font-medium">{{ t('home.fears.fear2_solution1') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear2_solution2') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear2_solution3') }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-custom p-8">
          <div class="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:clock-alert" class="text-orange-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ t('home.fears.fear3_title') }}</h3>
          <div class="space-y-3">
            <p class="text-gray-600">{{ t('home.fears.fear_label') }}</p>
            <p class="text-sm text-gray-500 italic">{{ t('home.fears.fear3_quote') }}</p>
            <div class="border-t pt-3">
              <p class="text-green-600 font-medium">{{ t('home.fears.fear3_solution1') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear3_solution2') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear3_solution3') }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-custom p-8">
          <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:currency-usd" class="text-purple-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ t('home.fears.fear4_title') }}</h3>
          <div class="space-y-3">
            <p class="text-gray-600">{{ t('home.fears.fear_label') }}</p>
            <p class="text-sm text-gray-500 italic">{{ t('home.fears.fear4_quote') }}</p>
            <div class="border-t pt-3">
              <p class="text-green-600 font-medium">{{ t('home.fears.fear4_solution1') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear4_solution2') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear4_solution3') }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-custom p-8">
          <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:close-circle" class="text-green-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ t('home.fears.fear5_title') }}</h3>
          <div class="space-y-3">
            <p class="text-gray-600">{{ t('home.fears.fear_label') }}</p>
            <p class="text-sm text-gray-500 italic">{{ t('home.fears.fear5_quote') }}</p>
            <div class="border-t pt-3">
              <p class="text-green-600 font-medium">{{ t('home.fears.fear5_solution1') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear5_solution2') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear5_solution3') }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-custom p-8">
          <div class="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:home" class="text-yellow-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ t('home.fears.fear6_title') }}</h3>
          <div class="space-y-3">
            <p class="text-gray-600">{{ t('home.fears.fear_label') }}</p>
            <p class="text-sm text-gray-500 italic">{{ t('home.fears.fear6_quote') }}</p>
            <div class="border-t pt-3">
              <p class="text-green-600 font-medium">{{ t('home.fears.fear6_solution1') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear6_solution2') }}</p>
              <p class="text-green-600 font-medium">{{ t('home.fears.fear6_solution3') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Breaking fears section
const { t } = useI18n()
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
