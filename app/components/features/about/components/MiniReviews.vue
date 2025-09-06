<template>
  <section class="py-20">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-6">{{ $t('about.testimonials.title') }}</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ $t('about.testimonials.subtitle') }}
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <div class="bg-white rounded-2xl shadow-custom p-8 hover-lift">
            <div class="mb-6">
              <div class="flex mb-4">
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
              </div>
              <p class="text-gray-600 leading-relaxed italic text-lg">
                {{ $t('about.testimonials.reviews.anna.quote') }}
              </p>
            </div>
            <div class="flex items-center">
              <div class="ml-0">
                <h3 class="font-semibold text-secondary">{{ $t('about.testimonials.reviews.anna.name') }}</h3>
                <p class="text-sm text-gray-500">{{ $t('about.testimonials.reviews.anna.university') }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-2xl shadow-custom p-8 hover-lift">
            <div class="mb-6">
              <div class="flex mb-4">
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
              </div>
              <p class="text-gray-600 leading-relaxed italic text-lg">
                {{ $t('about.testimonials.reviews.dmitry.quote') }}
              </p>
            </div>
            <div class="flex items-center">
              <div class="ml-0">
                <h3 class="font-semibold text-secondary">{{ $t('about.testimonials.reviews.dmitry.name') }}</h3>
                <p class="text-sm text-gray-500">{{ $t('about.testimonials.reviews.dmitry.university') }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-2xl shadow-custom p-8 hover-lift">
            <div class="mb-6">
              <div class="flex mb-4">
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
              </div>
              <p class="text-gray-600 leading-relaxed italic text-lg">
                {{ $t('about.testimonials.reviews.elena.quote') }}
              </p>
            </div>
            <div class="flex items-center">
              <div class="ml-0">
                <h3 class="font-semibold text-secondary">{{ $t('about.testimonials.reviews.elena.name') }}</h3>
                <p class="text-sm text-gray-500">{{ $t('about.testimonials.reviews.elena.role') }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white rounded-2xl shadow-custom p-8 hover-lift">
            <div class="mb-6">
              <div class="flex mb-4">
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
              </div>
              <p class="text-gray-600 leading-relaxed italic text-lg">
                {{ $t('about.testimonials.reviews.arman.quote') }}
              </p>
            </div>
            <div class="flex items-center">
              <div class="ml-0">
                <h3 class="font-semibold text-secondary">{{ $t('about.testimonials.reviews.arman.name') }}</h3>
                <p class="text-sm text-gray-500">{{ $t('about.testimonials.reviews.arman.university') }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-2xl shadow-custom p-8 hover-lift">
            <div class="mb-6">
              <div class="flex mb-4">
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
                <Icon name="mdi:star" class="text-yellow-400" />
              </div>
              <p class="text-gray-600 leading-relaxed italic text-lg">
                {{ $t('about.testimonials.reviews.maria.quote') }}
              </p>
            </div>
            <div class="flex items-center">
              <div class="ml-0">
                <h3 class="font-semibold text-secondary">{{ $t('about.testimonials.reviews.maria.name') }}</h3>
                <p class="text-sm text-gray-500">{{ $t('about.testimonials.reviews.maria.university') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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
