<template>
  <section class="py-20 bg-background">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-6">{{ t('about.guarantees.title') }}</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ t('about.guarantees.subtitle') }}
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="mdi:file-document" class="text-blue-600 text-2xl" />
            </div>
            <h3 class="text-lg font-semibold text-secondary mb-4">{{ t('about.guarantees.contract_work') }}</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ t('about.guarantees.contract_work_desc') }}
            </p>
          </div>
          
          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="mdi:eye" class="text-green-600 text-2xl" />
            </div>
            <h3 class="text-lg font-semibold text-secondary mb-4">{{ t('about.guarantees.transparent_terms') }}</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ t('about.guarantees.transparent_terms_desc') }}
            </p>
          </div>
          
          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="mdi:headset" class="text-purple-600 text-2xl" />
            </div>
            <h3 class="text-lg font-semibold text-secondary mb-4">{{ t('about.guarantees.full_support') }}</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ t('about.guarantees.full_support_desc') }}
            </p>
          </div>
          
          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div class="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="mdi:clock" class="text-orange-600 text-2xl" />
            </div>
            <h3 class="text-lg font-semibold text-secondary mb-4">{{ t('about.guarantees.fast_response') }}</h3>
            <p class="text-gray-600 text-sm leading-relaxed">
              {{ t('about.guarantees.fast_response_desc') }}
            </p>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 lg:p-12 text-white">
          <div class="text-center">
            <div class="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="mdi:shield-check" class="text-green-600 text-3xl" />
            </div>
            <h3 class="text-2xl lg:text-3xl font-bold mb-4">{{ t('about.guarantees.admission_guarantee') }}</h3>
            <p class="text-lg leading-relaxed max-w-3xl mx-auto mb-6">
              {{ t('about.guarantees.admission_guarantee_desc') }}
            </p>
            <div class="flex justify-center space-x-8 text-sm">
              <div class="flex items-center space-x-2">
                <Icon name="mdi:check-circle" />
                <span>{{ t('about.guarantees.success_rate') }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <Icon name="mdi:cash-refund" />
                <span>{{ t('about.guarantees.money_back') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
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
