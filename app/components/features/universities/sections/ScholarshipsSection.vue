<template>
  <section id="scholarships" class="py-16">
    <div class="container">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-4">{{ $t('universities_page.scholarships.title') }}</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">{{ $t('universities_page.scholarships.subtitle') }}</p>
      </div>
      
      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:trophy" class="text-white text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ $t('universities_page.scholarships.types.government.title') }}</h3>
          <p class="text-gray-600 mb-4">{{ $t('universities_page.scholarships.types.government.description') }}</p>
          <div class="space-y-2 text-sm">
            <div class="flex items-center">
              <Icon name="mdi:check" class="text-green-500 w-4 h-4" />
              <span class="ml-2">{{ $t('universities_page.scholarships.types.government.benefits.full_tuition') }}</span>
            </div>
            <div class="flex items-center">
              <Icon name="mdi:check" class="text-green-500 w-4 h-4" />
              <span class="ml-2">{{ $t('universities_page.scholarships.types.government.benefits.monthly_allowance') }}</span>
            </div>
            <div class="flex items-center">
              <Icon name="mdi:check" class="text-green-500 w-4 h-4" />
              <span class="ml-2">{{ $t('universities_page.scholarships.types.government.benefits.health_insurance') }}</span>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:school" class="text-white text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ $t('universities_page.scholarships.types.university.title') }}</h3>
          <p class="text-gray-600 mb-4">{{ $t('universities_page.scholarships.types.university.description') }}</p>
          <div class="space-y-2 text-sm">
            <div class="flex items-center">
              <Icon name="mdi:check" class="text-green-500 w-4 h-4" />
              <span class="ml-2">{{ $t('universities_page.scholarships.types.university.benefits.tuition_discount') }}</span>
            </div>
            <div class="flex items-center">
              <Icon name="mdi:check" class="text-green-500 w-4 h-4" />
              <span class="ml-2">{{ $t('universities_page.scholarships.types.university.benefits.academic_merit') }}</span>
            </div>
            <div class="flex items-center">
              <Icon name="mdi:check" class="text-green-500 w-4 h-4" />
              <span class="ml-2">{{ $t('universities_page.scholarships.types.university.benefits.sports_achievement') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
