<template>
  <section id="who-we-are" class="pt-20">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-6">{{ t('about.who_we_are.title') }}</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ t('about.who_we_are.subtitle') }}
          </p>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <img
              class="w-full object-cover rounded-2xl shadow-custom"
              :src="whoWeAre"
              alt="Modern education consultancy office"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div class="space-y-8">
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="mdi:trophy" class="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-secondary mb-2">{{ t('about.who_we_are.experienced_agency') }}</h3>
                  <p class="text-gray-600">{{ t('about.who_we_are.experienced_agency_desc') }}</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="mdi:school" class="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-secondary mb-2">{{ t('about.who_we_are.students_enrolled') }}</h3>
                  <p class="text-gray-600">{{ t('about.who_we_are.students_enrolled_desc') }}</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="mdi:file-document" class="text-purple-600 text-xl" />
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-secondary mb-2">{{ t('about.who_we_are.official_work') }}</h3>
                  <p class="text-gray-600">{{ t('about.who_we_are.official_work_desc') }}</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="mdi:hand-heart" class="text-orange-600 text-xl" />
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-secondary mb-2">{{ t('about.who_we_are.comprehensive_help') }}</h3>
                  <p class="text-gray-600">{{ t('about.who_we_are.comprehensive_help_desc') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const whoWeAre = '/images/team/who-we-are.jpg'
const { t } = useI18n()
</script>

<style scoped>
.shadow-custom { 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); 
}
</style>
