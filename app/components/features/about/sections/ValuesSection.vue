<template>
  <section class="py-20 bg-background">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-6">
            {{ $t('about.values.title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ $t('about.values.subtitle') }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div
              class="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Icon name="mdi:heart" class="text-blue-600 text-3xl" />
            </div>
            <h3 class="text-xl font-semibold text-secondary mb-4">
              {{ $t('about.values.honesty.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ $t('about.values.honesty.description') }}
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div
              class="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Icon name="mdi:star" class="text-green-600 text-3xl" />
            </div>
            <h3 class="text-xl font-semibold text-secondary mb-4">
              {{ $t('about.values.quality.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ $t('about.values.quality.description') }}
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div
              class="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Icon name="mdi:account-group" class="text-purple-600 text-3xl" />
            </div>
            <h3 class="text-xl font-semibold text-secondary mb-4">
              {{ $t('about.values.care.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ $t('about.values.care.description') }}
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div
              class="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Icon name="mdi:rocket" class="text-orange-600 text-3xl" />
            </div>
            <h3 class="text-xl font-semibold text-secondary mb-4">
              {{ $t('about.values.development.title') }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ $t('about.values.development.description') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.hover-lift {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
</style>
