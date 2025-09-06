<template>
  <section id="how-to-choose" class="py-16 bg-background">
    <div class="container">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-4">{{ $t('universities_page.how_to_choose.title') }}</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">{{ $t('universities_page.how_to_choose.subtitle') }}</p>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icon name="mdi:map-marker" class="text-blue-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ $t('universities_page.how_to_choose.tips.location.title') }}</h3>
          <p class="text-gray-600 leading-relaxed">{{ $t('universities_page.how_to_choose.tips.location.description') }}</p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icon name="mdi:translate" class="text-green-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ $t('universities_page.how_to_choose.tips.language.title') }}</h3>
          <p class="text-gray-600 leading-relaxed">{{ $t('universities_page.how_to_choose.tips.language.description') }}</p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icon name="mdi:home" class="text-purple-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ $t('universities_page.how_to_choose.tips.dormitory.title') }}</h3>
          <p class="text-gray-600 leading-relaxed">{{ $t('universities_page.how_to_choose.tips.dormitory.description') }}</p>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icon name="mdi:star" class="text-orange-600 text-2xl" />
          </div>
          <h3 class="text-xl font-semibold text-secondary mb-4">{{ $t('universities_page.how_to_choose.tips.rating.title') }}</h3>
          <p class="text-gray-600 leading-relaxed">{{ $t('universities_page.how_to_choose.tips.rating.description') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
